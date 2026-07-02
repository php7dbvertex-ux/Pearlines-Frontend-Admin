import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import api from "../../config/api";

const ChangePasswordPage = () => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleChange = (e) => {
    const { name, value } =
      e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };
const handleSubmit = async (e) => {
  e.preventDefault();

  // Current password validation
  if (!formData.currentPassword.trim()) {
    const message = "Current Password is required.";
    setError(message);
    toast.error(message);
    return;
  }

  // New password validation
  if (!formData.newPassword.trim()) {
    const message = "New Password is required.";
    setError(message);
    toast.error(message);
    return;
  }

  // Confirm password validation
  if (!formData.confirmPassword.trim()) {
    const message = "Confirm Password is required.";
    setError(message);
    toast.error(message);
    return;
  }

  // Match validation
  if (formData.newPassword !== formData.confirmPassword) {
    const message =
      "New Password and Confirm Password must be the same.";

    setError(message);
    toast.error(message);
    return;
  }

  // Optional: Prevent same password
  if (formData.currentPassword === formData.newPassword) {
    const message =
      "New Password must be different from Current Password.";

    setError(message);
    toast.error(message);
    return;
  }

  try {
    setLoading(true);

    const response = await api.put("/admin/change-password", {
      oldPassword: formData.currentPassword,
      newPassword: formData.newPassword,
    });

    toast.success(response.data.message);

    setFormData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    setError("");
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      "Failed to change password";

    setError(errorMessage);
    toast.error(errorMessage);
  } finally {
    setLoading(false);
  }
};
  return (
    <div>
      <h1 className="text-[38px] font-light text-[#444] mb-6">
        Change Password
      </h1>

      <div
        className="
          bg-white
          border-t-4
          border-[#3c8dbc]
          rounded-sm
          shadow-sm
          max-w-[1200px]
        "
      >
        <form
          onSubmit={handleSubmit}
          className="p-6"
        >
          <div className="space-y-5">
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Current Password
              </label>

              <input
                type="password"
                name="currentPassword"
                placeholder="Enter Current Password"
                value={
                  formData.currentPassword
                }
                onChange={
                  handleChange
                }
                className="
                  w-full
                  h-[45px]
                  px-4
                  border
                  border-gray-300
                  rounded
                  focus:border-[#3c8dbc]
                  outline-none
                "
              />
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700">
                New Password
              </label>

              <div className="relative">
                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="newPassword"
                  placeholder="Enter New Password"
                  value={
                    formData.newPassword
                  }
                  onChange={
                    handleChange
                  }
                  className="
                    w-full
                    h-[45px]
                    px-4
                    pr-12
                    border
                    border-gray-300
                    rounded
                    focus:border-[#3c8dbc]
                    outline-none
                  "
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  className="
                    absolute
                    right-3
                    top-1/2
                    -translate-y-1/2
                    text-gray-500
                  "
                >
                  {showPassword ? (
                    <EyeOff
                      size={20}
                    />
                  ) : (
                    <Eye
                      size={20}
                    />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Confirm Password
              </label>

              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm New Password"
                value={
                  formData.confirmPassword
                }
                onChange={
                  handleChange
                }
                className="
                  w-full
                  h-[45px]
                  px-4
                  border
                  border-gray-300
                  rounded
                  focus:border-[#3c8dbc]
                  outline-none
                "
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm font-medium">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="
                bg-[#3c8dbc]
                hover:bg-[#367fa9]
                text-white
                px-6
                py-2.5
                rounded
                transition
                font-medium
                disabled:opacity-50
              "
            >
              {loading
                ? "Updating..."
                : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordPage;