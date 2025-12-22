import React from 'react'

const Footer = () => {
  return (
     <footer className="bg-darkYellow px-4 py-6 relative mt-14 ">
        {/* Smooth curve border - filled with more pronounced curve */}
        <svg
          className="absolute top-0 left-0 w-full"
          style={{ height: '120px', transform: 'translateY(-100%)' }}
          viewBox="0 0 1200 80"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,80 Q600,-20 1200,80 L1200,80 L0,80 Z"
            fill="#ede9e1"
            stroke="none"
          />
        </svg>

        <div className="flex items-center justify-center">
          <div className="flex items-start gap-2 text-sm text-gray-700 mb-4 font-nunito">
            <p>
              If you are in a crisis or any other person may be in danger - don't use this site.{' '}
              <a href="#" className="text-customGreen underline hover:text-[#5a8a6f]">
                These resources
              </a>{' '}
              can provide you with immediate help.
            </p>
          </div>
        </div>
      </footer>
  )
}

export default Footer