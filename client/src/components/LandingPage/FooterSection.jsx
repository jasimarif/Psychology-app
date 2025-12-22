import React, { useState } from 'react';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export default function FooterSection() {
    const [email, setEmail] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Email submitted:', email);
    };

    return (
        <div className="bg-lightGreen pb-4">
            {/* Newsletter Section */}
            <div className="pb-12 sm:pb-16 px-4 sm:px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-averia text-customGreen mb-6 sm:mb-8">
                        Stay in the loop
                    </h2>

                    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-3 sm:mb-4">
                        <input
                            type="email"
                            placeholder="Enter email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full sm:w-80 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg bg-white text-customGreen placeholder-customGreen focus:outline-none font-nunito"
                            required
                        />
                        <button
                            type="submit"
                            className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 bg-customGreen text-white rounded-lg hover:bg-customGreen cursor-pointer transition-colors font-medium font-nunito"
                        >
                            Submit
                        </button>
                    </form>

                    <p className="text-xs sm:text-sm text-customGreen font-nunito px-4">
                        By signing up, I agree to the{' '}
                        <a href="#" className="underline hover:text-customGreen">
                            Terms of Use
                        </a>{' '}
                        and to receive emails from PsychApp.
                    </p>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-customGreen text-teal-100 pt-8 sm:pt-12 lg:pt-16 px-4 sm:px-8 lg:px-20 mx-4 sm:mx-8 rounded-lg">
                <div className="w-full">
                    <div className="flex flex-col lg:flex-row gap-8 lg:gap-4">
                        {/* Download the app */}
                        <div className="w-full lg:w-1/3 flex justify-center lg:justify-start">
                            {/* Phone mockup */}
                            <div className="hidden lg:block pt-0 lg:pt-20">
                                {/* <div className="w-40 h-96 bg-white rounded-3xl p-4 shadow-xl">
                                    <div className="bg-gray-100 rounded-2xl h-full p-4 flex flex-col">
                                        <div className="flex justify-between items-center mb-4 text-xs text-gray-600">
                                            <span>9:41</span>
                                            <div className="flex gap-1">
                                                <div className="w-4 h-3 bg-gray-400 rounded-sm"></div>
                                            </div>
                                        </div>

                                        <div className="flex-1 flex flex-col">
                                            <h4 className="text-lg font-semibold text-gray-900 mb-1">Welcome, Taylor</h4>
                                            <p className="text-xs text-gray-600 mb-4">We're so glad you're here</p>

                                            <div className="bg-white rounded-lg p-3 mb-auto">
                                                <p className="text-xs font-semibold text-gray-900 mb-2">Your support team</p>
                                                <div className="flex items-start gap-2">
                                                    <div className="w-8 h-8 bg-teal-600 rounded-full shrink-0"></div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="text-xs font-semibold text-gray-900">Taylor</span>
                                                            <span className="text-xs text-green-600 bg-green-100 px-2 rounded">Today</span>
                                                        </div>
                                                        <p className="text-xs text-gray-600">May I'm not sure how I feel about it. I think I will need some...</p>
                                                        <span className="text-xs text-gray-400">4 days</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <button className="w-full bg-teal-800 text-white py-2 rounded-lg text-sm font-medium">
                                                Book a session
                                            </button>
                                        </div>
                                    </div>
                                </div> */}
                                <img src="/phone.png" alt="Phone Mockup" className="w-48 sm:w-60 lg:w-72 object-cover" />
                            </div>
                        </div>
                        <div className="w-full">
                            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12 lg:gap-20'>

                                {/* Company */}
                                <div>
                                    <h3 className="text-white text-xl font-medium mb-6 font-averia">Company</h3>
                                    <ul className="space-y-4 font-nunito text-sm text-white/70">
                                        <li><a href="#" className="hover:text-white transition-colors">Reviews</a></li>
                                        <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                                        <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
                                        <li><a href="#" className="hover:text-white transition-colors">Research</a></li>
                                        <li><a href="#" className="hover:text-white transition-colors">Investors</a></li>
                                        <li><a href="#" className="hover:text-white transition-colors">Affiliate program</a></li>
                                        <li><a href="#" className="hover:text-white transition-colors">Tell-a-friend program</a></li>
                                    </ul>
                                </div>

                                {/* Resources */}
                                <div>
                                    <h3 className="text-white text-xl font-medium mb-6 font-averia">Resources</h3>
                                    <ul className="space-y-4 font-nunito text-sm text-white/70">
                                        <li><a href="#" className="hover:text-white transition-colors">Help center</a></li>
                                        <li><a href="#" className="hover:text-white transition-colors">Health collective</a></li>
                                        <li><a href="#" className="hover:text-white transition-colors">Mental health topics</a></li>
                                        <li><a href="#" className="hover:text-white transition-colors">Mental health conditions</a></li>
                                        <li><a href="#" className="hover:text-white transition-colors">Free mental health tests</a></li>
                                        <li><a href="#" className="hover:text-white transition-colors">Self-guided app</a></li>
                                    </ul>
                                </div>

                                {/* Legal */}
                                <div>
                                    <h3 className="text-white text-xl font-medium mb-6 font-averia">Legal</h3>
                                    <ul className="space-y-4 font-nunito text-sm text-white/70">
                                        <li><a href="#" className="hover:text-white transition-colors">Privacy policy</a></li>
                                        <li><a href="#" className="hover:text-white transition-colors">Teenspace privacy policy</a></li>
                                        <li><a href="#" className="hover:text-white transition-colors">Terms of use</a></li>
                                        <li><a href="#" className="hover:text-white transition-colors">Accessibility</a></li>
                                        <li><a href="#" className="hover:text-white transition-colors">Privacy settings</a></li>
                                        <li><a href="#" className="hover:text-white transition-colors">Notice of US state privacy rights</a></li>
                                    </ul>
                                </div>
                            </div>

                        {/* Bottom section */}
                        <div className="pt-8 sm:pt-12 lg:pt-16 pb-6 sm:pb-8">
                            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 sm:gap-8">
                                {/* Contact info */}
                                <div className="flex flex-col sm:flex-row gap-6 sm:gap-12 lg:gap-30 text-xs sm:text-sm w-full lg:w-auto">
                                    <div className="text-center sm:text-left">
                                        <p className="font-semibold text-white mb-1 font-nunito">Business Correspondence</p>
                                        <p className='font-nunito text-white'>PO Box 669</p>
                                        <p className='font-nunito text-white'>Portsmouth, NH 03802</p>
                                    </div>
                                    <div className="text-center sm:text-left">
                                        <p className="font-semibold text-white mb-1 font-nunito">Payer Claims</p>
                                        <p className='font-nunito text-white'>2578 Broadway #607</p>
                                        <p className='font-nunito text-white'>New York, NY 10025</p>
                                    </div>
                                </div>

                                {/* Social icons */}
                                <div className="flex gap-6 sm:gap-10 lg:gap-20 justify-center lg:justify-end w-full lg:w-auto">
                                    <a href="#" className="hover:text-white transition-colors" aria-label="Facebook">
                                        <Facebook size={20} className="sm:w-6 sm:h-6" />
                                    </a>
                                    <a href="#" className="hover:text-white transition-colors" aria-label="Twitter">
                                        <Twitter size={20} className="sm:w-6 sm:h-6" />
                                    </a>
                                    <a href="#" className="hover:text-white transition-colors" aria-label="Instagram">
                                        <Instagram size={20} className="sm:w-6 sm:h-6" />
                                    </a>
                                    <a href="#" className="hover:text-white transition-colors" aria-label="LinkedIn">
                                        <Linkedin size={20} className="sm:w-6 sm:h-6" />
                                    </a>
                                </div>
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
            </footer>

            <div className='w-full text-center text-customGreen font-nunito mt-6 sm:mt-8 mb-3 sm:mb-4 text-xs sm:text-sm px-4'>
                If you are in a life threatening situation - don't use this site. Call <span className='font-semibold'>911</span> or use <span className='font-semibold'>these resources</span> to get immediate help.
            </div>
        </div>
    );
}