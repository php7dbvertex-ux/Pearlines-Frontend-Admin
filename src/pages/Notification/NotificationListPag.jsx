import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Trash2,
  Plus,
  X,
} from "lucide-react";

import { Link } from "react-router-dom";

import Swal from "sweetalert2";
import { toast } from "react-toastify";

import {
  getAllNotifications,
  deleteNotification,
} from "../../services/notificationService";

const NotificationListPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [previewImage, setPreviewImage] =
    useState(null);

  const recordsPerPage = 10;

  // =========================
  // Load Notifications
  // =========================

  const loadNotifications =
    useCallback(async () => {
      try {
        setLoading(true);

        const response =
          await getAllNotifications();

        setNotifications(
          response?.data || []
        );
      } catch (error) {
        console.error(error);

        toast.error(
          "Failed to load notifications"
        );
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    let isMounted = true;

    const handle = setTimeout(() => {
      if (isMounted)
        loadNotifications();
    }, 0);

    return () => {
      isMounted = false;
      clearTimeout(handle);
    };
  }, [loadNotifications]);

  // =========================
  // Delete Notification
  // =========================

  const handleDelete = async (
    notificationId
  ) => {
    const result =
      await Swal.fire({
        title:
          "Delete Notification?",
        text:
          "Are you sure you want to delete this notification?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText:
          "Yes, Delete",
        cancelButtonText:
          "Cancel",
      });

    if (!result.isConfirmed)
      return;

    try {
      await deleteNotification(
        notificationId
      );

      toast.success(
        "Notification deleted successfully"
      );

      await loadNotifications();
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to delete notification"
      );
    }
  };

  // =========================
  // Search & Pagination
  // =========================

  const filteredNotifications =
    useMemo(() => {
      return notifications.filter(
        (item) =>
          item.title
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            ) ||
          item.message
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            )
      );
    }, [notifications, search]);

  const totalPages =
    Math.ceil(
      filteredNotifications.length /
        recordsPerPage
    );

  const effectiveCurrentPage =
    Math.min(
      Math.max(currentPage, 1),
      totalPages || 1
    );

  const paginatedNotifications =
    filteredNotifications.slice(
      (effectiveCurrentPage - 1) *
        recordsPerPage,
      effectiveCurrentPage *
        recordsPerPage
    );

  if (loading) {
    return (
      <div className="text-center py-10 text-lg">
        Loading
        Notifications...
      </div>
    );
  }


  return (
    <div>
      {/* Heading */}
      <h1 className="text-[24px] sm:text-[28px] font-light text-[#444] mb-4 text-center sm:text-left">
        Notification List
      </h1>

      {/* Add Button */}
      <div className="mb-4">
        <Link
          to="/admin/send-notification/add"
          className="
            inline-flex items-center gap-2
            bg-[#3c8dbc] hover:bg-[#367fa9]
            text-white px-4 py-2 rounded transition
          "
        >
          <Plus size={16} />
          Send Notification
        </Link>
      </div>

      {/* Card */}
      <div className="bg-white border-t-4 border-[#3c8dbc] shadow-sm rounded-sm p-3 sm:p-4">

        {/* Search */}
        <div className="flex justify-end mb-4">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="
              w-full sm:w-[240px] h-[36px] px-3
              border border-gray-300 rounded text-sm
              outline-none focus:border-[#3c8dbc]
            "
          />
        </div>

        {/* ── MOBILE: Card Layout ── */}
        <div className="block sm:hidden space-y-3">
          {paginatedNotifications.length > 0 ? (
            paginatedNotifications.map((item, index) => (
              <div key={item._id} className="border rounded-sm p-3 text-[13px] text-gray-700">

                {/* Header row: title + delete */}
                <div className="flex justify-between items-start mb-2">
                  <span className="font-semibold text-[#444] text-sm">
                    {item.title}
                  </span>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>

                {/* Message */}
                <p className="text-gray-600 mb-3 line-clamp-2">{item.message}</p>

                <div className="grid grid-cols-[72px_1fr] gap-y-1.5">
                  <span className="text-gray-400 text-xs font-medium">S.No</span>
                  <span>{(effectiveCurrentPage - 1) * recordsPerPage + index + 1}</span>

                  <span className="text-gray-400 text-xs font-medium">Image</span>
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt=""
                      onClick={() => setPreviewImage({ src: item.imageUrl, alt: item.title })}
                      className="w-14 h-14 object-contain bg-gray-50 rounded border cursor-pointer"
                    />
                  ) : (
                    <span>-</span>
                  )}

                  <span className="text-gray-400 text-xs font-medium">Created</span>
                  <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center py-6 text-gray-500 text-sm">
              No Notifications Found
            </p>
          )}
        </div>

        {/* ── DESKTOP: Table Layout ── */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-[14px]">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-3 py-2 text-left">S.No</th>
                <th className="px-3 py-2 text-left">Title</th>
                <th className="px-3 py-2 text-left">Message</th>
                <th className="px-3 py-2 text-left">Image</th>
                <th className="px-3 py-2 text-left">Created</th>
                <th className="px-3 py-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedNotifications.length > 0 ? (
                paginatedNotifications.map((item, index) => (
                  <tr key={item._id} className="border-b hover:bg-gray-50">
                    <td className="px-3 py-3">
                      {(effectiveCurrentPage - 1) * recordsPerPage + index + 1}
                    </td>
                    <td className="px-3 py-3">{item.title}</td>
                    <td className="px-3 py-3 max-w-[300px]">
                      <p className="line-clamp-2">{item.message}</p>
                    </td>
                    <td className="px-3 py-3">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt=""
                          onClick={() => setPreviewImage({ src: item.imageUrl, alt: item.title })}
                          className="w-14 h-14 object-contain bg-gray-50 rounded border cursor-pointer"
                        />
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="px-3 py-3">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex justify-center">
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-gray-500">
                    No Notifications Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-4">
          <p className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
            Total Notifications: {filteredNotifications.length}
          </p>

          <div className="flex gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="px-3 py-1 border text-xs sm:text-sm disabled:opacity-50 hover:bg-gray-100"
            >
              Previous
            </button>
            <button
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="px-3 py-1 border text-xs sm:text-sm disabled:opacity-50 hover:bg-gray-100"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* ── Image Preview Modal ── */}
      {previewImage && (
        <div
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 cursor-pointer"
        >
          <button
            onClick={() => setPreviewImage(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300"
          >
            <X size={28} />
          </button>
          <img
            src={previewImage.src}
            alt={previewImage.alt}
            onClick={(e) => e.stopPropagation()}
            className="max-w-full max-h-full object-contain rounded cursor-default"
          />
        </div>
      )}
    </div>
  );
};

export default NotificationListPage;