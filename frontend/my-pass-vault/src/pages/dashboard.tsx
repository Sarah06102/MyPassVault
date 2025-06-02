import React, { useState, useEffect } from 'react'
import DashboardNavBar from '../components/dashboard-nav-bar'
import { FaSearch } from 'react-icons/fa';
import { fetchPassword, createPassword, deletePassword, updatePassword } from '../api';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Dashboard: React.FC = () => {
    const [userEmail, setUserEmail] = useState<string>('');
    const [userFirstName, setUserFirstName] = useState<string>('');
    const [userLastName, setUserLastName] = useState<string>('');
    const [passwordEntries, setPasswordEntries] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [newEntryData, setNewEntryData] = useState({site_name: '', email: '', password: '', notes: '',});
    const [showPasswords, setShowPasswords] = useState<{ [key: number]: boolean }>({});
    const [newEntryUpdates, setNewEntryUpdates] = useState<{ [key: number]: { email: string; password: string } }>({});
    const [editingEntry, setEditingEntry] = useState<{ [key: number]: boolean }>({});


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
        const fetchEntries = async () => {
            const token = localStorage.getItem('access_token');
            if (token) {
                try {
                    const data = await fetchPassword(token);
                    setPasswordEntries(data);
                } catch (err) {
                    console.error('Failed to fetch passwords:', err);
                }
            }
        };
        fetchUserProfile();
        fetchEntries();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
    };

    const handleAddPassword = async () => {
        const token = localStorage.getItem('access_token');
        if (!token) return;
        const newEntry = newEntryData;
        try {
            await createPassword(newEntry, token);
            const updatedEntries = await fetchPassword(token);
            setPasswordEntries(updatedEntries);
            setNewEntryData({ site_name: '', email: '', password: '', notes: '' }); 
        } catch(err) {
            console.error('Failed to add password:', err);
        }
    };

    const handleDeletePassword = async (id: number) => {
        const token = localStorage.getItem('access_token');
        if(!token) return;
        try {
            await deletePassword(id, token);
            const updatedEntries = await fetchPassword(token);
            setPasswordEntries(updatedEntries);
        } catch (err) {
            console.error('Failed to delete password', err);
        }
    };

    const handleUpdatePassword = async (id: number, entry: any) => {
        const token = localStorage.getItem('access_token');
        if (!token) return;
        try {
            const updatedData = {
                site_name: entry.site_name,
                email: newEntryUpdates[entry.id]?.email || entry.email,
                password: newEntryUpdates[entry.id]?.password || entry.password,
                notes: entry.notes || "", 
            };
            await updatePassword(id, updatedData, token);
            const updatedEntries = await fetchPassword(token);
            setPasswordEntries(updatedEntries);
        } catch (err) {
            console.error('Failed to update password:', err);
        }
    };

  return (
    <>
        <div className="bg-violet-50 min-h-screen w-full overflow-hidden">
            {/* Navbar */}
            <DashboardNavBar first_name={userFirstName} last_name={userLastName} email={userEmail} onLogout={handleLogout}/>

            {/* Greeting */}
            <div className="items-center mt-25 flex pl-15 gap-50">
                <div className="bg-white flex flex-col p-15 gap-3 border rounded-3xl border-gray-300 shadow-md">
                    <h1 className="font-extrabold text-3xl">Hi, {userFirstName || 'Loading...'}!</h1>
                    <p className="text-gray-500">Welcome to MyPassVault, your personal password manager.<br></br> Here, you can save your own passwords or generated passwords for different platforms.</p>
                </div>
                {/* Searchbar */}
                <div className="flex items-center border border-gray-300 rounded-full px-4 py-3 w-150 bg-white text-gray-700 placeholder-gray-400">
                    <FaSearch className="text-gray-400 mr-2" />
                    <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} type="text" placeholder="Search passwords..." className="flex-grow outline-none bg-transparent text-sm"></input>
                </div>
            </div>
            {/* Password Entries */}
            <div className="mt-10 px-10 grid grid-cols-1 md:grid-cols-3 gap-6">
                {passwordEntries.filter((entry) => entry.site_name.toLowerCase().includes(searchTerm.toLowerCase())).map((entry) => (
                    <div key={entry.id} className="rounded-xl bg-white p-4 shadow-md flex flex-col items-start gap-2">
                        {entry.logo_url && ( <img src={entry.logo_url} alt={entry.site_name} className="w-10 h-10 object-contain"/> )}
                        <h3 className="font-semibold">{entry.site_name}</h3>
                        
                        {editingEntry[entry.id] ? (
                            <input type="email" value={newEntryUpdates[entry.id]?.email || entry.email} onChange={(e) => setNewEntryUpdates((prev) => ({...prev, [entry.id]: {...prev[entry.id], email: e.target.value,},}))} className="text-sm text-gray-600 border rounded px-1 bg-white"/>
                        ) : (
                            <p className="text-sm text-gray-600">{entry.email}</p>
                        )}

                        <div className="flex items-center gap-2">
                            {editingEntry[entry.id] ? (
                                <input type={showPasswords[entry.id] ? "text" : "password"} value={newEntryUpdates[entry.id]?.password || entry.password} onChange={(e) => setNewEntryUpdates((prev) => ({...prev, [entry.id]: {...prev[entry.id], password: e.target.value,},}))} className="border pl-1 rounded-xl"/>
                            ) : (
                                <input type={showPasswords[entry.id] ? "text" : "password"} value={entry.password} readOnly className="border pl-1 rounded-xl bg-transparent"/>
                            )}
                            <button onClick={() => setShowPasswords((prev) => ({...prev, [entry.id]: !prev[entry.id],}))} className="text-gray-500 hover:text-black">{showPasswords[entry.id] ? <FaEyeSlash /> : <FaEye />}</button>
                        </div>

                        <div className="flex gap-5 items-center justify-center">
                            <button onClick={() => handleDeletePassword(entry.id)} className="cursor-pointer text-red-500 hover:bg-red-100 rounded-4xl transition-all duration-300 ease-in-out px-2 py-1">Delete</button>
                            
                            {editingEntry[entry.id] ? (
                                <button onClick={() => {handleUpdatePassword(entry.id, entry); setEditingEntry((prev) => ({ ...prev, [entry.id]: false }));}} className="text-violet-500 hover:bg-violet-100 cursor-pointer px-2 py-1 rounded-4xl transition-all duration-300 ease-in-out">Save</button>
                            ) : (
                                <button onClick={() => setEditingEntry((prev) => ({ ...prev, [entry.id]: true }))} className="text-violet-500 hover:bg-violet-100 cursor-pointer px-2 py-1 rounded-4xl transition-all duration-300 ease-in-out">Update</button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            {/* Add Entry */}
            <div className="px-10 mt-10 bg-white p-4 rounded-xl shadow-md flex flex-col gap-3 w-80">
                <h3 className="font-semibold text-lg">Add New Password</h3>
                <input type="text" placeholder="Site Name" value={newEntryData.site_name} onChange={(e) => setNewEntryData({ ...newEntryData, site_name: e.target.value })} className="border p-2 rounded"/>
                <input type="email" placeholder="Email" value={newEntryData.email} onChange={(e) => setNewEntryData({ ...newEntryData, email: e.target.value })} className="border p-2 rounded"/>
                <input type="password" placeholder="Password" value={newEntryData.password} onChange={(e) => setNewEntryData({ ...newEntryData, password: e.target.value })} className="border p-2 rounded"/>
                <textarea placeholder="Notes (optional)" value={newEntryData.notes} onChange={(e) => setNewEntryData({ ...newEntryData, notes: e.target.value })} className="border p-2 rounded"/>
                <button onClick={handleAddPassword} className="cursor-pointer bg-violet-500 hover:bg-violet-600 text-white px-4 py-2 rounded-4xl">Add Password</button>
            </div>
        </div>
    </>
  )
}

export default Dashboard;