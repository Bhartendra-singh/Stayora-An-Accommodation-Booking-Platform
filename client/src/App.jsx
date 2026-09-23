import React from "react";
import Navbar from "./components/Navbar";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import AllRooms from "./pages/AllRooms";
import RoomDetials from "./pages/RoomDetails";
import MyBookings from "./pages/MyBookings";
import MyWishlist from "./pages/MyWishlist";
import HotelReg from "./components/HotelReg";
import Layout from "./pages/hotelOwner/Layout";
import Dashboard from "../src/pages/hotelOwner/Dashboard";
import ListRoom from "../src/pages/hotelOwner/ListRoom";
import AddRoom from "../src/pages/hotelOwner/AddRoom";
import HotelProfile from "../src/pages/hotelOwner/HotelProfile";
import { Toaster } from "react-hot-toast";
import { useAppContext } from "./context/AppContext";
import { Loader } from "./components/Loader";

import OffersList from "./pages/OfferPage";
import OfferDetails from "./pages/OfferDetails";
import Experience from "./pages/Experience";
import About from "./pages/About";

import AddOffer from "./pages/hotelOwner/AddOffer";
import ListOffers from "./pages/hotelOwner/ListOffer";
import AddCoupon from "./pages/hotelOwner/AddCoupon";
import ListCoupons from "./pages/hotelOwner/ListCoupons";

import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminHotels from "./pages/admin/AdminHotels";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminBookings from "./pages/admin/AdminBookings";

const App = () => {
  const location = useLocation();
  const isOwnerPath = location.pathname.includes("owner") || location.pathname.includes("admin");
  const { showHotelReg } = useAppContext();

  return (
    <div>
      <Toaster />
      {!isOwnerPath && <Navbar />}
      {showHotelReg && <HotelReg />}

      <div className="min-h-[70vh]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rooms" element={<AllRooms />} />
          <Route path="/rooms/:id" element={<RoomDetials />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/my-wishlist" element={<MyWishlist />} />
          <Route path="/loader/:nextUrl" element={<Loader />} />

          <Route path="/offers" element={<OffersList />} />
          <Route path="/offers/:id" element={<OfferDetails />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/about" element={<About />} />

          <Route path="/owner" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="hotel-profile" element={<HotelProfile />} />
            <Route path="add-room" element={<AddRoom />} />
            <Route path="list-room" element={<ListRoom />} />
            <Route path="add-offer" element={<AddOffer />} />
            <Route path="list-offers" element={<ListOffers />} />
            <Route path="add-coupon" element={<AddCoupon />} />
            <Route path="list-coupons" element={<ListCoupons />} />
          </Route>

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="hotels" element={<AdminHotels />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="bookings" element={<AdminBookings />} />
          </Route>
        </Routes>
      </div>

      {!isOwnerPath && <Footer />}
    </div>
  );
};

export default App;