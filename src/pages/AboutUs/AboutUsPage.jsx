import { useEffect, useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { toast } from "react-toastify";

import {
  getAboutUs,
  updateAboutUs,
} from "../../services/aboutUsService";

// Toolbar options for the editor
const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ align: [] }],
    ["link"],
    ["clean"],
  ],
};

const AboutUsPage = () => {
  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [description, setDescription] =
    useState("");

  // ===========================
  // Load About Us Data
  // ===========================

  useEffect(() => {
    const loadAboutUs = async () => {
      try {
        const response =
          await getAboutUs();

        if (response.data) {
          setDescription(
            response.data
              .description || ""
          );
        }
      } catch (error) {
        console.error(error);

        toast.error(
          "Failed to load About Us"
        );
      } finally {
        setLoading(false);
      }
    };

    loadAboutUs();
  }, []);

  // ===========================
  // Save
  // ===========================

  const handleSubmit = async (
    e
  ) => {
    e.preventDefault();

    try {
      setSaving(true);

      await updateAboutUs({
        description,
      });

      toast.success(
        "About Us Updated Successfully"
      );
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed To Update About Us"
      );
    } finally {
      setSaving(false);
    }
  };

  // ===========================
  // Loading
  // ===========================

  if (loading) {
    return (
      <div className="text-center py-10 text-lg">
        Loading About Us...
      </div>
    );
  }
return (
    <div>
      {/* Heading */}
      <h1 className="text-[24px] sm:text-[28px] font-light text-[#444] mb-4 text-center sm:text-left">
        About Us
      </h1>

      {/* Card */}
      <div className="bg-white border-t-4 border-[#3c8dbc] shadow-sm rounded-sm">
        <form onSubmit={handleSubmit} className="p-4 sm:p-6">

          {/* Description */}
          <div className="mb-6">
            <label className="block font-semibold mb-2 text-sm">
              Description
            </label>
            <ReactQuill
              theme="snow"
              value={description}
              onChange={setDescription}
              modules={quillModules}
              className="bg-white"
              style={{ height: "400px", marginBottom: "42px" }}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={saving}
            className="
              w-full sm:w-auto
              bg-[#3c8dbc] hover:bg-[#367fa9]
              text-white px-6 py-2 rounded
              transition disabled:opacity-50
            "
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AboutUsPage;