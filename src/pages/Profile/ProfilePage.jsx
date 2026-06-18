import { UserCircle2, Mail, Phone } from "lucide-react";

const ProfilePage = () => {
  return (
    <div>
      {/* Page Title */}
      <h1 className="text-[36px] font-light text-[#444] mb-6">
        User Profile
      </h1>

      {/* Card */}
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
        {/* Top Section */}
        <div className="flex flex-col items-center py-10">
          <UserCircle2
            size={120}
            className="text-[#3c8dbc]"
          />

          <h2 className="text-4xl mt-3 text-gray-700">
            Admin
          </h2>

          <p className="text-gray-500 mt-1">
            Administrator
          </p>
        </div>

        {/* Details */}
        <div className="px-6 pb-6">
          <div className="border-t py-4 flex justify-between">
            <span className="font-semibold">
              Name
            </span>

            <span className="text-gray-700">
              Admin
            </span>
          </div>

          <div className="border-t py-4 flex justify-between">
            <span className="font-semibold flex items-center gap-2">
              <Mail size={16} />
              Email
            </span>

            <span className="text-[#3c8dbc]">
              admin@gmail.com
            </span>
          </div>

          <div className="border-t py-4 flex justify-between">
            <span className="font-semibold flex items-center gap-2">
              <Phone size={16} />
              Mobile
            </span>

            <span className="text-gray-700">
              +91 9876543210
            </span>
          </div>

          <div className="border-t pt-5">
            <button
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