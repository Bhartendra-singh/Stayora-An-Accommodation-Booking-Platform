import React, { useState } from "react";
import { assets, cities } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const HotelReg = () => {
  const { setShowHotelReg, axios, getToken, setIsOwner } = useAppContext();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [contact, setContact] = useState("");
  const [city, setCity] = useState("");
  const [customCity, setCustomCity] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    const finalCity = city === "other" ? customCity : city;

    if (!finalCity) {
      toast.error("City is required");
      return;
    }

    try {
      const { data } = await axios.post(
        "/api/hotels",
        {
          name,
          address,
          contact,
          city: finalCity,
        },
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        }
      );

      if (data.success) {
        toast.success(data.message || "Hotel registered successfully");
        setIsOwner(true);
        setShowHotelReg(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div
      onClick={() => setShowHotelReg(false)}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
    >
      <form
        onSubmit={onSubmitHandler}
        onClick={(e) => e.stopPropagation()}
        className="flex bg-white rounded-xl max-w-4xl"
      >
        <img
          src={assets.regImage}
          alt="reg"
          className="w-1/2 rounded-xl hidden md:block"
        />

        <div className="relative flex flex-col md:w-1/2 p-8 md:p-10">
          <img
            src={assets.closeIcon}
            alt="close"
            className="absolute top-4 right-4 h-4 w-4 cursor-pointer"
            onClick={() => setShowHotelReg(false)}
          />

          <p className="text-2xl font-semibold mt-6">Register Your Hotel</p>

          <div className="w-full mt-4">
            <label className="font-medium text-gray-500">Hotel Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border rounded w-full px-3 py-2 mt-1"
              required
            />
          </div>

          <div className="w-full mt-4">
            <label className="font-medium text-gray-500">Phone</label>
            <input
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="border rounded w-full px-3 py-2 mt-1"
              required
            />
          </div>

          <div className="w-full mt-4">
            <label className="font-medium text-gray-500">Address</label>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="border rounded w-full px-3 py-2 mt-1"
              required
            />
          </div>

          <div className="w-full mt-4 max-w-60">
            <label className="font-medium text-gray-500">City</label>

            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="border rounded w-full px-3 py-2 mt-1"
              required
            >
              <option value="">Select City</option>
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
              <option value="other">Other</option>
            </select>

            {city === "other" && (
              <input
                type="text"
                placeholder="Enter City"
                value={customCity}
                onChange={(e) => setCustomCity(e.target.value)}
                className="border rounded w-full px-3 py-2 mt-2"
                required
              />
            )}
          </div>

          <button className="bg-indigo-600 text-white px-6 py-2 rounded mt-6">
            Register
          </button>
        </div>
      </form>
    </div>
  );
};

export default HotelReg;