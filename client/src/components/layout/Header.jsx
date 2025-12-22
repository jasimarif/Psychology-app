import React from 'react'
import { Navigate } from 'react-router-dom'

const Header = () => {
  return (
      <header className="w-full bg-[#EDE9E1] flex justify-between items-center px-4 md:px-8 h-16">
     

        <h1 className='font-semibold text-2xl tracking-tighter font-nunito text-customGreen absolute left-1/2 transform -translate-x-1/2'>
          PsychApp
        </h1>

        <button
          onClick={() => Navigate('/login')}
          className="px-4 py-2 bg-customGreen font-nunito text-white rounded-full hover:bg-opacity-90 transition-all duration-300 font-medium"
        >
          Login
        </button>
      </header>
  )
}

export default Header