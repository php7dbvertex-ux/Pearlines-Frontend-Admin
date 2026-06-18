import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createDoctor } from "../../services/doctorService";

const AddDoctorPage = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    mobileNo: "",
    email: "",
    mpin: "",
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

    if (!formData.name.trim())     return alert("Doctor name is required");
    if (!formData.mobileNo.trim()) return alert("Mobile number is required");
    if (!formData.email.trim())    return alert("Email is required");
    if (!/^\d{4}$/.test(formData.mpin)) return alert("MPIN must be exactly 4 digits");

    try {
      setLoading(true);
      await createDoctor(formData);
      alert("Doctor Added Successfully");
      navigate("/admin/doctor-list");
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.message || "Failed to add doctor");
    } finally {
      setLoading(false);
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
        Add Doctor
      </h1>

      {/* Card */}
      <div className="bg-white border-t-4 border-[#3c8dbc] shadow-sm rounded-sm">
        <form onSubmit={handleSubmit} className="p-4 sm:p-6">

          {/* 2-column grid on desktop, 1-column on mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">

            {/* Doctor Name */}
            <div>
              <label className="block font-semibold mb-2 text-sm">
                Doctor Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter Doctor Name"
                className={inputClass}
              />
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block font-semibold mb-2 text-sm">
                Mobile Number
              </label>
              <input
                type="text"
                name="mobileNo"
                value={formData.mobileNo}
                onChange={handleChange}
                placeholder="Enter Mobile Number"
                className={inputClass}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block font-semibold mb-2 text-sm">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter Email"
                className={inputClass}
              />
            </div>

            {/* MPIN */}
            <div>
              <label className="block font-semibold mb-2 text-sm">
                MPIN
              </label>
              <input
                type="password"
                name="mpin"
                value={formData.mpin}
                onChange={handleChange}
                maxLength="4"
                placeholder="Enter 4 Digit MPIN"
                className={inputClass}
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="
              w-full sm:w-auto
              bg-[#3c8dbc] hover:bg-[#367fa9]
              text-white px-6 py-2 rounded
              disabled:opacity-50 transition
            "
          >
            {loading ? "Saving..." : "Save Doctor"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddDoctorPage;