import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { Pencil, Trash2, Plus } from "lucide-react";
import { Link } from "react-router-dom";

import {
  getAllVideos,
  deleteVideo,
} from "../../services/videoService";

const VideoListPage = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const recordsPerPage = 10;

  // =========================
  // Load Videos
  // =========================

  const loadVideos = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getAllVideos();
      setVideos(response?.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    (async () => {
      await loadVideos();
    })();
  }, [loadVideos]);

  // =========================
  // Delete Video
  // =========================

  const handleDelete = async (videoId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this video?"
    );
    if (!confirmDelete) return;

    try {
      await deleteVideo(videoId);
      await loadVideos();
    } catch (error) {
      console.error(error);
      alert("Failed to delete video");
    }
  };

  // =========================
  // Search & Pagination
  // =========================

  const filteredVideos = useMemo(() => {
    return videos.filter(
      (video) =>
        video.title?.toLowerCase().includes(search.toLowerCase()) ||
        video.videoUrl?.toLowerCase().includes(search.toLowerCase())
    );
  }, [videos, search]);

  const totalPages = Math.ceil(filteredVideos.length / recordsPerPage);

  const paginatedVideos = filteredVideos.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  if (loading) {
    return (
      <div className="text-center py-10 text-lg">Loading Videos...</div>
    );
  }

  return (
    <div>
      {/* Heading */}
      <h1 className="text-[24px] sm:text-[28px] font-light text-[#444] mb-4 text-center sm:text-left">
        Video List
      </h1>

      {/* Add Button */}
      <div className="mb-4">
        <Link
          to="/admin/video/add"
          className="
            inline-flex items-center gap-2
            bg-[#3c8dbc] hover:bg-[#367fa9]
            text-white px-4 py-2 rounded
          "
        >
          <Plus size={16} />
          Add Video
        </Link>
      </div>

      {/* Card */}
      <div className="bg-white border-t-4 border-[#3c8dbc] shadow-sm rounded-sm p-3 sm:p-4">

        {/* Search */}
        <div className="flex justify-end mb-4">
          <input
            type="text"
            placeholder="Search Video..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="
              w-full sm:w-[240px]
              h-[36px]
              border border-gray-300
              rounded px-3 text-sm
              outline-none focus:border-[#3c8dbc]
            "
          />
        </div>

        {/* ── MOBILE: Card Layout ── */}
        <div className="block sm:hidden space-y-3">
          {paginatedVideos.length > 0 ? (
            paginatedVideos.map((video, index) => (
              <div key={video._id} className="border rounded-sm p-3 text-[13px] text-gray-700">
                {/* Header: S.No + actions */}
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-[#444] text-sm">
                    #{(currentPage - 1) * recordsPerPage + index + 1}
                  </span>
                  <div className="flex items-center gap-3">
                    <Link
                      to={`/admin/video/edit/${video._id}`}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <Pencil size={17} />
                    </Link>
                    <button
                      onClick={() => handleDelete(video._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-[68px_1fr] gap-y-1.5 text-xs">
                  <span className="text-gray-400 font-medium">Title</span>
                  <span className="break-words">{video.title}</span>

                  <span className="text-gray-400 font-medium">Video</span>
                  <a
                    href={video.videoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline break-all"
                  >
                    Open Video
                  </a>

                  <span className="text-gray-400 font-medium">Created</span>
                  <span>{new Date(video.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center py-6 text-gray-500 text-sm">No Videos Found</p>
          )}
        </div>

        {/* ── DESKTOP: Table Layout ── */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-[14px]">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-3 py-2 text-left">S No.</th>
                <th className="px-3 py-2 text-left">Title</th>
                <th className="px-3 py-2 text-left">Video URL</th>
                <th className="px-3 py-2 text-left">Created</th>
                <th className="px-3 py-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedVideos.length > 0 ? (
                paginatedVideos.map((video, index) => (
                  <tr key={video._id} className="border-b hover:bg-gray-50">
                    <td className="px-3 py-3">
                      {(currentPage - 1) * recordsPerPage + index + 1}
                    </td>
                    <td className="px-3 py-3">{video.title}</td>
                    <td className="px-3 py-3">
                      <a
                        href={video.videoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Open Video
                      </a>
                    </td>
                    <td className="px-3 py-3">
                      {new Date(video.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex justify-center gap-3">
                        <Link
                          to={`/admin/video/edit/${video._id}`}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <Pencil size={17} />
                        </Link>
                        <button
                          onClick={() => handleDelete(video._id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-gray-500">
                    No Videos Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-4">
          <p className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
            Total Videos: {filteredVideos.length}
          </p>

          <div className="flex gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="px-3 py-1 border text-xs sm:text-sm disabled:opacity-50 hover:bg-gray-100"
            >
              Previous
            </button>
            <button
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="px-3 py-1 border text-xs sm:text-sm disabled:opacity-50 hover:bg-gray-100"
            >
              Next
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default VideoListPage;