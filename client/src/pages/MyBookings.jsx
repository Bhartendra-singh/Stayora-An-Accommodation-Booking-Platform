import React,{useEffect, useState} from 'react'
import Title from '../components/Title'
import { assets} from '../assets/assets'
import {useAppContext} from '../context/AppContext'
import toast from 'react-hot-toast'


const MyBookings = () => {

    const {axios,getToken,user}=useAppContext()
    const [bookings,setBookings]=useState([])

    const fetchUserBookings=async()=>{
        try {
            const {data}=await axios.get('/api/bookings/user',{headers:{Authorization:`Bearer ${await getToken()}`}})
            if(data.success){
                setBookings(data.bookings)
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }


    const handlePayment = async (bookingId) => {
  try {
    const { data } = await axios.post(
      '/api/bookings/razorpay-payment',
      { bookingId },
      { headers: { Authorization: `Bearer ${await getToken()}` } }
    );

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY,
      amount: data.order.amount,
      currency: "INR",
      name: "Hotel Booking",
      order_id: data.order.id,

      handler: async function (response) {
        await axios.post(
          '/api/bookings/verify-payment',
          {
            ...response,
            bookingId,
          },
          { headers: { Authorization: `Bearer ${await getToken()}` } }
        );

        toast.success("Payment Successful");
        fetchUserBookings(); 
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();

  } catch (error) {
    toast.error(error?.response?.data?.message || error.message);
  }
};

    const handleCancel = async (bookingId) => {
        if (!window.confirm("Are you sure you want to cancel this booking?")) return;

        try {
            const { data } = await axios.patch(
                `/api/bookings/cancel/${bookingId}`,
                {},
                { headers: { Authorization: `Bearer ${await getToken()}` } }
            );

            if (data.success) {
                toast.success(data.message);
                fetchUserBookings();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message);
        }
    };

    const handleDownloadInvoice = async (bookingId) => {
        try {
            const response = await axios.get(
                `/api/bookings/invoice/${bookingId}`,
                {
                    headers: { Authorization: `Bearer ${await getToken()}` },
                    responseType: "blob",
                }
            );

            const blob = new Blob([response.data], { type: "application/pdf" });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `invoice-${bookingId}.pdf`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            toast.error("Failed to download invoice");
        }
    };

    useEffect(()=>{
        if(user){
            fetchUserBookings()
        }
    },[user])

    
  return (
    <div className='py-28 md:pb-35 md:pt-32 px-4 md:px-16 lg:px-24 xl:px-32'>
        <Title title='My Bookings' subTitle='Easily manage your past, current, and upcoming hotel reservstions in one place. 
        Plan your trips seamlessly with just a few clicks' align='left'/>
        <div className='max-w-6xl mt-8 w-full text-gray-800'>
            <div className='hidden md:grid md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-300 font-medium text-base py-3'>
                <div className='w-1/3'>Hotels</div>
                <div className='w-1/3'>Date & Timings</div>
                <div className='w-1/3'>Payment</div>
            </div>
            {bookings?.map((booking)=>(
                <div key={booking._id} className='grid grid-cols-1 md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-300 py-6 first:border-t'>
                    {/*--Hotel details-- */}
                    <div className='flex flex-col md:flex-row'>
                        <img src={booking?.room?.images?.[0]} alt='hotel-img' className='min-md:w-44 rounded shadow object-cover'/>
                        <div className='flex flex-col gap-1.5 max-md:mt-3 min-md:ml-4'>
                            <p className='font-palyfair text-2xl'>{booking?.hotel?.name}
                                <span className='font-inter text-sm'> ({booking?.room?.roomType})</span>
                            </p>
                            <div className='flex items-center gap-1 text-sm text-gray-500'>
                                <img src={assets.locationIcon} alt='location-icon'/>
                                <span>{booking?.hotel?.address}</span>
                            </div>

                            <div className='flex items-center gap-1 text-sm text-gray-500'>
                                <img src={assets.guestsIcon} alt='guest-icon'/>
                                <span>Guests:{booking.guests}</span>
                            </div>
                            <p className='text-base'>Total:₹{booking.totalPrice}</p>

                        </div>
                    </div>
                    {/* Date and Timings */}
                    <div className='flex flex-row md:items-center md:gap-12 mt-3 gap-8'>
                        <div>
                            <p>Check-In:</p>
                            <p className='text-gray-500 text-sm'>
                                {new Date(booking.checkInDate).toDateString()}
                            </p>
                        </div>
                        <div>
                            <p>Check-Out:</p>
                            <p className='text-gray-500 text-sm'>
                                {new Date(booking.checkOutDate).toDateString()}
                            </p>
                        </div>
                    </div>
                    {/*--Payment Status */}
                    <div className='flex flex-col items-start justify-center pt-3 gap-2'>
                        <div className='flex items-center gap-2'>
                            <div className={`h-3 w-3 rounded-full ${booking.isPaid ? "bg-green-500" : "bg-red-500"}`}></div>
                            <p className={`text-sm ${booking.isPaid ? "text-green-500" : "text-red-500"}`}>
                                {booking.isPaid ? "Paid" : "unpaid"}
                            </p>
                        </div>

                        {booking.status === "cancelled" ? (
                            <span className='px-3 py-1 text-xs rounded-full bg-gray-200 text-gray-600'>
                                Cancelled
                            </span>
                        ) : (
                            <>
                                {!booking.isPaid && (
                                    <button onClick={()=>handlePayment(booking._id)} className='px-4 py-1.5 text-xs border border-gray-400 rounded-full hover:bg-gray-50 transition-all cursor-pointer'>
                                        Pay Now</button>
                                )}
                                <button onClick={()=>handleCancel(booking._id)} className='px-4 py-1.5 text-xs border border-red-300 text-red-500 rounded-full hover:bg-red-50 transition-all cursor-pointer'>
                                    Cancel Booking</button>
                            </>
                        )}
                        <button onClick={()=>handleDownloadInvoice(booking._id)} className='px-4 py-1.5 text-xs border border-blue-300 text-blue-600 rounded-full hover:bg-blue-50 transition-all cursor-pointer'>
                            Download Invoice</button>
                    </div>
                </div>
            ))}
           
        </div>
    </div>
  )
}
export default MyBookings