import { useEffect, useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { toast } from "react-toastify";

import {
  getTermsCondition,
  updateTermsCondition,
} from "../../services/termsConditionService";

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

const TermsConditionPage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [content, setContent] = useState("");

  // ===========================
  // Load Terms & Conditions
  // ===========================

  useEffect(() => {
    const loadTermsCondition = async () => {
      try {
        const response = await getTermsCondition();
        setContent(response?.data?.content || "");
      } catch (error) {
        console.error(error);
        toast.error(
          "Failed to load Terms & Conditions"
        );
      } finally {
        setLoading(false);
      }
    };

    loadTermsCondition();
  }, []);

  // ===========================
  // Save
  // ===========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      await updateTermsCondition({
        content,
      });

      toast.success(
        "Terms & Conditions Updated Successfully"
      );
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed To Update Terms & Conditions"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-10 text-lg">
        Loading Terms & Conditions...
      </div>
    );
  }


  return (
    <div>
      <h1 className="text-[24px] sm:text-[28px] font-light text-[#444] mb-4 text-center sm:text-left">
        Terms & Conditions
      </h1>

      <div className="bg-white border-t-4 border-[#3c8dbc] shadow-sm rounded-sm">
        <form onSubmit={handleSubmit} className="p-4 sm:p-6">

          <div className="mb-6">
            <label className="block font-semibold mb-2">
              Terms & Conditions Content
            </label>
            <ReactQuill
              theme="snow"
              value={content}
              onChange={setContent}
              modules={quillModules}
              className="bg-white"
              style={{ height: "400px", marginBottom: "42px" }}
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="
              w-full sm:w-auto
              bg-[#3c8dbc] hover:bg-[#367fa9]
              text-white px-6 py-2
              rounded disabled:opacity-50
            "
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default TermsConditionPage;