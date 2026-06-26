import {
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";

import { Pencil, Trash2, Plus } from "lucide-react";
import { Link } from "react-router-dom";

import {
  getAllDoctors,
  deleteDoctor,
} from "../../services/doctorService";

import Swal from "sweetalert2";
import { toast } from "react-toastify";

const DoctorListPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const recordsPerPage = 10;

  // ===========================
  // Fetch Doctors
  // ===========================

  const loadDoctors = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getAllDoctors();
      setDoctors(response?.data || []);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchDoctors = async () => {
      await loadDoctors();
    };
    fetchDoctors();
  }, [loadDoctors]);

  // ===========================
  // Delete Doctor
  // ===========================

const handleDelete = async (doctorId) => {
  const result = await Swal.fire({
    title: "Delete Doctor?",
    text: "Are you sure you want to delete this doctor?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, Delete",
    cancelButtonText: "Cancel",
  });

  if (!result.isConfirmed) return;

  try {
    await deleteDoctor(doctorId);

    toast.success("Doctor deleted successfully");

    loadDoctors();
  } catch (error) {
    console.error("Delete Error:", error);

    toast.error("Failed to delete doctor");
  }
};

  // ===========================
  // Search
  // ===========================

  const filteredDoctors = useMemo(() => {
    return doctors.filter(
      (doctor) =>
        doctor.name?.toLowerCase().includes(search.toLowerCase()) ||
        doctor.email?.toLowerCase().includes(search.toLowerCase()) ||
        doctor.mobileNo?.includes(search)
    );
  }, [doctors, search]);

  // ===========================
  // Pagination
  // ===========================

  const totalPages = Math.ceil(filteredDoctors.length / recordsPerPage);
  const effectiveCurrentPage = Math.min(Math.max(currentPage, 1), totalPages || 1);
  const paginatedDoctors = filteredDoctors.slice(
    (effectiveCurrentPage - 1) * recordsPerPage,
    effectiveCurrentPage * recordsPerPage
  );

  // ===========================
  // Loading
  // ===========================

  if (loading) {
    return (
      <div className="text-center py-10 text-lg">
        Loading Doctors...
      </div>
    );
  }

  return (
    <div>
      {/* Heading */}
      <h1 className="text-[24px] sm:text-[28px] font-light text-[#444] mb-4 text-center sm:text-left">
        Doctor List
      </h1>

      {/* Add Button */}
      <div className="mb-4">
        <Link
          to="/admin/doctor/add"
          className="
            inline-flex items-center gap-2
            bg-[#3c8dbc] hover:bg-[#367fa9]
            text-white px-4 py-2 rounded transition
          "
        >
          <Plus size={18} />
          Add Doctor
        </Link>
      </div>

      {/* Card */}
      <div className="bg-white border-t-4 border-[#3c8dbc] shadow-sm rounded-sm p-3 sm:p-4">

        {/* Search */}
        <div className="flex justify-end mb-4">
          <input
            type="text"
            placeholder="Search Doctor..."
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
          {paginatedDoctors.length > 0 ? (
            paginatedDoctors.map((doctor, index) => (
              <div key={doctor._id} className="border rounded-sm p-3 text-[13px] text-gray-700">

                {/* Header row: name + actions */}
                <div className="flex justify-between items-start mb-2">
                  <span className="font-semibold text-[#444] text-sm">
                    {doctor.name}
                  </span>
                  <div className="flex gap-3">
                    <Link
                      to={`/admin/doctor/edit/${doctor._id}`}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <Pencil size={17} />
                    </Link>
                    <button
                      onClick={() => handleDelete(doctor._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-[72px_1fr] gap-y-1.5">
                  <span className="text-gray-400 text-xs font-medium">S No.</span>
                  <span>{(effectiveCurrentPage - 1) * recordsPerPage + index + 1}</span>

                  <span className="text-gray-400 text-xs font-medium">Mobile</span>
                  <span>{doctor.mobileNo}</span>

                  <span className="text-gray-400 text-xs font-medium">Email</span>
                  <span className="break-all">{doctor.email}</span>

                  <span className="text-gray-400 text-xs font-medium">MPIN</span>
                  <span>{doctor.mpin}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center py-6 text-gray-500 text-sm">
              No Doctors Found
            </p>
          )}
        </div>

        {/* ── DESKTOP: Table Layout ── */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-[14px]">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-3 py-2 text-left">S No.</th>
                <th className="px-3 py-2 text-left">Name</th>
                <th className="px-3 py-2 text-left">Mobile</th>
                <th className="px-3 py-2 text-left">Email</th>
                <th className="px-3 py-2 text-left">MPIN</th>
                <th className="px-3 py-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedDoctors.length > 0 ? (
                paginatedDoctors.map((doctor, index) => (
                  <tr key={doctor._id} className="border-b hover:bg-gray-50">
                    <td className="px-3 py-3">
                      {(effectiveCurrentPage - 1) * recordsPerPage + index + 1}
                    </td>
                    <td className="px-3 py-3">{doctor.name}</td>
                    <td className="px-3 py-3">{doctor.mobileNo}</td>
                    <td className="px-3 py-3">{doctor.email}</td>
                    <td className="px-3 py-3">{doctor.mpin}</td>
                    <td className="px-3 py-3">
                      <div className="flex justify-center gap-3">
                        <Link
                          to={`/admin/doctor/edit/${doctor._id}`}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <Pencil size={17} />
                        </Link>
                        <button
                          onClick={() => handleDelete(doctor._id)}
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
                    No Doctors Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-4">
          <p className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
            Total Doctors: {filteredDoctors.length}
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

export default DoctorListPage;