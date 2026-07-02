import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
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
  const { name, value } = e.target;

  // Name: Only letters and spaces
  if (name === "name") {
    const lettersOnly = value.replace(/[^a-zA-Z\s]/g, "");

    setFormData((prev) => ({
      ...prev,
      name: lettersOnly,
    }));

    setErrors((prev) => ({
      ...prev,
      name: "",
    }));

    return;
  }

  // Mobile Number: Only digits, max 10
  if (name === "mobileNo") {
    const digitsOnly = value.replace(/\D/g, "").slice(0, 10);

    setFormData((prev) => ({
      ...prev,
      mobileNo: digitsOnly,
    }));

    setErrors((prev) => ({
      ...prev,
      mobileNo: "",
    }));

    return;
  }

  // MPIN: Only digits, max 4
  if (name === "mpin") {
    const digitsOnly = value.replace(/\D/g, "").slice(0, 4);

    setFormData((prev) => ({
      ...prev,
      mpin: digitsOnly,
    }));

    setErrors((prev) => ({
      ...prev,
      mpin: "",
    }));

    return;
  }

  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));

  setErrors((prev) => ({
    ...prev,
    [name]: "",
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
    return;
  }

  if (name === "name") {
    if (!/^[A-Za-z ]+$/.test(value)) {
      setErrors((prev) => ({
        ...prev,
        name: "Name can contain only letters",
      }));
      return;
    }
  }

  if (name === "email") {
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(value)) {
      setErrors((prev) => ({
        ...prev,
        email: "Enter a valid email address",
      }));
      return;
    }
  }

  if (name === "mobileNo") {
    if (value.length !== 10) {
      setErrors((prev) => ({
        ...prev,
        mobileNo: "Mobile number must be exactly 10 digits",
      }));
      return;
    }
  }

  if (name === "mpin") {
    if (!/^\d{4}$/.test(value)) {
      setErrors((prev) => ({
        ...prev,
        mpin: "MPIN must be exactly 4 digits",
      }));
      return;
    }
  }

  setErrors((prev) => ({
    ...prev,
    [name]: "",
  }));
};
  // =========================
  // Submit
  // =========================

const handleSubmit = async (e) => {
  e.preventDefault();

  const newErrors = {};

  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!formData.name.trim()) {
    newErrors.name = "This field is required";
  } else if (!/^[A-Za-z ]+$/.test(formData.name)) {
    newErrors.name = "Name can contain only letters";
  }

  if (!formData.mobileNo.trim()) {
    newErrors.mobileNo = "This field is required";
  } else if (formData.mobileNo.length !== 10) {
    newErrors.mobileNo =
      "Mobile number must be exactly 10 digits";
  }

  if (!formData.email.trim()) {
    newErrors.email = "This field is required";
  } else if (!emailRegex.test(formData.email)) {
    newErrors.email = "Enter a valid email address";
  }

  if (!formData.mpin.trim()) {
    newErrors.mpin = "This field is required";
  } else if (!/^\d{4}$/.test(formData.mpin)) {
    newErrors.mpin =
      "MPIN must be exactly 4 digits";
  }

  setErrors(newErrors);

  if (Object.keys(newErrors).length > 0) {
    toast.error("Please fill all required fields correctly");
    return;
  }

  try {
    setLoading(true);

    await createDoctor(formData);

    toast.success("Doctor Added Successfully");

    navigate("/admin/doctor-list");
  } catch (error) {
    console.error(error);

    toast.error(
      error?.response?.data?.message ||
        "Failed to add doctor"
    );
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
                inputMode="numeric"
                maxLength={10}
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