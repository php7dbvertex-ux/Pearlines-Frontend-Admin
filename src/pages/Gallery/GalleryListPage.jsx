import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { Pencil, Trash2, Plus } from "lucide-react";
import { Link } from "react-router-dom";

import {
  getAllGallery,
  deleteGallery,
} from "../../services/galleryService";

const GalleryListPage = () => {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const recordsPerPage = 10;

  // =========================
  // Load Gallery
  // =========================

  const loadGallery = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getAllGallery();
      setGallery(response?.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchGallery = async () => {
      await loadGallery();
    };
    fetchGallery();
  }, [loadGallery]);

  // =========================
  // Delete Gallery
  // =========================

  const handleDelete = async (galleryId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this image?"
    );
    if (!confirmDelete) return;

    try {
      await deleteGallery(galleryId);
      await loadGallery();
    } catch (error) {
      console.error(error);
      alert("Failed to delete image");
    }
  };

  // =========================
  // Search & Pagination
  // =========================

  const filteredGallery = useMemo(() => {
    return gallery.filter((item) =>
      item.title?.toLowerCase().includes(search.toLowerCase())
    );
  }, [gallery, search]);

  const totalPages = Math.ceil(filteredGallery.length / recordsPerPage);

  const paginatedGallery = filteredGallery.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  if (loading) {
    return (
      <div className="text-center py-10 text-lg">Loading Gallery...</div>
    );
  }

  return (
    <div>
      {/* Heading */}
      <h1 className="text-[24px] sm:text-[28px] font-light text-[#444] mb-4 text-center sm:text-left">
        Gallery Image List
      </h1>

      {/* Add Button */}
      <div className="mb-4">
        <Link
          to="/admin/gallery-image/add"
          className="
            inline-flex items-center gap-2
            bg-[#3c8dbc] hover:bg-[#367fa9]
            text-white px-4 py-2 rounded
          "
        >
          <Plus size={16} />
          Add Image
        </Link>
      </div>

      {/* Card */}
      <div className="bg-white border-t-4 border-[#3c8dbc] shadow-sm rounded-sm p-3 sm:p-4">

        {/* Search */}
        <div className="flex justify-end mb-4">
          <input
            type="text"
            placeholder="Search..."
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
          {paginatedGallery.length > 0 ? (
            paginatedGallery.map((item, index) => (
              <div key={item._id} className="border rounded-sm p-3 text-[13px] text-gray-700">
                {/* Header: S.No + actions */}
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-[#444] text-sm">
                    #{(currentPage - 1) * recordsPerPage + index + 1}
                  </span>
                  <div className="flex items-center gap-3">
                    <Link
                      to={`/admin/gallery-image/edit/${item._id}`}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <Pencil size={17} />
                    </Link>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>

                {/* Image + title */}
                <div className="flex gap-3 items-center">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-16 h-16 object-cover rounded border flex-shrink-0"
                  />
                  <div className="grid grid-cols-[44px_1fr] gap-y-1.5 text-xs">
                    <span className="text-gray-400 font-medium">Title</span>
                    <span className="break-words">{item.title}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center py-6 text-gray-500 text-sm">No Images Found</p>
          )}
        </div>

        {/* ── DESKTOP: Table Layout ── */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-[14px]">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-3 py-2 text-left">S No.</th>
                <th className="px-3 py-2 text-left">Image</th>
                <th className="px-3 py-2 text-left">Title</th>
                <th className="px-3 py-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedGallery.length > 0 ? (
                paginatedGallery.map((item, index) => (
                  <tr key={item._id} className="border-b hover:bg-gray-50">
                    <td className="px-3 py-3">
                      {(currentPage - 1) * recordsPerPage + index + 1}
                    </td>
                    <td className="px-3 py-3">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-16 h-16 object-cover rounded border"
                      />
                    </td>
                    <td className="px-3 py-3">{item.title}</td>
                    <td className="px-3 py-3">
                      <div className="flex justify-center gap-3">
                        <Link
                          to={`/admin/gallery-image/edit/${item._id}`}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <Pencil size={17} />
                        </Link>
                        <button
                          onClick={() => handleDelete(item._id)}
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
                  <td colSpan="4" className="text-center py-6 text-gray-500">
                    No Images Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-4">
          <p className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
            Total Images: {filteredGallery.length}
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

export default GalleryListPage;