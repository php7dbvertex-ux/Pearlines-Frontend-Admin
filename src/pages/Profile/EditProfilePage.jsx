import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../config/api";

const EditProfilePage = () => {
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
    setFormData((prev) => ({
      ...prev,
      [e.target.name]:
        e.target.value,
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

      fetchProfile();
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