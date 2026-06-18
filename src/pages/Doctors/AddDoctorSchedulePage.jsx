import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllDoctors } from "../../services/doctorService";
import { createSchedule } from "../../services/doctorScheduleService";

const AddDoctorSchedulePage = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState({
    doctorId: "",
    date: "",
    time: "",
    status: "Available",
  });

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
  };

  // =========================
  // Submit
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.doctorId) return alert("Please select doctor");
    if (!formData.date)     return alert("Please select date");
    if (!formData.time.trim()) return alert("Please enter time");

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
                className={inputClass}
              >
                <option value="">Select Doctor</option>
                {doctors.map((doctor) => (
                  <option key={doctor._id} value={doctor._id}>
                    {doctor.name}
                  </option>
                ))}
              </select>
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
                className={inputClass}
              />
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
                placeholder="10:00 AM - 02:00 PM"
                className={inputClass}
              />
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