import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";

import { createNotification } from "../../services/notificationService";
import { uploadImage } from "../../services/uploadService";

const AddNotificationPage = () => {
  const navigate = useNavigate();

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    message: "",
    imageUrl: "",
    publicId: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    try {
      setUploading(true);

      const response = await uploadImage(file);

      setFormData((prev) => ({
        ...prev,
        imageUrl: response.data.imageUrl,
        publicId: response.data.publicId,
      }));

      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error(error);

      toast.error("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Notification title is required");
      return;
    }

    if (!formData.message.trim()) {
      toast.error("Notification message is required");
      return;
    }

    try {
      setSaving(true);

      await createNotification(formData);

      toast.success("Notification sent successfully");

      setTimeout(() => {
        navigate("/admin/send-notification");
      }, 1500);
    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to send notification"
      );
    } finally {
      setSaving(false);
    }
  };

  // Shared input class
  const inputClass = `
    w-full h-[42px] border border-gray-300
    rounded px-3 text-sm outline-none
    focus:border-[#3c8dbc]
  `;
  return (
    <div>
      {/* Heading */}
      <h1 className="text-[24px] sm:text-[28px] font-light text-[#444] mb-4 text-center sm:text-left">
        Send Notification
      </h1>

      {/* Card */}
      <div className="bg-white border-t-4 border-[#3c8dbc] shadow-sm rounded-sm">
        <form onSubmit={handleSubmit} className="p-4 sm:p-6">

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
              className="
                w-full border border-gray-300
                rounded px-3 py-2 text-sm
                resize-none outline-none
                focus:border-[#3c8dbc]
              "
            />
          </div>

          {/* Preview - full width */}
          {formData.imageUrl && (
            <div className="mb-5">
              <label className="block font-semibold mb-2 text-sm">
                Preview
              </label>
              <img
                src={formData.imageUrl}
                alt="Preview"
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

export default AddNotificationPage;