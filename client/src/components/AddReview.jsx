import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";

const AddReview = ({ refresh }) => {

  const { axios, user, getToken, toast } = useAppContext(); //  toast added

  const [form, setForm] = useState({
    address: "",
    rating: 5,
    review: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("/api/testimonials", form, {
        headers: {
          Authorization: `Bearer ${await getToken()}`
        }
      });

      if (res.data.success) {

        toast.success("Review Added Successfully "); //  toast

        setForm({
          address: "",
          rating: 5,
          review: ""
        });

        refresh();
      }

    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong"); //  toast error
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow mt-10 max-w-md mx-auto">

      <h2 className="text-lg font-semibold mb-4">Add Review</h2>

      <div className="flex items-center gap-3 mb-4">
        <img src={user?.imageUrl} className="w-10 h-10 rounded-full" />
        <p className="font-medium">{user?.fullName}</p>
      </div>

      <input
        type="text"
        placeholder="Address"
        value={form.address}
        onChange={(e) => setForm({ ...form, address: e.target.value })}
        className="w-full mb-2 p-2 border"
        required
      />

      <input
        type="number"
        min="1"
        max="5"
        value={form.rating}
        onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
        className="w-full mb-2 p-2 border"
      />

      <textarea
        placeholder="Review"
        value={form.review}
        onChange={(e) => setForm({ ...form, review: e.target.value })}
        className="w-full mb-2 p-2 border"
        required
      />

      <button className="bg-blue-500 text-white px-4 py-2 rounded w-full">
        Submit
      </button>

    </form>
  );
};

export default AddReview;