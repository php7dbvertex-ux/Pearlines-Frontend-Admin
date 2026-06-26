import { useEffect, useMemo, useState } from "react";
import { getAllPayments } from "../../services/paymentService";
import { Link } from "react-router-dom";
import { IndianRupee } from "lucide-react";

const PaymentPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const recordsPerPage = 10;

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);

        const response = await getAllPayments();

        setPayments(response?.payments || []);
      } catch (error) {
        console.error("Payment Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const filteredPayments = useMemo(() => {
    return payments.filter(
      (item) =>
        item?.userId?.name
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        item?.paymentId
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        item?.orderId
          ?.toLowerCase()
          .includes(search.toLowerCase())
    );
  }, [payments, search]);

  const totalPages = Math.ceil(
    filteredPayments.length / recordsPerPage
  );

  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  if (loading) {
    return (
      <div className="text-center py-10 text-lg">
        Loading Payments...
      </div>
    );
  }

  return (
    <div>
      {/* Heading */}
{/* Heading */}
<h1 className="text-[24px] sm:text-[28px] font-light text-[#444] mb-4 text-center sm:text-left">
  Payment List
</h1>

{/* Custom Payment Button */}
<div className="mb-4">
  <Link
    to="/admin/custom-payment"
    className="
      inline-flex
      items-center
      gap-2
      bg-[#3c8dbc]
      hover:bg-[#367fa9]
      text-white
      px-4
      py-2
      rounded-sm
      text-sm
      font-medium
      transition
    "
  >
    <IndianRupee size={18} />
    Custom Payment
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
              w-full sm:w-[250px] px-3 py-2
              border border-gray-300 rounded text-sm
              outline-none focus:border-[#3c8dbc]
            "
          />
        </div>

        {/* Mobile Layout */}
        <div className="block sm:hidden space-y-3">
          {paginatedPayments.length > 0 ? (
            paginatedPayments.map((item, index) => (
              <div
                key={item._id}
                className="border rounded-sm p-3 text-[13px] text-gray-700"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-semibold text-[#444] text-sm">
                    {item?.userId?.name || "-"}
                  </span>

                  <span className="font-medium text-green-600 text-sm">
                    ₹{item.amount}
                  </span>
                </div>

                <div className="grid grid-cols-[72px_1fr] gap-y-1.5">
                  <span className="text-gray-400 text-xs font-medium">
                    S.No
                  </span>
                  <span>
                    {(currentPage - 1) *
                      recordsPerPage +
                      index +
                      1}
                  </span>

                  <span className="text-gray-400 text-xs font-medium">
                    Payment ID
                  </span>
                  <span className="break-all">
                    {item.paymentId || "-"}
                  </span>

                  <span className="text-gray-400 text-xs font-medium">
                    Status
                  </span>
                  <span>{item.status}</span>

                  <span className="text-gray-400 text-xs font-medium">
                    Created
                  </span>
                  <span>
                    {new Date(
                      item.createdAt
                    ).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center py-6 text-gray-500 text-sm">
              No Payments Found
            </p>
          )}
        </div>

        {/* Desktop Table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-3 py-2 text-left">
                  S.No
                </th>

                <th className="px-3 py-2 text-left">
                  Patient Name
                </th>

                <th className="px-3 py-2 text-left">
                  Amount
                </th>

                <th className="px-3 py-2 text-left">
                  Payment ID
                </th>

                <th className="px-3 py-2 text-left">
                  Status
                </th>

                <th className="px-3 py-2 text-left">
                  Created Date
                </th>
              </tr>
            </thead>

            <tbody>
              {paginatedPayments.length > 0 ? (
                paginatedPayments.map(
                  (item, index) => (
                    <tr
                      key={item._id}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="px-3 py-3">
                        {(currentPage - 1) *
                          recordsPerPage +
                          index +
                          1}
                      </td>

                      <td className="px-3 py-3">
                        {item?.userId?.name ||
                          "-"}
                      </td>

                      <td className="px-3 py-3 font-medium text-green-600">
                        ₹{item.amount}
                      </td>

                      <td className="px-3 py-3">
                        {item.paymentId || "-"}
                      </td>

                      <td className="px-3 py-3">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            item.status ===
                            "success"
                              ? "bg-green-100 text-green-700"
                              : item.status ===
                                "failed"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>

                      <td className="px-3 py-3">
                        {new Date(
                          item.createdAt
                        ).toLocaleDateString()}
                      </td>
                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-6 text-gray-500"
                  >
                    No Payments Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-4">
          <p className="text-xs sm:text-sm text-gray-600">
            Total Payments:{" "}
            {filteredPayments.length}
          </p>

          <div className="flex gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() =>
                setCurrentPage(
                  currentPage - 1
                )
              }
              className="px-3 py-1 border text-xs sm:text-sm disabled:opacity-50 hover:bg-gray-100"
            >
              Previous
            </button>

            <button
              disabled={
                currentPage ===
                  totalPages ||
                totalPages === 0
              }
              onClick={() =>
                setCurrentPage(
                  currentPage + 1
                )
              }
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

export default PaymentPage;