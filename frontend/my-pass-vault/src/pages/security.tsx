import React, { useState, useEffect } from 'react'
import DashboardNavBar from '../components/dashboard-nav-bar';
import { fetchWithRefresh } from '../api';
import zxcvbn from 'zxcvbn';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Security: React.FC  = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string>('');
  const [userFirstName, setUserFirstName] = useState<string>('');
  const [userLastName, setUserLastName] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordToCheck, setPasswordToCheck] = useState('');
  const [strengthScore, setStrengthScore] = useState<number>(0);
  const [crackTime, setCrackTime] = useState<string>('');
  const [feedback, setFeedback] = useState<string>('');
  
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  };
  
  useEffect(() => {
      const fetchUserProfile = async () => {
        try {
          const response = await fetchWithRefresh('/profile/');
          if (!response.ok) throw new Error('Failed to fetch profile');
            const data = await response.json();
              setUserEmail(data.email);
              setUserFirstName(data.first_name);
              setUserLastName(data.last_name);
          } catch (err) {
              console.error('Profile fetch error:', err);
          }
        };       
        fetchUserProfile();
  }, []);

  useEffect(() => {
    const result = zxcvbn(passwordToCheck);
    setStrengthScore(result.score);
    setCrackTime(String(result.crack_times_display.offline_slow_hashing_1e4_per_second));
    setFeedback(result.feedback.warning || result.feedback.suggestions.join(' ') || 'Strong password!');
  }, [passwordToCheck]);

  const getStrengthLabel = (score: number) => {
    switch (score) {
      case 0:
      case 1:
        return 'Very Weak';
      case 2:
        return 'Weak';
      case 3: 
        return 'Moderate';
      case 4:
        return 'Strong';
      default:
        return '';
    }
  };

  const getStrengthColor = (score:number) => {
    switch (score) {
      case 0:
      case 1:
        return 'bg-red-500';
      case 2:
        return 'bg-yellow-500';
      case 3: 
        return 'bg-blue-500';
      case 4:
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };
  
  return (
    <>
      <div className="bg-violet-50 min-h-screen w-full overflow-hidden relative z-0">
        <DashboardNavBar first_name={userFirstName} last_name={userLastName} email={userEmail} onLogout={handleLogout} isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen}/>
        <div className="flex justify-center mt-40">
          <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-2xl flex flex-col gap-6">
            <h1 className="text-2xl font-bold text-center">Password Strength Checker</h1>
            <p className="text-gray-500 text-center text-md mb-3">How secure is your password? Enter your password to find out.</p>
            <div className="relative flex items-center">
              <input type={showPassword ? "text" : "password"} placeholder="Enter password" value={passwordToCheck} onChange={(e) => setPasswordToCheck(e.target.value)} className="border border-gray-300 p-2 rounded-full w-full mb-2"/>
              <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="cursor-pointer absolute right-4 top-3.5 text-gray-400 hover:text-gray-700">{showPassword ? <FaEyeSlash /> : <FaEye />}</button>
            </div>
            {passwordToCheck && (
              <div className={`p-2 text-center w-full rounded text-white transition-colors duration-300 ${getStrengthColor(strengthScore)}`}>
                {getStrengthLabel(strengthScore)}
              </div>
            )}

            {passwordToCheck && ( 
              <div className="mt-2 text-gray-700 flex flex-col items-center">
                <p>Time to crack your password: {crackTime}</p>
                <p className="italic text-sm mt-1">{feedback || 'Strong password!'}</p>
              </div>
            )}
            {passwordToCheck && (
              <div className="w-full h-2 bg-gray-300 rounded-full mt-2 overflow-hidden">
                  <div className={`h-2 rounded-full transition-all duration-700 ease-in-out ${passwordToCheck ? getStrengthColor(strengthScore) : 'bg-transparent'}`} style={{  width: passwordToCheck ? `${(strengthScore + 1) * 20}%` : '0%' }}></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
 
export default Security;