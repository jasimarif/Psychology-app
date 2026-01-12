import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Shield, Users, Award, Target, Sparkles } from 'lucide-react';

const AboutUs = () => {
    const navigate = useNavigate();

    const values = [
        {
            icon: <Heart className="w-6 h-6" />,
            title: 'Compassion First',
            description: 'We believe everyone deserves access to quality mental health care with empathy and understanding.',
        },
        {
            icon: <Shield className="w-6 h-6" />,
            title: 'Privacy & Trust',
            description: 'Your privacy is sacred. We use bank-level encryption and are fully HIPAA compliant.',
        },
        {
            icon: <Users className="w-6 h-6" />,
            title: 'Accessibility',
            description: 'Breaking down barriers to mental health care by making therapy available anytime, anywhere.',
        },
        {
            icon: <Award className="w-6 h-6" />,
            title: 'Excellence',
            description: 'Every therapist in our network is licensed, vetted, and committed to your wellbeing.',
        },
    ];

    const stats = [
        { number: '5000+', label: 'People Helped' },
        { number: '500+', label: 'Licensed Therapists' },
        { number: '98%', label: 'Client Satisfaction' },
        { number: '24/7', label: 'Support Available' },
    ];

    const team = [
        {
            name: 'Dr. Sarah Johnson',
            role: 'Founder & CEO',
            image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
            bio: 'Clinical psychologist with 15+ years of experience, passionate about making mental health care accessible to all.',
        },
        {
            name: 'Michael Chen',
            role: 'Chief Technology Officer',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
            bio: 'Tech leader focused on building secure, user-friendly platforms that connect people with the care they need.',
        },
        {
            name: 'Dr. Emily Rodriguez',
            role: 'Head of Clinical Operations',
            image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
            bio: 'Psychiatrist dedicated to ensuring the highest standards of care across our therapist network.',
        },
    ];

    return (
        <div className="min-h-screen bg-white font-nunito">
            {/* Header */}
            <header className="bg-customGreen text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 text-white/80 hover:text-white transition-colors cursor-pointer"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back to Home
                    </button>
                </div>
            </header>

            {/* Hero Section */}
            <section className="bg-customGreen text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white/90 text-sm font-semibold mb-6">
                        <Sparkles className="w-4 h-4" />
                        Our Story
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                        Making Mental Health Care
                        <span className="block text-darkYellow font-averia mt-2">Accessible to Everyone</span>
                    </h1>
                    <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
                        PsychApp was founded with a simple mission: to break down the barriers that prevent people
                        from getting the mental health support they deserve. We believe that therapy should be
                        accessible, affordable, and convenient for everyone.
                    </p>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-customGreen/10 text-customGreen text-sm font-semibold mb-6">
                                <Target className="w-4 h-4" />
                                Our Mission
                            </div>
                            <h2 className="text-3xl sm:text-4xl font-bold text-gray-700 mb-6">
                                Transforming Lives Through
                                <span className="text-customGreen font-averia"> Accessible Therapy</span>
                            </h2>
                            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                                We started PsychApp because we saw too many people struggling to access mental health care.
                                Long wait times, high costs, and limited availability were keeping people from getting the help they needed.
                            </p>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                Today, we're proud to have helped over 5000 people connect with licensed therapists
                                from the comfort of their homes. Our platform makes it easy to find the right therapist,
                                schedule sessions that fit your life, and start your journey to better mental health.
                            </p>
                        </div>
                        <div className="relative">
                            <img
                                src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&h=500&fit=crop"
                                alt="Therapy session"
                                className="rounded-2xl shadow-xl w-full"
                            />
                            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg">
                                <p className="text-3xl font-bold text-customGreen">2025</p>
                                <p className="text-gray-600">Founded in Toronto</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-700 mb-4">
                            Our Core <span className="text-customGreen font-averia">Values</span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Everything we do is guided by our commitment to these principles.
                        </p>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value, index) => (
                            <div
                                key={index}
                                className="bg-white p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow"
                            >
                                <div className="w-12 h-12 bg-customGreen/10 rounded-xl flex items-center justify-center text-customGreen mb-4">
                                    {value.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-700 mb-2">{value.title}</h3>
                                <p className="text-gray-600">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 bg-customGreen text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                            Our Impact in <span className="text-darkYellow font-averia">Numbers</span>
                        </h2>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <p className="text-4xl sm:text-5xl font-bold text-darkYellow mb-2 font-averia">{stat.number}</p>
                                <p className="text-white/80 text-lg">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            {/* <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-700 mb-4">
                            Meet Our <span className="text-customGreen">Leadership</span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Passionate professionals dedicated to transforming mental health care.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {team.map((member, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow"
                            >
                                <img
                                    src={member.image}
                                    alt={member.name}
                                    className="w-full h-64 object-cover"
                                />
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-700">{member.name}</h3>
                                    <p className="text-customGreen font-medium mb-3">{member.role}</p>
                                    <p className="text-gray-600">{member.bio}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section> */}

            {/* CTA Section */}
            <section className="py-20 bg-customYellow">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-700 mb-6">
                        Ready to Start Your Journey?
                    </h2>
                    <p className="text-xl text-gray-700 mb-8">
                        Join thousands of others who have found support through PsychApp.
                    </p>
                    <button
                        onClick={() => navigate('/signup')}
                        className="px-8 py-4 bg-customGreen text-white font-semibold rounded-xl hover:bg-customGreenHover cursor-pointer transition-colors"
                    >
                        Get Started Today
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-gray-400">
                        © 2026 PsychApp. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default AboutUs;
