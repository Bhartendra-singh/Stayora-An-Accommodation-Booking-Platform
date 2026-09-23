import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const statusBadge = {
  confirmed: "bg-green-100 text-green-600",
  cancelled: "bg-gray-200 text-gray-600",
  pending: "bg-amber-100 text-amber-600",
};

const AdminBookings = () => {
  const { axios, getToken, currency } = useAppContext();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const { data } = await axios.get("/api/admin/bookings", {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      if (data.success) {
        setBookings(data.bookings);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (bookingId) => {
    if (!window.confirm("Cancel this booking? (admin override, for dispute resolution)")) return;
    try {
      const { data } = await axios.patch(
        `/api/admin/bookings/${bookingId}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );
      if (data.success) {
        toast.success("Booking cancelled");
        setBookings((prev) =>
          prev.map((b) => (b._id === bookingId ? { ...b, status: "cancelled" } : b))
        );
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  if (loading) return null;

  return (
    <div className="animate-fade-in-up">
      <h1 className="text-2xl font-playfair mb-6">All Bookings ({bookings.length})</h1>

      <div className="max-w-4xl border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-left text-gray-600 font-medium">Hotel</th>
              <th className="py-3 px-4 text-left text-gray-600 font-medium">Room</th>
              <th className="py-3 px-4 text-left text-gray-600 font-medium">Amount</th>
              <th className="py-3 px-4 text-left text-gray-600 font-medium">Status</th>
              <th className="py-3 px-4 text-left text-gray-600 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b._id} className="border-t border-gray-100 hover:bg-gray-50/70 transition-colors">
                <td className="py-3 px-4 font-medium">{b.hotel?.name || "—"}</td>
                <td className="py-3 px-4 text-gray-500">{b.room?.roomType || "—"}</td>
                <td className="py-3 px-4">{currency}{b.totalPrice}</td>
                <td className="py-3 px-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusBadge[b.status] || statusBadge.pending}`}>
                    {b.status || "pending"}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  {b.status !== "cancelled" && (
                    <button
                      onClick={() => handleCancel(b._id)}
                      className="text-red-500 text-xs hover:underline"
                    >
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminBookings;