import React from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

export default function TherapySection() {
  const [headerRef, headerVisible] = useScrollAnimation({ threshold: 0.2 });
  const [pinkCardRef, pinkCardVisible] = useScrollAnimation({ threshold: 0.2 });
  const [greenCardRef, greenCardVisible] = useScrollAnimation({ threshold: 0.2 });

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="max-w-5xl w-full">
        {/* Header Section */}
        <div
          ref={headerRef}
          className={`text-center mb-12 transition-all duration-1000 ease-out ${
            headerVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <h1 className="text-4xl md:text-5xl font-averia text-teal-900 mb-4">
            Comprehensive treatment with<br />therapy and psychiatry
          </h1>
          <p className="text-customGreen font-nunito text-lg">
            Combining therapy and medication has been proven to bring the best results for most mental health conditions.
          </p>
        </div>

        {/* Cards Section */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Pink Card */}
          <div
            ref={pinkCardRef}
            className={`bg-[#FFB8B2] rounded p-12 flex flex-col items-center text-center transition-all duration-1000 ease-out ${
              pinkCardVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
            }`}
          >
            <div className="mb-6 h-16 flex items-center justify-center">
              <img src="/pinkCardImg.png" alt="Therapy and medication" className="h-40 w-auto object-contain" />
            </div>

            <h2 className="text-2xl font-averia text-customGreen mb-6">
              Explore therapy and<br />medication combined (18+)
            </h2>

            <button className="bg-customGreen text-white px-8 py-3 rounded-lg hover:bg-customGreenHover cursor-pointer font-nunito transition-colors">
              Get started
            </button>
          </div>

          {/* Green Card */}
          <div
            ref={greenCardRef}
            className={`bg-[#9EEAB2] rounded p-12 flex flex-col items-center text-center transition-all duration-1000 ease-out ${
              greenCardVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
            }`}
          >
            <div className="mb-6 h-16 flex items-center justify-center">
              <img src="/greenCardImg.png" alt="Get help deciding" className="h-24 w-auto object-contain" />
            </div>

            <h2 className="text-2xl font-averia text-customGreen mb-6">
              Get help deciding what's<br />right for you
            </h2>

            <button className="bg-customGreen text-white px-8 py-3 rounded-lg hover:bg-customGreenHover cursor-pointer font-nunito transition-colors">
              Get started
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}