import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import logo from "../../../assets/logo.png";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      formData.email === "admin@gmail.com" &&
      formData.password === "admin123"
    ) {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("adminEmail", "admin@gmail.com");

      navigate("/admin/dashboard");
    } else {
      alert("Invalid Email or Password");
    }
  };

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center px-4">
      <motion.div
        initial={{
          opacity: 0,
          y: -1000,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 1.2,
          ease: "easeOut",
        }}
        className="
          w-full
          max-w-[450px]
          bg-white
          rounded-[12px]
          px-[35px]
          py-[20px]
          shadow-[0_20px_50px_rgba(0,0,0,0.18)]
        "
      >
        {/* Logo */}
        <img
          src={logo}
          alt="logo"
          className="
            w-[264px]
            h-auto
            object-contain
            mx-auto
            mb-1
          "
        />

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <input
              type="text"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="
                w-full
                h-[54px]
                bg-[#edf2fb]
                rounded
                border-none
                outline-none
                text-center
                text-[18px]
                placeholder:text-gray-500
              "
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="
                  w-full
                  h-[54px]
                  bg-[#edf2fb]
                  rounded
                  border-none
                  outline-none
                  text-center
                  text-[18px]
                  placeholder:text-gray-500
                  -mt-1
                  pr-12
                "
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="
                  absolute
                  right-4
                  top-1/2
                  -translate-y-1/2
                  text-gray-500
                  hover:text-gray-700
                  transition-colors
                "
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="flex justify-center mt-3">
            <button
              type="submit"
              className="
                w-full
                max-w-[200px]
                h-[48px]
                bg-[#4fb3e8]
                text-white
                rounded
                uppercase
                font-medium
                shadow-[0_10px_25px_rgba(79,179,232,0.4)]
                hover:bg-[#3aa8e2]
                hover:scale-[1.02]
                transition-all
                mb-6
              "
            >
              Log In
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default LoginPage;