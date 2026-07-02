import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getAppointmentById,
  updateAppointment,
} from "../../services/appointmentService";

import Swal from "sweetalert2";
import { toast } from "react-toastify";

const AppointmentDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    appointmentDate: "",
    appointmentTime: "",
    problem: "",
    status: "Pending",
  });

  // Keep track of the original date/time fetched from the server,
  // so we can detect whether the admin actually changed them
  // before allowing a "Rescheduled" save.
  const originalRef = useRef({
    appointmentDate: "",
    appointmentTime: "",
    status: "Pending",
  });

  useEffect(() => {
    const loadAppointment = async () => {
      try {
        const response = await getAppointmentById(id);
        const appointment = response.data;

        const loadedDate = appointment.appointmentDate?.split("T")[0] || "";
        const loadedTime = appointment.appointmentTime || "";
        const loadedStatus = appointment.status || "Pending";

        setFormData({
          appointmentDate: loadedDate,
          appointmentTime: loadedTime,
          problem: appointment.problem || "",
          status: loadedStatus,
        });

        // Store the original values for comparison on submit
        originalRef.current = {
          appointmentDate: loadedDate,
          appointmentTime: loadedTime,
          status: loadedStatus,
        };
      } catch (error) {
        console.error("Error Loading Appointment:", error);
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

    // Validation: if the admin is rescheduling, they must pick a
    // different date or time than what was already saved.
    if (formData.status === "Rescheduled") {
      const dateUnchanged =
        formData.appointmentDate === originalRef.current.appointmentDate;
      const timeUnchanged =
        formData.appointmentTime === originalRef.current.appointmentTime;

      if (dateUnchanged && timeUnchanged) {
        Swal.fire(
          "Date/Time Required",
          "Please change or select a new date or time to reschedule this appointment.",
          "warning"
        );
        return;
      }
    }

    try {
      await updateAppointment(id, formData);

      // Update the "original" snapshot so a subsequent edit in the
      // same session is compared against the just-saved values.
      originalRef.current = {
        appointmentDate: formData.appointmentDate,
        appointmentTime: formData.appointmentTime,
        status: formData.status,
      };

      await Swal.fire("Success", "Appointment Updated Successfully", "success");

      // Redirect back to the appointments list after a successful save
      navigate("/admin/appointments");
    } catch (error) {
      console.error("Update Error:", error);
      Swal.fire("Error", "Failed To Update Appointment", "error");
    }
  };

  if (loading) {
    return <div className="text-center py-10 text-lg">Loading Appointment...</div>;
  }

  const labelClass = "block font-semibold text-[14px] sm:text-[16px] mb-2 text-[#444]";
  const inputClass = "w-full h-[42px] border border-gray-300 px-3 rounded outline-none focus:border-[#3c8dbc] text-sm sm:text-[15px]";

  // Added: Prevent selecting dates before today
  const today = new Date().toISOString().split("T")[0];

  return (
    <div>
      {/* Heading */}
      <h1 className="text-[24px] sm:text-[28px] font-light text-[#444] mb-4 text-center sm:text-left">
        Appointment Details
      </h1>

      <div className="bg-white border-t-4 border-[#3c8dbc] shadow-sm rounded-sm">
        <form onSubmit={handleSubmit} className="p-4 sm:p-6">

          {/* Two-column grid on md+, single column on mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">

            {/* Appointment Date */}
            <div>
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
            <div>
              <label className={labelClass}>Appointment Time :</label>
              <select
                name="appointmentTime"
                value={formData.appointmentTime}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="10:00 AM - 10:30 AM">10:00 AM - 10:30 AM</option>
                <option value="10:30 AM - 11:00 AM">10:30 AM - 11:00 AM</option>
                <option value="11:00 AM - 11:30 AM">11:00 AM - 11:30 AM</option>
                <option value="11:30 AM - 12:00 PM">11:30 AM - 12:00 PM</option>
                <option value="12:00 PM - 12:30 PM">12:00 PM - 12:30 PM</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className={labelClass}>Appointment Status :</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="Pending">Pending</option>
                <option value="Accepted">Accepted</option>
                <option value="Rescheduled">Rescheduled</option>
              </select>
            </div>
          </div>

          {/* Problem — full width always */}
          <div className="mb-6">
            <label className={labelClass}>Problem :</label>
            <textarea
              rows="4"
              name="problem"
              value={formData.problem}
              onChange={handleChange}
              className="
                w-full border border-gray-300
                px-3 py-2 rounded resize-none
                outline-none focus:border-[#3c8dbc]
                text-sm sm:text-[15px]
              "
            />
          </div>

          {/* Button — full width on mobile, auto on desktop */}
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

export default AppointmentDetailPage;