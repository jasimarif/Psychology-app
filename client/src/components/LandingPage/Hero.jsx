import React, { useEffect, useState } from 'react'
import './LandingPage.css'
import { ArrowRight } from 'lucide-react'

const Hero = () => {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Trigger animations on mount with slight delay
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="noise-bg min-h-screen flex flex-col items-center justify-center font-nunito pt-20 px-4 sm:px-6 lg:px-8">
      <div className='text-center text-white font-light space-y-4 sm:space-y-8 mb-8 sm:mb-12'>
        <h1
          className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tighter font-averia font-extrabold transition-all duration-1000 ease-out ${
            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          You deserve to be happy.
        </h1>
        <h2
          className={`text-lg sm:text-xl md:text-2xl font-light tracking-tight font-averia px-4 transition-all duration-1000 ease-out ${
            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
          style={{ transitionDelay: '200ms' }}
        >
          What type of therapy are you looking for?
        </h2>
      </div>
      <div className="w-full flex flex-col md:flex-row items-center justify-center gap-6 sm:gap-8 max-w-7xl">
        {/* Individual Card */}
        <div
          className={`relative group cursor-pointer w-full max-w-sm md:max-w-none md:flex-1 transition-all duration-1000 ease-out ${
            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
          style={{ transitionDelay: '400ms' }}
        >
          <img
            src="/individuals.png"
            alt="Individual therapy"
            className="w-full md:w-[24rem] h-64 sm:h-72 md:h-80 rounded-lg object-cover transition-all duration-300 group-hover:border group-hover:border-white"
          />
          <div className="absolute inset-0 flex flex-col items-start justify-start pt-6 sm:pt-8 pl-4 sm:pl-6">
            <h2 className="text-white text-2xl sm:text-3xl font-light mb-1">Individual</h2>
            <div className="flex items-center gap-2 sm:gap-3 group">
              <span className="text-white text-base sm:text-lg font-light">For myself</span>
              <div className="bg-white rounded-full p-1.5 sm:p-2 transition-transform duration-300 group-hover:translate-x-2">
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-customGreen" />
              </div>
            </div>
          </div>
        </div>

        {/* Couples Card */}
        <div
          className={`relative group cursor-pointer w-full max-w-sm md:max-w-none md:flex-1 transition-all duration-1000 ease-out ${
            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
          style={{ transitionDelay: '600ms' }}
        >
          <img
            src="/couples.png"
            alt="Couples therapy"
            className="w-full md:w-[24rem] h-64 sm:h-72 md:h-80 rounded-lg object-cover transition-all duration-300 group-hover:border group-hover:border-white"
          />
          <div className="absolute inset-0 flex flex-col items-start justify-start pt-6 sm:pt-8 pl-4 sm:pl-6">
            <h2 className="text-white text-2xl sm:text-3xl font-light mb-1">Couples</h2>
            <div className="flex items-center gap-2 sm:gap-3 group">
              <span className="text-white text-base sm:text-lg font-light">For me and my partner</span>
              <div className="bg-white rounded-full p-1.5 sm:p-2 transition-transform duration-300 group-hover:translate-x-2">
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-customGreen" />
              </div>
            </div>
          </div>
        </div>

        {/* Teens Card */}
        <div
          className={`relative group cursor-pointer w-full max-w-sm md:max-w-none md:flex-1 transition-all duration-1000 ease-out ${
            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
          style={{ transitionDelay: '800ms' }}
        >
          <img
            src="/teens.png"
            alt="Teen therapy"
            className="w-full md:w-[24rem] h-64 sm:h-72 md:h-80 rounded-lg object-cover transition-all duration-300 group-hover:border group-hover:border-white"
          />
          <div className="absolute inset-0 flex flex-col items-start justify-start pt-6 sm:pt-8 pl-4 sm:pl-6">
            <h2 className="text-white text-2xl sm:text-3xl font-light mb-1">Teens</h2>
            <div className="flex items-center gap-2 sm:gap-3 group">
              <span className="text-white text-base sm:text-lg font-light">For my child</span>
              <div className="bg-white rounded-full p-1.5 sm:p-2 transition-transform duration-300 group-hover:translate-x-2">
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-customGreen" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero