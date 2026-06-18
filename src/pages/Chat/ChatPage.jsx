import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";

import { getAllChats } from "../../services/chatService";

import {
  createMessage,
  getMessagesByChatId,
} from "../../services/messageService";

const ChatPage = () => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  // Load Chats

  const loadChats = async () => {
    try {
      const response = await getAllChats();
      setChats(response.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  // Load Messages

  const loadMessages = async (chatId) => {
    try {
      const response = await getMessagesByChatId(chatId);
      setMessages(response.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        await loadChats();
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  // Polling

  useEffect(() => {
    if (!selectedChat) return;

    const interval = setInterval(() => {
      loadMessages(selectedChat._id);
    }, 5000);

    return () => clearInterval(interval);
  }, [selectedChat]);

  // Send Message

  const handleSend = async () => {
    if (!message.trim() || !selectedChat) return;

    try {
      await createMessage({
        chatId: selectedChat._id,
        senderType: "admin",
        message,
      });

      setMessage("");
      loadMessages(selectedChat._id);
      loadChats();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      {/* Heading - hidden on mobile when chat is open */}
      <h1
        className={`
          text-[24px] sm:text-[28px] font-light text-[#444] mb-4
          ${selectedChat ? "hidden sm:block" : ""}
        `}
      >
        Chat
      </h1>

      <div
        className="
          bg-white border-t-4 border-[#3c8dbc]
          shadow-sm rounded-sm
          h-[80vh] sm:h-[75vh]
          flex overflow-hidden
        "
      >
        {/* ── LEFT SIDE: Chat List ── */}
        <div
          className={`
            w-full sm:w-[320px]
            border-r overflow-y-auto
            ${selectedChat ? "hidden sm:block" : "block"}
          `}
        >
          {chats.length > 0 ? (
            chats.map((chat) => (
              <div
                key={chat._id}
                onClick={() => setSelectedChat(chat)}
                className={`
                  p-4 cursor-pointer border-b hover:bg-gray-50
                  ${selectedChat?._id === chat._id ? "bg-blue-50" : ""}
                `}
              >
                <h3 className="font-semibold text-sm sm:text-base">
                  {chat.patientName}
                </h3>
                <p className="text-sm text-gray-500">{chat.mobileNo}</p>
                <p className="text-xs text-gray-400 truncate mt-1">
                  {chat.lastMessage}
                </p>
              </div>
            ))
          ) : (
            <div className="p-4 text-gray-500 text-sm">No Chats Found</div>
          )}
        </div>

        {/* ── RIGHT SIDE: Conversation ── */}
        <div
          className={`
            flex-1 flex flex-col
            ${selectedChat ? "flex" : "hidden sm:flex"}
          `}
        >
          {selectedChat ? (
            <>
              {/* Header */}
              <div className="p-3 sm:p-4 border-b bg-gray-50 flex items-center gap-3">
                {/* Back button - mobile only */}
                <button
                  onClick={() => setSelectedChat(null)}
                  className="sm:hidden text-gray-600 hover:text-gray-800"
                >
                  <ArrowLeft size={20} />
                </button>
                <div>
                  <h2 className="font-semibold text-sm sm:text-base">
                    {selectedChat.patientName}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500">
                    {selectedChat.mobileNo}
                  </p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-3 sm:p-4 bg-gray-100">
                {messages.map((msg) => (
                  <div
                    key={msg._id}
                    className={`mb-3 flex ${
                      msg.senderType === "admin" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`
                        max-w-[85%] sm:max-w-[70%]
                        px-4 py-2 rounded-lg text-sm
                        ${
                          msg.senderType === "admin"
                            ? "bg-[#3c8dbc] text-white"
                            : "bg-white"
                        }
                      `}
                    >
                      {msg.message}
                    </div>
                  </div>
                ))}
              </div>

              {/* Input */}
              <div className="p-3 sm:p-4 border-t flex gap-2 sm:gap-3">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Type message..."
                  className="
                    flex-1 border rounded px-3 py-2 text-sm
                    outline-none focus:border-[#3c8dbc]
                  "
                />
                <button
                  onClick={handleSend}
                  className="
                    bg-[#3c8dbc] hover:bg-[#367fa9]
                    text-white px-4 sm:px-5 rounded text-sm
                    transition
                  "
                >
                  Send
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
              Select a conversation
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;