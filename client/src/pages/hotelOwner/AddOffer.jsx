import React, { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { toast } from "react-hot-toast";

const AddOffer = () => {
  const { axios, getToken, rooms, setOffers } = useAppContext();

  const [form, setForm] = useState({
    title: "",
    description: "",
    priceOff: "",
    expiryDate: "",
    room: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.room) {
      return toast.error("Please select a room");
    }

    try {
      setLoading(true);

      const { data } = await axios.post("/api/offers", form, {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
      });

      if (data.success) {
        toast.success("Offer Added ");

        setForm({
          title: "",
          description: "",
          priceOff: "",
          expiryDate: "",
          room: "",
        });

        // refresh offers
        const res = await axios.get("/api/offers");
        if (res.data.success) {
          setOffers(res.data.offers);
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Add Offer</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">

        <input
          value={form.title}
          placeholder="Offer Title"
          className="border p-2"
          onChange={(e)=>setForm({...form,title:e.target.value})}
        />

        <input
          value={form.description}
          placeholder="Description"
          className="border p-2"
          onChange={(e)=>setForm({...form,description:e.target.value})}
        />

        <input
          value={form.priceOff}
          type="number"
          placeholder="% Off"
          className="border p-2"
          onChange={(e)=>setForm({...form,priceOff:e.target.value})}
        />

        <input
          value={form.expiryDate}
          type="date"
          className="border p-2"
          onChange={(e)=>setForm({...form,expiryDate:e.target.value})}
        />

        <select
          value={form.room}
          className="border p-2"
          onChange={(e)=>setForm({...form,room:e.target.value})}
        >
          <option value="">Select Room</option>
          {rooms.map((room) => (
            <option key={room._id} value={room._id}>
              {room.hotel?.name}
            </option>
          ))}
        </select>

        <button disabled={loading} className="bg-blue-600 text-white p-2 rounded">
          {loading ? "Adding..." : "Add Offer"}
        </button>

      </form>
    </div>
  );
};

export default AddOffer;