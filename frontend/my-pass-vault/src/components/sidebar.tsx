import React from 'react'
import { useNavigate } from 'react-router-dom';
import { FaTimes, FaKey } from 'react-icons/fa';
import { IoShieldCheckmark, IoSettingsSharp } from "react-icons/io5";
import { RiPencilFill } from "react-icons/ri";
import { MdOutlineHelp } from "react-icons/md";

interface SidebarProps {
    isOpen:boolean;
    onClose: () => void;
}

const Sidebar: React.FC<SidebarProps>= ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const handleClick = (path: any) => {
        navigate(path);
        onClose(); 
      };
  return (
    <>
        {/* Sidebar Panel */}
        <div className={`fixed top-0 left-0 h-full w-80 bg-violet-700 shadow-lg z-50 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-violet-600">
                <button onClick={onClose} className="text-white text-xl">
                    <FaTimes />
                </button>
                <h2 className="text-white font-bold text-xl">MyPassVault</h2>
            </div>
            {/* Navigation */}
            <div className="flex flex-col gap-6 px-6 py-8">
                <button onClick={() => handleClick('/dashboard')} className="flex items-center gap-3 text-white text-lg font-medium hover:bg-violet-500 px-4 py-2 rounded-lg transition cursor-pointer">
                    <FaKey />Passwords
                </button>

                <button onClick={() => handleClick('/security')} className="flex items-center gap-3 text-white text-lg font-medium hover:bg-violet-500 px-4 py-2 rounded-lg transition cursor-pointer">
                    <IoShieldCheckmark />Security
                </button>

                <button onClick={() => handleClick('/generate-password')} className="flex items-center gap-3 text-white text-lg font-medium hover:bg-violet-500 px-4 py-2 rounded-lg transition cursor-pointer">
                    <RiPencilFill />Generate Password
                </button>

                <button onClick={() => handleClick('/settings')} className="flex items-center gap-3 text-white text-lg font-medium hover:bg-violet-500 px-4 py-2 rounded-lg transition cursor-pointer">
                    <IoSettingsSharp />Settings
                </button>

                <button onClick={() => handleClick('/help')} className="flex items-center gap-3 text-white text-lg font-medium hover:bg-violet-500 px-4 py-2 rounded-lg transition cursor-pointer">
                    <MdOutlineHelp />Help
                </button>
            </div>
            
        </div>
    </>
  )
}

export default Sidebar;