import React, { useState, useEffect } from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

const Testimonials = () => {
    const [headerRef, headerVisible] = useScrollAnimation({ threshold: 0.2 });
    const [activeIndex, setActiveIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const testimonials = [
        {
            name: 'Jessica M.',
            role: 'Software Engineer',
            image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
            quote: "After years of struggling with anxiety, I finally found a therapist who truly understands me. The convenience of online sessions has been life-changing. I can't recommend MindfulPath enough.",
            rating: 5,
            highlight: 'life-changing',
        },
        {
            name: 'David K.',
            role: 'Business Owner',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
            quote: "Being able to message my therapist between sessions has made such a difference. It's like having support in my pocket. The platform is incredibly intuitive and secure.",
            rating: 5,
            highlight: 'support in my pocket',
        },
        {
            name: 'Sarah L.',
            role: 'Marketing Director',
            image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
            quote: "I was skeptical about online therapy at first, but my therapist made me feel comfortable from day one. The flexibility to schedule sessions around my busy life has been invaluable.",
            rating: 5,
            highlight: 'comfortable from day one',
        },
        {
            name: 'Marcus J.',
            role: 'Teacher',
            image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
            quote: "The matching process was spot-on. My therapist specializes exactly in what I needed help with. Three months in and I've made more progress than years of traditional therapy.",
            rating: 5,
            highlight: 'more progress',
        },
        {
            name: 'Emily R.',
            role: 'Healthcare Worker',
            image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop',
            quote: "As someone who works long shifts, finding time for in-person therapy was impossible. Now I can have sessions from my car during lunch. It's been a game-changer for my mental health.",
            rating: 5,
            highlight: 'game-changer',
        },
    ];

    useEffect(() => {
        if (isPaused) return;
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [isPaused, testimonials.length]);

    const nextSlide = () => {
        setActiveIndex((prev) => (prev + 1) % testimonials.length);
    };

    const prevSlide = () => {
        setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    return (
        <section className="py-24 bg-customYellow font-nunito relative overflow-hidden">
   

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                {/* Header */}
                <div 
                    ref={headerRef}
                    className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-1000 ${
                        headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 text-amber-700 text-sm font-semibold mb-6">
                        <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                        4.9/5 from 10,000+ reviews
                    </div>
                    <h2 className="text-4xl sm:text-5xl font-bold text-gray-700 mb-6">
                        Stories of
                        <span className="text-transparent bg-clip-text bg-customGreen font-averia"> Transformation</span>
                    </h2>
                    <p className="text-xl text-gray-600">
                        Real experiences from people who found their path to better mental health.
                    </p>
                </div>

                {/* Testimonials Carousel */}
                <div 
                    className="relative"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    {/* Main Card */}
                    <div className="relative overflow-hidden rounded-3xl bg-darkYellow  ">
                        <div className="flex transition-transform duration-700 ease-out" style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
                            {testimonials.map((testimonial, index) => (
                                <div 
                                    key={index}
                                    className="w-full shrink-0 p-8 md:p-12 lg:p-16"
                                >
                                    <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
                                        {/* Image */}
                                        <div className="relative shrink-0">
                                            <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-2xl overflow-hidden">
                                                <img
                                                    src={testimonial.image}
                                                    alt={testimonial.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="absolute -top-3 -right-3 w-10 h-10 bg-customGreen rounded-xl flex items-center justify-center">
                                                <Quote className="w-5 h-5 text-white" />
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 text-center lg:text-left">
                                            {/* Rating */}
                                            <div className="flex items-center justify-center lg:justify-start gap-1 mb-4">
                                                {[...Array(testimonial.rating)].map((_, i) => (
                                                    <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                                                ))}
                                            </div>

                                            {/* Quote */}
                                            <blockquote className="text-xl lg:text-2xl text-gray-700 leading-relaxed mb-6">
                                                "{testimonial.quote.split(testimonial.highlight).map((part, i, arr) => (
                                                    <React.Fragment key={i}>
                                                        {part}
                                                        {i < arr.length - 1 && (
                                                            <span className="text-customGreen font-semibold">{testimonial.highlight}</span>
                                                        )}
                                                    </React.Fragment>
                                                ))}"
                                            </blockquote>

                                            {/* Author */}
                                            <div>
                                                <div className="font-bold text-gray-700 text-lg">{testimonial.name}</div>
                                                <div className="text-gray-500">{testimonial.role}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="flex items-center justify-center gap-4 mt-8">
                        <button 
                            onClick={prevSlide}
                            className="w-12 h-12 rounded-full bg-darkYellow flex items-center justify-center text-gray-600 hover:text-customGreen hover:border-customGreen transition-all"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>

                        <div className="flex items-center gap-2">
                            {testimonials.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setActiveIndex(index)}
                                    className={`transition-all duration-300 ${
                                        index === activeIndex 
                                            ? 'w-8 h-2 bg-customGreen rounded-full' 
                                            : 'w-2 h-2 bg-gray-300 rounded-full hover:bg-gray-400'
                                    }`}
                                />
                            ))}
                        </div>

                        <button 
                            onClick={nextSlide}
                            className="w-12 h-12 rounded-full bg-darkYellow  flex items-center justify-center text-gray-600 hover:text-customGreen hover:border-customGreen transition-all"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
