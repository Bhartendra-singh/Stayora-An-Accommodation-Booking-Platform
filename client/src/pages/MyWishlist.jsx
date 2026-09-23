import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const MyWishlist = () => {
  const { axios, getToken, navigate, currency, toggleWishlist } = useAppContext();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    try {
      const { data } = await axios.get("/api/user/wishlist", {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      if (data.success) {
        setRooms(data.rooms);
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
    fetchWishlist();
  }, []);

  const handleRemove = async (roomId) => {
    await toggleWishlist(roomId);
    setRooms((prev) => prev.filter((r) => r._id !== roomId));
  };

  if (loading) return null;

  return (
    <div className="py-28 md:py-36 px-4 md:px-16 lg:px-24 xl:px-32">
      <h1 className="font-playfair text-4xl md:text-[40px] mb-10">My Wishlist</h1>

      {rooms.length === 0 ? (
        <div className="flex flex-col items-center text-center py-20 border border-dashed border-gray-300 rounded-xl">
          <p className="text-lg font-playfair text-gray-700 mb-2">No saved rooms yet</p>
          <p className="text-sm text-gray-500 max-w-sm">
            Tap the heart icon on any room to save it here for later.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <div key={room._id} className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="relative">
                <img
                  onClick={() => { navigate(`/rooms/${room._id}`); window.scrollTo(0, 0); }}
                  src={room?.images?.[0]}
                  alt="room"
                  className="w-full h-48 object-cover cursor-pointer"
                />
                <button
                  onClick={() => handleRemove(room._id)}
                  className="absolute top-2 right-2 text-xl"
                  title="Remove from wishlist"
                >
                  ❤️
                </button>
              </div>
              <div className="p-4">
                <p className="text-gray-500 text-sm">{room?.hotel?.city}</p>
                <p className="text-lg font-playfair">{room?.hotel?.name}</p>
                <p className="text-base font-medium mt-2">{currency}{room.pricePerNight}/night</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyWishlist;