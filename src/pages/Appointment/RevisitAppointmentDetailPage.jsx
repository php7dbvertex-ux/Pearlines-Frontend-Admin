import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  getAppointmentById,
  updateAppointment,
} from "../../services/appointmentService";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const RevisitAppointmentDetailPage = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    appointmentDate: "",
    appointmentTime: "",
    problem: "",
    status: "Pending",
    nextVisit: "",
  });

  useEffect(() => {
    const loadAppointment = async () => {
      try {
        const response = await getAppointmentById(id);
        const appointment = response.data;
        setFormData({
          appointmentDate: appointment.appointmentDate?.split("T")[0] || "",
          appointmentTime: appointment.appointmentTime || "",
          problem: appointment.problem || "",
          status: appointment.status || "Pending",
          nextVisit: appointment.nextVisit?.split("T")[0] || "",
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadAppointment();
  }, [id]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateAppointment(id, formData);
      Swal.fire("Success", "Revisit Appointment Updated Successfully", "success");
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Failed To Update Revisit Appointment", "error");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-10 text-lg">
        Loading Revisit Appointment...
      </div>
    );
  }

  const labelClass =
    "block font-semibold text-[14px] sm:text-[16px] mb-2 text-[#444]";
  const inputClass =
    "w-full max-w-[600px] h-[42px] border border-gray-300 px-3 rounded outline-none focus:border-[#3c8dbc] text-sm sm:text-[15px]";

  // Prevent selecting dates before today
  const today = new Date().toISOString().split("T")[0];

  return (
    <div>
      {/* Heading */}
      <h1 className="text-[24px] sm:text-[28px] font-light text-[#444] mb-4 text-center sm:text-left">
        Revisit Appointment Details
      </h1>

      <div className="bg-white border-t-4 border-[#3c8dbc] shadow-sm rounded-sm">
        <form onSubmit={handleSubmit} className="p-4 sm:p-6">
          {/* Appointment Date */}
          <div className="mb-5">
            <label className={labelClass}>Appointment Date :</label>
            <input
              type="date"
              name="appointmentDate"
              value={formData.appointmentDate}
              onChange={handleChange}
              min={today}
              className={inputClass}
            />
          </div>

          {/* Appointment Time */}
          <div className="mb-5">
            <label className={labelClass}>Appointment Time :</label>
            <select
              name="appointmentTime"
              value={formData.appointmentTime}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="10:00 AM - 10:30 AM">
                10:00 AM - 10:30 AM
              </option>
              <option value="10:30 AM - 11:00 AM">
                10:30 AM - 11:00 AM
              </option>
              <option value="11:00 AM - 11:30 AM">
                11:00 AM - 11:30 AM
              </option>
              <option value="11:30 AM - 12:00 PM">
                11:30 AM - 12:00 PM
              </option>
            </select>
          </div>

          {/* Problem */}
          <div className="mb-5">
            <label className={labelClass}>Problem :</label>
            <textarea
              rows="4"
              name="problem"
              value={formData.problem}
              onChange={handleChange}
              className="
                w-full max-w-[600px]
                border border-gray-300
                px-3 py-2 rounded resize-none
                outline-none focus:border-[#3c8dbc]
                text-sm sm:text-[15px]
              "
            />
          </div>

          {/* Status */}
          <div className="mb-5">
            <label className={labelClass}>Status :</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="Pending">Pending</option>
              <option value="Accepted">Accepted</option>
              <option value="Visited">Visited</option>
            </select>
          </div>

          {/* Next Visit Date */}
          <div className="mb-6">
            <label className={labelClass}>Next Visit Date :</label>
            <input
              type="date"
              name="nextVisit"
              value={formData.nextVisit}
              onChange={handleChange}
              min={today}
              className={inputClass}
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="
              w-full sm:w-auto
              bg-[#3c8dbc] hover:bg-[#367fa9]
              text-white px-6 py-2
              rounded transition text-sm sm:text-[15px]
            "
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default RevisitAppointmentDetailPage;