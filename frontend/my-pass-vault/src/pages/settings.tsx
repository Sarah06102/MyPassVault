import React, { useState, useEffect } from 'react'
import DashboardNavBar from '../components/dashboard-nav-bar';
import { fetchWithRefresh } from '../api';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Settings: React.FC  = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string>('');
  const [userFirstName, setUserFirstName] = useState<string>('');
  const [userLastName, setUserLastName] = useState<string>('');
  const [userPassword, setUserPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  };

  useEffect(() => {
      const fetchUserProfile = async () => {
        try {
          const response = await fetchWithRefresh('/api/profile/');
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

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetchWithRefresh('/api/profile/update/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: userFirstName,
          last_name: userLastName,
          email: userEmail,
          password: userPassword || undefined,
        }),

      });
      if (response.ok) {
        alert('Profile updated successfully!');
        setUserPassword('');
      } else {
          alert('Failed to update profile');
      }
    } catch (err) {
        console.error('Error updating profile:', err);
    }
  };

  return (
    <>
      <div className="bg-violet-50 min-h-screen w-full overflow-hidden relative z-0">
        <DashboardNavBar first_name={userFirstName} last_name={userLastName} email={userEmail} onLogout={handleLogout} isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen}/>

        <div className="flex justify-center mt-40">
          <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-2xl flex flex-col gap-6">
            <h1 className="text-2xl font-bold text-center">Account Settings</h1>
            <form onSubmit={handleUpdateProfile} className="flex flex-col gap-4">
              
              <div className="flex flex-col gap-3">
                <label className="font-medium">First Name</label>
                <input className="border border-gray-300 rounded-full p-2" type="text" value={userFirstName} onChange={(e) => setUserFirstName(e.target.value)}/>
              </div>

              <div className="flex flex-col gap-3">
                <label className="font-medium">Last Name</label>
                <input className="border border-gray-300 rounded-full p-2" type="text" value={userLastName} onChange={(e) => setUserLastName(e.target.value)}/>
              </div>

              <div className="flex flex-col gap-">
                <label className="font-medium">Email</label>
                <input className="border border-gray-300 rounded-full p-2" type="email" value={userEmail} onChange={(e) => setUserEmail(e.target.value)}/>
              </div>

              <div className="flex flex-col gap-3 relative">
                <label className="font-medium">Password</label>
                <input className="border border-gray-300 rounded-full p-2 w-full" type={showPassword ? "text" : "password"} value={userPassword} onChange={(e) => setUserPassword(e.target.value)} placeholder="Leave blank to keep current"/>
              
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-14.25 transform -translate-y-1/2 text-lg text-gray-500 hover:text-black cursor-pointer">
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              <button type="submit" className="bg-violet-600 text-white cursor-pointer font-medium py-2 px-4 rounded-full hover:bg-violet-700 transition-colors duration-300">
                Save Changes
              </button>
            </form>
          </div>
        </div>
      </div>

    </>
  )
}

export default Settings;