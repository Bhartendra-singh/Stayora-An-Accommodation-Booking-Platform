import React from "react";
import { useParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const OfferDetails = () => {
  const { id } = useParams();
  const { offers } = useAppContext();

  const offer = offers.find((item) => item._id === id);

  if (!offer) return <div className="p-10">Offer not found</div>;

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 py-10">
      <img src={offer.image} className="rounded-xl mb-6" />
      <h1 className="text-3xl font-bold">{offer.title}</h1>
      <p className="mt-4">{offer.description}</p>
      <p className="mt-2 text-gray-500">Expires: {offer.expiryDate}</p>
      <p className="mt-2 font-semibold">{offer.priceOff}% OFF</p>
    </div>
  );
};

export default OfferDetails;