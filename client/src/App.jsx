// import React from "react";
// import Navbar from "./components/Navbar";
// import{Routes, Route,useLocation} from "react-router-dom"
// import Home from './pages/Home'
// import Footer from "./components/Footer";
// import AllRooms from "./pages/AllRooms";
// import RoomDetials from "./pages/RoomDetails";
// import MyBookings from "./pages/MyBookings";
// import HotelReg from "./components/HotelReg";
// import Layout from "./pages/hotelOwner/Layout";
// import Dashboard from "../src/pages/hotelOwner/Dashboard"
// import ListRoom from "../src/pages/hotelOwner/ListRoom"
// import AddRoom from "../src/pages/hotelOwner/AddRoom"
// import {Toaster} from 'react-hot-toast'
// import { useAppContext } from "./context/AppContext";
// import { Loader } from "./components/Loader";
// //offer pages
// import OffersPage from "./pages/OfferDetails";
// import OfferDetails from "./pages/OfferPage";
// //owner add offer
// import AddOffer from "./pages/hotelOwner/AddOffer";
// import ListOffers from "./pages/hotelOwner/ListOffer";

// const App =()=>{
//   const isOwnerPath=useLocation().pathname.includes("owner");
//   const {showHotelReg}=useAppContext();
//   return(
//     <div>
//       <Toaster/>
//       {!isOwnerPath&&<Navbar/>}
//       {showHotelReg && <HotelReg/>}
//       <div className='min-h-[70vh]'>
//       <Routes>
//         <Route path='/' element={<Home/>}/>
//         <Route path='/rooms' element={<AllRooms/>}/>
//         <Route path='/rooms/:id' element={<RoomDetials/>}/>
//         <Route path='/my-bookings' element={<MyBookings/>}/>
//         <Route path='/loader/:nextUrl' element={<Loader/>}/>

//         <Route path='/offers' element={<OffersPage/>}/>
//         <Route path='/offers/:id' element={<OfferDetails/>}/>

//         <Route path="/owner" element={<Layout/>}>
//             <Route index element={<Dashboard/>}/>
//             <Route path="add-room" element={<AddRoom/>}/>
//             <Route path="list-room" element={<ListRoom/>}/>
            
//             <Route path="add-offer" element={<AddOffer/>}/>
//             <Route path="list-offers" element={<ListOffers/>}/>

//         </Route>
//       </Routes>
//       </div>
//       <Footer/>
//     </div>
//   )
// }

// export default App




import React from "react";
import Navbar from "./components/Navbar";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import AllRooms from "./pages/AllRooms";
import RoomDetials from "./pages/RoomDetails";
import MyBookings from "./pages/MyBookings";
import HotelReg from "./components/HotelReg";
import Layout from "./pages/hotelOwner/Layout";
import Dashboard from "../src/pages/hotelOwner/Dashboard";
import ListRoom from "../src/pages/hotelOwner/ListRoom";
import AddRoom from "../src/pages/hotelOwner/AddRoom";
import { Toaster } from "react-hot-toast";
import { useAppContext } from "./context/AppContext";
import { Loader } from "./components/Loader";

// Offer pages
import OffersPage from "./pages/OfferDetails";
import OfferDetails from "./pages/OfferPage";

// Owner offer pages
import AddOffer from "./pages/hotelOwner/AddOffer";
import ListOffers from "./pages/hotelOwner/ListOffer";

// ✅ NEW: AI Features
import AiTripPlanner from "./pages/AiTripPlanner";
import AiConcierge from "./components/AiConcierge";

const App = () => {
  const isOwnerPath = useLocation().pathname.includes("owner");
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
          <Route path="/loader/:nextUrl" element={<Loader />} />

          <Route path="/offers" element={<OffersPage />} />
          <Route path="/offers/:id" element={<OfferDetails />} />

          {/* ✅ NEW: AI Trip Planner route */}
          <Route path="/ai-planner" element={<AiTripPlanner />} />

          <Route path="/owner" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="add-room" element={<AddRoom />} />
            <Route path="list-room" element={<ListRoom />} />
            <Route path="add-offer" element={<AddOffer />} />
            <Route path="list-offers" element={<ListOffers />} />
          </Route>
        </Routes>
      </div>

      <Footer />

      {/* ✅ NEW: AI Concierge chatbot - shows on all pages except owner panel */}
      {!isOwnerPath && <AiConcierge />}
    </div>
  );
};

export default App;
