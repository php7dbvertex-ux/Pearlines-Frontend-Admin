import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createDoctor } from "../../services/doctorService";

const AddDoctorPage = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

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

    setErrors((prev) => ({
      ...prev,
      [e.target.name]: "",
    }));
  };

  // =========================
  // Handle Blur
  // =========================

  const handleBlur = (e) => {
    const { name, value } = e.target;

    if (!value.trim()) {
      setErrors((prev) => ({
        ...prev,
        [name]: "This field is required",
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // =========================
  // Submit
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "This field is required";
    }

    if (!formData.mobileNo.trim()) {
      newErrors.mobileNo = "This field is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "This field is required";
    }

    if (!formData.mpin.trim()) {
      newErrors.mpin = "This field is required";
    } else if (!/^\d{4}$/.test(formData.mpin)) {
      newErrors.mpin = "MPIN must be exactly 4 digits";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

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
                onBlur={handleBlur}
                placeholder="Enter Doctor Name"
                className={inputClass}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.name}
                </p>
              )}
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
                onBlur={handleBlur}
                placeholder="Enter Mobile Number"
                className={inputClass}
              />
              {errors.mobileNo && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.mobileNo}
                </p>
              )}
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
                onBlur={handleBlur}
                placeholder="Enter Email"
                className={inputClass}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email}
                </p>
              )}
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
                onBlur={handleBlur}
                maxLength={4}
                placeholder="Enter 4 Digit MPIN"
                className={inputClass}
              />
              {errors.mpin && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.mpin}
                </p>
              )}
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