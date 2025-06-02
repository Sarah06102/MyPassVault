import React, { useState, useEffect } from 'react'
import DashboardNavBar from '../components/dashboard-nav-bar';
import { fetchWithRefresh } from '../api';

const Security: React.FC  = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string>('');
  const [userFirstName, setUserFirstName] = useState<string>('');
  const [userLastName, setUserLastName] = useState<string>('');
  
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
  
  return (
    <>
      <div className="bg-violet-50 min-h-screen w-full overflow-hidden relative z-0">
        <DashboardNavBar first_name={userFirstName} last_name={userLastName} email={userEmail} onLogout={handleLogout} isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen}/>
      </div>

    </>
  )
}

export default Security;