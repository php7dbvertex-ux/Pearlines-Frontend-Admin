import { useEffect, useState } from "react";
import { getAboutUs, updateAboutUs } from "../../services/aboutUsService";

const AboutUsPage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    phone: "",
    website: "",
  });

  // ===========================
  // Load About Us Data
  // ===========================

  useEffect(() => {
    const loadAboutUs = async () => {
      try {
        const response = await getAboutUs();
        if (response.data) {
          setFormData({
            title: response.data.title || "",
            description: response.data.description || "",
            phone: response.data.phone || "",
            website: response.data.website || "",
          });
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadAboutUs();
  }, []);

  // ===========================
  // Handle Change
  // ===========================

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ===========================
  // Save
  // ===========================

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await updateAboutUs(formData);
      alert("About Us Updated Successfully");
    } catch (error) {
      console.error(error);
      alert("Failed To Update About Us");
    } finally {
      setSaving(false);
    }
  };

  // ===========================
  // Loading
  // ===========================

  if (loading) {
    return <div className="text-center py-10 text-lg">Loading About Us...</div>;
  }

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
        About Us
      </h1>

      {/* Card */}
      <div className="bg-white border-t-4 border-[#3c8dbc] shadow-sm rounded-sm">
        <form onSubmit={handleSubmit} className="p-4 sm:p-6">
          {/* 2-column grid for Title + Phone + Website, full-width Description */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
            {/* Title */}
            <div>
              <label className="block font-semibold mb-2 text-sm">
                Clinic Name
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block font-semibold mb-2 text-sm">
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            {/* Website */}
            <div>
              <label className="block font-semibold mb-2 text-sm">
                Website
              </label>
              <input
                type="text"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          </div>

          {/* Description - full width */}
          <div className="mb-5">
            <label className="block font-semibold mb-2 text-sm">
              Description
            </label>
            <textarea
              name="description"
              rows="10"
              value={formData.description}
              onChange={handleChange}
              className="
                w-full border border-gray-300
                rounded px-3 py-3 text-sm
                resize-none outline-none
                focus:border-[#3c8dbc]
              "
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
