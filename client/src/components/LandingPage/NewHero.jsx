import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Play, Star, Shield, Clock, Users } from 'lucide-react';
import onIcon from '@/assets/on.svg';
import membershipIcon from '@/assets/Membership.svg';

const NewHero = () => {
    const [isLoaded, setIsLoaded] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => setIsLoaded(true), 100);
        return () => clearTimeout(timer);
    }, []);

    return (
        <section className="relative min-h-screen overflow-hidden bg-customGreen font-nunito select-none border-0">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-customGreen/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-3xl" />
            </div>

            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNMzAgMzBtLTEgMGExIDEgMCAxIDAgMiAwIDEgMSAwIDEgMCAtMiAwIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48L2c+PC9zdmc+')] opacity-40" />

            {/* Floating Icon - Desktop Only (Right) */}
            <div className="hidden lg:block">
                <div
                    className={`absolute bottom-32 right-[3%] z-10 transition-all duration-1000 ease-out ${
                        isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
                    }`}
                    style={{ transitionDelay: '800ms' }}
                >
                    <div className="relative group">
                        <div className="relative w-92 h-92 p-2 flex items-center justify-center  transition-transform">
                            <img
                                src={onIcon}
                                alt="Feature icon"
                                className="w-full h-full object-contain"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Membership Icon - Desktop Only (Left) */}
            <div className="hidden lg:block">
                <div
                    className={`absolute top-32 left-[5%] z-10 transition-all duration-1000 ease-out ${
                        isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
                    }`}
                    style={{ transitionDelay: '600ms' }}
                >
                    <div className="relative group">
                        <div className="relative w-88 h-88 p-2 flex items-center justify-center">
                            <img
                                src={membershipIcon}
                                alt="Membership icon"
                                className="w-full h-full object-contain animate-bounce-slow"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 min-h-screen flex flex-col justify-center">
                <div className="text-center max-w-4xl mx-auto">
                    {/* Badge */}
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm  mb-8 transition-all duration-1000 ${
                        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}>
                        <div className="flex -space-x-2">
                            {[1, 2, 3].map((_, i) => (
                                <div key={i} className="w-6 h-6 rounded-full bg-customGreenHover border-2 " />
                            ))}
                        </div>
                        <span className="text-white/90 text-sm font-medium">Join 50,000+ members finding peace</span>
                    </div>

                    {/* Main Heading */}
                    <h1 className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6 transition-all duration-1000 ${
                        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                    }`} style={{ transitionDelay: '100ms' }}>
                        Your Journey to
                        <span className="block mt-2 font-averia text-darkYellow">
                            Mental Wellness
                        </span>
                        Starts Here
                    </h1>

                    {/* Subheading */}
                    <p className={`text-lg sm:text-xl text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed transition-all duration-1000 ${
                        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                    }`} style={{ transitionDelay: '200ms' }}>
                        Connect with licensed therapists who understand your unique needs. 
                        Flexible online sessions that fit your schedule, backed by proven results.
                    </p>

                    {/* CTA Buttons */}
                    <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 transition-all duration-1000 ${
                        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                    }`} style={{ transitionDelay: '300ms' }}>
                        <button 
                            onClick={() => navigate('/signup')}
                            className="group relative px-8 py-4 bg-darkYellow border-none text-customGreen font-semibold rounded-2xl cursor-pointer select-none "
                        >
                            <span className="flex items-center gap-2">
                                Start Your Free Trial
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </span>
                        </button>
                        <button className="group flex items-center gap-3 px-6 py-4 text-white/90 font-medium rounded-2xl hover:bg-white/10 transition-all duration-300">
                            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform cursor-pointer select-none">
                                <Play className="w-5 h-5 text-white fill-white ml-1" />
                            </div>
                            Watch How It Works
                        </button>
                    </div>

                  
                </div>
            </div>

            {/* Bottom Wave */}
            <div className="absolute -bottom-1 left-0 right-0">
                <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full block">
                    <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
                </svg>
            </div>
        </section>
    );
};

export default NewHero;
