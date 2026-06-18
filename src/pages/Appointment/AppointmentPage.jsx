import { useState, useMemo, useEffect } from "react";
import { Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { getAllAppointments } from "../../services/appointmentService";

const StatusBadge = ({ status }) => {
  const color =
    status === "Accepted"
      ? "bg-green-600"
      : status === "Rescheduled"
        ? "bg-yellow-500"
        : "bg-orange-500";

  return (
    <span
      className={`px-3 py-1 rounded-full text-white text-xs font-medium ${color}`}
    >
      {status}
    </span>
  );
};

const AppointmentPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const recordsPerPage = 10;

  useEffect(() => {
    let isMounted = true;
    const loadAppointments = async () => {
      try {
        const response = await getAllAppointments();
        if (isMounted) setAppointments(response?.data || []);
      } catch (error) {
        console.error("Error Fetching Appointments:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadAppointments();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredAppointments = useMemo(() => {
    return appointments.filter(
      (a) =>
        a.patientName?.toLowerCase().includes(search.toLowerCase()) ||
        a.problem?.toLowerCase().includes(search.toLowerCase()) ||
        a._id?.toLowerCase().includes(search.toLowerCase()),
    );
  }, [appointments, search]);

  const totalPages = Math.ceil(filteredAppointments.length / recordsPerPage);
  const effectiveCurrentPage = Math.min(
    Math.max(currentPage, 1),
    totalPages || 1,
  );
  const paginatedAppointments = filteredAppointments.slice(
    (effectiveCurrentPage - 1) * recordsPerPage,
    effectiveCurrentPage * recordsPerPage,
  );

  if (loading) {
    return (
      <div className="text-center py-10 text-lg">Loading Appointments...</div>
    );
  }

  return (
    <div>
      {/* Heading */}
      <h1 className="text-[24px] sm:text-[28px] font-light text-[#444] mb-4 text-center sm:text-left">
        Appointment List
      </h1>

      {/* Card */}
      <div className="bg-white border-t-4 border-[#3c8dbc] shadow-sm rounded-sm p-3 sm:p-4">
        {/* Search */}
        <div className="flex justify-end mb-4">
          <input
            type="text"
            placeholder="Search Appointment..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="
              w-full sm:w-[240px] h-[34px] px-3
              border border-gray-300 rounded text-sm
              outline-none focus:border-[#3c8dbc]
            "
          />
        </div>

        {/* ── MOBILE: Card Layout ── */}
        <div className="block sm:hidden space-y-3">
          {paginatedAppointments.length > 0 ? (
            paginatedAppointments.map((a) => (
              <div
                key={a._id}
                className="border rounded-sm p-3 text-[13px] text-gray-700"
              >
                {/* Header row: name + status */}
                <div className="flex justify-between items-start mb-2">
                  <span className="font-semibold text-[#444] text-sm">
                    {a.patientName}
                  </span>
                  <StatusBadge status={a.status} />
                </div>

                <div className="grid grid-cols-[72px_1fr] gap-y-1.5 mb-3">
                  <span className="text-gray-400 text-xs font-medium">ID</span>
                  <span className="break-all text-xs text-gray-500">
                    {a._id}
                  </span>

                  <span className="text-gray-400 text-xs font-medium">
                    Date & Time
                  </span>
                  <span>
                    {new Date(a.appointmentDate).toLocaleDateString("en-IN")} |{" "}
                    {a.appointmentTime}
                  </span>

                  <span className="text-gray-400 text-xs font-medium">
                    Problem
                  </span>
                  <span>{a.problem}</span>
                </div>

                <Link
                  to={`/admin/appointments/${a._id}`}
                  className="
                    inline-flex items-center gap-1
                    bg-[#3c8dbc] hover:bg-[#367fa9]
                    text-white px-3 py-1.5 rounded text-xs transition
                  "
                >
                  <Eye size={13} />
                  View Detail
                </Link>
              </div>
            ))
          ) : (
            <p className="text-center py-6 text-gray-500 text-sm">
              No Appointments Found
            </p>
          )}
        </div>

        {/* ── DESKTOP: Table Layout ── */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-[14px]">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-3 py-2 text-left">ID</th>
                <th className="px-3 py-2 text-left">Patient Name</th>
                <th className="px-3 py-2 text-left">Date & Time</th>
                <th className="px-3 py-2 text-left">Problem</th>
                <th className="px-3 py-2 text-center">View</th>
                <th className="px-3 py-2 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {paginatedAppointments.length > 0 ? (
                paginatedAppointments.map((a) => (
                  <tr key={a._id} className="border-b hover:bg-gray-50">
                    <td className="px-3 py-3 text-xs text-gray-500 max-w-[80px] truncate">
                      {a._id}
                    </td>
                    <td className="px-3 py-3">{a.patientName}</td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      {new Date(a.appointmentDate).toLocaleDateString("en-IN")}{" "}
                      | {a.appointmentTime}
                    </td>
                    <td className="px-3 py-3">{a.problem}</td>
                    <td className="px-3 py-3 text-center">
                      <Link
                        to={`/admin/appointments/${a._id}`}
                        className="
                          inline-flex items-center justify-center gap-1
                          bg-[#3c8dbc] hover:bg-[#367fa9]
                          text-white px-3 py-1.5 rounded text-sm transition
                        "
                      >
                        <Eye size={14} />
                        View Detail
                      </Link>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <StatusBadge status={a.status} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-gray-500">
                    No Appointments Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-4">
          <p className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
            Total Appointments: {filteredAppointments.length}
          </p>

          <div className="flex gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="px-3 py-1 border text-xs sm:text-sm disabled:opacity-50 hover:bg-gray-100"
            >
              Previous
            </button>
            <button
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="px-3 py-1 border text-xs sm:text-sm disabled:opacity-50 hover:bg-gray-100"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentPage;
