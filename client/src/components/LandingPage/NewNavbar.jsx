import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { logout } from '@/lib/firebase';
import { Menu, X, ChevronDown, UserCircle, LogOut, User, Sparkles } from 'lucide-react';
import { BriefcaseIcon } from '@/components/icons/DuoTuneIcons';

const NewNavbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const navLinks = [
        {
            label: 'Services',
            items: [
                { name: 'Individual Therapy', href: '/' },
                { name: 'Couples Therapy', href: '/' },
                { name: 'Teen Therapy', href: '/' },
                { name: 'Psychiatry', href: '/' },
            ]
        },
        {
            label: 'How It Works',
            href: '#how-it-works'
        },
        {
            label: 'Our Therapists',
            href: '#therapists'
        },
        {
            label: 'Pricing',
            href: '#pricing'
        },
    ];

    return (
        <>
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 font-nunito select-none ${
                isScrolled 
                    ? 'bg-white/95 backdrop-blur-md' 
                    : 'bg-transparent'
            }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo */}
                        <div 
                            className="flex items-center gap-2 cursor-pointer group"
                            onClick={() => navigate('/')}
                        >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 `}>
                            <BriefcaseIcon className={`w-8 h-8 ${isScrolled ? 'text-customGreen' : 'text-white'}`} />
                            </div>
                            <span className={`text-2xl font-bold transition-colors duration-300 ${
                                isScrolled ? 'text-customGreen' : 'text-white'
                            }`}>
                                PsychApp
                            </span>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center gap-1">
                            {navLinks.map((link, index) => (
                                <div 
                                    key={index}
                                    className="relative"
                                    onMouseEnter={() => link.items && setActiveDropdown(index)}
                                    onMouseLeave={() => setActiveDropdown(null)}
                                >
                                    {link.items ? (
                                        <>
                                            <button className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                                                isScrolled 
                                                    ? 'text-gray-700 hover:text-customGreen hover:bg-customGreen-50' 
                                                    : 'text-white/90 hover:text-white hover:bg-white/10'
                                            }`}>
                                                {link.label}
                                                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${
                                                    activeDropdown === index ? 'rotate-180' : ''
                                                }`} />
                                            </button>
                                            
                                            {/* Dropdown */}
                                            <div className={`absolute top-full left-0 pt-2 transition-all duration-300 ${
                                                activeDropdown === index 
                                                    ? 'opacity-100 translate-y-0 pointer-events-auto' 
                                                    : 'opacity-0 -translate-y-2 pointer-events-none'
                                            }`}>
                                                <div className="bg-white rounded-2xl shadow-xl shadow-black/10 border border-gray-100 py-2 min-w-[200px] overflow-hidden">
                                                    {link.items.map((item, itemIndex) => (
                                                        <Link
                                                            key={itemIndex}
                                                            to={item.href}
                                                            className="block px-4 py-3 text-gray-700 hover:bg-customGreen-50 hover:text-customGreen transition-colors text-sm font-medium"
                                                        >
                                                            {item.name}
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <a 
                                            href={link.href}
                                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                                                isScrolled 
                                                    ? 'text-gray-700 hover:text-customGreen hover:bg-customGreen-50' 
                                                    : 'text-white/90 hover:text-white hover:bg-white/10'
                                            }`}
                                        >
                                            {link.label}
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Desktop CTA */}
                        <div className="hidden lg:flex items-center gap-3">
                            {!currentUser ? (
                                <>
                                    <button 
                                        onClick={() => navigate('/login')}
                                        className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 cursor-pointer select-none ${
                                            isScrolled 
                                                ? 'text-gray-700 hover:text-customGreen' 
                                                : 'text-white hover:text-white/80'
                                        }`}
                                    >
                                        Sign In
                                    </button>
                                    <button 
                                        onClick={() => navigate('/signup')}
                                        className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                                            isScrolled 
                                                ? 'bg-customGreen hover:bg-customGreenHover text-white cursor-pointer select-none' 
                                                : 'bg-white text-gray-900 hover:bg-white/90 hover:scale-105'
                                        }`}
                                    >
                                        Get Started Free
                                    </button>
                                </>
                            ) : (
                                <div 
                                    className="relative"
                                    onMouseEnter={() => setActiveDropdown('user')}
                                    onMouseLeave={() => setActiveDropdown(null)}
                                >
                                    <button className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                                        isScrolled 
                                            ? 'bg-customGreen-50 text-customGreen-700' 
                                            : 'bg-white/20 text-white'
                                    }`}>
                                        <UserCircle className="w-5 h-5" />
                                        <span className="text-sm font-medium">{currentUser.displayName || 'Profile'}</span>
                                        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${
                                            activeDropdown === 'user' ? 'rotate-180' : ''
                                        }`} />
                                    </button>
                                    
                                    <div className={`absolute top-full right-0 pt-2 transition-all duration-300 ${
                                        activeDropdown === 'user' 
                                            ? 'opacity-100 translate-y-0 pointer-events-auto' 
                                            : 'opacity-0 -translate-y-2 pointer-events-none'
                                    }`}>
                                        <div className="bg-white rounded-2xl shadow-xl shadow-black/10 border border-gray-100 py-2 min-w-[180px]">
                                            <button
                                                onClick={() => navigate('/dashboard')}
                                                className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-customGreen-50 hover:text-customGreen transition-colors text-sm font-medium"
                                            >
                                                <User className="w-4 h-4" />
                                                Dashboard
                                            </button>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors text-sm font-medium"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                Sign Out
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button 
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className={`lg:hidden p-2 rounded-xl transition-all duration-300 ${
                                isScrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'
                            }`}
                        >
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            <div className={`fixed inset-0 z-40 lg:hidden transition-all duration-500 font-nunito ${
                isMobileMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'
            }`}>
                {/* Backdrop */}
                <div 
                    className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-500 ${
                        isMobileMenuOpen ? 'opacity-100' : 'opacity-0'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                />
                
                {/* Menu Panel */}
                <div className={`absolute top-0 right-0 h-full w-full max-w-sm bg-white transition-transform duration-500 ${
                    isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
                }`}>
                    <div className="p-6 pt-24">
                        <div className="space-y-1">
                            {navLinks.map((link, index) => (
                                <div key={index}>
                                    {link.items ? (
                                        <div className="py-3">
                                            <div className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">
                                                {link.label}
                                            </div>
                                            {link.items.map((item, itemIndex) => (
                                                <Link
                                                    key={itemIndex}
                                                    to={item.href}
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                    className="block py-2 text-gray-700 hover:text-customGreen transition-colors font-medium"
                                                >
                                                    {item.name}
                                                </Link>
                                            ))}
                                        </div>
                                    ) : (
                                        <a 
                                            href={link.href}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="block py-3 text-gray-700 hover:text-customGreen transition-colors font-medium text-lg"
                                        >
                                            {link.label}
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                        
                        <div className="mt-8 pt-8 border-t border-gray-100 space-y-3">
                            {!currentUser ? (
                                <>
                                    <button 
                                        onClick={() => { navigate('/login'); setIsMobileMenuOpen(false); }}
                                        className="w-full py-3 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                                    >
                                        Sign In
                                    </button>
                                    <button 
                                        onClick={() => { navigate('/signup'); setIsMobileMenuOpen(false); }}
                                        className="w-full py-3 bg-customGreen text-white font-semibold rounded-xl cursor-pointer select-none"
                                    >
                                        Get Started Free
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button 
                                        onClick={() => { navigate('/dashboard'); setIsMobileMenuOpen(false); }}
                                        className="w-full py-3 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                                    >
                                        Dashboard
                                    </button>
                                    <button 
                                        onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                                        className="w-full py-3 text-red-600 font-semibold rounded-xl hover:bg-red-50 transition-colors"
                                    >
                                        Sign Out
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default NewNavbar;
