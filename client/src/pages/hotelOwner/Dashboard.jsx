import React, { useEffect, useState, useMemo } from 'react'
import Title from '../../components/Title'
import { assets } from '../../assets/assets'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'
import {
  ResponsiveContainer,
  BarChart,
  LineChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'

const Dashboard = () => {
  const { currency, user, getToken, axios } = useAppContext();
  const [dashboardData, setDashboardData] = useState({
    bookings: [],
    totalBookings: 0,
    totalRevenue: 0,
  })

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('/api/bookings/hotel', {
        headers: { Authorization: `Bearer ${await getToken()}` }
      });

      if (response?.data?.success) {
        setDashboardData(response.data.dashboardData);
      } else {
        toast.error(response?.data?.message || "Something went wrong");
      }

    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user])

  const monthlyData = useMemo(() => {
    const now = new Date();
    const months = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        key: `${d.getFullYear()}-${d.getMonth()}`,
        label: d.toLocaleString('default', { month: 'short' }),
        revenue: 0,
        bookings: 0,
      });
    }

    dashboardData.bookings?.forEach((booking) => {
      if (!booking.createdAt) return;
      if (booking.status === "cancelled") return;
      const d = new Date(booking.createdAt);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      const bucket = months.find((m) => m.key === key);
      if (bucket) {
        bucket.revenue += booking.totalPrice || 0;
        bucket.bookings += 1;
      }
    });

    return months;
  }, [dashboardData.bookings]);

  return (
    <div>
      <Title align='left' font='outfit' title='Dashboard' subTitle='Monitor your room listings, track bookings
        and analyze revenue-all in one placee. Stay update with real-time insights to ensure smooth operations.'
      />
      <div className='flex gap-4 my-8'>
        <div className='bg-primary/3 border border-primary/10 rounded flex p-4 pr-8'>
          <img src={assets.totalBookingIcon} alt='' className='max-sm:hidden h-10'/>
          <div className='flex flex-col sm:ml-4 font-medium'>
            <p className='text-blue-500 text-lg'>Total Bookings</p>
            <p className='text-neutral-400 text-base'>{dashboardData.totalBookings}</p>
          </div>
        </div>

        <div className='bg-primary/3 border border-primary/10 rounded flex p-4 pr-8'>
          <img src={assets.totalRevenueIcon} alt='' className='max-sm:hidden h-10'/>
          <div className='flex flex-col sm:ml-4 font-medium'>
            <p className='text-blue-500 text-lg'>Total Revenue</p>
            <p className='text-neutral-400 text-base'>{currency}{dashboardData.totalRevenue}</p>
          </div>
        </div>
      </div>

      {/* Performance Charts */}
      <h2 className='text-xl text-blue-950/70 font-medium mb-5'>Performance — Last 6 Months</h2>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 max-w-3xl'>
        <div className='border border-gray-200 rounded-2xl p-6 bg-white shadow-sm'>
          <p className='text-sm font-medium text-gray-600 mb-3'>Revenue</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EEF2FF" />
              <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: 8, border: '1px solid #E5E7EB', fontSize: 13 }}
                formatter={(value) => [`${currency}${value}`, 'Revenue']}
              />
              <Bar dataKey="revenue" fill="#2563EB" radius={[6, 6, 0, 0]} barSize={26} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className='border border-gray-200 rounded-2xl p-6 bg-white shadow-sm'>
          <p className='text-sm font-medium text-gray-600 mb-3'>Bookings</p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={monthlyData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#FEF3C7" />
              <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: 8, border: '1px solid #E5E7EB', fontSize: 13 }}
                formatter={(value) => [value, 'Bookings']}
              />
              <Line type="monotone" dataKey="bookings" stroke="#FBBF24" strokeWidth={2.5} dot={{ r: 4, fill: '#FBBF24' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Bookings */}
      <h2 className='text-xl text-blue-950/70 font-medium mb-5'>Recent Bookings</h2>
      <div className='w-full max-w-3xl text-left border border-gray-300 rounded-lg max-h-80 overflow-y-scroll'>
          <table className='w-full'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='py-3 px-4 text-gray-800 font-medium'>User Name</th>
                <th className='py-3 px-4 text-gray-800 font-medium max-sm:hidden'>Room Name</th>
                <th className='py-3 px-4 text-gray-800 font-medium text-center'>Total Amount</th>
                <th className='py-3 px-4 text-gray-800 font-medium text-center'>Payment Status</th>
              </tr>
            </thead>

            <tbody className='text-sm'>
              {dashboardData?.bookings?.length === 0 && (
                <tr>
                  <td colSpan={4} className='py-8 px-4 text-center text-gray-400 border-t border-gray-300'>
                    No bookings yet
                  </td>
                </tr>
              )}
              {dashboardData?.bookings?.map((item,index)=>(
                <tr key={index}>
                  <td className='py-3 px-4 text-gray-700 border-t border-gray-300'>
                     {item?.userName || "Guest"}
                  </td>

                  <td className='py-3 px-4 text-gray-700 border-t border-gray-300 max-sm:hidden'>
                    {item?.room?.roomType}
                  </td>

                  <td className='py-3 px-4 text-gray-700 border-t border-gray-300 text-center'>
                    {currency}{item.totalPrice}
                  </td>

                  <td className='py-3 px-4 border-t border-gray-300 flex'>
                    <button className={`py-1 px-3 text-xs rounded-full mx-auto ${item.isPaid ? 'bg-green-200 text-green-600':'bg-amber-200 text-yellow-600'}`}>
                      {item.isPaid ? 'Completed' : 'Pending'}
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
      </div>
    </div>
  )
}

export default Dashboard