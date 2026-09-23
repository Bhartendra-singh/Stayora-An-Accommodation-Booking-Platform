import React from 'react'
import { assets } from '../../assets/assets'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {

  const sidebarLinks = [
    { name: "Overview", path: "/admin", icon: assets.dashboardIcon, end: true },
    { name: "Hotels", path: "/admin/hotels", icon: assets.listIcon },
    { name: "Users", path: "/admin/users", icon: assets.listIcon },
    { name: "Bookings", path: "/admin/bookings", icon: assets.listIcon },
  ]

  return (
    <div className="md:w-64 w-16 border-r border-gray-300 pt-4 flex flex-col sticky top-0 self-start h-screen">
      {sidebarLinks.map((item, index) => (
        <NavLink
          key={index}
          to={item.path}
          end={item.end}
          className={({ isActive }) =>
            `flex items-center py-3 px-4 md:px-8 gap-3 transition-all
            ${
              isActive
                ? "border-r-4 md:border-r-[6px] bg-blue-600/10 border-blue-600 text-blue-600"
                : "hover:bg-gray-100/90 text-gray-700"
            }`
          }
        >
          <img src={item.icon} alt={item.name} className="min-h-6 min-w-6" />
          <p className="md:block hidden">{item.name}</p>
        </NavLink>
      ))}
    </div>
  )
}

export default Sidebar