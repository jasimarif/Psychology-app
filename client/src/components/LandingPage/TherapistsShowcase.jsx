import React from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { Star, Award, GraduationCap, Clock, ArrowRight } from 'lucide-react';

const TherapistsShowcase = () => {
    const [headerRef, headerVisible] = useScrollAnimation({ threshold: 0.2 });

    const therapists = [
        {
            name: 'Dr. Sarah Mitchell',
            title: 'Clinical Psychologist',
            specialties: ['Anxiety', 'Depression', 'Trauma'],
            experience: '12+ years',
            rating: 4.9,
            reviews: 320,
            image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop',
            available: true,
        },
        {
            name: 'Dr. James Chen',
            title: 'Licensed Therapist',
            specialties: ['Relationships', 'Stress', 'Life Transitions'],
            experience: '8+ years',
            rating: 4.8,
            reviews: 245,
            image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop',
            available: true,
        },
        {
            name: 'Dr. Emily Rodriguez',
            title: 'Psychiatrist',
            specialties: ['ADHD', 'Bipolar', 'Medication Management'],
            experience: '15+ years',
            rating: 4.9,
            reviews: 412,
            image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop',
            available: false,
        },
        {
            name: 'Dr. Michael Foster',
            title: 'Marriage Counselor',
            specialties: ['Couples Therapy', 'Family', 'Communication'],
            experience: '10+ years',
            rating: 4.7,
            reviews: 189,
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
            available: true,
        },
    ];

    return (
        <section id="therapists" className="py-24 relative overflow-hidden font-nunito bg-customYellow">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div 
                    ref={headerRef}
                    className={`flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16 transition-all duration-1000 ${
                        headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}
                >
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-darkYellow text-customGreen text-sm font-semibold mb-6">
                            <Award className="w-4 h-4" />
                            Licensed Professionals
                        </div>
                        <h2 className="text-4xl sm:text-5xl font-bold text-gray-700 mb-4">
                            Meet Our Expert
                            <span className="text-transparent bg-clip-text bg-customGreen font-averia"> Therapists</span>
                        </h2>
                        <p className="text-xl text-gray-600">
                            Every therapist in our network is vetted, licensed, and committed to your wellbeing.
                        </p>
                    </div>
                    
                    <button className="group flex items-center gap-2 text-customGreen hover:text-customGreenHover cursor-pointer select-none transition-colors">
                        View All Therapists
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

                {/* Therapists Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {therapists.map((therapist, index) => (
                        <TherapistCard key={index} therapist={therapist} index={index} />
                    ))}
                </div>

               
            </div>
        </section>
    );
};

const TherapistCard = ({ therapist, index }) => {
    const [ref, isVisible] = useScrollAnimation({ threshold: 0.1 });

    return (
        <div
            ref={ref}
            className={`group relative bg-darkYellow rounded-3xl  cursor-pointer overflow-hidden hover:shadow-2xl hover:shadow-gray-200/60 transition-all duration-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: `${index * 100}ms` }}
        >
            {/* Image */}
            <div className="relative h-56 overflow-hidden">
                <img
                    src={therapist.image}
                    alt={therapist.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Availability Badge */}
                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold ${
                    therapist.available 
                        ? 'bg-customGreen text-white' 
                        : 'bg-gray-200 text-gray-600'
                }`}>
                    {therapist.available ? 'Available Today' : 'Fully Booked'}
                </div>

                {/* Rating */}
                <div className="absolute bottom-4 left-4 flex items-center gap-1 px-2 py-1 rounded-lg bg-white/90 backdrop-blur-sm">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span className="text-sm font-bold text-gray-900">{therapist.rating}</span>
                    <span className="text-xs text-gray-500">({therapist.reviews})</span>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                <h3 className="text-lg font-bold text-gray-700 mb-1">{therapist.name}</h3>
                <p className="text-customGreen font-medium text-sm mb-3">{therapist.title}</p>
                
                {/* Experience */}
                <div className="flex items-center gap-2 text-gray-600 text-sm mb-4">
                    <GraduationCap className="w-4 h-4" />
                    <span>{therapist.experience} experience</span>
                </div>

                {/* Specialties */}
                <div className="flex flex-wrap gap-2">
                    {therapist.specialties.map((specialty, idx) => (
                        <span 
                            key={idx}
                            className="px-3 py-1 bg-lightGray text-customGreen text-xs font-medium rounded-full"
                        >
                            {specialty}
                        </span>
                    ))}
                </div>
            </div>

            {/* Hover CTA */}
            <div className="absolute bottom-0 left-0 right-0 p-6  translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <button className="w-full py-3 cursor-pointer select-none bg-customGreen to-teal-500 text-white font-semibold rounded-xl hover:shadow-lg transition-shadow">
                    Book Session
                </button>
            </div>
        </div>
    );
};
;

export default TherapistsShowcase;
