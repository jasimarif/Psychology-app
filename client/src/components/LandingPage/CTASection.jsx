import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { ArrowRight, Heart, Shield, Star } from 'lucide-react';

const CTASection = () => {
    const [ref, isVisible] = useScrollAnimation({ threshold: 0.2 });
    const navigate = useNavigate();

    return (
        <section className="py-24 bg-white relative overflow-hidden font-nunito">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
                <div
                    ref={ref}
                    className={`relative rounded-3xl overflow-hidden bg-customGreen transition-all duration-1000 ${
                        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}
                >
                    {/* Background */}
                    
                    {/* Decorative Elements */}
                    
                    {/* Pattern Overlay */}
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNMzAgMzBtLTEgMGExIDEgMCAxIDAgMiAwIDEgMSAwIDEgMCAtMiAwIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48L2c+PC9zdmc+')] opacity-30" />

                    {/* Content */}
                    <div className="relative px-8 py-16 sm:px-12 sm:py-20 lg:px-20 lg:py-24">
                        <div className="flex flex-col lg:flex-row items-center gap-12">
                            {/* Text Content */}
                            <div className="flex-1 text-center lg:text-left">
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white/90 text-sm font-semibold mb-6">
                                    <Heart className="w-4 h-4" />
                                    Start Your Healing Journey
                                </div>
                                
                                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                                    Take the <span className="text-darkYellow font-averia">First Step</span>
                                    <span className="block">Towards Better <span className="text-darkYellow font-averia">Mental Health</span></span>
                                </h2>
                                
                                <p className="text-lg text-emerald-100/90 mb-8 max-w-xl">
                                    Join thousands of people who have transformed their lives with professional 
                                    online therapy. Your wellbeing is worth it.
                                </p>

                                {/* CTAs */}
                                <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                                    <button 
                                        onClick={() => navigate('/signup')}
                                        className="group w-full sm:w-auto px-8 py-4 bg-white text-customGreen font-bold rounded-2xl cursor-pointer select-none transition-all duration-300 "
                                    >
                                        <span className="flex items-center justify-center gap-2">
                                            Get Started Free
                                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </span>
                                    </button>
                                    <button 
                                        onClick={() => navigate('/login')}
                                        className="w-full sm:w-auto px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold cursor-pointer select-none rounded-2xl border border-white/20 hover:bg-white/20 transition-all"
                                    >
                                        I Already Have an Account
                                    </button>
                                </div>

                                {/* Trust Badges */}
                                <div className="flex flex-wrap items-center gap-6 mt-8 justify-center lg:justify-start">
                                    <div className="flex items-center gap-2 text-emerald-100/80">
                                        <Shield className="w-5 h-5" />
                                        <span className="text-sm">HIPAA Compliant</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-emerald-100/80">
                                        <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                                        <span className="text-sm">4.9/5 Rating</span>
                                    </div>
                                </div>
                            </div>

                            {/* Visual Element */}
                            <div className="hidden lg:block shrink-0">
                                <div className="relative">
                                    {/* Main Image Card */}
                                    <div className="relative w-80 h-96 rounded-3xl overflow-hidden shadow-2xl">
                                        <img 
                                            src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&h=800&fit=crop"
                                            alt="Professional therapist"
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
                                    </div>

                                    {/* Floating Card 1 */}
                                    <div className="absolute -top-6 -left-6 p-4 bg-white rounded-2xl shadow-xl">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-full bg-customGreen/20 flex items-center justify-center">
                                                <Heart className="w-6 h-6 text-customGreen" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-gray-900">50k+</div>
                                                <div className="text-xs text-gray-500">Happy Members</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Floating Card 2 */}
                                    <div className="absolute -bottom-4 -right-4 p-4 bg-white rounded-2xl ">
                                        <div className="flex items-center gap-1 mb-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                                            ))}
                                        </div>
                                        <div className="text-xs text-gray-600">"Life-changing experience!"</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CTASection;
