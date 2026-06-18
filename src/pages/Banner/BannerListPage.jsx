import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { Pencil, Trash2, Plus } from "lucide-react";
import { Link } from "react-router-dom";

import {
  getAllBanners,
  deleteBanner,
} from "../../services/bannerService";

const BannerListPage = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const recordsPerPage = 10;

  // =========================
  // Load Banners
  // =========================

  const loadBanners = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getAllBanners();
      setBanners(response?.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => { loadBanners(); }, 0);
    return () => clearTimeout(timer);
  }, [loadBanners]);

  // =========================
  // Delete Banner
  // =========================

  const handleDelete = async (bannerId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this banner?"
    );
    if (!confirmDelete) return;
    try {
      await deleteBanner(bannerId);
      await loadBanners();
    } catch (error) {
      console.error(error);
      alert("Failed to delete banner");
    }
  };

  // =========================
  // Search
  // =========================

  const filteredBanners = useMemo(() => {
    return banners.filter((banner) =>
      banner.title?.toLowerCase().includes(search.toLowerCase())
    );
  }, [banners, search]);

  // =========================
  // Pagination
  // =========================

  const totalPages = Math.ceil(filteredBanners.length / recordsPerPage);
  const effectiveCurrentPage = Math.min(Math.max(currentPage, 1), totalPages || 1);
  const paginatedBanners = filteredBanners.slice(
    (effectiveCurrentPage - 1) * recordsPerPage,
    effectiveCurrentPage * recordsPerPage
  );

  // =========================
  // Loading
  // =========================

  if (loading) {
    return (
      <div className="text-center py-10 text-lg">
        Loading Banners...
      </div>
    );
  }

  return (
    <div>
      {/* Heading */}
      <h1 className="text-[24px] sm:text-[28px] font-light text-[#444] mb-4 text-center sm:text-left">
        Banner List
      </h1>

      {/* Add Button */}
      <div className="mb-4">
        <Link
          to="/admin/banner/add"
          className="
            inline-flex items-center gap-2
            bg-[#3c8dbc] hover:bg-[#367fa9]
            text-white px-4 py-2 rounded transition
          "
        >
          <Plus size={16} />
          Add Banner
        </Link>
      </div>

      {/* Card */}
      <div className="bg-white border-t-4 border-[#3c8dbc] shadow-sm rounded-sm p-3 sm:p-4">

        {/* Search */}
        <div className="flex justify-end mb-4">
          <input
            type="text"
            placeholder="Search Banner..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="
              w-full sm:w-[240px] h-[36px] px-3
              border border-gray-300 rounded text-sm
              outline-none focus:border-[#3c8dbc]
            "
          />
        </div>

        {/* ── MOBILE: Card Layout ── */}
        <div className="block sm:hidden space-y-3">
          {paginatedBanners.length > 0 ? (
            paginatedBanners.map((banner, index) => (
              <div key={banner._id} className="border rounded-sm p-3 text-[13px] text-gray-700">

                {/* Header row: title + actions */}
                <div className="flex justify-between items-start mb-2">
                  <span className="font-semibold text-[#444] text-sm">
                    {banner.title}
                  </span>
                  <div className="flex gap-3">
                    <Link
                      to={`/admin/banner/edit/${banner._id}`}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <Pencil size={17} />
                    </Link>
                    <button
                      onClick={() => handleDelete(banner._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-[72px_1fr] gap-y-1.5">
                  <span className="text-gray-400 text-xs font-medium">S No.</span>
                  <span>{(effectiveCurrentPage - 1) * recordsPerPage + index + 1}</span>

                  <span className="text-gray-400 text-xs font-medium">Image</span>
                  <img
                    src={banner.imageUrl}
                    alt={banner.title}
                    className="w-16 h-16 object-cover rounded border"
                  />

                  <span className="text-gray-400 text-xs font-medium">Created</span>
                  <span>{new Date(banner.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center py-6 text-gray-500 text-sm">
              No Banners Found
            </p>
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
                <th className="px-3 py-2 text-left">Created</th>
                <th className="px-3 py-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedBanners.length > 0 ? (
                paginatedBanners.map((banner, index) => (
                  <tr key={banner._id} className="border-b hover:bg-gray-50">
                    <td className="px-3 py-3">
                      {(effectiveCurrentPage - 1) * recordsPerPage + index + 1}
                    </td>
                    <td className="px-3 py-3">
                      <img
                        src={banner.imageUrl}
                        alt={banner.title}
                        className="w-16 h-16 object-cover rounded border"
                      />
                    </td>
                    <td className="px-3 py-3">{banner.title}</td>
                    <td className="px-3 py-3">
                      {new Date(banner.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex justify-center gap-3">
                        <Link
                          to={`/admin/banner/edit/${banner._id}`}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <Pencil size={17} />
                        </Link>
                        <button
                          onClick={() => handleDelete(banner._id)}
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
                    No Banners Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-4">
          <p className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
            Total Banners: {filteredBanners.length}
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

export default BannerListPage;