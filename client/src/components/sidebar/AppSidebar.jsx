import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  DashboardIcon,
  QuestionnaireIcon,
  ProfileIcon,
  PsychologistsIcon,
  BookingsIcon,
  BriefcaseIcon
} from '../icons/DuoTuneIcons';

const AppSidebar = ({ onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { icon: DashboardIcon, label: 'Dashboard', path: '/dashboard' },
    { icon: PsychologistsIcon, label: 'Psychologists', path: '/browse-psychologists' },
    { icon: BookingsIcon, label: 'My Bookings', path: '/my-bookings' },
    { icon: QuestionnaireIcon, label: 'Questionnaire', path: '/questionnaire' },
    { icon: ProfileIcon, label: 'Profile', path: '/profile' },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    if (onClose) onClose();
  };

  return (
    <div className="w-[250px] h-screen flex flex-col py-6 px-4 bg-[#F7F0EA] font-nunito">
      {/* Logo */}
      <div className="mb-10 px-2 select-none">
        <Link to="/" className="flex items-center gap-2" onClick={() => onClose && onClose()}>
          <BriefcaseIcon className="w-8 h-8 text-customGreen" />
          <span className="text-2xl font-extrabold text-customGreen font-averia">PsychApp</span>
        </Link>
      </div>

      {/* Menu */}
      <div className="flex-1 flex flex-col gap-1 select-none">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={`flex items-center gap-3 px-4 py-3 font-medium cursor-pointer rounded-lg transition-colors ${
                isActive
                  ? 'bg-[#EEE7DE] text-customGreen font-semibold'
                  : 'text-customGray  hover:bg-[#EEE7DE]'
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? 'text-customGreen' : 'text-customGray group-hover:text-gray-600'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

    </div>
  );
};

export default AppSidebar;
