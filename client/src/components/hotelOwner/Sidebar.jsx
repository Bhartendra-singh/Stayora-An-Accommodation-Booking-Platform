import React from 'react'
import { assets } from '../../assets/assets'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {

  const sidebarLinks = [
    { name: "Dashboard", path: "/owner", icon: assets.dashboardIcon, end: true },
    { name: "Add Room", path: "/owner/add-room", icon: assets.addIcon },
    { name: "List Room", path: "/owner/list-room", icon: assets.listIcon },
    { name: "Add Offer", path: "/owner/add-offer", icon: assets.addIcon },
    { name: "List Offers", path: "/owner/list-offers", icon: assets.listIcon },
  ]

  return (
    <div className="md:w-64 w-16 border-r h-full border-gray-300 pt-4 flex flex-col">
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