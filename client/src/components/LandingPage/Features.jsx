import React from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

// Duotune Icons as React components
const VideoIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path opacity="0.3" d="M18.0001 21H6.00006C5.40006 21 5.00006 20.6 5.00006 20V4C5.00006 3.4 5.40006 3 6.00006 3H18.0001C18.6001 3 19.0001 3.4 19.0001 4V20C19.0001 20.6 18.6001 21 18.0001 21Z" fill="currentColor"/>
        <path d="M12 11C10.9 11 10 10.1 10 9V8C10 6.9 10.9 6 12 6C13.1 6 14 6.9 14 8V9C14 10.1 13.1 11 12 11ZM15.5 17.5C15.5 15.1 13.9 14 12 14C10.1 14 8.5 15.1 8.5 17.5V18H15.5V17.5Z" fill="currentColor"/>
    </svg>
);

const MessageIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path opacity="0.3" d="M20 3H4C2.9 3 2 3.9 2 5V16C2 17.1 2.9 18 4 18H4.5C5.1 18 5.5 18.4 5.5 19V21.5L9 18H20C21.1 18 22 17.1 22 16V5C22 3.9 21.1 3 20 3Z" fill="currentColor"/>
        <path d="M8 12C8.6 12 9 11.6 9 11C9 10.4 8.6 10 8 10C7.4 10 7 10.4 7 11C7 11.6 7.4 12 8 12ZM12 12C12.6 12 13 11.6 13 11C13 10.4 12.6 10 12 10C11.4 10 11 10.4 11 11C11 11.6 11.4 12 12 12ZM16 12C16.6 12 17 11.6 17 11C17 10.4 16.6 10 16 10C15.4 10 15 10.4 15 11C15 11.6 15.4 12 16 12Z" fill="currentColor"/>
    </svg>
);

const CalendarIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path opacity="0.3" d="M21 22H3C2.4 22 2 21.6 2 21V5C2 4.4 2.4 4 3 4H21C21.6 4 22 4.4 22 5V21C22 21.6 21.6 22 21 22Z" fill="currentColor"/>
        <path d="M6 6C5.4 6 5 5.6 5 5V3C5 2.4 5.4 2 6 2C6.6 2 7 2.4 7 3V5C7 5.6 6.6 6 6 6ZM11 5V3C11 2.4 10.6 2 10 2C9.4 2 9 2.4 9 3V5C9 5.6 9.4 6 10 6C10.6 6 11 5.6 11 5ZM15 5V3C15 2.4 14.6 2 14 2C13.4 2 13 2.4 13 3V5C13 5.6 13.4 6 14 6C14.6 6 15 5.6 15 5ZM19 5V3C19 2.4 18.6 2 18 2C17.4 2 17 2.4 17 3V5C17 5.6 17.4 6 18 6C18.6 6 19 5.6 19 5Z" fill="currentColor"/>
        <path d="M8.8 13.1C9.2 13.1 9.5 13 9.7 12.8C9.9 12.6 10.1 12.3 10.1 11.9C10.1 11.6 10 11.3 9.8 11.1C9.6 10.9 9.3 10.8 9 10.8C8.8 10.8 8.6 10.8 8.4 10.9C8.2 11 8.1 11.1 8 11.2C7.9 11.3 7.8 11.4 7.7 11.6C7.6 11.8 7.5 11.9 7.5 12.1C7.5 12.2 7.4 12.2 7.3 12.3C7.2 12.4 7.1 12.4 6.9 12.4C6.7 12.4 6.6 12.3 6.5 12.2C6.4 12.1 6.3 11.9 6.3 11.7C6.3 11.5 6.4 11.3 6.5 11.1C6.6 10.9 6.8 10.7 7 10.5C7.2 10.3 7.5 10.1 7.9 10C8.3 9.9 8.6 9.8 9.1 9.8C9.5 9.8 9.8 9.9 10.1 10C10.4 10.1 10.7 10.3 10.9 10.4C11.1 10.5 11.3 10.8 11.4 11.1C11.5 11.4 11.6 11.6 11.6 11.9C11.6 12.3 11.5 12.6 11.3 12.9C11.1 13.2 10.9 13.5 10.6 13.7C10.9 13.9 11.2 14.1 11.4 14.3C11.6 14.5 11.8 14.7 11.9 15C12 15.3 12.1 15.5 12.1 15.8C12.1 16.2 12 16.5 11.9 16.8C11.8 17.1 11.5 17.4 11.3 17.7C11.1 18 10.7 18.2 10.3 18.3C9.9 18.4 9.5 18.5 9 18.5C8.5 18.5 8.1 18.4 7.7 18.2C7.3 18 7 17.8 6.8 17.6C6.6 17.4 6.4 17.1 6.3 16.8C6.2 16.5 6.1 16.3 6.1 16.1C6.1 15.9 6.2 15.7 6.3 15.6C6.4 15.5 6.6 15.4 6.8 15.4C6.9 15.4 7 15.4 7.1 15.5C7.2 15.6 7.3 15.6 7.3 15.7C7.5 16.2 7.7 16.6 8 16.9C8.3 17.2 8.6 17.3 9 17.3C9.2 17.3 9.5 17.2 9.7 17.1C9.9 17 10.1 16.8 10.3 16.6C10.5 16.4 10.5 16.1 10.5 15.8C10.5 15.3 10.4 15 10.1 14.7C9.8 14.4 9.5 14.3 9.1 14.3C9 14.3 8.9 14.3 8.7 14.3C8.5 14.3 8.4 14.3 8.4 14.3C8.2 14.3 8 14.2 7.9 14.1C7.8 14 7.7 13.8 7.7 13.7C7.7 13.5 7.8 13.4 7.9 13.2C8 13 8.2 13 8.5 13H8.8V13.1Z" fill="currentColor"/>
    </svg>
);

const BrainIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path opacity="0.3" d="M20.9 12.9C20.3 12.9 19.9 12.5 19.9 11.9C19.9 11.3 20.3 10.9 20.9 10.9H21.8C21.3 6.2 17.6 2.4 12.9 2V2.9C12.9 3.5 12.5 3.9 11.9 3.9C11.3 3.9 10.9 3.5 10.9 2.9V2C6.2 2.5 2.4 6.2 2 10.9H2.9C3.5 10.9 3.9 11.3 3.9 11.9C3.9 12.5 3.5 12.9 2.9 12.9H2C2.5 17.6 6.2 21.4 10.9 21.8V20.9C10.9 20.3 11.3 19.9 11.9 19.9C12.5 19.9 12.9 20.3 12.9 20.9V21.8C17.6 21.3 21.4 17.6 21.8 12.9H20.9Z" fill="currentColor"/>
        <path d="M16.9 10.9H13.6C13.4 10.6 13.2 10.4 12.9 10.2V5.9C12.9 5.3 12.5 4.9 11.9 4.9C11.3 4.9 10.9 5.3 10.9 5.9V10.2C10.6 10.4 10.4 10.6 10.2 10.9H9.9C9.3 10.9 8.9 11.3 8.9 11.9C8.9 12.5 9.3 12.9 9.9 12.9H10.2C10.4 13.2 10.6 13.4 10.9 13.6V13.9C10.9 14.5 11.3 14.9 11.9 14.9C12.5 14.9 12.9 14.5 12.9 13.9V13.6C13.2 13.4 13.4 13.2 13.6 12.9H16.9C17.5 12.9 17.9 12.5 17.9 11.9C17.9 11.3 17.5 10.9 16.9 10.9Z" fill="currentColor"/>
    </svg>
);

const HeartIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path opacity="0.3" d="M12.025 4.725C9.725 2.425 6.025 2.425 3.725 4.725C1.425 7.025 1.425 10.725 3.725 13.025L11.325 20.625C11.725 21.025 12.325 21.025 12.725 20.625L20.325 13.025C22.625 10.725 22.625 7.025 20.325 4.725C18.025 2.425 14.325 2.425 12.025 4.725Z" fill="currentColor"/>
        <path d="M14.025 17.125H13.925C13.525 17.025 13.125 16.725 13.025 16.325L11.925 11.125L11.025 14.325C10.925 14.725 10.625 15.025 10.225 15.025C9.825 15.125 9.425 14.925 9.225 14.625L7.725 12.325L6.525 12.925C6.425 13.025 6.225 13.025 6.125 13.025H3.125C2.525 13.025 2.125 12.625 2.125 12.025C2.125 11.425 2.525 11.025 3.125 11.025H5.925L7.725 10.125C8.225 9.925 8.725 10.025 9.025 10.425L9.825 11.625L11.225 6.725C11.325 6.325 11.725 6.025 12.225 6.025C12.725 6.025 13.025 6.325 13.125 6.825L14.525 13.025L15.225 11.525C15.425 11.225 15.725 10.925 16.125 10.925H21.125C21.725 10.925 22.125 11.325 22.125 11.925C22.125 12.525 21.725 12.925 21.125 12.925H16.725L15.025 16.325C14.725 16.925 14.425 17.125 14.025 17.125Z" fill="currentColor"/>
    </svg>
);

const ShieldIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path opacity="0.3" d="M20.5543 4.37824L12.1798 2.02473C12.0626 1.99176 11.9376 1.99176 11.8203 2.02473L3.44572 4.37824C3.18118 4.45258 3 4.6807 3 4.93945V13.569C3 14.6914 3.48509 15.8404 4.4417 16.984C5.17231 17.8575 6.18314 18.7345 7.446 19.5909C9.56752 21.0295 11.6566 21.912 11.7445 21.9488C11.8258 21.9829 11.9129 22 12.0001 22C12.0872 22 12.1744 21.983 12.2557 21.9488C12.3435 21.912 14.4326 21.0295 16.5541 19.5909C17.8169 18.7345 18.8277 17.8575 19.5584 16.984C20.515 15.8404 21 14.6914 21 13.569V4.93945C21 4.6807 20.8189 4.45258 20.5543 4.37824Z" fill="currentColor"/>
        <path d="M14.854 11.321C14.7568 11.2282 14.6388 11.1818 14.4998 11.1818H14.3333V10.2272C14.3333 9.61741 14.1041 9.09378 13.6458 8.65628C13.1875 8.21876 12.639 8 12 8C11.361 8 10.8124 8.21876 10.3541 8.65626C9.89574 9.09378 9.66663 9.61739 9.66663 10.2272V11.1818H9.49999C9.36115 11.1818 9.24306 11.2282 9.14583 11.321C9.0486 11.4138 9 11.5265 9 11.6591V14.5227C9 14.6553 9.04862 14.768 9.14583 14.8609C9.24306 14.9536 9.36115 15 9.49999 15H14.5C14.6389 15 14.7569 14.9536 14.8542 14.8609C14.9513 14.768 15 14.6553 15 14.5227V11.6591C15.0001 11.5265 14.9513 11.4138 14.854 11.321ZM13.3333 11.1818H10.6666V10.2272C10.6666 9.87594 10.7969 9.57597 11.0573 9.32743C11.3177 9.07886 11.6319 8.9546 12 8.9546C12.3681 8.9546 12.6823 9.07884 12.9427 9.32743C13.2031 9.57595 13.3333 9.87594 13.3333 10.2272V11.1818Z" fill="currentColor"/>
    </svg>
);

const ClockIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path opacity="0.3" d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="currentColor"/>
        <path d="M12 7C11.4 7 11 7.4 11 8V12C11 12.3 11.1 12.5 11.3 12.7L14.3 15.7C14.5 15.9 14.7 16 15 16C15.3 16 15.5 15.9 15.7 15.7C16.1 15.3 16.1 14.7 15.7 14.3L13 11.6V8C13 7.4 12.6 7 12 7Z" fill="currentColor"/>
    </svg>
);

const SmartphoneIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 21C6 21.6 6.4 22 7 22H17C17.6 22 18 21.6 18 21V20H6V21Z" fill="currentColor"/>
        <path opacity="0.3" d="M17 2H7C6.4 2 6 2.4 6 3V20H18V3C18 2.4 17.6 2 17 2Z" fill="currentColor"/>
        <path d="M12 4C11.4 4 11 3.6 11 3V2H13V3C13 3.6 12.6 4 12 4Z" fill="currentColor"/>
    </svg>
);

const Features = () => {
    const [headerRef, headerVisible] = useScrollAnimation({ threshold: 0.2 });

    const features = [
        {
            icon: <VideoIcon />,
            title: 'HD Video Sessions',
            description: 'Crystal clear video calls with your therapist from anywhere in the world.',
            iconBg: 'bg-blue-500',
            cardBg: 'bg-blue-50',
        },
        // {
        //     icon: <MessageIcon />,
        //     title: 'Progress Tracking',
        //     description: 'Monitor your mental health journey with detailed progress reports and insights.',
        //     iconBg: 'bg-emerald-500',
        //     cardBg: 'bg-emerald-50',
        // },
        {
            icon: <CalendarIcon />,
            title: 'Flexible Scheduling',
            description: 'Book sessions that fit your life. Early mornings, late nights, weekends.',
            iconBg: 'bg-violet-500',
            cardBg: 'bg-violet-50',
        },
        {
            icon: <BrainIcon />,
            title: 'Expert Therapists',
            description: 'Licensed professionals specialized in anxiety, depression, relationships & more.',
            iconBg: 'bg-orange-500',
            cardBg: 'bg-orange-50',
        },
        {
            icon: <HeartIcon />,
            title: 'Personalized Care',
            description: 'Therapy tailored to your unique needs, goals, and healing journey.',
            iconBg: 'bg-rose-500',
            cardBg: 'bg-rose-50',
        },
        // {
        //     icon: <ShieldIcon />,
        //     title: 'Complete Privacy',
        //     description: 'HIPAA compliant platform with end-to-end encryption for your peace of mind.',
        //     iconBg: 'bg-slate-600',
        //     cardBg: 'bg-slate-50',
        // },
        // {
        //     icon: <ClockIcon />,
        //     title: '24/7 Support',
        //     description: 'Access resources and emergency support whenever you need it most.',
        //     iconBg: 'bg-indigo-500',
        //     cardBg: 'bg-indigo-50',
        // },
        // {
        //     icon: <SmartphoneIcon />,
        //     title: 'Mobile App',
        //     description: 'Take your therapy journey anywhere with our iOS and Android apps.',
        //     iconBg: 'bg-teal-500',
        //     cardBg: 'bg-teal-50',
        // },
    ];

    return (
        <section className="py-24 bg-white relative overflow-hidden font-nunito">
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                {/* Header */}
                <div 
                    ref={headerRef}
                    className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-1000 ${
                        headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-customGreen/10 text-customGreen text-sm font-semibold mb-6">
                        <span className="w-2 h-2 bg-customGreen rounded-full animate-pulse" />
                        Why Choose Us
                    </div>
                    <h2 className="text-4xl sm:text-5xl font-bold text-gray-700 mb-6">
                        Everything You Need for
                        <span className="block text-transparent bg-clip-text bg-customGreen font-averia">
                            Better Mental Health
                        </span>
                    </h2>
                    <p className="text-xl text-gray-600 leading-relaxed">
                        Our comprehensive platform provides all the tools and support you need 
                        to prioritize your mental wellness journey.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <FeatureCard key={index} feature={feature} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
};

const FeatureCard = ({ feature, index }) => {
    const [ref, isVisible] = useScrollAnimation({ threshold: 0.1 });

    return (
        <div
            ref={ref}
            className={`group relative p-6 rounded-3xl ${feature.cardBg} border-none transition-all duration-500  ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: `${index * 100}ms` }}
        >
            <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl ${feature.iconBg} text-white mb-5 group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
                {feature.title}
            </h3>
            <p className="text-gray-600 leading-relaxed">
                {feature.description}
            </p>
        </div>
    );
};

export default Features;
