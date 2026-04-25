import React from "react";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const OffersPage = () => {
  const { offers } = useAppContext();
  const navigate = useNavigate();

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 py-10">
      <h1 className="text-3xl font-semibold mb-6">All Offers</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {offers.length === 0 && (
          <p className="text-gray-500">No offers available</p>
        )}

        {offers.map((item) => (
          <div
            key={item._id}
            onClick={() => navigate(`/rooms/${item.room?._id}`)}
            className="border p-4 rounded-lg cursor-pointer hover:shadow-lg transition"
          >
            <img
              src={item.room?.images?.[0] || ""}
              className="rounded-md mb-3"
            />

            <h2 className="text-xl font-semibold">{item.title}</h2>
            <p>{item.description}</p>

            <p className="text-sm text-gray-500 mt-2">
              {item.priceOff}% OFF
            </p>

            <p className="text-xs text-gray-400">
              Expires: {item.expiryDate}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OffersPage;