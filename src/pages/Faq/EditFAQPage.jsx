import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { toast } from "react-toastify";

import { getFAQById, updateFAQ } from "../../services/faqService";

const EditFAQPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    question: "",
    answer: "",
  });

  // =========================
  // Load FAQ
  // =========================

  useEffect(() => {
    const loadFAQ = async () => {
      try {
        const response = await getFAQById(id);

        setFormData({
          question: response.data?.question || "",
          answer: response.data?.answer || "",
        });
      } catch (error) {
        console.error(error);

        toast.error("Failed to load FAQ");
      } finally {
        setLoading(false);
      }
    };

    loadFAQ();
  }, [id]);

  // =========================
  // Handle Change
  // =========================

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // =========================
  // Update
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      await updateFAQ(id, formData);

      toast.success("FAQ Updated Successfully");

      setTimeout(() => {
        navigate("/admin/faq");
      }, 1500);
    } catch (error) {
      console.error(error);

      toast.error("Failed to update FAQ");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-10">
        Loading FAQ...
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-[24px] sm:text-[28px] font-light text-[#444] mb-4 text-center sm:text-left">
        Edit FAQ
      </h1>

      <div className="bg-white border-t-4 border-[#3c8dbc] shadow-sm rounded-sm">
        <form onSubmit={handleSubmit} className="p-4 sm:p-6">

          {/* Question */}
          <div className="mb-5">
            <label className="block font-semibold mb-2">
              Question
            </label>
            <input
              type="text"
              name="question"
              value={formData.question}
              onChange={handleChange}
              className="
                w-full
                h-[42px]
                border border-gray-300
                rounded px-3
                outline-none focus:border-[#3c8dbc]
              "
            />
          </div>

          {/* Answer */}
          <div className="mb-6">
            <label className="block font-semibold mb-2">
              Answer
            </label>
            <textarea
              rows="8"
              name="answer"
              value={formData.answer}
              onChange={handleChange}
              className="
                w-full
                border border-gray-300
                rounded px-3 py-2
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
            {saving ? "Updating..." : "Update FAQ"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default EditFAQPage;