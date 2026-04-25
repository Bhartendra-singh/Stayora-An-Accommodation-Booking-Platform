import React from "react";
import Title from "./Title";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

const ExclusiveOffers = () => {
  const { offers, navigate } = useAppContext();

  return (
    <div className="flex flex-col items-center px-6 md:px-16 lg:px-24 xl:px-32">
      <div className="flex flex-col md:flex-row items-center justify-between w-full">
        <Title
          align="left"
          title="Exclusive Offers"
          subTitle={`Take advantage of our limited-time offers and special packages to enhance your stay and
          create unforgettable memories.`}
        />

        <button
          onClick={() => navigate("/offers")}
          className="group flex items-center gap-2 font-medium cursor-pointer max-md:mt-12"
        >
          View All Offers
          <img
            src={assets.arrowIcon}
            alt="arrow-icon"
            className="group-hover:translate-x-1 transition-all"
          />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 w-full">

        {/* EMPTY STATE */}
        {offers?.length === 0 && (
          <p className="text-center col-span-3 text-gray-500">
            No offers available
          </p>
        )}

        {/* OFFERS */}
        {offers?.slice(0, 3).map((item) => (
          <div
            key={item._id}
            onClick={() => navigate(`/offers/${item._id}`)}
            className="group cursor-pointer relative flex flex-col items-start justify-between gap-1 pr-12 pt-18 px-4 rounded-xl
            text-white bg-no-repeat bg-cover bg-center"
            style={{
              backgroundImage: `url(${item.room?.images?.[0] || ""})`,
            }}
          >
            {/* DISCOUNT BADGE */}
            <p className="px-3 py-1 absolute top-4 left-4 text-xs bg-white text-gray-800 font-medium rounded-full">
              {item.priceOff}% OFF
            </p>

            {/* CONTENT */}
            <div>
              <p className="text-2xl font-medium font-playfair">
                {item.title}
              </p>
              <p>{item.description}</p>
              <p className="text-xs text-white/70 mt-3">
                Expires {item.expiryDate}
              </p>
            </div>

            {/* BUTTON */}
            <button className="flex items-center gap-2 font-medium cursor-pointer mt-4 mb-5">
              View Offer
              <img
                className="invert group-hover:translate-x-1 transition-all"
                src={assets.arrowIcon}
                alt="arrow-icon"
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExclusiveOffers;