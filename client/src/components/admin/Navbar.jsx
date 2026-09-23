import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../../assets/assets'
import { UserButton } from '@clerk/clerk-react'

const Navbar = () => {
  return (
    <div className='flex items-center justify-between px-4 md:px-8 border-b border-gray-300 py-3 bg-white transition-all duration-300'>
        <Link to='/'>
            <img src={assets.logo} alt='logo' className='h-9 invert opacity-80'/>
        </Link>
        <div className='flex items-center gap-4'>
            <Link
                to='/'
                className='flex items-center gap-1.5 text-sm text-gray-600 border border-gray-300 rounded-full px-4 py-1.5 hover:bg-gray-50 hover:text-gray-900 transition-all'
            >
                <img src={assets.homeIcon} alt='' className='h-3.5 w-3.5 opacity-70' />
                Back to Home
            </Link>
            <UserButton/>
        </div>
    </div>
  )
}

export default Navbar