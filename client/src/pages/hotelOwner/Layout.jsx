import React, { useEffect } from 'react'
import Navbar from '../../components/hotelOwner/Navbar'
import Sidebar from '../../components/hotelOwner/Sidebar'
import { Outlet } from 'react-router-dom'
import {useAppContext} from '../../context/AppContext'

const Layout = () => {
  const {isOwner,roleChecked,navigate}=useAppContext()

  useEffect(()=>{
    if(!roleChecked) return
    if(!isOwner){
      navigate('/')
    }
  },[isOwner,roleChecked])

  if(!roleChecked){
    return <div className='flex items-center justify-center h-screen text-gray-400'>Loading...</div>
  }

  if(!isOwner){
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

export default Layout