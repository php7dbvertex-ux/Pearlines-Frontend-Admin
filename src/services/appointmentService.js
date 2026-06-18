import api from "../config/api";

// Get All Appointments
export const getAllAppointments =
  async () => {
    const response =
      await api.get("/appointments");

    return response.data;
  };

// Get Appointment By Id
export const getAppointmentById =
  async (id) => {
    const response =
      await api.get(
        `/appointments/${id}`
      );

    return response.data;
  };

// Update Appointment
export const updateAppointment =
  async (id, data) => {
    const response =
      await api.put(
        `/appointments/${id}`,
        data
      );

    return response.data;
  };

// Delete Appointment
export const deleteAppointment =
  async (id) => {
    const response =
      await api.delete(
        `/appointments/${id}`
      );

    return response.data;
  };

// Create Revisit Appointment
export const getRevisitAppointments =
  async () => {
    const response =
      await api.get(
        "/appointments/revisit"
      );

    return response.data;
  };


  export const getTodayAppointments =
  async () => {
    const response =
      await api.get(
        "/appointments/today"
      );

    return response.data;
  };


 
