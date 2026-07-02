import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../config/api";

const EditProfilePage = () => {
  const navigate = useNavigate();

  const [loading, setLoading] =
    useState(false);

  const [image, setImage] =
    useState(null);

  const [preview, setPreview] =
    useState("");

  const [formData, setFormData] =
    useState({
      name: "",
      email: "",
      mobileNo: "",
    });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token =
        localStorage.getItem(
          "adminToken"
        );

      const response =
        await api.get(
          "/admin/profile",
          {
            headers: {
              Authorization:
                token,
            },
          }
        );

      const admin =
        response.data.data;

      setFormData({
        name: admin?.name || "",
        email: admin?.email || "",
        mobileNo:
          admin?.mobileNo || "",
      });

      setPreview(
        admin?.profileImage || ""
      );
    } catch (error) {
      console.log(error);

      toast.error(
        "Failed to load profile"
      );
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Mobile number: strip non-digits and cap at 10 digits
    // as the admin types, so letters/symbols and an 11th
    // digit simply can't be entered.
    if (name === "mobileNo") {
      const digitsOnly = value
        .replace(/\D/g, "")
        .slice(0, 10);

      setFormData((prev) => ({
        ...prev,
        mobileNo: digitsOnly,
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (
    e
  ) => {
    const file =
      e.target.files[0];

    if (!file) return;

    setImage(file);

    setPreview(
      URL.createObjectURL(file)
    );
  };

  const handleSubmit = async (
    e
  ) => {
    e.preventDefault();

    // Mobile number must be exactly 10 digits — typing is
    // capped at 10, but it could still be shorter than 10.
    if (
      formData.mobileNo &&
      formData.mobileNo.length !== 10
    ) {
      toast.error(
        "Mobile number must be exactly 10 digits"
      );
      return;
    }

    try {
      setLoading(true);

      const token =
        localStorage.getItem(
          "adminToken"
        );

      if (image) {
        const imageForm =
          new FormData();

        imageForm.append(
          "image",
          image
        );

        await api.put(
          "/admin/profile-photo",
          imageForm,
          {
            headers: {
              Authorization:
                token,
              "Content-Type":
                "multipart/form-data",
            },
          }
        );
      }

      await api.put(
        "/admin/profile",
        {
          name:
            formData.name,
          mobileNo:
            formData.mobileNo,
        },
        {
          headers: {
            Authorization:
              token,
          },
        }
      );

      toast.success(
        "Profile Updated Successfully"
      );

      navigate("/admin/profile");
    } catch (error) {
      console.log(error);

      toast.error(
        "Failed To Update Profile"
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <h1 className="text-[38px] font-light text-[#444] mb-6">
        Edit Profile
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
          onSubmit={
            handleSubmit
          }
          className="p-6"
        >
          <div className="space-y-5">

            <div>
              <label className="block mb-2 font-medium">
                Profile Photo
              </label>

              {preview && (
                <img
                  src={preview}
                  alt="profile"
                  className="
                    w-28
                    h-28
                    rounded-full
                    object-cover
                    border
                    mb-3
                  "
                />
              )}

              <input
                type="file"
                accept="image/*"
                onChange={
                  handleImageChange
                }
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">
                Name
              </label>

              <input
                type="text"
                name="name"
                value={
                  formData.name
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
                "
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">
                Email
              </label>

              <input
                type="email"
                value={
                  formData.email
                }
                disabled
                className="
                  w-full
                  h-[45px]
                  px-4
                  border
                  border-gray-300
                  rounded
                  bg-gray-100
                "
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">
                Mobile
              </label>

              <input
                type="text"
                name="mobileNo"
                inputMode="numeric"
                maxLength={10}
                value={
                  formData.mobileNo
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
                "
              />
            </div>

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
              "
            >
              {loading
                ? "Updating..."
                : "Update Profile"}
            </button>

          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfilePage;