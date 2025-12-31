import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import AppSidebar from '../sidebar/AppSidebar';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SearchIcon, BellIcon, FileIcon, DashboardIcon } from '../icons/DuoTuneIcons';
import { useAuth } from '@/context/AuthContext';
import { Menu } from 'lucide-react';

const Layout = ({ children }) => {
  const location = useLocation();
  const { currentUser } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const generateBreadcrumbs = () => {
    const pathnames = location.pathname.split('/').filter((x) => x);
    const psychologist = location.state?.psychologist;

    const getLabel = (path, index) => {
      const labels = {
        'dashboard': 'Dashboard',
        'psychologist': 'Psychologists',
        'my-bookings': 'My Bookings',
        'questionnaire': 'Questionnaire',
        'profile': 'Profile',
        'browse-psychologists': 'Psychologists',
      };

      // If this is a psychologist ID (after /psychologist/), show psychologist name
      if (pathnames[index - 1] === 'psychologist' && psychologist?.name) {
        return psychologist.name;
      }

      return labels[path] || path.charAt(0).toUpperCase() + path.slice(1);
    };

    const getLink = (value, index) => {
      // For psychologist route, link to browse-psychologists instead
      if (value === 'psychologist') {
        return '/browse-psychologists';
      }
      return `/${pathnames.slice(0, index + 1).join('/')}`;
    };

    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild className="flex items-center gap-2">
              <Link to="/dashboard">
                <DashboardIcon className="h-4 w-4 text-gray-400" />
                Dashboard
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          {pathnames.length === 0 || (pathnames.length === 1 && pathnames[0] === 'dashboard') ? (
             <BreadcrumbItem>
               <BreadcrumbPage>Default</BreadcrumbPage>
             </BreadcrumbItem>
          ) : (
            pathnames.map((value, index) => {
              if (value === 'dashboard' && index === 0) return null;

              const to = getLink(value, index);
              const isLast = index === pathnames.length - 1;
              const label = getLabel(value, index);

              return (
                <React.Fragment key={to + index}>
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage>{label}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link to={to}>{label}</Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {!isLast && <BreadcrumbSeparator />}
                </React.Fragment>
              );
            })
          )}
        </BreadcrumbList>
      </Breadcrumb>
    );
  };

  return (
    <div className="flex h-screen bg-[#F7F0EA] font-nunito ">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Desktop and Mobile Drawer */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <AppSidebar onClose={() => setSidebarOpen(false)} />
      </div>

      <main className="flex-1 overflow-y-auto w-full">
        {/* Top Header */}
        <header className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 bg-[#F7F0EA] sticky top-0 z-10">
          {/* Left: Mobile Menu + Breadcrumbs */}
          <div className="flex items-center gap-3">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-500 hover:bg-white rounded-lg transition-colors"
            >
              <Menu className="h-6 w-6" />
            </button>

        

            {/* Breadcrumbs - Hidden on very small screens */}
            <div className="hidden sm:block">
              {generateBreadcrumbs()}
            </div>
          </div>

          {/* Center: Search (Optional, based on image) */}
          {/* <div className="flex-1 max-w-md mx-4 lg:mx-8 hidden md:block">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border-none bg-white focus:ring-1 focus:ring-customGreen outline-none text-sm"
              />
            </div>
          </div> */}

          {/* Right: Actions & Profile */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button className="p-2 text-gray-500 hover:bg-white rounded-lg transition-colors hidden sm:block">
              <BellIcon className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
            <button className="p-2 text-gray-500 hover:bg-white rounded-lg transition-colors hidden sm:block">
              <FileIcon className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>

            <div className="flex items-center gap-2 sm:gap-3 sm:pl-2 sm:border-l sm:border-gray-200">
              <div className="text-right hidden md:block">
                <p className="text-sm font-semibold text-gray-900">
                  {currentUser?.displayName || 'User'}
                </p>
                <p className="text-xs text-gray-500">
                  {currentUser?.email || 'user@example.com'}
                </p>
              </div>
              <Avatar className="h-8 w-8 sm:h-10 sm:w-10 border-2 border-white shadow-sm cursor-pointer">
                <AvatarImage src={currentUser?.photoURL} alt={currentUser?.displayName} />
                <AvatarFallback className="bg-customGreen text-white">
                  {currentUser?.displayName?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="px-4 sm:px-6 lg:px-8 pb-8 relative">
          {/* Sticky corners that stay visible on scroll */}
          <div className="sticky top-[72px] z-5 h-0 pointer-events-none">
            <div className="absolute left-0 w-6 h-6 bg-[#F7F0EA]">
              <div className="w-full h-full bg-white rounded-tl-3xl"></div>
            </div>
            <div className="absolute right-0 w-6 h-6 bg-[#F7F0EA]">
              <div className="w-full h-full bg-white rounded-tr-3xl"></div>
            </div>
          </div>

          <div className="bg-white rounded-t-3xl min-h-[calc(100vh-100px)]">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
