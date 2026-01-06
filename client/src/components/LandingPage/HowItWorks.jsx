import React from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

// Duotune Icons
const ClipboardIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path opacity="0.3" d="M19 22H5C4.4 22 4 21.6 4 21V3C4 2.4 4.4 2 5 2H14L20 8V21C20 21.6 19.6 22 19 22ZM12.5 18C12.5 17.4 12.6 17.5 12 17.5H8.5C7.9 17.5 8 17.4 8 18C8 18.6 7.9 18.5 8.5 18.5H12C12.6 18.5 12.5 18.6 12.5 18ZM16.5 13C16.5 12.4 16.6 12.5 16 12.5H8.5C7.9 12.5 8 12.4 8 13C8 13.6 7.9 13.5 8.5 13.5H16C16.6 13.5 16.5 13.6 16.5 13ZM12.5 15.5C12.5 14.9 12.6 15 12 15H8.5C7.9 15 8 14.9 8 15.5C8 16.1 7.9 16 8.5 16H12C12.6 16 12.5 16.1 12.5 15.5Z" fill="currentColor"/>
        <path d="M15 8H20L14 2V7C14 7.6 14.4 8 15 8Z" fill="currentColor"/>
    </svg>
);

const UsersIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16.0173 9H15.3945C14.2833 9 13.263 9.61425 12.7431 10.5963L12.154 11.7091C12.0645 11.8781 12.1072 12.0868 12.2559 12.2071L12.6402 12.5183C13.2631 13.0225 13.7556 13.6691 14.0764 14.4035L14.2321 14.7601C14.2957 14.9058 14.4396 15 14.5987 15H18.6747C19.7297 15 20.4057 13.8774 19.912 12.945L18.6686 10.5963C18.1487 9.61425 17.1285 9 16.0173 9Z" fill="currentColor"/>
        <rect opacity="0.3" x="14" y="4" width="4" height="4" rx="2" fill="currentColor"/>
        <path d="M4.65486 14.8559C5.40389 13.1224 7.11161 12 9 12C10.8884 12 12.5961 13.1224 13.3451 14.8559L14.793 18.2067C15.3636 19.5271 14.3955 21 12.9571 21H5.04292C3.60453 21 2.63644 19.5271 3.20698 18.2067L4.65486 14.8559Z" fill="currentColor"/>
        <rect opacity="0.3" x="6" y="5" width="6" height="6" rx="3" fill="currentColor"/>
    </svg>
);

const CalendarCheckIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path opacity="0.3" d="M21 22H3C2.4 22 2 21.6 2 21V5C2 4.4 2.4 4 3 4H21C21.6 4 22 4.4 22 5V21C22 21.6 21.6 22 21 22Z" fill="currentColor"/>
        <path d="M6 6C5.4 6 5 5.6 5 5V3C5 2.4 5.4 2 6 2C6.6 2 7 2.4 7 3V5C7 5.6 6.6 6 6 6ZM11 5V3C11 2.4 10.6 2 10 2C9.4 2 9 2.4 9 3V5C9 5.6 9.4 6 10 6C10.6 6 11 5.6 11 5ZM15 5V3C15 2.4 14.6 2 14 2C13.4 2 13 2.4 13 3V5C13 5.6 13.4 6 14 6C14.6 6 15 5.6 15 5ZM19 5V3C19 2.4 18.6 2 18 2C17.4 2 17 2.4 17 3V5C17 5.6 17.4 6 18 6C18.6 6 19 5.6 19 5Z" fill="currentColor"/>
        <path d="M10.5606 11.3042L9.57283 10.3018C9.28174 10.0065 8.80522 10.0065 8.51412 10.3018C8.22897 10.5912 8.22897 11.0559 8.51412 11.3452L10.4182 13.2773C10.8099 13.6747 11.451 13.6747 11.8427 13.2773L15.4859 9.58051C15.771 9.29117 15.771 8.82648 15.4859 8.53714C15.1948 8.24176 14.7183 8.24176 14.4272 8.53714L11.7002 11.3042C11.3869 11.6221 10.874 11.6221 10.5606 11.3042Z" fill="currentColor"/>
    </svg>
);

const HeartIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path opacity="0.3" d="M12.025 4.725C9.725 2.425 6.025 2.425 3.725 4.725C1.425 7.025 1.425 10.725 3.725 13.025L11.325 20.625C11.725 21.025 12.325 21.025 12.725 20.625L20.325 13.025C22.625 10.725 22.625 7.025 20.325 4.725C18.025 2.425 14.325 2.425 12.025 4.725Z" fill="currentColor"/>
        <path d="M14.025 17.125H13.925C13.525 17.025 13.125 16.725 13.025 16.325L11.925 11.125L11.025 14.325C10.925 14.725 10.625 15.025 10.225 15.025C9.825 15.125 9.425 14.925 9.225 14.625L7.725 12.325L6.525 12.925C6.425 13.025 6.225 13.025 6.125 13.025H3.125C2.525 13.025 2.125 12.625 2.125 12.025C2.125 11.425 2.525 11.025 3.125 11.025H5.925L7.725 10.125C8.225 9.925 8.725 10.025 9.025 10.425L9.825 11.625L11.225 6.725C11.325 6.325 11.725 6.025 12.225 6.025C12.725 6.025 13.025 6.325 13.125 6.825L14.525 13.025L15.225 11.525C15.425 11.225 15.725 10.925 16.125 10.925H21.125C21.725 10.925 22.125 11.325 22.125 11.925C22.125 12.525 21.725 12.925 21.125 12.925H16.725L15.025 16.325C14.725 16.925 14.425 17.125 14.025 17.125Z" fill="currentColor"/>
    </svg>
);

const HowItWorks = () => {
    const [headerRef, headerVisible] = useScrollAnimation({ threshold: 0.2 });

    const steps = [
        {
            icon: <ClipboardIcon />,
            step: '01',
            title: 'Complete Assessment',
            description: 'Take a quick 5-minute questionnaire to help us understand your unique needs and preferences.',
            color: 'emerald',
        },
        {
            icon: <UsersIcon />,
            step: '02',
            title: 'Get Matched',
            description: 'Our smart algorithm connects you with licensed therapists who specialize in your areas of concern.',
            color: 'teal',
        },
        {
            icon: <CalendarCheckIcon />,
            step: '03',
            title: 'Book Your Session',
            description: 'Choose a time that works for you. Video, voice, or chat - your choice, your comfort.',
            color: 'cyan',
        },
        {
            icon: <HeartIcon />,
            step: '04',
            title: 'Start Healing',
            description: 'Begin your journey with ongoing support, tools, and a dedicated therapist by your side.',
            color: 'blue',
        },
    ];

    return (
        <section id="how-it-works" className="py-24 bg-customYellow relative overflow-hidden font-nunito">


            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                {/* Header */}
                <div
                    ref={headerRef}
                    className={`text-center max-w-3xl mx-auto mb-20 transition-all duration-1000 ${
                        headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-darkYellow text-customGreen text-sm font-semibold mb-6">
                        <span className="w-2 h-2 bg-customGreen rounded-full animate-pulse" />
                        Simple Process
                    </div>
                    <h2 className="text-4xl sm:text-5xl font-bold text-gray-700 mb-6">
                        Start Therapy in
                        <span className="text-customGreen font-averia"> 4 Easy Steps</span>
                    </h2>
                    <p className="text-xl text-gray-600 leading-relaxed">
                        Getting started with therapy has never been easier. We've simplified the process
                        so you can focus on what matters most - your wellbeing.
                    </p>
                </div>

                {/* Steps */}
                <div className="relative">
                    {/* Connection Line - Desktop */}

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
                        {steps.map((step, index) => (
                            <StepCard key={index} step={step} index={index} />
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <div className="text-center mt-16">
                    <button className="group relative px-8 py-4 bg-customGreen shadow-none cursor-pointer select-none text-white font-semibold rounded-2xl  transition-all duration-300 ">
                        Get Started Now - It's Free
                        <span className="absolute -top-3 -right-3 px-2 py-1 bg-amber-400 text-amber-900 text-xs font-bold rounded-full">
                            $0
                        </span>
                    </button>
                </div>
            </div>
        </section>
    );
};

const StepCard = ({ step, index }) => {
    const [ref, isVisible] = useScrollAnimation({ threshold: 0.2 });

    const colorClasses = {
        emerald: {
            bg: 'bg-emerald-100',
            icon: 'bg-emerald-500',
            number: 'text-emerald-600',
            ring: 'ring-emerald-100',
        },
        teal: {
            bg: 'bg-teal-100',
            icon: 'bg-teal-500',
            number: 'text-teal-600',
            ring: 'ring-teal-100',
        },
        cyan: {
            bg: 'bg-cyan-100',
            icon: 'bg-cyan-500',
            number: 'text-cyan-600',
            ring: 'ring-cyan-100',
        },
        blue: {
            bg: 'bg-blue-100',
            icon: 'bg-blue-500',
            number: 'text-blue-600',
            ring: 'ring-blue-100',
        },
    };

    const colors = colorClasses[step.color];

    return (
        <div
            ref={ref}
            className={`relative text-center transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: `${index * 150}ms` }}
        >
            {/* Icon Circle */}
            <div className="relative inline-block mb-6">
                <div className={`w-20 h-20 rounded-2xl ${colors.icon} text-white flex items-center justify-center `}>
                    {step.icon}
                </div>
                {/* Step Number Badge */}
                <div className={`absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center font-bold text-sm ${colors.number}`}>
                    {step.step}
                </div>
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-3">
                {step.title}
            </h3>
            <p className="text-gray-600 leading-relaxed">
                {step.description}
            </p>
        </div>
    );
};

export default HowItWorks;
