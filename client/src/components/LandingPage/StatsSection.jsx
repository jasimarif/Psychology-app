import React, { useState, useEffect, useRef } from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const StatsSection = () => {
    const [sectionRef, sectionVisible] = useScrollAnimation({ threshold: 0.3 });
    const [hasAnimated, setHasAnimated] = useState(false);

    useEffect(() => {
        if (sectionVisible && !hasAnimated) {
            setHasAnimated(true);
        }
    }, [sectionVisible, hasAnimated]);

    const stats = [
        { 
            end: 5000000, 
            suffix: '+', 
            label: 'Therapy Sessions', 
            description: 'Successfully completed',
            format: 'compact'
        },
        { 
            end: 1200000, 
            suffix: '+', 
            label: 'Members Helped', 
            description: 'And counting',
            format: 'compact'
        },
        { 
            end: 98, 
            suffix: '%', 
            label: 'Client Satisfaction', 
            description: 'Would recommend us',
            format: 'number'
        },
        { 
            end: 5700, 
            suffix: '+', 
            label: 'Licensed Providers', 
            description: 'Across all specialties',
            format: 'compact'
        },
    ];

    return (
        <section className="py-24 relative overflow-hidden font-nunito">
            {/* Background */}
            <div className="absolute inset-0 bg-customGreen" />
            
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNMzAgMzBtLTEgMGExIDEgMCAxIDAgMiAwIDEgMSAwIDEgMCAtMiAwIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIi8+PC9nPjwvc3ZnPg==')] opacity-60" />

            <div ref={sectionRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                {/* Header */}
                <div className={`text-center mb-16 transition-all duration-1000 ${
                    sectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}>
                    <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                        Trusted by <span className='font-averia text-darkYellow'>Millions</span>
                    </h2>
                    <p className="text-xl text-white/60">
                        The numbers speak for themselves
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                    {stats.map((stat, index) => (
                        <StatCard 
                            key={index} 
                            stat={stat} 
                            index={index} 
                            shouldAnimate={hasAnimated}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

const StatCard = ({ stat, index, shouldAnimate }) => {
    const [count, setCount] = useState(0);
    const countRef = useRef(null);

    useEffect(() => {
        if (!shouldAnimate) return;

        const duration = 2000;
        const steps = 60;
        const stepValue = stat.end / steps;
        let current = 0;

        const timer = setInterval(() => {
            current += stepValue;
            if (current >= stat.end) {
                setCount(stat.end);
                clearInterval(timer);
            } else {
                setCount(Math.floor(current));
            }
        }, duration / steps);

        return () => clearInterval(timer);
    }, [shouldAnimate, stat.end]);

    const formatNumber = (num) => {
        if (stat.format === 'compact') {
            if (num >= 1000000) {
                return (num / 1000000).toFixed(1) + 'M';
            } else if (num >= 1000) {
                return (num / 1000).toFixed(num >= 10000 ? 0 : 1) + 'K';
            }
        }
        return num.toLocaleString();
    };

    return (
        <div 
            className={`text-center p-6 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 transition-all duration-700 hover:bg-white/10 ${
                shouldAnimate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: `${index * 150}ms` }}
        >
            <div ref={countRef} className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-2 font-averia">
                {formatNumber(count)}{stat.suffix}
            </div>
            <div className="text-lg font-semibold text-darkYellow mb-1">
                {stat.label}
            </div>
            <div className="text-sm text-white/50">
                {stat.description}
            </div>
        </div>
    );
};

export default StatsSection;
