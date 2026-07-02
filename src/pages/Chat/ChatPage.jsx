import { useEffect, useState, useRef, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Search } from "lucide-react";

import {
  createChat,
  getAllChats,
} from "../../services/chatService";

import {
  createMessage,
  getMessagesByChatId,
  markMessagesAsRead,
} from "../../services/messageService";

import { getAllUsers } from "../../services/userService";

// Shows the user's photo (schema field: image). Falls back to an
// initials circle if there's no image, or if the image fails to load.
const Avatar = ({ image, name, size = 40 }) => {
  const [failed, setFailed] = useState(false);
  const initials = name?.trim()?.charAt(0)?.toUpperCase() || "?";

  if (image && !failed) {
    return (
      <img
        src={image}
        alt={name || "User"}
        onError={() => setFailed(true)}
        style={{ width: size, height: size }}
        className="rounded-full object-cover shrink-0 bg-gray-100"
      />
    );
  }

  return (
    <div
      style={{ width: size, height: size }}
      className="rounded-full bg-[#3c8dbc] text-white flex items-center justify-center text-sm font-semibold shrink-0"
    >
      {initials}
    </div>
  );
};

const ChatPage = () => {
  const [chats, setChats] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");

  // Whether the initial chats fetch has completed at least once. We need
  // this so the "open chat from navigation state" effect waits for real
  // data instead of running against an empty array on first render.
  const [chatsLoaded, setChatsLoaded] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // Declared up top (was previously declared after the effect that used it)
  const messagesEndRef = useRef(null);

  // Track which chat is "active" so late-arriving/stale async responses
  // (from polling or fast chat switching) never overwrite newer state.
  const selectedChatIdRef = useRef(null);

  // Prevent the background "loadChats" poll from stomping on local,
  // optimistic state (e.g. just-marked-as-read counts, newly created chats)
  // while the user is actively interacting.
  const chatsRef = useRef(chats);
  chatsRef.current = chats;

  const loadChats = useCallback(async () => {
    try {
      const response = await getAllChats();
      const fresh = response.data || [];

      // Merge server data with any local unread-count overrides we've
      // already applied optimistically, instead of blindly replacing the
      // whole array. This stops the side list from "flickering"/resetting
      // every 5s while a chat is open.
      setChats((prev) => {
        const prevById = new Map(prev.map((c) => [c._id, c]));
        return fresh.map((c) => {
          const prior = prevById.get(c._id);
          // If we already marked this chat's unread count as 0 locally
          // and the server hasn't caught up yet, keep it at 0.
          if (
            prior &&
            prior.unreadCount === 0 &&
            selectedChatIdRef.current === c._id
          ) {
            return { ...c, unreadCount: 0 };
          }
          return c;
        });
      });
    } catch (error) {
      console.error(error);
    } finally {
      setChatsLoaded(true);
    }
  }, []);

  const loadUsers = useCallback(async () => {
    try {
      const response = await getAllUsers();

      // Same normalization as AddCustomNotificationPage: backend may
      // return a raw array, { users: [...] }, or { data: [...] }.
      // Previously this only checked response.users, which silently
      // stayed empty if the shape was different — that's why search
      // never showed any users here.
      const list = Array.isArray(response)
        ? response
        : response?.users || response?.data || [];

      setUsers(Array.isArray(list) ? list : []);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const loadMessages = useCallback(async (chatId) => {
    try {
      const response = await getMessagesByChatId(chatId);
      // Guard against race conditions: only apply the result if this
      // chat is still the one the user has selected. Without this, quickly
      // switching chats (or a slow poll resolving late) could overwrite the
      // current chat's messages with a different chat's messages.
      if (selectedChatIdRef.current === chatId) {
        setMessages(response.data || []);
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  useEffect(() => {
    (async () => {
      await loadChats();
      await loadUsers();
    })();
  }, [loadChats, loadUsers]);

  useEffect(() => {
    const interval = setInterval(() => {
      loadChats();
    }, 5000);
    return () => clearInterval(interval);
  }, [loadChats]);

  useEffect(() => {
    if (!selectedChat) return;
    const interval = setInterval(() => {
      loadMessages(selectedChat._id);
    }, 5000);
    return () => clearInterval(interval);
  }, [selectedChat, loadMessages]);

  const openChat = async (chat) => {
    selectedChatIdRef.current = chat._id;
    setSelectedChat(chat);
    await loadMessages(chat._id);

    try {
      await markMessagesAsRead(chat._id);
      setChats((prev) =>
        prev.map((c) =>
          c._id === chat._id ? { ...c, unreadCount: 0 } : c
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleUserClick = async (user) => {
    // If a chat already exists with this user, just open it instead of
    // creating a duplicate.
    const existingChat = chats.find((c) => c.mobileNo === user.mobileNo);

    setSearch("");

    if (existingChat) {
      await openChat(existingChat);
      return;
    }

    try {
      const response = await createChat({
        patientName: user.name,
        mobileNo: user.mobileNo,
        image: user.image,
      });
      const chat = response.data;
      selectedChatIdRef.current = chat._id;
      setSelectedChat(chat);
      await loadMessages(chat._id);
      await loadChats();
    } catch (error) {
      console.error(error);
    }
  };

  // Opens (or creates) the chat for a patient handed to us via navigation
  // state — e.g. clicking "Chat" on a row in RevisitAppointmentPage.
  // Mirrors handleUserClick, but takes patientName/mobileNo/image directly
  // instead of looking a user up from the search list.
  const openChatForPatient = useCallback(
    async ({ mobileNo, patientName, image }) => {
      const existingChat = chats.find((c) => c.mobileNo === mobileNo);

      if (existingChat) {
        await openChat(existingChat);
        return;
      }

      try {
        const response = await createChat({
          patientName,
          mobileNo,
          image,
        });
        const chat = response.data;
        selectedChatIdRef.current = chat._id;
        setSelectedChat(chat);
        await loadMessages(chat._id);
        await loadChats();
      } catch (error) {
        console.error(error);
      }
    },
    [chats, loadChats, loadMessages]
  );

  // If we were navigated here with a patient to open (e.g. from the
  // "Chat" button on Revisit Appointments), wait until chats have loaded
  // at least once, then find-or-create that chat and open it. We clear
  // the navigation state afterwards so refreshing or revisiting this page
  // later doesn't keep re-triggering this.
  useEffect(() => {
    const target = location.state;
    if (!target?.mobileNo || !chatsLoaded) return;

    openChatForPatient(target);
    navigate(location.pathname, { replace: true, state: null });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state, chatsLoaded]);

  const handleSend = async () => {
    if (!message.trim() || !selectedChat) return;

    const chatId = selectedChat._id;

    try {
      const messageText = message.trim();
      setMessage("");

      await createMessage({
        chatId,
        senderType: "admin",
        message: messageText,
      });

      // Show message instantly in UI, but only if the user hasn't
      // switched to a different chat in the meantime.
      if (selectedChatIdRef.current === chatId) {
        setMessages((prev) => [
          ...prev,
          {
            _id: `local-${Date.now()}`,
            senderType: "admin",
            message: messageText,
            seenByUser: false,
          },
        ]);
      }

      // Refresh chat list (last message, sorting, etc.)
      await loadChats();
    } catch (error) {
      console.error(error);
    }
  };

  // Same behavior as AddCustomNotificationPage: show nothing until the
  // user actually types something, then show matches in a dropdown.
  const filteredUsers = search.trim()
    ? users.filter((user) => {
        const keyword = search.toLowerCase();
        return (
          user.name?.toLowerCase().includes(keyword) ||
          user.mobileNo?.toLowerCase().includes(keyword) ||
          user.email?.toLowerCase().includes(keyword)
        );
      })
    : [];

  return (
    <div>
      <h1
        className={`text-[24px] sm:text-[28px] font-light text-[#444] mb-4 ${
          selectedChat ? "hidden sm:block" : ""
        }`}
      >
        Chat
      </h1>

      <div className="bg-white border-t-4 border-[#3c8dbc] shadow-sm rounded-sm h-[80vh] sm:h-[75vh] flex overflow-hidden">
        <div
          className={`w-full sm:w-[340px] border-r overflow-y-auto ${
            selectedChat ? "hidden sm:block" : "block"
          }`}
        >
          <div className="p-3 border-b bg-white sticky top-0 z-10">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search user..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border rounded text-sm outline-none"
              />
            </div>

            {/* Search dropdown - only visible while typing, same as
                AddCustomNotificationPage */}
            {search && filteredUsers.length > 0 && (
              <div className="mt-2 border rounded max-h-[250px] overflow-y-auto bg-white shadow-sm">
                {filteredUsers.map((user) => (
                  <button
                    type="button"
                    key={user._id}
                    onClick={() => handleUserClick(user)}
                    className="w-full text-left px-3 py-3 text-sm hover:bg-gray-100 border-b flex items-center gap-3"
                  >
                    <Avatar image={user.image} name={user.name} size={40} />
                    <div className="min-w-0">
                      <div className="font-medium">{user.name}</div>
                      <div className="text-gray-500 text-xs">{user.mobileNo}</div>
                      {user.email && (
                        <div className="text-gray-500 text-xs">{user.email}</div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {search && filteredUsers.length === 0 && (
              <div className="mt-2 text-xs text-gray-400 px-1">
                No users found
              </div>
            )}
          </div>

          <div>
            <div className="px-3 py-2 bg-[#3c8dbc] text-white text-sm font-semibold">
              Total Unread:{" "}
              {chats.reduce(
                (sum, chat) => sum + (chat.unreadCount || 0),
                0
              )}
            </div>
            <div className="px-3 py-2 bg-gray-100 text-xs font-semibold text-gray-600">
              RECENT CHATS
            </div>

            {chats.map((chat) => (
              <div
                key={chat._id}
                onClick={() => openChat(chat)}
                className={`p-4 border-b cursor-pointer hover:bg-gray-50 flex items-start gap-3 ${
                  selectedChat?._id === chat._id ? "bg-blue-50" : ""
                }`}
              >
                <Avatar image={chat.image} name={chat.patientName} size={40} />

                <div className="min-w-0 flex-1 flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-sm">{chat.patientName}</h3>
                    <p className="text-xs text-gray-500">{chat.mobileNo}</p>
                    <p className="text-xs text-gray-400 truncate mt-1">
                      {chat.lastMessage}
                    </p>
                  </div>

                  {chat.unreadCount > 0 && (
                    <span className="bg-[#3c8dbc] text-white text-[11px] font-semibold rounded-full min-w-[20px] h-[20px] px-1.5 flex items-center justify-center shrink-0 mt-0.5">
                      {chat.unreadCount > 99 ? "99+" : chat.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>

        <div
          className={`flex-1 flex flex-col ${
            selectedChat ? "flex" : "hidden sm:flex"
          }`}
        >
          {selectedChat ? (
            <>
              <div className="p-4 border-b bg-gray-50 flex items-center gap-3">
                <button onClick={() => setSelectedChat(null)} className="sm:hidden">
                  <ArrowLeft size={20} />
                </button>
                <Avatar image={selectedChat.image} name={selectedChat.patientName} size={36} />
                <div>
                  <h2 className="font-semibold">{selectedChat.patientName}</h2>
                  <p className="text-sm text-gray-500">{selectedChat.mobileNo}</p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {messages.length > 0 ? (
                  messages.map((msg) => (
                    <div
                      key={msg._id}
                      className={`mb-3 flex ${
                        msg.senderType === "admin"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] px-4 py-2 rounded-lg text-sm ${
                          msg.senderType === "admin"
                            ? "bg-[#3c8dbc] text-white"
                            : "bg-white"
                        }`}
                      >
                        <div>{msg.message}</div>

                        {msg.senderType === "admin" && (
                          <div className="text-[10px] text-right mt-1 opacity-80">
                            {msg.seenByUser ? "Seen" : "Delivered"}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-400 mt-10">
                    No messages
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              <div className="p-4 border-t flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Type message..."
                  className="flex-1 border rounded px-3 py-2 text-sm outline-none"
                />
                <button
                  onClick={handleSend}
                  className="bg-[#3c8dbc] hover:bg-[#367fa9] text-white px-5 rounded"
                >
                  Send
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              Select a user or chat
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;