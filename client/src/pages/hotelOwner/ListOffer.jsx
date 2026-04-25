import React from "react";
import { useAppContext } from "../../context/AppContext";
import { toast } from "react-hot-toast";

const ListOffers = () => {
  const { offers, setOffers, axios, getToken } = useAppContext();

  const handleDelete = async (id) => {
    try {
      const { data } = await axios.delete(`/api/offers/${id}`, {
        headers: {
          Authorization: `Bearer ${await getToken()}`
        }
      });

      if (data.success) {
        toast.success("Deleted");

        setOffers((prev) => prev.filter((item) => item._id !== id));
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Offer Listings</h1>

      <div className="border rounded-lg">
        <div className="grid grid-cols-4 font-semibold p-3 border-b">
          <p>Title</p>
          <p>Discount</p>
          <p>Expiry</p>
          <p>Action</p>
        </div>

        {offers.map((item) => (
          <div key={item._id} className="grid grid-cols-4 p-3 border-b">
            <p>{item.title}</p>
            <p>{item.priceOff}%</p>
            <p>{item.expiryDate}</p>

            <button
              onClick={() => handleDelete(item._id)}
              className="text-red-500"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListOffers;