import React, { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const AddCoupon = () => {
  const { axios, getToken } = useAppContext();

  const [form, setForm] = useState({
    code: "",
    discountPercent: "",
    expiryDate: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post("/api/coupons", form, {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });

      if (data.success) {
        toast.success("Coupon created");
        setForm({ code: "", discountPercent: "", expiryDate: "" });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-playfair mb-6">Add Coupon</h1>

      <form onSubmit={handleSubmit} className="max-w-md space-y-4">
        <div>
          <label className="text-sm text-gray-600">Coupon Code</label>
          <input
            type="text"
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
            placeholder="e.g. WELCOME10"
            className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
            required
          />
        </div>

        <div>
          <label className="text-sm text-gray-600">Discount %</label>
          <input
            type="number"
            min="1"
            max="90"
            value={form.discountPercent}
            onChange={(e) => setForm({ ...form, discountPercent: e.target.value })}
            placeholder="e.g. 10"
            className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
            required
          />
        </div>

        <div>
          <label className="text-sm text-gray-600">Expiry Date</label>
          <input
            type="date"
            value={form.expiryDate}
            onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
            min={new Date().toISOString().split("T")[0]}
            className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-primary text-white px-6 py-2 rounded disabled:opacity-60"
        >
          {loading ? "Creating..." : "Create Coupon"}
        </button>
      </form>
    </div>
  );
};

export default AddCoupon;