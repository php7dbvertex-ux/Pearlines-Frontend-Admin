import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getTipById, updateTip } from "../../services/tipService";
import { uploadImage } from "../../services/uploadService";

const EditTipPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    imageUrl: "",
    publicId: "",
  });

  // =========================
  // Load Tip
  // =========================

  useEffect(() => {
    const loadTip = async () => {
      try {
        const response = await getTipById(id);
        const tip = response.data;
        setFormData({
          title: tip.title || "",
          imageUrl: tip.imageUrl || "",
          publicId: tip.publicId || "",
        });
      } catch (error) {
        console.error(error);
        alert("Failed to load tip");
      } finally {
        setLoading(false);
      }
    };

    loadTip();
  }, [id]);

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
  // Upload New Image
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

    try {
      setSaving(true);
      await updateTip(id, formData);
      alert("Tip Updated Successfully");
      navigate("/admin/tips");
    } catch (error) {
      console.error(error);
      alert(
        error?.response?.data?.message || "Failed to update tip"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-10 text-lg">Loading Tip...</div>
    );
  }

  return (
    <div>
      {/* Heading */}
      <h1 className="text-[24px] sm:text-[28px] font-light text-[#444] mb-4 text-center sm:text-left">
        Edit Tip
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

          {/* Current Image */}
          {formData.imageUrl && (
            <div className="mb-5">
              <label className="block font-semibold mb-2">
                Current Image
              </label>
              <img
                src={formData.imageUrl}
                alt="Current Tip"
                className="
                  w-full sm:w-[250px]
                  h-[180px] sm:h-[120px]
                  object-cover border rounded
                "
              />
            </div>
          )}

          {/* Upload New Image */}
          <div className="mb-6">
            <label className="block font-semibold mb-2">
              Change Image
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

          {/* Submit */}
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
            {saving ? "Updating..." : "Update Tip"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default EditTipPage;