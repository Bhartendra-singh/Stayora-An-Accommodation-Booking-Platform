import React, { useEffect } from 'react'
import Navbar from '../../components/admin/Navbar'
import Sidebar from '../../components/admin/Sidebar'
import { Outlet } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext'

const AdminLayout = () => {
  const { isAdmin, roleChecked, navigate } = useAppContext()

  useEffect(() => {
    if (!roleChecked) return
    if (!isAdmin) {
      navigate('/')
    }
  }, [isAdmin, roleChecked])

  if (!roleChecked) {
    return <div className='flex items-center justify-center h-screen text-gray-400'>Loading...</div>
  }

  if (!isAdmin) {
    return null
  }

  return (
    <div className='flex flex-col min-h-screen'>
        <Navbar/>
        <div className='flex flex-1'>
            <Sidebar/>
           <div className='flex-1 p-4 pt-10 md:px-10'>
                <Outlet/>
            </div>
        </div>
    </div>
  )
}

export default AdminLayout