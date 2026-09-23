import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const BuildingIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h9v18h-9V3Zm9 4.5h6v13.5h-6v-13.5ZM7.5 6.75h.008v.008H7.5V6.75Zm0 3h.008v.008H7.5v-.008Zm0 3h.008v.008H7.5v-.008Zm0 3h.008v.008H7.5v-.008Z" />
  </svg>
);

const BedIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 18v-9a3 3 0 0 1 3-3h10.5a3 3 0 0 1 3 3v9M3.75 18h16.5M3.75 18v1.5M20.25 18v1.5M6.75 9.75a2.25 2.25 0 1 1 4.5 0 2.25 2.25 0 0 1-4.5 0Z" />
  </svg>
);

const UsersIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
  </svg>
);

const BookIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
  </svg>
);

const RevenueIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182.553-.44 1.278-.659 2.003-.659.725 0 1.45.22 2.003.659l.879.659" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
  </svg>
);

const cardStyles = [
  { icon: BuildingIcon, color: "text-blue-600", bg: "bg-blue-50" },
  { icon: BedIcon, color: "text-purple-600", bg: "bg-purple-50" },
  { icon: UsersIcon, color: "text-amber-600", bg: "bg-amber-50" },
  { icon: BookIcon, color: "text-green-600", bg: "bg-green-50" },
  { icon: RevenueIcon, color: "text-rose-600", bg: "bg-rose-50" },
];

const StatCard = ({ label, value, style, delay }) => {
  const Icon = style.icon;
  return (
    <div
      className="animate-fade-in-up border border-gray-200 rounded-2xl p-5 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className={`w-11 h-11 rounded-full ${style.bg} ${style.color} flex items-center justify-center mb-3`}>
        <Icon />
      </div>
      <p className="text-gray-500 text-sm font-medium">{label}</p>
      <p className="text-2xl text-gray-800 mt-1 font-semibold">{value}</p>
    </div>
  );
};

const AdminDashboard = () => {
  const { axios, getToken, currency } = useAppContext();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const { data } = await axios.get("/api/admin/stats", {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      if (data.success) {
        setStats(data.stats);
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
    fetchStats();
  }, []);

  if (loading) return null;
  if (!stats) return <p className="text-gray-500">Failed to load stats.</p>;

  const cards = [
    { label: "Total Hotels", value: stats.totalHotels },
    { label: "Total Rooms", value: stats.totalRooms },
    { label: "Total Users", value: stats.totalUsers },
    { label: "Total Bookings", value: stats.totalBookings },
    { label: "Platform Revenue", value: `${currency}${stats.totalRevenue}` },
  ];

  return (
    <div>
      <h1 className="text-2xl font-playfair mb-1">Platform Overview</h1>
      <p className="text-sm text-gray-500 mb-6">
        A bird's-eye view of everything on WanderLust — every hotel, guest, and booking.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-5xl">
        {cards.map((card, i) => (
          <StatCard key={card.label} label={card.label} value={card.value} style={cardStyles[i]} delay={i * 0.08} />
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;