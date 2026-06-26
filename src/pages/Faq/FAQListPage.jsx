import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { Pencil, Trash2, Plus } from "lucide-react";
import { Link } from "react-router-dom";

import Swal from "sweetalert2";
import { toast } from "react-toastify";

import {
  getAllFAQs,
  deleteFAQ,
} from "../../services/faqService";

const FAQListPage = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const recordsPerPage = 10;

  // =========================
  // Load FAQs
  // =========================

  const loadFAQs = useCallback(async () => {
    try {
      setLoading(true);

      const response = await getAllFAQs();

      setFaqs(response?.data || []);
    } catch (error) {
      console.error("FAQ Fetch Error:", error);

      toast.error("Failed to load FAQs");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchFAQs = async () => {
      await loadFAQs();
    };

    fetchFAQs();
  }, [loadFAQs]);

  // =========================
  // Delete FAQ
  // =========================

  const handleDelete = async (faqId) => {
    const result = await Swal.fire({
      title: "Delete FAQ?",
      text: "Are you sure you want to delete this FAQ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteFAQ(faqId);

      toast.success("FAQ deleted successfully");

      await loadFAQs();
    } catch (error) {
      console.error("Delete Error:", error);

      toast.error("Failed to delete FAQ");
    }
  };

  // =========================
  // Search & Pagination
  // =========================

  const filteredFAQs = useMemo(() => {
    return faqs.filter(
      (faq) =>
        faq.question?.toLowerCase().includes(search.toLowerCase()) ||
        faq.answer?.toLowerCase().includes(search.toLowerCase())
    );
  }, [faqs, search]);

  const totalPages = Math.ceil(
    filteredFAQs.length / recordsPerPage
  );

  const paginatedFAQs = filteredFAQs.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  if (loading) {
    return (
      <div className="text-center py-10 text-lg">
        Loading FAQs...
      </div>
    );
  }
  return (
    <div>
      {/* Heading */}
      <h1 className="text-[24px] sm:text-[28px] font-light text-[#444] mb-4 text-center sm:text-left">
        All FAQs
      </h1>

      {/* Add FAQ */}
      <div className="mb-4">
        <Link
          to="/admin/faq/add"
          className="
            inline-flex items-center gap-2
            bg-[#3c8dbc] hover:bg-[#367fa9]
            text-white px-4 py-2 rounded
          "
        >
          <Plus size={16} />
          Add FAQ
        </Link>
      </div>

      {/* Card */}
      <div className="bg-white border-t-4 border-[#3c8dbc] shadow-sm rounded-sm p-3 sm:p-4">

        {/* Search */}
        <div className="flex justify-end mb-4">
          <input
            type="text"
            placeholder="Search FAQ..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="
              w-full sm:w-[250px]
              h-[36px]
              border border-gray-300
              rounded px-3 text-sm
              outline-none focus:border-[#3c8dbc]
            "
          />
        </div>

        {/* ── MOBILE: Card Layout ── */}
        <div className="block sm:hidden space-y-3">
          {paginatedFAQs.length > 0 ? (
            paginatedFAQs.map((faq, index) => (
              <div key={faq._id} className="border rounded-sm p-3 text-[13px] text-gray-700">
                {/* Header: S.No + actions */}
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-[#444] text-sm">
                    #{(currentPage - 1) * recordsPerPage + index + 1}
                  </span>
                  <div className="flex items-center gap-3">
                    <Link
                      to={`/admin/faq/edit/${faq._id}`}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <Pencil size={17} />
                    </Link>
                    <button
                      onClick={() => handleDelete(faq._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-[72px_1fr] gap-y-1.5 text-xs">
                  <span className="text-gray-400 font-medium">Question</span>
                  <span className="break-words">{faq.question}</span>

                  <span className="text-gray-400 font-medium">Answer</span>
                  <span className="break-words">{faq.answer}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center py-6 text-gray-500 text-sm">No FAQs Found</p>
          )}
        </div>

        {/* ── DESKTOP: Table Layout ── */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-[14px]">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-3 py-2 text-left w-[80px]">S No.</th>
                <th className="px-3 py-2 text-left">Question</th>
                <th className="px-3 py-2 text-left">Answer</th>
                <th className="px-3 py-2 text-center w-[120px]">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedFAQs.length > 0 ? (
                paginatedFAQs.map((faq, index) => (
                  <tr key={faq._id} className="border-b hover:bg-gray-50">
                    <td className="px-3 py-3 align-top">
                      {(currentPage - 1) * recordsPerPage + index + 1}
                    </td>
                    <td className="px-3 py-3 align-top">{faq.question}</td>
                    <td className="px-3 py-3 align-top">{faq.answer}</td>
                    <td className="px-3 py-3">
                      <div className="flex justify-center gap-3">
                        <Link
                          to={`/admin/faq/edit/${faq._id}`}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <Pencil size={17} />
                        </Link>
                        <button
                          onClick={() => handleDelete(faq._id)}
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
                  <td colSpan="4" className="text-center py-5 text-gray-500">
                    No FAQs Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-4">
          <p className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
            Total FAQs: {filteredFAQs.length}
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

export default FAQListPage;