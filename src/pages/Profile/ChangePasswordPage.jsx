import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const ChangePasswordPage = () => {
  // Form State
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Show/Hide New Password
  const [showPassword, setShowPassword] = useState(false);

  // Error Message
  const [error, setError] = useState("");

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Remove error while typing
    setError("");
  };

  // Handle Form Submit
  const handleSubmit = (e) => {
    e.preventDefault();

    // Check password match
    if (formData.newPassword !== formData.confirmPassword) {
      setError("New Password and Confirm Password must be same.");
      return;
    }

    // API call will come here later
    console.log("Password Changed Successfully");
    console.log(formData);

    alert("Password Changed Successfully");

    // Reset form
    setFormData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  return (
    <div>
      {/* Page Heading */}
      <h1 className="text-[38px] font-light text-[#444] mb-6">
        Change Password
      </h1>

      {/* Main Card */}
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

            {/* Current Password */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Current Password
              </label>

              <input
                type="password"
                name="currentPassword"
                placeholder="Enter Current Password"
                value={formData.currentPassword}
                onChange={handleChange}
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

            {/* New Password */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                New Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="newPassword"
                  placeholder="Enter New Password"
                  value={formData.newPassword}
                  onChange={handleChange}
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

                {/* Eye Button */}
                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
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
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Confirm Password
              </label>

              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm New Password"
                value={formData.confirmPassword}
                onChange={handleChange}
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

            {/* Error Message */}
            {error && (
              <p className="text-red-500 text-sm font-medium">
                {error}
              </p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="
                bg-[#3c8dbc]
                hover:bg-[#367fa9]
                text-white
                px-6
                py-2.5
                rounded
                transition
                font-medium
              "
            >
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordPage;