import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Facebook, Twitter, Instagram, Linkedin, Youtube, Mail, MapPin, Phone, ArrowRight, Heart } from 'lucide-react';
import { BriefcaseIcon } from '@/components/icons/DuoTuneIcons';

const NewFooter = () => {
    const [email, setEmail] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Newsletter signup:', email);
        setEmail('');
    };

    const footerLinks = {
        services: [
            { name: 'Individual Therapy', href: '/login' },
            { name: 'Couples Therapy', href: '/login' },
            { name: 'Teen Therapy', href: '/login' },
            { name: 'Psychiatry', href: '/login' },
            { name: 'Group Sessions', href: '/login' },
        ],
        company: [
            { name: 'About Us', href: '/about' },
            { name: 'Research', href: '/' },
            { name: 'Reviews', href: '/' },
        ],
        resources: [
            { name: 'Mental Health Info', href: 'https://www.nimh.nih.gov/health', external: true },
            { name: 'Anxiety Resources', href: 'https://adaa.org/understanding-anxiety', external: true },
            // { name: 'Depression Help', href: 'https://www.helpguide.org/articles/depression/coping-with-depression.htm', external: true },
            { name: 'Crisis Lifeline', href: 'https://988lifeline.org/', external: true },
        ],
        legal: [
            { name: 'Privacy Policy', href: '/privacy' },
            { name: 'Terms of Service', href: '/terms' },
            { name: 'Accessibility', href: '/accessibility' },
            { name: 'Cookie Policy', href: '/cookies' },
        ],
    };

    const socialLinks = [
        { icon: <Facebook className="w-5 h-5" />, href: '#', label: 'Facebook' },
        { icon: <Twitter className="w-5 h-5" />, href: '#', label: 'Twitter' },
        { icon: <Instagram className="w-5 h-5" />, href: '#', label: 'Instagram' },
        { icon: <Linkedin className="w-5 h-5" />, href: '#', label: 'LinkedIn' },
        { icon: <Youtube className="w-5 h-5" />, href: '#', label: 'YouTube' },
    ];

    return (
        <footer className="bg-customGreen text-white font-nunito">
            {/* Newsletter Section */}
            <div className="border-b border-customGreenHover">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                        <div className="text-center lg:text-left">
                            <h3 className="text-2xl font-bold mb-2">Stay Updated</h3>
                            <p className="text-white/70">Get mental health tips and updates delivered to your inbox.</p>
                        </div>
                        <form onSubmit={handleSubmit} className="flex w-full max-w-md gap-3">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="flex-1 px-5 py-3 rounded-xl bg-darkYellow  text-gray-700 placeholder-gray-400 focus:outline-none  transition-colors"
                                required
                            />
                            <button
                                type="submit"
                                className="px-6 py-3 bg-customGreenHover hover:bg-customGreenHover/50 text-white font-semibold rounded-xl cursor-pointer select-none transition-all"
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Main Footer */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-12">
                    {/* Brand Column */}
                    <div className="col-span-2 md:col-span-3 lg:col-span-2">
                        <div className="flex items-center gap-2 mb-6">
                            <BriefcaseIcon className="w-8 h-8 text-white" />
                            <span className="text-2xl font-bold">PsychApp</span>
                        </div>
                        <p className="text-white mb-6 max-w-xs leading-relaxed">
                            Professional online therapy that fits your life. Connect with licensed therapists from anywhere.
                        </p>
                        
                        {/* Contact Info */}
                        <div className="space-y-3 text-sm text-white">
                            <div className="flex items-center gap-3">
                                <Mail className="w-4 h-4 text-white" />
                                <span>psychapp@gmail.com</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="w-4 h-4 text-white" />
                                <span>1-800-THERAPY</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <MapPin className="w-4 h-4 text-white" />
                                <span>Toronto, ON</span>
                            </div>
                        </div>
                    </div>

                    {/* Services */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Services</h4>
                        <ul className="space-y-3">
                            {footerLinks.services.map((link, index) => (
                                <li key={index}>
                                    <Link to={link.href} className="text-white hover:text-gray-200 transition-colors text-sm">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Company</h4>
                        <ul className="space-y-3">
                            {footerLinks.company.map((link, index) => (
                                <li key={index}>
                                    <Link to={link.href} className="text-white hover:text-gray-200 transition-colors text-sm">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Resources</h4>
                        <ul className="space-y-3">
                            {footerLinks.resources.map((link, index) => (
                                <li key={index}>
                                    <a
                                        href={link.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-white hover:text-gray-200 transition-colors text-sm"
                                    >
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal */}
                    {/* <div>
                        <h4 className="text-lg font-semibold mb-4">Legal</h4>
                        <ul className="space-y-3">
                            {footerLinks.legal.map((link, index) => (
                                <li key={index}>
                                    <Link to={link.href} className="text-white hover:text-gray-200 transition-colors text-sm">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div> */}
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        {/* Copyright */}
                        <div className="flex items-center gap-2 text-white text-sm">
                            <span>© 2026 PsycyApp. Made with</span>
                            <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                            <span>for better mental health.</span>
                        </div>

                        {/* Social Links */}
                        <div className="flex items-center gap-4">
                            {socialLinks.map((social, index) => (
                                <a
                                    key={index}
                                    href={social.href}
                                    aria-label={social.label}
                                    className="w-10 h-10 rounded-xl bg-customGreenHover flex items-center justify-center text-white hover:bg-customGreen hover:text-white transition-all"
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Crisis Banner */}
            <div className="bg-linear-to-r from-red-900/50 to-orange-900/50 border-t border-red-800/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <p className="text-center text-sm text-red-200">
                        <strong>In crisis?</strong> If you're in immediate danger or having thoughts of self-harm, call{' '}
                        <a href="tel:911" className="font-bold underline">911</a> or the{' '}
                        <a href="tel:988" className="font-bold underline">988 Suicide & Crisis Lifeline</a>.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default NewFooter;
