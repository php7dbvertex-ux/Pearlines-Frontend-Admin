import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";

import { createCustomNotification } from "../../services/customNotificationService";
import { uploadImage } from "../../services/uploadService";
import { getAllUsers } from "../../services/userService";

const AddCustomNotificationPage = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    message: "",
    imageUrl: "",
    publicId: "",
  });

  // =========================
  // Load Users
  // =========================

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await getAllUsers();

        console.log(
          "Users API Response:",
          response
        );

        setUsers(
          response.users || []
        );
      } catch (error) {
        console.error(error);

        toast.error(
          "Failed to load users"
        );
      }
    };

    loadUsers();
  }, []);

  // =========================
  // Search Users
  // =========================

  const filteredUsers = useMemo(() => {
    if (!search.trim()) return [];

    const keyword =
      search.toLowerCase();

    return users.filter(
      (user) =>
        user.name
          ?.toLowerCase()
          .includes(keyword) ||
        user.mobileNo
          ?.toLowerCase()
          .includes(keyword) ||
        user.email
          ?.toLowerCase()
          .includes(keyword)
    );
  }, [users, search]);

  // =========================
  // Input Change
  // =========================

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]:
        e.target.value,
    }));
  };

  // =========================
  // Upload Image
  // =========================

  const handleImageUpload =
    async (e) => {
      const file =
        e.target.files[0];

      if (!file) return;

      try {
        setUploading(true);

        const response =
          await uploadImage(file);

        setFormData((prev) => ({
          ...prev,
          imageUrl:
            response.data.imageUrl,
          publicId:
            response.data.publicId,
        }));

        toast.success(
          "Image uploaded successfully"
        );
      } catch (error) {
        console.error(error);

        toast.error(
          "Image upload failed"
        );
      } finally {
        setUploading(false);
      }
    };

  // =========================
  // Submit
  // =========================

  const handleSubmit = async (
    e
  ) => {
    e.preventDefault();

    if (!selectedUser) {
      toast.error(
        "Please select a user"
      );
      return;
    }

    if (
      !formData.title.trim()
    ) {
      toast.error(
        "Notification title is required"
      );
      return;
    }

    if (
      !formData.message.trim()
    ) {
      toast.error(
        "Notification message is required"
      );
      return;
    }

    try {
      setSaving(true);

      await createCustomNotification({
        userId:
          selectedUser._id,
        title:
          formData.title,
        message:
          formData.message,
        imageUrl:
          formData.imageUrl,
        publicId:
          formData.publicId,
      });

      toast.success(
        "Notification sent successfully"
      );

      setTimeout(() => {
        navigate(
          "/admin/custom-notification"
        );
      }, 1500);
    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data
          ?.message ||
          "Failed to send notification"
      );
    } finally {
      setSaving(false);
    }
  };

  // Shared input class

  const inputClass = `
    w-full border border-gray-300
    rounded px-3 py-2 text-sm outline-none
    focus:border-[#3c8dbc]
  `;



  return (
    <div>
      {/* Heading */}
      <h1 className="text-[24px] sm:text-[28px] font-light text-[#444] mb-4 text-center sm:text-left">
        Send Custom Notification
      </h1>

      {/* Card */}
      <div className="bg-white border-t-4 border-[#3c8dbc] shadow-sm rounded-sm">
        <form onSubmit={handleSubmit} className="p-4 sm:p-6">

          {/* Search User - full width */}
          <div className="mb-5">
            <label className="block font-semibold mb-2 text-sm">
              Search User
            </label>
           <input
  type="text"
  placeholder="Search by name, mobile or email"
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  className={inputClass}
/>
            {search && filteredUsers.length > 0 && (
              <div className="mt-2 border rounded max-h-[250px] overflow-y-auto">
               {filteredUsers.map((user) => (
  <button
    type="button"
    key={user._id}
    onClick={() => {
      setSelectedUser(user);
      setSearch("");
    }}
    className="w-full text-left px-3 py-3 text-sm hover:bg-gray-100 border-b"
  >
    <div className="font-medium">
      {user.name}
    </div>

    <div className="text-gray-500 text-xs">
      {user.mobileNo}
    </div>

    <div className="text-gray-500 text-xs">
      {user.email}
    </div>
  </button>
))}
              </div>
            )}
          </div>

          {/* Selected User - full width */}
         {selectedUser && (
  <div className="bg-gray-50 border rounded p-4 mb-5 text-sm">
    <p>
      <strong>Name:</strong>{" "}
      {selectedUser.name}
    </p>

    <p>
      <strong>Mobile:</strong>{" "}
      {selectedUser.mobileNo}
    </p>

    <p>
      <strong>Email:</strong>{" "}
      {selectedUser.email}
    </p>
  </div>
)}
          {/* 2-column grid for Title + Image, full-width Message */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">

            {/* Title */}
            <div>
              <label className="block font-semibold mb-2 text-sm">
                Notification Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block font-semibold mb-2 text-sm">
                Notification Image (Optional)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="
                  w-full text-sm text-gray-500
                  file:mr-3 file:py-2 file:px-4
                  file:rounded file:border-0
                  file:text-sm file:font-medium
                  file:bg-[#3c8dbc] file:text-white
                  hover:file:bg-[#367fa9]
                  file:cursor-pointer
                "
              />
              {uploading && (
                <p className="mt-2 text-sm text-blue-600">
                  Uploading image...
                </p>
              )}
            </div>
          </div>

          {/* Message - full width */}
          <div className="mb-5">
            <label className="block font-semibold mb-2 text-sm">
              Notification Message
            </label>
            <textarea
              rows="5"
              name="message"
              value={formData.message}
              onChange={handleChange}
              className={`${inputClass} resize-none`}
            />
          </div>

          {/* Preview - full width */}
          {formData.imageUrl && (
            <div className="mb-5">
              <img
                src={formData.imageUrl}
                alt="preview"
                className="w-full sm:w-[250px] h-[150px] object-cover border rounded"
              />
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={saving || uploading}
            className="
              w-full sm:w-auto
              bg-[#3c8dbc] hover:bg-[#367fa9]
              text-white px-6 py-2 rounded
              disabled:opacity-50 transition
            "
          >
            {saving ? "Sending..." : "Send Notification"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCustomNotificationPage;