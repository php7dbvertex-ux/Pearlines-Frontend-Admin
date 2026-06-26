import { useNavigate } from "react-router-dom";
import {
  UserCircle2,
  Mail,
  Phone,
} from "lucide-react";
import {
  useEffect,
  useState,
} from "react";
import api from "../../config/api";

const ProfilePage = () => {
  const navigate = useNavigate();

  const [admin, setAdmin] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile =
    async () => {
      try {
        const response =
          await api.get(
            "/admin/profile"
          );

        setAdmin(
          response.data.data
        );
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

  if (loading) {
    return (
      <div className="text-center py-10">
        Loading...
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-[36px] font-light text-[#444] mb-6">
        User Profile
      </h1>

      <div
        className="
          max-w-4xl
          mx-auto
          bg-white
          rounded-md
          shadow-sm
          border-t-4
          border-[#3c8dbc]
          overflow-hidden
        "
      >
        <div className="flex flex-col items-center py-10">
          {admin?.profileImage ? (
            <img
              src={admin.profileImage}
              alt="profile"
              className="
                w-[120px]
                h-[120px]
                rounded-full
                object-cover
              "
            />
          ) : (
            <UserCircle2
              size={120}
              className="text-[#3c8dbc]"
            />
          )}

          <h2 className="text-4xl mt-3 text-gray-700">
            {admin?.name}
          </h2>

          <p className="text-gray-500 mt-1">
            Administrator
          </p>
        </div>

        <div className="px-6 pb-6">
          <div className="border-t py-4 flex justify-between">
            <span className="font-semibold">
              Name
            </span>

            <span className="text-gray-700">
              {admin?.name}
            </span>
          </div>

          <div className="border-t py-4 flex justify-between">
            <span className="font-semibold flex items-center gap-2">
              <Mail size={16} />
              Email
            </span>

            <span className="text-[#3c8dbc]">
              {admin?.email}
            </span>
          </div>

          <div className="border-t py-4 flex justify-between">
            <span className="font-semibold flex items-center gap-2">
              <Phone size={16} />
              Mobile
            </span>

            <span className="text-gray-700">
              {admin?.mobileNo || "N/A"}
            </span>
          </div>

          <div className="border-t pt-5">
            <button
              onClick={() =>
                navigate("/admin/edit-profile")
              }
              className="
                bg-[#3c8dbc]
                text-white
                px-5
                py-2
                rounded
                hover:bg-[#367fa9]
                transition
              "
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;