import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const AdminHotels = () => {
  const { axios, getToken } = useAppContext();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHotels = async () => {
    try {
      const { data } = await axios.get("/api/admin/hotels", {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      if (data.success) {
        setHotels(data.hotels);
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
    fetchHotels();
  }, []);

  const handleDelete = async (hotelId, name) => {
    if (!window.confirm(`Delete "${name}" and all of its rooms? This can't be undone.`)) return;
    try {
      const { data } = await axios.delete(`/api/admin/hotels/${hotelId}`, {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      if (data.success) {
        toast.success("Hotel deleted");
        setHotels((prev) => prev.filter((h) => h._id !== hotelId));
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
      <h1 className="text-2xl font-playfair mb-6">All Hotels ({hotels.length})</h1>

      <div className="max-w-4xl border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-left text-gray-600 font-medium">Name</th>
              <th className="py-3 px-4 text-left text-gray-600 font-medium">City</th>
              <th className="py-3 px-4 text-left text-gray-600 font-medium">Address</th>
              <th className="py-3 px-4 text-left text-gray-600 font-medium">Contact</th>
              <th className="py-3 px-4 text-left text-gray-600 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {hotels.map((h) => (
              <tr key={h._id} className="border-t border-gray-100 hover:bg-gray-50/70 transition-colors">
                <td className="py-3 px-4 font-medium">{h.name}</td>
                <td className="py-3 px-4">
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600">
                    {h.city}
                  </span>
                </td>
                <td className="py-3 px-4 text-gray-500">{h.address}</td>
                <td className="py-3 px-4 text-gray-500">{h.contact}</td>
                <td className="py-3 px-4 text-right">
                  <button
                    onClick={() => handleDelete(h._id, h.name)}
                    className="text-red-500 text-xs hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminHotels;