import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { Pencil, Trash2, Plus } from "lucide-react";
import { Link } from "react-router-dom";

import {
  getAllServices,
  deleteService,
} from "../../services/serviceService";

const ServiceListPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const recordsPerPage = 10;

  // =========================
  // Load Services
  // =========================

  const loadServices = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getAllServices();
      setServices(response?.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      await loadServices();
    };
    fetchData();
  }, [loadServices]);

  // =========================
  // Delete Service
  // =========================

  const handleDelete = async (serviceId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this service?"
    );
    if (!confirmDelete) return;

    try {
      await deleteService(serviceId);
      await loadServices();
    } catch (error) {
      console.error(error);
      alert("Failed to delete service");
    }
  };

  // =========================
  // Search & Pagination
  // =========================

  const filteredServices = useMemo(() => {
    return services.filter(
      (service) =>
        service.title?.toLowerCase().includes(search.toLowerCase()) ||
        service.description?.toLowerCase().includes(search.toLowerCase())
    );
  }, [services, search]);

  const totalPages = Math.ceil(filteredServices.length / recordsPerPage);

  const paginatedServices = filteredServices.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  if (loading) {
    return (
      <div className="text-center py-10 text-lg">Loading Services...</div>
    );
  }

  return (
    <div>
      {/* Heading */}
      <h1 className="text-[24px] sm:text-[28px] font-light text-[#444] mb-4 text-center sm:text-left">
        Service List
      </h1>

      {/* Add Button */}
      <div className="mb-4">
        <Link
          to="/admin/service/add"
          className="
            inline-flex items-center gap-2
            bg-[#3c8dbc] hover:bg-[#367fa9]
            text-white px-4 py-2 rounded
          "
        >
          <Plus size={16} />
          Add Service
        </Link>
      </div>

      {/* Card */}
      <div className="bg-white border-t-4 border-[#3c8dbc] shadow-sm rounded-sm p-3 sm:p-4">

        {/* Search */}
        <div className="flex justify-end mb-4">
          <input
            type="text"
            placeholder="Search Service..."
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
          {paginatedServices.length > 0 ? (
            paginatedServices.map((service, index) => (
              <div key={service._id} className="border rounded-sm p-3 text-[13px] text-gray-700">
                {/* Header: S.No + actions */}
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-[#444] text-sm">
                    #{(currentPage - 1) * recordsPerPage + index + 1}
                  </span>
                  <div className="flex items-center gap-3">
                    <Link
                      to={`/admin/service/edit/${service._id}`}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <Pencil size={17} />
                    </Link>
                    <button
                      onClick={() => handleDelete(service._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>

                {/* Image + details */}
                <div className="flex gap-3 items-start">
                  <img
                    src={service.imageUrl}
                    alt={service.title}
                    className="w-16 h-16 object-cover rounded border flex-shrink-0"
                  />
                  <div className="grid grid-cols-[76px_1fr] gap-y-1.5 text-xs">
                    <span className="text-gray-400 font-medium">Title</span>
                    <span className="break-words">{service.title}</span>

                    <span className="text-gray-400 font-medium">Description</span>
                    <span className="break-words line-clamp-2">{service.description}</span>

                    <span className="text-gray-400 font-medium">Created</span>
                    <span>{new Date(service.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center py-6 text-gray-500 text-sm">No Services Found</p>
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
                <th className="px-3 py-2 text-left">Description</th>
                <th className="px-3 py-2 text-left">Created</th>
                <th className="px-3 py-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedServices.length > 0 ? (
                paginatedServices.map((service, index) => (
                  <tr key={service._id} className="border-b hover:bg-gray-50">
                    <td className="px-3 py-3">
                      {(currentPage - 1) * recordsPerPage + index + 1}
                    </td>
                    <td className="px-3 py-3">
                      <img
                        src={service.imageUrl}
                        alt={service.title}
                        className="w-16 h-16 object-cover rounded border"
                      />
                    </td>
                    <td className="px-3 py-3">{service.title}</td>
                    <td className="px-3 py-3 max-w-[350px]">
                      <p className="line-clamp-2">{service.description}</p>
                    </td>
                    <td className="px-3 py-3">
                      {new Date(service.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex justify-center gap-3">
                        <Link
                          to={`/admin/service/edit/${service._id}`}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <Pencil size={17} />
                        </Link>
                        <button
                          onClick={() => handleDelete(service._id)}
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
                  <td colSpan="6" className="text-center py-6 text-gray-500">
                    No Services Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-4">
          <p className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
            Total Services: {filteredServices.length}
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

export default ServiceListPage;