import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllDoctors } from "../../services/doctorService";
import { createSchedule } from "../../services/doctorScheduleService";

const AddDoctorSchedulePage = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    doctorId: "",
    date: "",
    time: "",
    status: "Available",
  });

  // Prevent past dates
  const today = new Date().toISOString().split("T")[0];

  // =========================
  // Load Doctors
  // =========================

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        const response = await getAllDoctors();
        setDoctors(response.data || []);
      } catch (error) {
        console.error(error);
      }
    };
    loadDoctors();
  }, []);

  // =========================
  // Input Change
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
  // Field Validation On Blur
  // =========================

  const handleBlur = (e) => {
    const { name, value } = e.target;

    if (!value || !value.trim()) {
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

    if (!formData.doctorId)
      newErrors.doctorId = "This field is required";

    if (!formData.date)
      newErrors.date = "This field is required";

    if (!formData.time.trim())
      newErrors.time = "This field is required";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    try {
      setLoading(true);
      await createSchedule(formData);
      alert("Doctor Schedule Added Successfully");
      navigate("/admin/doctor-schedule");
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.message || "Failed to create schedule");
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
        Add Doctor Schedule
      </h1>

      {/* Card */}
      <div className="bg-white border-t-4 border-[#3c8dbc] shadow-sm rounded-sm">
        <form onSubmit={handleSubmit} className="p-4 sm:p-6">
          {/* 2-column grid on desktop, 1-column on mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
            {/* Doctor */}
            <div>
              <label className="block font-semibold mb-2 text-sm">
                Doctor
              </label>
              <select
                name="doctorId"
                value={formData.doctorId}
                onChange={handleChange}
                onBlur={handleBlur}
                className={inputClass}
              >
                <option value="">Select Doctor</option>
                {doctors.map((doctor) => (
                  <option key={doctor._id} value={doctor._id}>
                    {doctor.name}
                  </option>
                ))}
              </select>

              {errors.doctorId && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.doctorId}
                </p>
              )}
            </div>

            {/* Date */}
            <div>
              <label className="block font-semibold mb-2 text-sm">
                Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                onBlur={handleBlur}
                min={today}
                className={inputClass}
              />

              {errors.date && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.date}
                </p>
              )}
            </div>

            {/* Time */}
            <div>
              <label className="block font-semibold mb-2 text-sm">
                Time
              </label>
              <input
                type="text"
                name="time"
                value={formData.time}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="10:00 AM - 02:00 PM"
                className={inputClass}
              />

              {errors.time && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.time}
                </p>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="block font-semibold mb-2 text-sm">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="Available">Available</option>
                <option value="Not Available">Not Available</option>
                <option value="Leave">Leave</option>
              </select>
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
            {loading ? "Saving..." : "Save Schedule"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddDoctorSchedulePage;