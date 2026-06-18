import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBanner } from "../../services/bannerService";
import { uploadImage } from "../../services/uploadService";

const AddBannerPage = () => {
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
    if (!formData.title.trim()) return alert("Banner title is required");
    if (!formData.imageUrl)     return alert("Please upload image");
    try {
      setSaving(true);
      await createBanner(formData);
      alert("Banner Added Successfully");
      navigate("/admin/banner");
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.message || "Failed to add banner");
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
        Add Banner
      </h1>

      {/* Card */}
      <div className="bg-white border-t-4 border-[#3c8dbc] shadow-sm rounded-sm">
        <form onSubmit={handleSubmit} className="p-4 sm:p-6">

          {/* 2-column grid on desktop, 1-column on mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">

            {/* Title */}
            <div>
              <label className="block font-semibold mb-2 text-sm">
                Banner Title
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
                Banner Image
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

          {/* Preview - full width below grid */}
          {formData.imageUrl && (
            <div className="mb-5">
              <label className="block font-semibold mb-2 text-sm">
                Preview
              </label>
              <img
                src={formData.imageUrl}
                alt="Preview"
                className="w-full sm:w-[250px] h-[120px] object-cover border rounded"
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
            {saving ? "Saving..." : "Save Banner"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddBannerPage;