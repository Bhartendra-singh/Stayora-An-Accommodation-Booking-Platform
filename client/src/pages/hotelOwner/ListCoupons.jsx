import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const ListCoupons = () => {
  const { axios, getToken } = useAppContext();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCoupons = async () => {
    try {
      const { data } = await axios.get("/api/coupons/mine", {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      if (data.success) {
        setCoupons(data.coupons);
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
    fetchCoupons();
  }, []);

  const handleDelete = async (id) => {
    try {
      const { data } = await axios.delete(`/api/coupons/${id}`, {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      if (data.success) {
        toast.success("Coupon deleted");
        setCoupons((prev) => prev.filter((c) => c._id !== id));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  if (loading) return null;

  return (
    <div>
      <h1 className="text-2xl font-playfair mb-6">List Coupons</h1>

      {coupons.length === 0 ? (
        <p className="text-gray-500 text-sm">No coupons created yet.</p>
      ) : (
        <div className="max-w-2xl border border-gray-300 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left text-gray-800 font-medium">Code</th>
                <th className="py-3 px-4 text-left text-gray-800 font-medium">Discount</th>
                <th className="py-3 px-4 text-left text-gray-800 font-medium">Expires</th>
                <th className="py-3 px-4 text-left text-gray-800 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((c) => {
                const expired = new Date(c.expiryDate) < new Date();
                return (
                  <tr key={c._id} className="border-t border-gray-200">
                    <td className="py-3 px-4 font-medium">{c.code}</td>
                    <td className="py-3 px-4">{c.discountPercent}% off</td>
                    <td className="py-3 px-4">
                      {new Date(c.expiryDate).toLocaleDateString()}
                      {expired && <span className="ml-2 text-xs text-red-500">Expired</span>}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDelete(c._id)}
                        className="text-red-500 text-xs hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ListCoupons;