import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  createService,
} from "../../services/serviceService";

import {
  uploadImage,
} from "../../services/uploadService";

const AddServicePage = () => {
  const navigate = useNavigate();

  const [saving, setSaving] =
    useState(false);

  const [uploading, setUploading] =
    useState(false);

  const [formData, setFormData] =
    useState({
      title: "",
      description: "",
      imageUrl: "",
      publicId: "",
    });

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
      } catch (error) {
        console.error(error);

        alert(
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

    if (
      !formData.title.trim()
    ) {
      return alert(
        "Service title is required"
      );
    }

    if (
      !formData.description.trim()
    ) {
      return alert(
        "Description is required"
      );
    }

    if (
      !formData.imageUrl
    ) {
      return alert(
        "Please upload image"
      );
    }

    try {
      setSaving(true);

      await createService(
        formData
      );

      alert(
        "Service Added Successfully"
      );

      navigate(
        "/admin/service"
      );
    } catch (error) {
      console.error(error);

      alert(
        error?.response?.data
          ?.message ||
          "Failed to add service"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className="text-[28px] font-light text-[#444] mb-4">
        Add Service
      </h1>

      <div className="bg-white border-t-4 border-[#3c8dbc] shadow-sm rounded-sm">
        <form
          onSubmit={handleSubmit}
          className="p-6"
        >
          {/* Title */}

          <div className="mb-5">
            <label className="block font-semibold mb-2">
              Service Title
            </label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={
                handleChange
              }
              className="
                w-full
                max-w-[700px]
                h-[42px]
                border
                border-gray-300
                rounded
                px-3
                outline-none
                focus:border-[#3c8dbc]
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
              value={
                formData.description
              }
              onChange={
                handleChange
              }
              className="
                w-full
                max-w-[700px]
                border
                border-gray-300
                rounded
                px-3
                py-2
                resize-none
                outline-none
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
              onChange={
                handleImageUpload
              }
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
                src={
                  formData.imageUrl
                }
                alt="Preview"
                className="
                  w-[250px]
                  h-[150px]
                  object-cover
                  border
                  rounded
                "
              />
            </div>
          )}

          {/* Submit */}

          <button
            type="submit"
            disabled={
              saving ||
              uploading
            }
            className="
              bg-[#3c8dbc]
              hover:bg-[#367fa9]
              text-white
              px-6
              py-2
              rounded
              disabled:opacity-50
            "
          >
            {saving
              ? "Saving..."
              : "Save Service"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddServicePage;