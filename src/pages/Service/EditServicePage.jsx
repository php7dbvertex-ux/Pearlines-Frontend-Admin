import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { toast } from "react-toastify";

import { getServiceById, updateService } from "../../services/serviceService";
import { uploadImage } from "../../services/uploadService";

const EditServicePage = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // make sure your route is defined as "/admin/service/edit/:id"

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    publicId: "",
  });

  // =========================
  // Load Service
  // =========================

  const loadService = useCallback(async () => {
    try {
      setLoading(true);

      const response = await getServiceById(id);

      // serviceService.js already does `return response.data` from axios,
      // so `response` here IS the service object — NOT response.data.
      // But some backends wrap it as { data: {...} } or { service: {...} }.
      // This handles all 3 shapes safely instead of assuming one.
      const service =
        response?.data?.title !== undefined
          ? response.data
          : response?.service?.title !== undefined
          ? response.service
          : response;

      if (!service || service.title === undefined) {
        console.error("Unexpected getServiceById shape:", response);
        toast.error("Could not read service data from server response");
        return;
      }

      setFormData({
        title: service.title || "",
        description: service.description || "",
        imageUrl: service.imageUrl || "",
        publicId: service.publicId || "",
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to load service");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      loadService();
    }
  }, [id, loadService]);

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

      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error(error);
      toast.error("Image upload failed");
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
      toast.error("Service title is required");
      return;
    }

    if (!formData.description.trim()) {
      toast.error("Description is required");
      return;
    }

    if (!formData.imageUrl) {
      toast.error("Please upload image");
      return;
    }

    try {
      setSaving(true);

      await updateService(id, formData);

      toast.success("Service Updated Successfully");

      setTimeout(() => {
        navigate("/admin/service");
      }, 1500);
    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data?.message || "Failed to update service"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-10 text-lg">
        Loading Service...
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-[24px] sm:text-[28px] font-light text-[#444] mb-4 text-center sm:text-left">
        Edit Service
      </h1>

      <div className="bg-white border-t-4 border-[#3c8dbc] shadow-sm rounded-sm">
        <form onSubmit={handleSubmit} className="p-4 sm:p-6">

          {/* Title */}
          <div className="mb-5">
            <label className="block font-semibold mb-2">
              Service Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="
                w-full sm:max-w-[700px]
                h-[42px]
                border border-gray-300
                rounded px-3
                outline-none focus:border-[#3c8dbc]
              "
            />
          </div>

          {/* Description */}
          <div className="mb-5">
            <label className="block font-semibold mb-2">
              Description
            </label>
            <textarea
              rows="5"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="
                w-full sm:max-w-[700px]
                border border-gray-300
                rounded px-3 py-2
                resize-none outline-none
                focus:border-[#3c8dbc]
              "
            />
          </div>

          {/* Image */}
          <div className="mb-5">
            <label className="block font-semibold mb-2">
              Service Image
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
                  h-[180px] sm:h-[150px]
                  object-cover border rounded
                "
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
              text-white px-6 py-2
              rounded disabled:opacity-50
            "
          >
            {saving ? "Updating..." : "Update Service"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default EditServicePage;