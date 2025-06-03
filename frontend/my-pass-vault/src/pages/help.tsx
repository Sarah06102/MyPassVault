import React, { useState, useEffect } from 'react'
import DashboardNavBar from '../components/dashboard-nav-bar';
import { fetchWithRefresh } from '../api';

const Help: React.FC = () => {
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

        <div className="flex justify-center mt-40  mb-20">
          <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-2xl flex flex-col gap-6">
            <h1 className="text-2xl font-bold text-center">Help & Support</h1>

            <section className="flex flex-col gap-2">
              <h2 className="text-lg font-semibold">Contact Us</h2>
              <p className="text-gray-600">
                Have questions or need help? Reach out to us at
                <a href="mailto:mypassvaulthelp@gmail.com" className="text-violet-600 underline ml-1">mypassvaulthelp@gmail.com</a>.
                We're here to help!
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="text-lg font-semibold">Troubleshooting</h2>
              <ul className="list-disc pl-5 text-gray-700">
                <li>Can't log in? Make sure your email and password are correct.</li>
                <li>Forgot your password? Use the password reset link on the login page.</li>
                <li>Issues with password generator? Try refreshing the page or clearing your cache.</li>
              </ul>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="text-lg font-semibold">Security Tips</h2>
              <ul className="list-disc pl-5 text-gray-700">
                <li>Always use strong, unique passwords for each account.</li>
                <li>Consider enabling two-factor authentication (2FA) for added security.</li>
                <li>Be cautious of phishing emails asking for your credentials.</li>
              </ul>
            </section>

            <section>
              <h2>More questions? Check out our {' '}
                <a href="/#faqs" target="_blank" rel="noopener noreferrer" className="text-violet-600 underline">FAQ section</a>
                {' '} on the homepage for quick answers to common questions!
              </h2>
            </section>

          </div>
        </div>
      </div> 
    </>
  )
}

export default Help;