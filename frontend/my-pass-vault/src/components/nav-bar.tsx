import React from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { FaApple } from "react-icons/fa";
import { MdAccountCircle } from "react-icons/md";


const NavBar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();  

    const handleNavigation = (sectionId: string) => {
        if (location.pathname === '/') {
          document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
        } else {
          navigate('/');
          setTimeout(() => {
            document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }
      };
    
  return (
    <nav className="fixed top-0 left-0 w-full z-50">
        <div className="justify-between py-4 px-8 space-x-6 text-white flex items-center bg-violet-700">
            <button onClick={() => handleNavigation('main')} className="cursor-pointer font-bold text-xl">MyPassVault</button>
            <div className="flex items-center gap-3">
                <button onClick={() => handleNavigation('about')} className="cursor-pointer font-medium hover:bg-neutral-100/40 rounded-lg p-2 transition-all ease-in-out duration-300">About</button>
                <button onClick={() => handleNavigation('tools')} className="cursor-pointer font-medium hover:bg-neutral-100/40 rounded-lg p-2 transition-all ease-in-out duration-300">Tools</button>
                <button onClick={() => handleNavigation('features')} className="cursor-pointer font-medium hover:bg-neutral-100/40 rounded-lg p-2 transition-all ease-in-out duration-300">Features</button>
                <button onClick={() => handleNavigation('faqs')} className="cursor-pointer font-medium hover:bg-neutral-100/40 rounded-lg p-2 transition-all ease-in-out duration-300">FAQs</button>
                <div className="relative group">
                    <span className="items-center flex cursor-pointer font-medium hover:bg-neutral-100/40 rounded-lg p-2 transition-all ease-in-out duration-300 gap-1.5"><MdAccountCircle />Account</span>
                    <div className="p-5 group-hover:pointer-events-auto pointer-events-none left-1/2 -translate-x-1/2 absolute opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transform transition-all duration-300 flex flex-col bg-white text-black rounded shadow-lg min-w-max">
                        <Link to="/signup" className="px-4 py-2 hover:underline rounded-t transition">New to MyPassVault? Sign Up</Link>
                        <Link to="/login" className="px-4 py-2 hover:underline rounded-b transition">Already have an account? Log In</Link>
                    </div>
                </div>
                <a href="https://www.apple.com/ca/app-store/" className="flex cursor-pointer font-medium rounded-lg hover:underline bg-black p-2 transition-all ease-in-out duration-300 gap-1.5 items-center" target="_blank" rel="noopener noreferrer"><FaApple />Download App</a>
            </div>
        </div>
    </nav>
  )
}

export default NavBar;