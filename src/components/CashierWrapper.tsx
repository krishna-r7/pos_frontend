import React, { useState, useEffect } from 'react';
import { Menu, Bell } from 'lucide-react';
import menuItems from "@/sidebar/sidebarCashier";
import { useNavigate } from 'react-router-dom';


interface LayoutWrapperProps {
  children?: React.ReactNode;
}

const CashierWrapper: React.FC<LayoutWrapperProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // Close sidebar on mobile when clicking outside or on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNavClick = (href: string) => {
    // console.log('Navigating to:', href);
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
    navigate(href);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

  
      <aside
        className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white transition-transform duration-300 ease-in-out lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-gray-800">
            <h2 className="text-xl font-bold">My App</h2>
          </div>
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <li key={index}>
                    <button
                      onClick={() => handleNavClick(item.href)}
                      className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors text-left"
                    >
                      <Icon size={20} />
                      <span>{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </aside>


      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
   
        <header className="bg-white shadow-sm z-30">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
                aria-label="Toggle menu"
              >
                <Menu size={24} />
              </button>
              <h1 className="text-lg sm:text-xl font-semibold text-gray-800">Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative" aria-label="Notifications">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  A
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-4 sm:p-6">
          {children || (
            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold mb-4">Welcome to Your Dashboard</h2>
              <p className="text-gray-600 mb-4 text-sm sm:text-base">
                This is a responsive layout with a collapsible sidebar and header.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div
                    key={item}
                    className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <h3 className="font-semibold mb-2">Card {item}</h3>
                    <p className="text-sm text-gray-600">
                      Sample content for card {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default CashierWrapper;
