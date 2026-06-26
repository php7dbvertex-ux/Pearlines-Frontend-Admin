import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { Pencil, Trash2, Plus, X } from "lucide-react";
import { Link } from "react-router-dom";

import Swal from "sweetalert2";
import { toast } from "react-toastify";

import {
  getAllTips,
  deleteTip,
} from "../../services/tipService";

const TipListPage = () => {
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [previewImage, setPreviewImage] = useState(null);

  const recordsPerPage = 10;

  // =========================
  // Load Tips
  // =========================

  const fetchTipsData = async () => {
    const response = await getAllTips();
    return response?.data || [];
  };

  const loadTips = useCallback(async () => {
    try {
      setLoading(true);
      const tipsData = await fetchTipsData();
      setTips(tipsData);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load tips");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const initialize = async () => {
      try {
        setLoading(true);
        const tipsData = await fetchTipsData();

        if (isMounted) {
          setTips(tipsData);
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load tips");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initialize();

    return () => {
      isMounted = false;
    };
  }, []);

  // =========================
  // Delete Tip
  // =========================

  const handleDelete = async (tipId) => {
    const result = await Swal.fire({
      title: "Delete Tip?",
      text: "Are you sure you want to delete this tip?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteTip(tipId);

      toast.success("Tip deleted successfully");

      await loadTips();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete tip");
    }
  };

  // =========================
  // Search & Pagination
  // =========================

  const filteredTips = useMemo(() => {
    return tips.filter((tip) =>
      tip.title?.toLowerCase().includes(search.toLowerCase())
    );
  }, [tips, search]);

  const totalPages = Math.ceil(
    filteredTips.length / recordsPerPage
  );

  const paginatedTips = filteredTips.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  if (loading) {
    return (
      <div className="text-center py-10 text-lg">
        Loading Tips...
      </div>
    );
  }


  return (
    <div>
      {/* Heading */}
      <h1 className="text-[24px] sm:text-[28px] font-light text-[#444] mb-4 text-center sm:text-left">
        Tips List
      </h1>

      {/* Add Button */}
      <div className="mb-4">
        <Link
          to="/admin/tip/add"
          className="
            inline-flex items-center gap-2
            bg-[#3c8dbc] hover:bg-[#367fa9]
            text-white px-4 py-2 rounded
          "
        >
          <Plus size={16} />
          Add Tip
        </Link>
      </div>

      {/* Card */}
      <div className="bg-white border-t-4 border-[#3c8dbc] shadow-sm rounded-sm p-3 sm:p-4">

        {/* Search */}
        <div className="flex justify-end mb-4">
          <input
            type="text"
            placeholder="Search Tip..."
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
          {paginatedTips.length > 0 ? (
            paginatedTips.map((tip, index) => (
              <div key={tip._id} className="border rounded-sm p-3 text-[13px] text-gray-700">
                {/* Header: S.No + actions */}
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-[#444] text-sm">
                    #{(currentPage - 1) * recordsPerPage + index + 1}
                  </span>
                  <div className="flex items-center gap-3">
                    <Link
                      to={`/admin/tip/edit/${tip._id}`}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <Pencil size={17} />
                    </Link>
                    <button
                      onClick={() => handleDelete(tip._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>

                {/* Image + details side by side */}
                <div className="flex gap-3 items-start">
                  <img
                    src={tip.imageUrl}
                    alt={tip.title}
                    onClick={() => setPreviewImage({ src: tip.imageUrl, alt: tip.title })}
                    className="w-16 h-16 object-contain bg-gray-50 rounded border flex-shrink-0 cursor-pointer"
                  />
                  <div className="grid grid-cols-[60px_1fr] gap-y-1.5 text-xs">
                    <span className="text-gray-400 font-medium">Title</span>
                    <span className="break-words">{tip.title}</span>

                    <span className="text-gray-400 font-medium">Created</span>
                    <span>{new Date(tip.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center py-6 text-gray-500 text-sm">No Tips Found</p>
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
              {paginatedTips.length > 0 ? (
                paginatedTips.map((tip, index) => (
                  <tr key={tip._id} className="border-b hover:bg-gray-50">
                    <td className="px-3 py-3">
                      {(currentPage - 1) * recordsPerPage + index + 1}
                    </td>
                    <td className="px-3 py-3">
                      <img
                        src={tip.imageUrl}
                        alt={tip.title}
                        onClick={() => setPreviewImage({ src: tip.imageUrl, alt: tip.title })}
                        className="w-16 h-16 object-contain bg-gray-50 rounded border cursor-pointer"
                      />
                    </td>
                    <td className="px-3 py-3">{tip.title}</td>
                    <td className="px-3 py-3">
                      {new Date(tip.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex justify-center gap-3">
                        <Link
                          to={`/admin/tip/edit/${tip._id}`}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <Pencil size={17} />
                        </Link>
                        <button
                          onClick={() => handleDelete(tip._id)}
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
                    No Tips Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-4">
          <p className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
            Total Tips: {filteredTips.length}
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

      {/* ── Image Preview Modal ── */}
      {previewImage && (
        <div
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 cursor-pointer"
        >
          <button
            onClick={() => setPreviewImage(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300"
          >
            <X size={28} />
          </button>
          <img
            src={previewImage.src}
            alt={previewImage.alt}
            onClick={(e) => e.stopPropagation()}
            className="max-w-full max-h-full object-contain rounded cursor-default"
          />
        </div>
      )}
    </div>
  );
};

export default TipListPage;