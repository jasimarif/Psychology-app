import React from 'react'
import { Clock, Monitor, MessageCircle, Users, Mic } from 'lucide-react'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

const WhatsIncluded = () => {
  const [titleRef, titleVisible] = useScrollAnimation({ threshold: 0.2 })
  const [featuresRef, featuresVisible] = useScrollAnimation({ threshold: 0.1 })
  const features = [
    {
      icon: <Clock className="w-6 h-6 text-customGreen" />,
      text: "Access to a licensed therapist in 2 days (or sooner)"
    },
    {
      icon: <Monitor className="w-6 h-6 text-customGreen" />,
      text: "Therapy sessions over video, voice, or live chat (your choice)"
    },
    {
      icon: <MessageCircle className="w-6 h-6 text-customGreen" />,
      text: "Unlimited messaging with your therapist, 24/7*"
    },
    {
      icon: <Users className="w-6 h-6 text-customGreen" />,
      text: "Switch therapists any time at no cost"
    },
    {
      icon: <Mic className="w-6 h-6 text-customGreen" />,
      text: "Between-session support with Talkcast personalized podcasts"
    }
  ]

  return (
    <section className="bg-[#FDFFDD] py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-12">
      <div className="flex items-center justify-center max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-8 sm:gap-12 lg:gap-20">
          {/* Image Section */}
          <div
            className="w-full max-w-sm sm:max-w-md lg:mr-8 h-[400px] sm:h-[500px] lg:h-[600px] overflow-hidden"
            style={{
              clipPath:
                "polygon(0 0, 100% 0, 100% 85%, 85% 85%, 85% 100%, 15% 100%, 15% 85%, 0 85%)"
            }}
          >
            <img
              src="/therapy-session.png"
              alt="Therapy session"
              className="w-full h-full object-cover"
            />
          </div>






          {/* Content Section */}
          <div className="w-full lg:w-1/2 text-center lg:text-left font-nunito px-4 sm:px-0">
            <h2
              ref={titleRef}
              className={`text-3xl sm:text-4xl lg:text-5xl font-averia text-customGreen mb-6 sm:mb-8 transition-all duration-1000 ease-out ${
                titleVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
              }`}
            >
              What's included<br />
              <span className="font-bold">with PsychApp</span>
            </h2>

            {/* Features List */}
            <div ref={featuresRef} className="space-y-4 sm:space-y-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 sm:gap-4 text-left transition-all duration-700 ease-out ${
                    featuresVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
                  }`}
                  style={{ transitionDelay: featuresVisible ? `${index * 100}ms` : '0ms' }}
                >
                  <div className="shrink-0 mt-1">
                    {feature.icon}
                  </div>
                  <p className="text-gray-800 text-base sm:text-lg leading-relaxed tracking-tight font-nunito">
                    {feature.text}
                  </p>
                </div>
              ))}
            </div>

            {/* Disclaimer */}
            <p className="text-gray-600 text-sm mt-6 sm:mt-8 italic">
              *May vary by insurance coverage
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default WhatsIncluded