import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { createFAQ } from "../../services/faqService";

const AddFAQPage = () => {
  const navigate = useNavigate();

  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
  });

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
  // Submit
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.question.trim()) {
      return alert("Question is required");
    }

    if (!formData.answer.trim()) {
      return alert("Answer is required");
    }

    try {
      setSaving(true);
      await createFAQ(formData);
      alert("FAQ Added Successfully");
      navigate("/admin/faq");
    } catch (error) {
      console.error(error);
      alert(
        error?.response?.data?.message || "Failed to add FAQ"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className="text-[24px] sm:text-[28px] font-light text-[#444] mb-4 text-center sm:text-left">
        Add FAQ
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
            {saving ? "Saving..." : "Save FAQ"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default AddFAQPage;