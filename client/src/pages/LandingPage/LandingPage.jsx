import React from 'react'
import NewNavbar from '@/components/LandingPage/NewNavbar';
import NewHero from '@/components/LandingPage/NewHero';
import Features from '@/components/LandingPage/Features';
import HowItWorks from '@/components/LandingPage/HowItWorks';
import TherapistsShowcase from '@/components/LandingPage/TherapistsShowcase';
import Testimonials from '@/components/LandingPage/Testimonials';
import StatsSection from '@/components/LandingPage/StatsSection';
import NewFAQSection from '@/components/LandingPage/NewFAQSection';
import CTASection from '@/components/LandingPage/CTASection';
import NewFooter from '@/components/LandingPage/NewFooter';

const LandingPage = () => {
    return (
        <div className="overflow-x-hidden">
            <NewNavbar />
            <NewHero />
            <Features />
            <HowItWorks />
            <TherapistsShowcase />
            <Testimonials />
            {/* <StatsSection /> */}
            <NewFAQSection />
            {/* <CTASection /> */}
            <NewFooter />
        </div>
    );
}

export default LandingPage