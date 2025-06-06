import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaUserCircle } from "react-icons/fa";
import { FaBars, FaTimes } from 'react-icons/fa';
import Sidebar from './sidebar';

interface DashboardNavBarProps {
    email:string;
    onLogout: () => void;
    first_name: string;
    last_name: string;
    isSidebarOpen: boolean;
    setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const DashboardNavBar: React.FC<DashboardNavBarProps> = ({ first_name, last_name, email, onLogout, isSidebarOpen, setIsSidebarOpen }) => {
    const navigate = useNavigate(); 
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const [isMobile, setIsMobile] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
          const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
          };
          checkMobile();
          window.addEventListener('resize', checkMobile);
          return () => window.removeEventListener('resize', checkMobile);
    }, []);
    
    const handleNavigation = (sectionId: string) => {
        if (location.pathname === '/') {
            document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
        } else {
            navigate('/dashboard');
            setTimeout(() => {
                document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
        },  100);
        }
    };

    const handleLogoutClick = () => {
        onLogout();
        setTimeout(() => {
            navigate('/');
        }, 100);
    };

    const toggleDropdown = () => setShowDropdown(!showDropdown);
    
  return (
    <>
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <nav className="fixed top-0 left-0 w-full z-50">
            <div className="justify-between py-4 px-8 space-x-6 text-white flex items-center bg-violet-700">
                <div className="flex items-start gap-6 justify-center">
                    <button onClick={toggleSidebar} className="text-white text-2xl cursor-pointer focus:outline-none z-50 mt-0.5">
                        {isSidebarOpen ? <FaTimes /> : <FaBars />}
                    </button>
                    <button onClick={() => handleNavigation('dashboard')} className="cursor-pointer font-bold text-xl">MyPassVault</button>
                </div>
                <div className="relative group flex items-center gap-3">
                    {!isMobile && (
                        <>
                            <div className="flex items-center gap-2 p-2 rounded-xl cursor-pointer hover:bg-neutral-100/40 transition duration-300 ease-in-out">
                                <FaUserCircle size={24} />
                                <span className="text-sm font-medium">{email || 'Loading...'}</span>
                                <svg className="w-4 h-4 ml-1 transition-transform" fill="currentColor" viewBox="0 0 20 20"><path d="M5.5 7l4.5 4 4.5-4" /></svg>
                            </div>
                            <div className="absolute right-0 top-full w-58 bg-white text-black rounded-xl shadow-lg z-10 overflow-hidden opacity-0 pointer-events-none transition-opacity duration-300 group-hover:opacity-100 group-hover:pointer-events-auto">
                                <div className="text-center py-3 border-b border-gray-200 text-sm font-semibold">
                                    {first_name || last_name ? `${first_name} ${last_name}` : 'Loading...'}
                                </div>
                                <button onClick={handleLogoutClick} className="cursor-pointer w-full text-center py-2 hover:bg-gray-100 transition">
                                    Logout
                                </button>
                            </div>
                        </>
                    )}

                    {isMobile && (
                        <div className="relative flex flex-col">
                            <div className="flex items-center gap-2 p-2 rounded-xl cursor-pointer hover:bg-neutral-100/40 transition duration-300 ease-in-out" onClick={() => setShowDropdown(!showDropdown)}>
                                <FaUserCircle size={24} />
                                <span className="text-sm font-medium">{email || 'Loading...'}</span>
                                <svg className="w-4 h-4 ml-1 transition-transform" fill="currentColor" viewBox="0 0 20 20"><path d="M5.5 7l4.5 4 4.5-4" /></svg>
                            </div>
                            {showDropdown && (
                                <div className="absolute right-0 top-full mt-1 w-58 bg-white text-black rounded-xl shadow-lg z-10 overflow-hidden">
                                    <div className="text-center py-3 border-b border-gray-200 text-sm font-semibold">
                                        {first_name || last_name ? `${first_name} ${last_name}` : 'Loading...'}
                                    </div>
                                    <button onClick={handleLogoutClick} className="cursor-pointer w-full text-center py-2 hover:bg-gray-100 transition">
                                    Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </nav>
    </>
    )
};

export default DashboardNavBar;