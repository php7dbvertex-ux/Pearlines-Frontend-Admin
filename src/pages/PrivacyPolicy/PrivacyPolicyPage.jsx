import { useEffect, useState } from "react";

import {
  getPrivacyPolicy,
  updatePrivacyPolicy,
} from "../../services/privacyPolicyService";

const PrivacyPolicyPage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [content, setContent] = useState("");

  // ===========================
  // Load Privacy Policy
  // ===========================

  useEffect(() => {
    const loadPrivacyPolicy = async () => {
      try {
        const response = await getPrivacyPolicy();
        setContent(response?.data?.content || "");
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadPrivacyPolicy();
  }, []);

  // ===========================
  // Save
  // ===========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      await updatePrivacyPolicy({ content });
      alert("Privacy Policy Updated Successfully");
    } catch (error) {
      console.error(error);
      alert("Failed To Update Privacy Policy");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-10 text-lg">Loading Privacy Policy...</div>
    );
  }

  return (
    <div>
      <h1 className="text-[24px] sm:text-[28px] font-light text-[#444] mb-4 text-center sm:text-left">
        Privacy Policy
      </h1>

      <div className="bg-white border-t-4 border-[#3c8dbc] shadow-sm rounded-sm">
        <form onSubmit={handleSubmit} className="p-4 sm:p-6">

          <div className="mb-6">
            <label className="block font-semibold mb-2">
              Privacy Policy Content
            </label>
            <textarea
              rows="20"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="
                w-full
                border border-gray-300
                rounded px-3 py-3
                resize-none outline-none
                focus:border-[#3c8dbc]
              "
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

export default PrivacyPolicyPage;