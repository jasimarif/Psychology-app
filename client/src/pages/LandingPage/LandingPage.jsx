import React from 'react'
import {Navbar, Hero, WhatsIncluded, ProfessionalTherapists, VirtualHealthStats, TherapySection, FAQSection, FooterSection} from '@/components';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const AnimatedSection = ({ children, animation = 'fade-up', delay = 0 }) => {
    const [ref, isVisible] = useScrollAnimation({ threshold: 0.1 });

    const animations = {
        'fade-up': 'translate-y-10 opacity-0',
        'fade-down': '-translate-y-10 opacity-0',
        'fade-left': 'translate-x-10 opacity-0',
        'fade-right': '-translate-x-10 opacity-0',
        'zoom-in': 'scale-95 opacity-0',
        'zoom-out': 'scale-105 opacity-0',
    };

    const animationClass = animations[animation] || animations['fade-up'];

    return (
        <div
            ref={ref}
            className={`transition-all duration-1000 ease-out ${
                isVisible ? 'translate-y-0 translate-x-0 scale-100 opacity-100' : animationClass
            }`}
            style={{ transitionDelay: isVisible ? `${delay}ms` : '0ms' }}
        >
            {children}
        </div>
    );
};

const LandingPage = () => {
    return (
        <div className="">
         <Navbar />
         <Hero />
         <AnimatedSection animation="fade-up">
             <WhatsIncluded />
         </AnimatedSection>
         <ProfessionalTherapists />
         <AnimatedSection animation="zoom-in" delay={100}>
             <VirtualHealthStats />
         </AnimatedSection>
         <TherapySection/>
         <AnimatedSection animation="fade-up" delay={100}>
             <FAQSection/>
         </AnimatedSection>
         <FooterSection/>
        </div>
    );
}

export default LandingPage