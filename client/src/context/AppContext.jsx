import axios from "axios";
import {  createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {useUser,useAuth} from "@clerk/clerk-react"
import {toast} from 'react-hot-toast'

axios.defaults.baseURL=import.meta.env.VITE_BACKEND_URL;

const AppContext=createContext();

export const AppProvider=({children})=>{
    const currency=import.meta.env.VITE_CURRENCY || "₹";
    const navigate=useNavigate();
    const {user,isLoaded}=useUser();
    const {getToken}=useAuth()

    const [isOwner,setIsOwner]=useState(false)
    const [isAdmin,setIsAdmin]=useState(false)
    const [roleChecked,setRoleChecked]=useState(false)
    const [showHotelReg,setShowHotelReg]=useState(false)
    const [searchedCities,setSearchedCities]=useState([])
    const [rooms,setRooms]=useState([])
    const [wishlist,setWishlist]=useState([])

    const [offers, setOffers] = useState([]); 

    const fetchRooms=async()=>{
        try {
            const {data}=await axios.get('/api/rooms')
            if(data.success){
                setRooms(data.rooms)
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const fetchUser=async()=>{
        try {
            const {data}=await axios.get('/api/user',
                {headers:{Authorization:`Bearer ${await getToken()}`}})
            if(data.success){
                setIsOwner(data.role ==="hotelOwner")
                setIsAdmin(data.role ==="admin")
                setSearchedCities(data.recentSearchCities)
                setWishlist(data.savedRooms || [])
                setRoleChecked(true)
            }else{
                setTimeout(()=>{
                    fetchUser()
                },5000)
            }    
        } catch (error) {
            toast.error(error.message)
            setRoleChecked(true)
        }
    }

    useEffect(() => {
      if (!isLoaded) return

      if (!user) {
        setIsOwner(false)
        setRoleChecked(true)
        return
      }

      fetchUser();
    }, [isLoaded, user]);

const fetchOffers = async () => {
  try {
    const { data } = await axios.get("/api/offers");

    if (data.success) {
      setOffers(data.offers);
    }
  } catch (error) {
    toast.error(error.message);
  }
};

    useEffect(()=>{
        fetchRooms()
        fetchOffers(); 
    },[])

    const toggleWishlist = async (roomId) => {
        if (!user) {
            toast.error("Please login to save rooms");
            return;
        }
        try {
            const { data } = await axios.post(
                `/api/user/wishlist/${roomId}`,
                {},
                { headers: { Authorization: `Bearer ${await getToken()}` } }
            );
            if (data.success) {
                setWishlist(data.savedRooms);
                toast.success(data.saved ? "Added to wishlist" : "Removed from wishlist");
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message);
        }
    };

    const value={
        currency,navigate,user,getToken,isOwner,setIsOwner,isAdmin,roleChecked,
        axios,showHotelReg,setShowHotelReg,searchedCities,setSearchedCities,
        rooms,setRooms,offers,wishlist,toggleWishlist
    }

    return(
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext=()=> useContext(AppContext);