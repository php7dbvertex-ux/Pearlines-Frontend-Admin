import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { toast } from "react-toastify";

import { getVideoById, updateVideo } from "../../services/videoService";

const EditVideoPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    videoUrl: "",
  });

  // =========================
  // Load Video
  // =========================

  useEffect(() => {
    const loadVideo = async () => {
      try {
        const response = await getVideoById(id);

        const video = response.data;

        setFormData({
          title: video.title || "",
          videoUrl: video.videoUrl || "",
        });
      } catch (error) {
        console.error(error);

        toast.error("Failed to load video");
      } finally {
        setLoading(false);
      }
    };

    loadVideo();
  }, [id]);

  // =========================
  // Input Change
  // =========================

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // =========================
  // Submit
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Video title is required");
      return;
    }

    if (!formData.videoUrl.trim()) {
      toast.error("Video URL is required");
      return;
    }

    try {
      setSaving(true);

      await updateVideo(id, formData);

      toast.success("Video Updated Successfully");

      setTimeout(() => {
        navigate("/admin/video");
      }, 1500);
    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to update video"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-10 text-lg">
        Loading Video...
      </div>
    );
  }


  return (
    <div>
      {/* Heading */}
      <h1 className="text-[24px] sm:text-[28px] font-light text-[#444] mb-4 text-center sm:text-left">
        Edit Video
      </h1>

      {/* Card */}
      <div className="bg-white border-t-4 border-[#3c8dbc] shadow-sm rounded-sm">
        <form onSubmit={handleSubmit} className="p-4 sm:p-6">

          {/* Title */}
          <div className="mb-5">
            <label className="block font-semibold mb-2">
              Video Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="
                w-full sm:max-w-[600px]
                h-[42px]
                border border-gray-300
                rounded px-3
                outline-none focus:border-[#3c8dbc]
              "
            />
          </div>

          {/* Video URL */}
          <div className="mb-6">
            <label className="block font-semibold mb-2">
              Video URL
            </label>
            <input
              type="url"
              name="videoUrl"
              value={formData.videoUrl}
              onChange={handleChange}
              placeholder="https://www.youtube.com/watch?v=xxxxx"
              className="
                w-full sm:max-w-[600px]
                h-[42px]
                border border-gray-300
                rounded px-3
                outline-none focus:border-[#3c8dbc]
              "
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={saving}
            className="
              w-full sm:w-auto
              bg-[#3c8dbc] hover:bg-[#367fa9]
              text-white px-6 py-2
              rounded disabled:opacity-50
            "
          >
            {saving ? "Updating..." : "Update Video"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default EditVideoPage;