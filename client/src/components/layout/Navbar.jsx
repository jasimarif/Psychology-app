import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { logout } from '@/lib/firebase';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { User, LogOut, UserCircle } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const coverageOptions = [
    "Aetna",
    "Anthem",
    "Cigna",
    "Optum",
    "Regence",
    "TRICARE",
    "Blue Cross Blue Shield",
    "Medicare and Medicare Advantage"
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="bg-white fixed top-0 left-0 right-0 z-10 font-nunito border-b">
      <div className="mx-auto px-6 lg:px-20">
        <div className="flex items-center justify-between h-[75px]">
          {/* Logo */}
          <div className="lg:flex-1 text-customGreen font-[1000] text-3xl font-averia cursor-pointer" onClick={() => navigate('/')}>
            PsychApp
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-5 font-semibold font-nunito">
            <NavigationMenu viewport={false}>
              <NavigationMenuList >
                {/* Services Dropdown */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-customGreen hover:bg-lightGreen transition-colors bg-transparent text-lg font-bold cursor-pointer px-3 py-2 rounded-md">
                    Services
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="w-[200px] p-2">
                      <li className="px-4 py-3 hover:bg-lightGreen rounded-md cursor-pointer transition-colors">
                        <Link to="/service1">Service 1</Link>
                      </li>
                      <li className="px-4 py-3 hover:bg-lightGreen rounded-md cursor-pointer transition-colors">
                        <Link to="/service2">Service 2</Link>
                      </li>
                      <li className="px-4 py-3 hover:bg-lightGreen rounded-md cursor-pointer transition-colors">
                        <Link to="/service3">Service 3</Link>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Coverage Dropdown */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-customGreen hover:bg-lightGreen transition-colors bg-transparent text-lg font-bold cursor-pointer px-3 py-2 rounded-md">
                    Coverage
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-[280px] p-4">
                      <h3 className="text-lg font-semibold text-customGreen mb-3">
                        Check your eligibility
                      </h3>
                      <ul className="space-y-1">
                        {coverageOptions.map((option, index) => (
                          <li
                            key={index}
                            className="px-4 py-2.5 hover:bg-lightGreen rounded-md cursor-pointer transition-colors text-customGreen"
                          >
                            <Link to={`/coverage/${option.toLowerCase().replace(/\s+/g, '-')}`}>
                              {option}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* For Clinicians Dropdown */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-customGreen hover:bg-lightGreen transition-colors bg-transparent text-lg font-bold cursor-pointer px-3 py-2 rounded-md">
                    For clinicians
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="w-[200px] p-2">
                      <li className="px-4 py-3 hover:bg-lightGreen rounded-md cursor-pointer transition-colors">
                        <Link to="/clinician1">Join our network</Link>
                      </li>
                      <li className="px-4 py-3 hover:bg-lightGreen rounded-md cursor-pointer transition-colors">
                        <Link to="/clinician2">Resources</Link>
                      </li>
                      <li className="px-4 py-3 hover:bg-lightGreen rounded-md cursor-pointer transition-colors">
                        <Link to="/clinician3">Support</Link>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* For Organizations - Simple Link */}
                <NavigationMenuItem>
                  <Link
                    to="/organizations"
                    className="text-customGreen hover:bg-lightGreen transition-colors py-2 px-3 rounded-md inline-block text-lg font-bold cursor-pointer"
                  >
                    For organizations
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Desktop Action Buttons */}
          <div className="hidden lg:flex flex-1 justify-end items-center gap-2">
            {!currentUser ? (
              <>
                <button className="px-6 py-2.5 text-customGreen rounded-full hover:bg-lightGreen transition-all duration-300 font-bold text-lg cursor-pointer " onClick={() => navigate('/login')}>
                  Login
                </button>
                <button onClick={() => navigate('/signup')} className="px-6 py-2.5 bg-customGreen font-bold text-white rounded-full hover:bg-opacity-90 transition-all duration-300  cursor-pointer">
                  Find a therapist
                </button>
              </>
            ) : (
              <NavigationMenu viewport={false}>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="text-customGreen hover:bg-lightGreen transition-colors bg-transparent text-lg font-bold cursor-pointer px-3 py-2 rounded-md">
                      <div className="flex items-center gap-2">
                        <UserCircle className="w-6 h-6" />
                        <span className="font-semibold">{currentUser.displayName || 'Profile'}</span>
                      </div>
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="right-0 left-auto">
                      <ul className="w-[200px] p-2">
                        <li
                          className="px-4 py-3 hover:bg-lightGreen rounded-md cursor-pointer transition-colors flex items-center gap-3"
                          onClick={() => navigate('/profile')}
                        >
                          <User className="w-5 h-5" />
                          <span>Personal Info</span>
                        </li>
                        <li
                          className="px-4 py-3 hover:bg-lightGreen rounded-md cursor-pointer transition-colors flex items-center gap-3"
                          onClick={handleLogout}
                        >
                          <LogOut className="w-5 h-5" />
                          <span>Logout</span>
                        </li>
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-customGreen p-2 cursor-pointer"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col gap-4">
              <Link to="/business" className="text-customGreen hover:bg-lightGreen transition-colors py-2 px-3 rounded-md cursor-pointer">
                Services
              </Link>
              <Link to="/about" className="text-customGreen hover:bg-lightGreen transition-colors py-2 px-3 rounded-md cursor-pointer">
                Coverage
              </Link>
              <Link to="/advice" className="text-customGreen hover:bg-lightGreen transition-colors py-2 px-3 rounded-md cursor-pointer">
                For clinicians
              </Link>
              <Link to="/therapist-jobs" className="text-customGreen hover:bg-lightGreen transition-colors py-2 px-3 rounded-md cursor-pointer">
                For organizations
              </Link>

              {!currentUser ? (
                <div className="flex flex-col gap-3 mt-4">
                  <button className="px-6 py-2.5 text-customGreen border-2 border-customGreen  rounded-full hover:bg-customGreen hover:text-white transition-all duration-300 font-medium" onClick={() => navigate('/login')}>
                    Login
                  </button>
                  <button onClick={() => navigate('/get-started')} className="px-6 py-2.5 bg-customGreen text-white rounded-full hover:bg-opacity-90 transition-all duration-300 font-medium">
                    Find a therapist
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-gray-200 ">
                  <div className="px-3 py-2 text-customGreen font-semibold">
                    {currentUser.displayName || currentUser.email}
                  </div>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigate('/profile');
                    }}
                    className="flex items-center gap-3 px-6 py-2.5 text-customGreen border-2 border-customGreen rounded-full hover:bg-customGreen hover:text-white transition-all duration-300 font-medium"
                  >
                    <User className="w-5 h-5" />
                    <span>Personal Info</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center gap-3 px-6 py-2.5 bg-customGreen text-white rounded-full hover:bg-opacity-90 transition-all duration-300 font-medium"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;