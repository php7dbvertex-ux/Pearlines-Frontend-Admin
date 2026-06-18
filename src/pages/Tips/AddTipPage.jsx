import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { createTip } from "../../services/tipService";
import { uploadImage } from "../../services/uploadService";

const AddTipPage = () => {
  const navigate = useNavigate();

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    imageUrl: "",
    publicId: "",
  });

  // =========================
  // Input Change
  // =========================

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // =========================
  // Upload Image
  // =========================

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
    } catch (error) {
      console.error(error);
      alert("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  // =========================
  // Submit
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      return alert("Tip title is required");
    }

    if (!formData.imageUrl) {
      return alert("Please upload image");
    }

    try {
      setSaving(true);
      await createTip(formData);
      alert("Tip Added Successfully");
      navigate("/admin/tips");
    } catch (error) {
      console.error(error);
      alert(
        error?.response?.data?.message || "Failed to add tip"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      {/* Heading */}
      <h1 className="text-[24px] sm:text-[28px] font-light text-[#444] mb-4 text-center sm:text-left">
        Add Tip
      </h1>

      {/* Card */}
      <div className="bg-white border-t-4 border-[#3c8dbc] shadow-sm rounded-sm">
        <form onSubmit={handleSubmit} className="p-4 sm:p-6">

          {/* Title */}
          <div className="mb-5">
            <label className="block font-semibold mb-2">
              Tip Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="
                w-full sm:max-w-[600px]
                h-[42px]
                border border-gray-300
                rounded px-3
                outline-none focus:border-[#3c8dbc]
              "
            />
          </div>

          {/* Upload */}
          <div className="mb-5">
            <label className="block font-semibold mb-2">
              Tip Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full sm:w-auto text-sm"
            />
            {uploading && (
              <p className="mt-2 text-sm text-blue-600">
                Uploading image...
              </p>
            )}
          </div>

          {/* Preview */}
          {formData.imageUrl && (
            <div className="mb-6">
              <label className="block font-semibold mb-2">
                Preview
              </label>
              <img
                src={formData.imageUrl}
                alt="Preview"
                className="
                  w-full sm:w-[250px]
                  h-[180px] sm:h-[120px]
                  object-cover border rounded
                "
              />
            </div>
          )}

          {/* Save */}
          <button
            type="submit"
            disabled={saving || uploading}
            className="
              w-full sm:w-auto
              bg-[#3c8dbc] hover:bg-[#367fa9]
              text-white px-6 py-2
              rounded disabled:opacity-50
            "
          >
            {saving ? "Saving..." : "Save Tip"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default AddTipPage;