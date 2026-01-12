import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Facebook, Twitter, Instagram, Linkedin, Youtube, Mail, MapPin, Phone, ArrowRight, Heart } from 'lucide-react';
import { BriefcaseIcon } from '@/components/icons/DuoTuneIcons';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';

const NewFooter = () => {
    const [email, setEmail] = useState('');
    const [activeModal, setActiveModal] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Newsletter signup:', email);
        setEmail('');
    };

    const legalContent = {
        privacy: {
            title: 'Privacy Policy',
            content: (
                <div className="space-y-4 text-gray-600">
                    <p className="text-sm text-gray-500">Last updated: January 12, 2026</p>
                    
                    <section>
                        <h3 className="font-semibold text-gray-800 mb-2">1. Information We Collect</h3>
                        <p>We collect information you provide directly to us, such as when you create an account, book a session, or contact us for support. This includes:</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Name, email address, and contact information</li>
                            <li>Health and wellness information you choose to share</li>
                            <li>Payment and billing information</li>
                            <li>Communications with therapists</li>
                        </ul>
                    </section>

                    <section>
                        <h3 className="font-semibold text-gray-800 mb-2">2. How We Use Your Information</h3>
                        <p>We use the information we collect to:</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Provide, maintain, and improve our services</li>
                            <li>Match you with appropriate mental health professionals</li>
                            <li>Process transactions and send related information</li>
                            <li>Send you technical notices and support messages</li>
                        </ul>
                    </section>

                    <section>
                        <h3 className="font-semibold text-gray-800 mb-2">3. Data Security</h3>
                        <p>We implement appropriate security measures to protect your personal information. All therapy sessions are encrypted end-to-end, and we comply with HIPAA regulations for handling health information.</p>
                    </section>

                    <section>
                        <h3 className="font-semibold text-gray-800 mb-2">4. Your Rights</h3>
                        <p>You have the right to access, correct, or delete your personal information. You may also opt out of marketing communications at any time.</p>
                    </section>

                    <section>
                        <h3 className="font-semibold text-gray-800 mb-2">5. Contact Us</h3>
                        <p>If you have questions about this Privacy Policy, please contact us at psychapp@gmail.com.</p>
                    </section>
                </div>
            )
        },
        terms: {
            title: 'Terms of Service',
            content: (
                <div className="space-y-4 text-gray-600">
                    <p className="text-sm text-gray-500">Last updated: January 12, 2026</p>
                    
                    <section>
                        <h3 className="font-semibold text-gray-800 mb-2">1. Acceptance of Terms</h3>
                        <p>By accessing or using PsychApp, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.</p>
                    </section>

                    <section>
                        <h3 className="font-semibold text-gray-800 mb-2">2. Description of Service</h3>
                        <p>PsychApp provides an online platform connecting users with licensed mental health professionals. Our services include:</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Online therapy sessions via video, voice, or messaging</li>
                            <li>Appointment scheduling and management</li>
                            <li>Secure communication tools</li>
                        </ul>
                    </section>

                    <section>
                        <h3 className="font-semibold text-gray-800 mb-2">3. User Responsibilities</h3>
                        <p>You agree to:</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Provide accurate and complete information</li>
                            <li>Maintain the confidentiality of your account</li>
                            <li>Use the service only for lawful purposes</li>
                            <li>Respect the privacy and rights of therapists</li>
                        </ul>
                    </section>

                    <section>
                        <h3 className="font-semibold text-gray-800 mb-2">4. Payment Terms</h3>
                        <p>Session fees are charged at the time of booking. Cancellations made less than 24 hours before a scheduled session may be subject to a cancellation fee.</p>
                    </section>

                    <section>
                        <h3 className="font-semibold text-gray-800 mb-2">5. Limitation of Liability</h3>
                        <p>PsychApp is not a substitute for emergency mental health services. If you are in crisis, please contact emergency services or a crisis hotline immediately.</p>
                    </section>
                </div>
            )
        },
        accessibility: {
            title: 'Accessibility Statement',
            content: (
                <div className="space-y-4 text-gray-600">
                    <p className="text-sm text-gray-500">Last updated: January 12, 2026</p>
                    
                    <section>
                        <h3 className="font-semibold text-gray-800 mb-2">Our Commitment</h3>
                        <p>PsychApp is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards.</p>
                    </section>

                    <section>
                        <h3 className="font-semibold text-gray-800 mb-2">Conformance Status</h3>
                        <p>We aim to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 at Level AA. These guidelines help make web content more accessible to people with disabilities.</p>
                    </section>

                    <section>
                        <h3 className="font-semibold text-gray-800 mb-2">Accessibility Features</h3>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Keyboard navigation support</li>
                            <li>Screen reader compatibility</li>
                            <li>High contrast color options</li>
                            <li>Resizable text without loss of functionality</li>
                            <li>Alternative text for images</li>
                            <li>Clear and consistent navigation</li>
                        </ul>
                    </section>

                    <section>
                        <h3 className="font-semibold text-gray-800 mb-2">Feedback</h3>
                        <p>We welcome your feedback on the accessibility of PsychApp. Please let us know if you encounter any barriers:</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Email: psychapp@gmail.com</li>
                            <li>Phone: 1-800-THERAPY</li>
                        </ul>
                    </section>
                </div>
            )
        },
        cookies: {
            title: 'Cookie Policy',
            content: (
                <div className="space-y-4 text-gray-600">
                    <p className="text-sm text-gray-500">Last updated: January 12, 2026</p>
                    
                    <section>
                        <h3 className="font-semibold text-gray-800 mb-2">What Are Cookies?</h3>
                        <p>Cookies are small text files stored on your device when you visit a website. They help websites remember your preferences and improve your browsing experience.</p>
                    </section>

                    <section>
                        <h3 className="font-semibold text-gray-800 mb-2">How We Use Cookies</h3>
                        <p>We use cookies for the following purposes:</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li><strong>Essential Cookies:</strong> Required for the website to function properly</li>
                            <li><strong>Authentication:</strong> To keep you signed in to your account</li>
                            <li><strong>Preferences:</strong> To remember your settings and preferences</li>
                            <li><strong>Analytics:</strong> To understand how visitors use our website</li>
                        </ul>
                    </section>

                    <section>
                        <h3 className="font-semibold text-gray-800 mb-2">Managing Cookies</h3>
                        <p>You can control and manage cookies through your browser settings. Please note that disabling certain cookies may affect the functionality of our website.</p>
                    </section>

                    <section>
                        <h3 className="font-semibold text-gray-800 mb-2">Third-Party Cookies</h3>
                        <p>Some cookies are placed by third-party services that appear on our pages. We do not control these cookies and recommend reviewing the privacy policies of these third parties.</p>
                    </section>

                    <section>
                        <h3 className="font-semibold text-gray-800 mb-2">Updates to This Policy</h3>
                        <p>We may update this Cookie Policy from time to time. We encourage you to review this page periodically for the latest information.</p>
                    </section>
                </div>
            )
        }
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
            { name: 'Privacy Policy', key: 'privacy' },
            { name: 'Terms of Service', key: 'terms' },
            { name: 'Accessibility', key: 'accessibility' },
            { name: 'Cookie Policy', key: 'cookies' },
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
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Legal</h4>
                        <ul className="space-y-3">
                            {footerLinks.legal.map((link, index) => (
                                <li key={index}>
                                    <button 
                                        onClick={() => setActiveModal(link.key)}
                                        className="text-white hover:text-gray-200 transition-colors text-sm cursor-pointer text-left"
                                    >
                                        {link.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Legal Modals */}
                {Object.keys(legalContent).map((key) => (
                    <Dialog key={key} open={activeModal === key} onOpenChange={(open) => !open && setActiveModal(null)}>
                        <DialogContent className="max-w-2xl max-h-[80vh]">
                            <DialogHeader>
                                <DialogTitle className="text-xl font-bold text-customGreen">
                                    {legalContent[key].title}
                                </DialogTitle>
                            </DialogHeader>
                            <div className="max-h-[60vh] overflow-y-auto pr-4">
                                {legalContent[key].content}
                            </div>
                        </DialogContent>
                    </Dialog>
                ))}
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
