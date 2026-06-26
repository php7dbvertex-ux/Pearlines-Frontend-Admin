import {
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";

import { Pencil, Trash2, Plus } from "lucide-react";
import { Link } from "react-router-dom";

import {
  getAllSchedules,
  deleteSchedule,
} from "../../services/doctorScheduleService";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const DoctorSchedulePage = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const recordsPerPage = 10;

  // =========================
  // Fetch Schedules
  // =========================

  const loadSchedules = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getAllSchedules();
      setSchedules(response?.data || []);
    } catch (error) {
      console.error("Error fetching schedules:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(loadSchedules);
  }, [loadSchedules]);

  // =========================
  // Delete Schedule
  // =========================

const handleDelete = async (scheduleId) => {
  const result = await Swal.fire({
    title: "Delete Schedule?",
    text: "Are you sure you want to delete this schedule?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, Delete",
    cancelButtonText: "Cancel",
  });

  if (!result.isConfirmed) return;

  try {
    await deleteSchedule(scheduleId);

    toast.success("Schedule deleted successfully");

    loadSchedules();
  } catch (error) {
    console.error(error);

    toast.error("Failed to delete schedule");
  }
};
  // =========================
  // Search
  // =========================

  const filteredSchedules = useMemo(() => {
    return schedules.filter(
      (schedule) =>
        schedule.doctorId?.name?.toLowerCase().includes(search.toLowerCase()) ||
        schedule.status?.toLowerCase().includes(search.toLowerCase())
    );
  }, [schedules, search]);

  // =========================
  // Pagination
  // =========================

  const totalPages = Math.ceil(filteredSchedules.length / recordsPerPage);
  const effectiveCurrentPage = Math.min(Math.max(currentPage, 1), totalPages || 1);
  const paginatedSchedules = filteredSchedules.slice(
    (effectiveCurrentPage - 1) * recordsPerPage,
    effectiveCurrentPage * recordsPerPage
  );

  // =========================
  // Loading
  // =========================

  if (loading) {
    return (
      <div className="text-center py-10 text-lg">
        Loading Doctor Schedules...
      </div>
    );
  }

  return (
    <div>
      {/* Heading */}
      <h1 className="text-[24px] sm:text-[28px] font-light text-[#444] mb-4 text-center sm:text-left">
        Doctor Schedule
      </h1>

      {/* Add Button */}
      <div className="mb-4">
        <Link
          to="/admin/doctor-schedule/add"
          className="
            inline-flex items-center gap-2
            bg-[#3c8dbc] hover:bg-[#367fa9]
            text-white px-4 py-2 rounded transition
          "
        >
          <Plus size={18} />
          Add Doctor Schedule
        </Link>
      </div>

      {/* Card */}
      <div className="bg-white border-t-4 border-[#3c8dbc] shadow-sm rounded-sm p-3 sm:p-4">

        {/* Search */}
        <div className="flex justify-end mb-4">
          <input
            type="text"
            placeholder="Search Schedule..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="
              w-full sm:w-[240px] h-[34px] px-3
              border border-gray-300 rounded text-sm
              outline-none focus:border-[#3c8dbc]
            "
          />
        </div>

        {/* ── MOBILE: Card Layout ── */}
        <div className="block sm:hidden space-y-3">
          {paginatedSchedules.length > 0 ? (
            paginatedSchedules.map((schedule, index) => (
              <div key={schedule._id} className="border rounded-sm p-3 text-[13px] text-gray-700">

                {/* Header row: doctor name + status */}
                <div className="flex justify-between items-start mb-2">
                  <span className="font-semibold text-[#444] text-sm">
                    {schedule.doctorId?.name}
                  </span>
                  <span
                    className={`
                      px-3 py-1 rounded-full text-white text-xs font-medium
                      ${
                        schedule.status === "Available"
                          ? "bg-green-600"
                          : schedule.status === "Leave"
                          ? "bg-red-500"
                          : "bg-orange-500"
                      }
                    `}
                  >
                    {schedule.status}
                  </span>
                </div>

                <div className="grid grid-cols-[72px_1fr] gap-y-1.5 mb-3">
                  <span className="text-gray-400 text-xs font-medium">S No.</span>
                  <span>{(effectiveCurrentPage - 1) * recordsPerPage + index + 1}</span>

                  <span className="text-gray-400 text-xs font-medium">Date</span>
                  <span>{new Date(schedule.date).toLocaleDateString("en-IN")}</span>

                  <span className="text-gray-400 text-xs font-medium">Time</span>
                  <span>{schedule.time}</span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Link
                    to={`/admin/doctor-schedule/edit/${schedule._id}`}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <Pencil size={17} />
                  </Link>
                  <button
                    onClick={() => handleDelete(schedule._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center py-6 text-gray-500 text-sm">
              No Doctor Schedule Found
            </p>
          )}
        </div>

        {/* ── DESKTOP: Table Layout ── */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-[14px]">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-3 py-2 text-left">S No.</th>
                <th className="px-3 py-2 text-left">Doctor Name</th>
                <th className="px-3 py-2 text-left">Date</th>
                <th className="px-3 py-2 text-left">Time</th>
                <th className="px-3 py-2 text-center">Status</th>
                <th className="px-3 py-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedSchedules.length > 0 ? (
                paginatedSchedules.map((schedule, index) => (
                  <tr key={schedule._id} className="border-b hover:bg-gray-50">
                    <td className="px-3 py-3">
                      {(effectiveCurrentPage - 1) * recordsPerPage + index + 1}
                    </td>
                    <td className="px-3 py-3">{schedule.doctorId?.name}</td>
                    <td className="px-3 py-3">
                      {new Date(schedule.date).toLocaleDateString("en-IN")}
                    </td>
                    <td className="px-3 py-3">{schedule.time}</td>
                    <td className="px-3 py-3 text-center">
                      <span
                        className={`
                          px-4 py-1 rounded-full text-white text-xs font-medium
                          ${
                            schedule.status === "Available"
                              ? "bg-green-600"
                              : schedule.status === "Leave"
                              ? "bg-red-500"
                              : "bg-orange-500"
                          }
                        `}
                      >
                        {schedule.status}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex justify-center gap-3">
                        <Link
                          to={`/admin/doctor-schedule/edit/${schedule._id}`}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <Pencil size={17} />
                        </Link>
                        <button
                          onClick={() => handleDelete(schedule._id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-5 text-center text-gray-500">
                    No Doctor Schedule Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-4">
          <p className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
            Total Schedules: {filteredSchedules.length}
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

export default DoctorSchedulePage;