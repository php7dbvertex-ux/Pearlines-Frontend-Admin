import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Trash2 } from "lucide-react";

import {
  getAllUsers,
  deleteUser,
} from "../../services/userService";

const UserListPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const recordsPerPage = 10;

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getAllUsers();
      setUsers(response?.data || []);
    } catch (error) {
      console.error("Error Fetching Users:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const response = await getAllUsers();
        setUsers(response?.data || []);
      } catch (error) {
        console.error("Error Fetching Users:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUser(id);
      await loadUsers();
    } catch (error) {
      console.error("Delete Error:", error);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((user) =>
      user.email?.toLowerCase().includes(search.toLowerCase()) ||
      user.mobileNo?.includes(search) ||
      user.address?.toLowerCase().includes(search)
    );
  }, [users, search]);

  const totalPages = Math.ceil(filteredUsers.length / recordsPerPage);
  const currentPageToShow = Math.max(1, Math.min(currentPage, totalPages || 1));

  const paginatedUsers = filteredUsers.slice(
    (currentPageToShow - 1) * recordsPerPage,
    currentPageToShow * recordsPerPage
  );

  if (loading) {
    return (
      <div className="text-center py-10 text-lg">Loading Users...</div>
    );
  }

  return (
    <div>
      {/* Page Heading */}
      <h1 className="text-[24px] sm:text-[28px] font-light text-[#444] mb-4 text-center sm:text-left">
        User List
      </h1>

      {/* Main Card */}
      <div className="bg-white border-t-4 border-[#3c8dbc] shadow-sm rounded-sm p-3 sm:p-4">

        {/* Search */}
        <div className="flex justify-end mb-4">
          <input
            type="text"
            placeholder="Search User..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="
              w-full sm:w-[220px]
              h-[34px]
              px-3
              border border-gray-300
              rounded text-sm
              outline-none
              focus:border-[#3c8dbc]
            "
          />
        </div>

        {/* ── MOBILE: Card Layout ── */}
        <div className="block sm:hidden space-y-3">
          {paginatedUsers.length > 0 ? (
            paginatedUsers.map((user, index) => (
              <div key={user._id} className="border rounded-sm p-3 text-[13px] text-gray-700">
                {/* Header row: S.No + Delete action */}
                <div className="flex justify-between items-start mb-2">
                  <span className="font-semibold text-[#444] text-sm">
                    #{(currentPage - 1) * recordsPerPage + index + 1}
                  </span>
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="text-red-500 hover:text-red-700 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="grid grid-cols-[72px_1fr] gap-y-1.5">
                  <span className="text-gray-400 text-xs font-medium">Email</span>
                  <span className="break-all">{user.email}</span>

                  <span className="text-gray-400 text-xs font-medium">Mobile</span>
                  <span>{user.mobileNo}</span>

                  <span className="text-gray-400 text-xs font-medium">DOB</span>
                  <span>{new Date(user.dob).toLocaleDateString("en-IN")}</span>

                  <span className="text-gray-400 text-xs font-medium">Address</span>
                  <span className="break-words">{user.address}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center py-6 text-gray-500 text-sm">No Users Found</p>
          )}
        </div>

        {/* ── DESKTOP: Table Layout ── */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full border-collapse text-[14px]">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-3 py-2 text-left whitespace-nowrap">S.No</th>
                <th className="px-3 py-2 text-left whitespace-nowrap">Email</th>
                <th className="px-3 py-2 text-left whitespace-nowrap">Mobile</th>
                <th className="px-3 py-2 text-left whitespace-nowrap">DOB</th>
                <th className="px-3 py-2 text-left whitespace-nowrap">Address</th>
                <th className="px-3 py-2 text-center whitespace-nowrap">Action</th>
              </tr>
            </thead>

            <tbody>
              {paginatedUsers.length > 0 ? (
                paginatedUsers.map((user, index) => (
                  <tr key={user._id} className="border-b hover:bg-gray-50">
                    <td className="px-3 py-2">
                      {(currentPage - 1) * recordsPerPage + index + 1}
                    </td>
                    <td className="px-3 py-2 max-w-[160px] truncate">{user.email}</td>
                    <td className="px-3 py-2 whitespace-nowrap">{user.mobileNo}</td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      {new Date(user.dob).toLocaleDateString("en-IN")}
                    </td>
                    <td className="px-3 py-2 max-w-[160px] truncate">{user.address}</td>
                    <td className="px-3 py-2 text-center">
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="text-red-500 hover:text-red-700 transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-5 text-gray-500">
                    No Users Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer — stacks on mobile */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-4">
          <p className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
            Showing{" "}
            {filteredUsers.length === 0
              ? 0
              : (currentPage - 1) * recordsPerPage + 1}{" "}
            to{" "}
            {(currentPage - 1) * recordsPerPage + paginatedUsers.length}{" "}
            of {filteredUsers.length} entries
          </p>

          <div className="flex items-center gap-1 flex-wrap justify-center">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="px-3 py-1 border text-xs sm:text-sm bg-white hover:bg-gray-100 disabled:opacity-50"
            >
              Previous
            </button>

            {/* Page numbers — hidden on mobile to save space, like AppointmentPage's simpler footer */}
            <div className="hidden sm:flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`
                    px-3 py-1 border text-xs sm:text-sm
                    ${currentPage === i + 1
                      ? "bg-[#3c8dbc] text-white"
                      : "bg-white hover:bg-gray-100"}
                  `}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="px-3 py-1 border text-xs sm:text-sm bg-white hover:bg-gray-100 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserListPage;