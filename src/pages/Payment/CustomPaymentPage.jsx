import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { getAllUsers } from "../../services/userService";
import { createPaymentRequest } from "../../services/paymentService";

const CustomPaymentPage = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);

  const [search, setSearch] =
    useState("");

  const [selectedUser, setSelectedUser] =
    useState(null);

  const [saving, setSaving] =
    useState(false);

  const [formData, setFormData] =
    useState({
      amount: "",
      title: "",
      description: "",
    });

  // ==========================
  // Load Users
  // ==========================

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response =
          await getAllUsers();

        setUsers(
          response.data ||
            response.users ||
            []
        );
      } catch (error) {
        console.error(error);

        toast.error(
          "Failed to load users"
        );
      }
    };

    loadUsers();
  }, []);

  // ==========================
  // Search Users
  // ==========================

  const filteredUsers =
    useMemo(() => {
      if (!search.trim()) return [];

      const keyword =
        search.toLowerCase();

      return users.filter(
        (user) =>
          user.name
            ?.toLowerCase()
            .includes(keyword) ||
          user.mobileNo
            ?.toLowerCase()
            .includes(keyword) ||
          user.email
            ?.toLowerCase()
            .includes(keyword)
      );
    }, [users, search]);

  // ==========================
  // Handle Change
  // ==========================

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]:
        e.target.value,
    }));
  };

  // ==========================
  // Submit
  // ==========================

  const handleSubmit = async (
    e
  ) => {
    e.preventDefault();

    if (!selectedUser) {
      toast.error(
        "Please select a patient"
      );
      return;
    }

    if (!formData.amount) {
      toast.error(
        "Please enter amount"
      );
      return;
    }

    if (
      Number(formData.amount) <= 0
    ) {
      toast.error(
        "Amount should be greater than zero"
      );
      return;
    }

    if (
      !formData.title.trim()
    ) {
      toast.error(
        "Please enter title"
      );
      return;
    }

    if (
      !formData.description.trim()
    ) {
      toast.error(
        "Please enter description"
      );
      return;
    }

    try {
      setSaving(true);

      await createPaymentRequest({
        userId:
          selectedUser._id,
        amount: Number(
          formData.amount
        ),
        title:
          formData.title,
        description:
          formData.description,
      });

      toast.success(
        "Payment request created successfully"
      );

      console.log("Redirecting to /admin/payment now...");
      navigate("/admin/payment");
    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data
          ?.message ||
          "Failed to create payment request"
      );
    } finally {
      setSaving(false);
    }
  };

  const inputClass = `
      w-full
      border
      border-gray-300
      rounded
      px-3
      py-2
      text-sm
      outline-none
      focus:border-[#3c8dbc]
  `;
    return (
    <div>
      {/* Heading */}
      <h1 className="text-[24px] sm:text-[28px] font-light text-[#444] mb-4 text-center sm:text-left">
        Create Custom Payment
      </h1>

      {/* Card */}
      <div className="bg-white border-t-4 border-[#3c8dbc] shadow-sm rounded-sm">
        <form
          onSubmit={handleSubmit}
          className="p-4 sm:p-6"
        >
          {/* Search User */}
          <div className="mb-5">
            <label className="block font-semibold mb-2 text-sm">
              Search Patient
            </label>

            <input
              type="text"
              placeholder="Search by name, mobile or email"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className={inputClass}
            />

            {search &&
              filteredUsers.length >
                0 && (
                <div className="mt-2 border rounded max-h-[250px] overflow-y-auto">
                  {filteredUsers.map(
                    (user) => (
                      <button
                        key={user._id}
                        type="button"
                        onClick={() => {
                          setSelectedUser(
                            user
                          );
                          setSearch("");
                        }}
                        className="w-full text-left px-3 py-3 hover:bg-gray-100 border-b"
                      >
                        <div className="font-medium">
                          {user.name}
                        </div>

                        <div className="text-xs text-gray-500">
                          {
                            user.mobileNo
                          }
                        </div>

                        <div className="text-xs text-gray-500">
                          {user.email}
                        </div>
                      </button>
                    )
                  )}
                </div>
              )}
          </div>

          {/* Selected User */}
          {selectedUser && (
            <div className="bg-gray-50 border rounded p-4 mb-5 text-sm">
              <p>
                <strong>
                  Name:
                </strong>{" "}
                {
                  selectedUser.name
                }
              </p>

              <p>
                <strong>
                  Mobile:
                </strong>{" "}
                {
                  selectedUser.mobileNo
                }
              </p>

              <p>
                <strong>
                  Email:
                </strong>{" "}
                {
                  selectedUser.email
                }
              </p>
            </div>
          )}

          {/* Amount + Title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
            <div>
              <label className="block font-semibold mb-2 text-sm">
                Amount (₹)
              </label>

              <input
                type="number"
                name="amount"
                value={
                  formData.amount
                }
                onChange={
                  handleChange
                }
                placeholder="Enter Amount"
                className={
                  inputClass
                }
              />
            </div>

            <div>
              <label className="block font-semibold mb-2 text-sm">
                Payment Title
              </label>

              <input
                type="text"
                name="title"
                value={
                  formData.title
                }
                onChange={
                  handleChange
                }
                placeholder="Consultation Fee"
                className={
                  inputClass
                }
              />
            </div>
          </div>

          {/* Description */}
          <div className="mb-5">
            <label className="block font-semibold mb-2 text-sm">
              Description
            </label>

            <textarea
              rows="5"
              name="description"
              value={
                formData.description
              }
              onChange={
                handleChange
              }
              placeholder="Enter payment description"
              className={`${inputClass} resize-none`}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="
                bg-[#3c8dbc]
                hover:bg-[#367fa9]
                text-white
                px-6
                py-2
                rounded
                transition
                disabled:opacity-50
              "
            >
              {saving
                ? "Creating..."
                : "Create Payment"}
            </button>

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/admin/payment"
                )
              }
              className="
                border
                px-6
                py-2
                rounded
                hover:bg-gray-100
              "
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomPaymentPage;