import React from 'react'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

const ProfessionalTherapists = () => {
  const [leftRef, leftVisible] = useScrollAnimation({ threshold: 0.2 })
  const [rightRef, rightVisible] = useScrollAnimation({ threshold: 0.2 })

  return (
    <section className="bg-[#F7EFE5] py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-12 font-nunito min-h-screen flex items-center relative z-0">
      <div className="max-w-7xl mx-auto w-full">
        <div className="flex flex-col lg:flex-row items-center gap-8 sm:gap-12 lg:gap-20">
          {/* Content Section */}
          <div
            ref={leftRef}
            className={`w-full lg:w-1/2 text-center lg:text-left transition-all duration-1000 ease-out ${
              leftVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
            }`}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-[#252625] mb-4 sm:mb-6 leading-tight tracking-tight px-4 sm:px-0">
              Professional and qualified therapists who you can trust
            </h2>

            <p className="text-[#4A4D4A] text-base sm:text-lg leading-relaxed mb-6 sm:mb-8 px-4 sm:px-0">
              Tap into the world's largest network of qualified and experienced therapists who can help you with a range of issues including depression, anxiety, relationships, trauma, grief, and more. With our therapists, you get the same professionalism and quality you would expect from an in-office therapist, but with the ability to communicate when and how you want.
            </p>

            <button className="bg-[#252625] hover:bg-[#141514] text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-full transition-all duration-300 cursor-pointer">
              Get matched to a therapist
            </button>
          </div>

          {/* Creative Image Section */}
          <div
            ref={rightRef}
            className={`w-full lg:w-1/2 relative hidden lg:flex justify-center items-center transition-all duration-1000 ease-out ${
              rightVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
            }`}
          >
            <div className="relative w-full max-w-lg h-[500px]">
              {/* Background decorative circle */}
              <div className="absolute top-0 right-0 w-72 h-72 bg-[#C8B5A0] rounded-full opacity-20 blur-3xl"></div>

              {/* Main image - Therapist consultation */}
              <div className="absolute top-8 left-0 w-64 h-80 rounded-3xl overflow-hidden transform hover:scale-105 transition-transform duration-300 z-10">
                <img
                  src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=500&h=700&fit=crop"
                  alt="Professional therapist consultation"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Secondary image - Peaceful therapy session */}
              <div className="absolute bottom-8 right-0 w-56 h-72 rounded-3xl overflow-hidden  transform hover:scale-105 transition-transform duration-300 z-20">
                <img
                  src="https://images.unsplash.com/photo-1527689368864-3a821dbccc34?w=500&h=700&fit=crop"
                  alt="Peaceful therapy environment"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Floating badge */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl  p-6 z-30 hover:scale-110 transition-transform duration-300">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#252625]">1000+</div>
                  <div className="text-sm text-[#4A4D4A] mt-1">Qualified</div>
                  <div className="text-sm text-[#4A4D4A]">Therapists</div>
                </div>
              </div>

              {/* Decorative dots */}
              <div className="absolute bottom-0 left-0 w-20 h-20 opacity-30">
                <div className="grid grid-cols-4 gap-2">
                  {[...Array(16)].map((_, i) => (
                    <div key={i} className="w-2 h-2 bg-[#252625] rounded-full"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProfessionalTherapists