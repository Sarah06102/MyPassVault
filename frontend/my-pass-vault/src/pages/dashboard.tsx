import React, { useState, useEffect } from 'react'
import DashboardNavBar from '../components/dashboard-nav-bar'

const Dashboard: React.FC = () => {
    const [userEmail, setUserEmail] = useState<string>('');
    const [userFirstName, setUserFirstName] = useState<string>('');
    const [userLastName, setUserLastName] = useState<string>('');

    useEffect(() => {
        const fetchUserProfile = async () => {
            const token = localStorage.getItem('access_token');
            console.log(localStorage.getItem('access_token'));
            if (!token) {
                console.warn('No access token found.');
                return;
              }
            try {
                let response = await fetch('/api/profile/', {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (response.status === 401) {
                    const refresh = localStorage.getItem('refresh_token');
                    const refreshResponse = await fetch('/api/token/refresh/', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ refresh }),
                    });
                    if (refreshResponse.ok) {
                        const refreshData = await refreshResponse.json();
                        localStorage.setItem('access_token', refreshData.access);
                        
                        response = await fetch('/api/profile/', {
                            method: 'GET',
                            headers: {
                              Authorization: `Bearer ${refreshData.access}`,
                              'Content-Type': 'application/json',
                            },
                          });
                        } else {
                            localStorage.removeItem('access_token');
                            localStorage.removeItem('refresh_token');
                            window.location.href = '/login';
                            return;
                        }
                    }
                if (!response.ok) throw new Error('Failed to fetch profile');
                
                const data = await response.json();
                setUserEmail(data.email);
                setUserFirstName(data.first_name);
                setUserLastName(data.last_name);
            } catch (err: any) {
                console.error('Profile fetch error', err);
            }
        };
        fetchUserProfile();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
    };

  return (
    <>
        <div className="bg-violet-50 min-h-screen w-full overflow-hidden">
            {/* Navbar */}
            <DashboardNavBar first_name={userFirstName} last_name={userLastName} email={userEmail} onLogout={handleLogout}/>
            {/* Searchbar */}

            {/* Greeting */}
            <div className="mt-25 flex pl-15">
                <div className="bg-white flex flex-col p-15 gap-3 border rounded-3xl border-gray-300 shadow-md">
                    <h1 className="font-extrabold text-3xl">Hi, {userFirstName || 'Loading...'}!</h1>
                    <p className="text-gray-500">Welcome to MyPassVault, your personal password manager.<br></br> Here, you can save your own passwords or generated passwords for different platforms.</p>
                </div>
            </div>
        

            {/* Company cards */}

        </div>
        
    </>
  )
}

export default Dashboard