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
import Swal from "sweetalert2";

import { toast } from "react-toastify";


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

      setUsers(response?.users || []);
    } catch (error) {
      console.error("Error Fetching Users:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

const handleDelete = async (id) => {
  const result = await Swal.fire({
    title: "Delete User?",
    text: "Are you sure you want to delete this user?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete",
    cancelButtonText: "Cancel",
  });

  if (!result.isConfirmed) return;

  try {
    await deleteUser(id);
    await loadUsers();
    toast.success("User deleted successfully");
  } catch (error) {
    console.error("Delete Error:", error);
    toast.error("Failed to delete user");
  }
};
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      return (
        user.email
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        user.mobileNo
          ?.toLowerCase?.()
          .includes(search.toLowerCase()) ||
        user.phone
          ?.toLowerCase?.()
          .includes(search.toLowerCase()) ||
        user.address
          ?.toLowerCase()
          .includes(search.toLowerCase())
      );
    });
  }, [users, search]);

  const totalPages = Math.ceil(
    filteredUsers.length / recordsPerPage
  );

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  if (loading) {
    return (
      <div className="text-center py-10 text-lg">
        Loading Users...
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-[24px] sm:text-[28px] font-light text-[#444] mb-4">
        User List
      </h1>

      <div className="bg-white border-t-4 border-[#3c8dbc] shadow-sm rounded-sm p-4">
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
              w-full
              sm:w-[250px]
              h-[38px]
              px-3
              border
              border-gray-300
              rounded
              outline-none
            "
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="px-3 py-2 text-left">
                  S.No
                </th>

                <th className="px-3 py-2 text-left">
                  Email
                </th>

                <th className="px-3 py-2 text-left">
                  Mobile
                </th>

                <th className="px-3 py-2 text-left">
                  DOB
                </th>

                <th className="px-3 py-2 text-left">
                  Address
                </th>

                <th className="px-3 py-2 text-center">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {paginatedUsers.length > 0 ? (
                paginatedUsers.map((user, index) => (
                  <tr
                    key={user._id}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="px-3 py-2">
                      {(currentPage - 1) *
                        recordsPerPage +
                        index +
                        1}
                    </td>

                    <td className="px-3 py-2">
                      {user.email || "-"}
                    </td>

                    <td className="px-3 py-2">
                      {user.mobileNo ||
                        user.phone ||
                        "-"}
                    </td>

                    <td className="px-3 py-2">
                      {user.dob
                        ? new Date(
                            user.dob
                          ).toLocaleDateString(
                            "en-IN"
                          )
                        : "-"}
                    </td>

                    <td className="px-3 py-2">
                      {user.address || "-"}
                    </td>

                    <td className="px-3 py-2 text-center">
                      <button
                        onClick={() =>
                          handleDelete(user._id)
                        }
                        className="
                          text-red-500
                          hover:text-red-700
                          transition
                        "
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="
                      text-center
                      py-6
                      text-gray-500
                    "
                  >
                    No Users Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center mt-4">
          <p className="text-sm text-gray-600">
            Total Users: {filteredUsers.length}
          </p>

          <div className="flex gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() =>
                setCurrentPage((prev) =>
                  prev - 1
                )
              }
              className="
                px-3
                py-1
                border
                disabled:opacity-50
              "
            >
              Previous
            </button>

            <span className="px-3 py-1">
              {currentPage} /{" "}
              {totalPages || 1}
            </span>

            <button
              disabled={
                currentPage === totalPages ||
                totalPages === 0
              }
              onClick={() =>
                setCurrentPage((prev) =>
                  prev + 1
                )
              }
              className="
                px-3
                py-1
                border
                disabled:opacity-50
              "
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