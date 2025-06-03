import React, { useState, useEffect } from 'react'
import DashboardNavBar from '../components/dashboard-nav-bar'
import { FaSearch } from 'react-icons/fa';
import { fetchPassword, createPassword, deletePassword, updatePassword, fetchWithRefresh } from '../api';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Dashboard: React.FC = () => {
    const [userEmail, setUserEmail] = useState<string>('');
    const [userFirstName, setUserFirstName] = useState<string>('');
    const [userLastName, setUserLastName] = useState<string>('');
    const [passwordEntries, setPasswordEntries] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [newEntryData, setNewEntryData] = useState({site_name: '', email: '', password: '', notes: '', domain_extension: '.com'});
    const [showPasswords, setShowPasswords] = useState<{ [key: number]: boolean }>({});
    const [newEntryUpdates, setNewEntryUpdates] = useState<{ [key: number]: { email: string; password: string } }>({});
    const [editingEntry, setEditingEntry] = useState<{ [key: number]: boolean }>({});
    const [showAddForm, setShowAddForm] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
        const fetchEntries = async () => {     
            try {
                const data = await fetchPassword();
                setPasswordEntries(data);
              } catch (err) {
                console.error('Failed to fetch passwords:', err);
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
        try {
            await createPassword(newEntryData);
            const updatedEntries = await fetchPassword();
            setPasswordEntries(updatedEntries);
            setNewEntryData({ site_name: '', email: '', password: '', notes: '', domain_extension: '.com'}); 
        } catch(err) {
            console.error('Failed to add password:', err);
        }
    };

    const handleDeletePassword = async (id: number) => {
        try {
            await deletePassword(id);
            const updatedEntries = await fetchPassword();
            setPasswordEntries(updatedEntries);
        } catch (err) {
            console.error('Failed to delete password', err);
        }
    };

    const handleUpdatePassword = async (id: number, entry: any) => {
        try {
            const updatedData = {
                site_name: entry.site_name,
                email: newEntryUpdates[entry.id]?.email || entry.email,
                password: newEntryUpdates[entry.id]?.password || entry.password,
                notes: entry.notes || "", 
            };
            await updatePassword(id, updatedData);
            const updatedEntries = await fetchPassword();
            setPasswordEntries(updatedEntries);
        } catch (err) {
            console.error('Failed to update password:', err);
        }
    };

  return (
    <>
        
        <div className="bg-violet-50 min-h-screen w-full overflow-hidden relative z-0">
            {/* Navbar */}
            <DashboardNavBar first_name={userFirstName} last_name={userLastName} email={userEmail} onLogout={handleLogout} isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen}/>
            {isSidebarOpen && (
                <div className={`fixed inset-0 backdrop-blur-sm bg-opacity-30 z-40 transition-opacity duration-300 ease-in-out ${isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}></div>
            )}
            {/* Greeting */}
            <div className="items-center mt-25 flex pl-15 gap-12">
                <div className="bg-white flex relative flex-col p-15 gap-3 border rounded-3xl border-gray-300 shadow-md w-120">
                    <h1 className="font-extrabold text-3xl">Hi, {userFirstName || 'Loading...'}!</h1>
                    <p className="text-gray-500">Welcome to MyPassVault, your personal password manager.<br></br> Here, you can save your own passwords or generated passwords for different platforms.</p>
                </div>
                {/* Searchbar & Add Password Form */}
                <div className="relative flex flex-col md:flex-row gap-4 items-start">
                    <div className="flex items-center gap-2">
                        <div className="flex flex-col gap-8">
                            <div className="flex items-center border border-gray-300 rounded-full px-4 py-3 w-110 bg-white text-gray-700 placeholder-gray-400">
                                <FaSearch className="text-gray-400 mr-2"/>
                                <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} type="text" placeholder="Search passwords..." className="flex-grow outline-none bg-transparent text-sm"></input>
                            </div>
                            <button onClick={() => setShowAddForm((prev) => !prev)} className="cursor-pointer bg-violet-500 hover:bg-violet-600 ml-32 text-white py-2 w-45 rounded-4xl transition-all">{showAddForm ? "Close Form" : "Add New Password"}</button>
                        </div>
                        
                        {showAddForm && (
                            <div className="absolute pt-17 right-0 left-125 p-4 flex flex-col justify-start">
                                <div className="mt-10 bg-white p-4 rounded-xl shadow-md border border-gray-300 flex flex-col gap-3 w-80"> 
                                    <h3 className="font-semibold text-lg">Add New Password</h3>
                                    
                                    <div className="flex gap-2">
                                        <input type="text" placeholder="Site Name" value={newEntryData.site_name} onChange={(e) => setNewEntryData({ ...newEntryData, site_name: e.target.value })} className="border p-2 rounded"/>
                                        <select value={newEntryData.domain_extension || ".com"} onChange={(e) => setNewEntryData({...newEntryData, domain_extension: e.target.value,})} className="border p-2 rounded">
                                            <option value=".com">.com</option>
                                            <option value=".ca">.ca</option>
                                            <option value=".org">.org</option>
                                            <option value=".net">.net</option>
                                            <option value=".edu">.edu</option>
                                        </select>
                                    </div>
                                    <input type="email" placeholder="Email" value={newEntryData.email} onChange={(e) => setNewEntryData({ ...newEntryData, email: e.target.value })} className="border p-2 rounded"/>
                                    <input type="password" placeholder="Password" value={newEntryData.password} onChange={(e) => setNewEntryData({ ...newEntryData, password: e.target.value })} className="border p-2 rounded"/>
                                    <textarea placeholder="Notes (optional)" value={newEntryData.notes} onChange={(e) => setNewEntryData({ ...newEntryData, notes: e.target.value })} className="border p-2 rounded"/>
                                    <button onClick={handleAddPassword} className="cursor-pointer bg-violet-500 hover:bg-violet-600 text-white px-4 py-2 rounded-4xl">Add Password</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {/* Password Entries */}
            <div className="mt-50 ml-6 px-10 grid grid-cols-3 md:grid-cols-5 gap-x-1 gap-y-6 mb-20">
                {passwordEntries.filter((entry) => entry.site_name.toLowerCase().includes(searchTerm.toLowerCase())).map((entry) => (
                    <div key={entry.id} className="rounded-xl bg-white p-4 shadow-md flex flex-col items-start gap-2 w-65">
                        
                        <div className="flex items-center gap-3 mb-2">
                            {entry.logo_url && ( <img src={entry.logo_url} alt={entry.site_name} className="w-8 h-8 object-contain"/> )}
                            <h3 className="font-semibold">{entry.site_name}</h3>
                        </div>
                        {editingEntry[entry.id] ? (
                            <input type="email" value={newEntryUpdates[entry.id]?.email || entry.email} onChange={(e) => setNewEntryUpdates((prev) => ({...prev, [entry.id]: {...prev[entry.id], email: e.target.value,},}))} className="text-sm text-gray-600 border rounded px-1 bg-white"/>
                        ) : (
                            <p className="text-sm text-gray-600">{entry.email}</p>
                        )}

                        <div className="flex items-center gap-2">
                            {editingEntry[entry.id] ? (
                                <input type={showPasswords[entry.id] ? "text" : "password"} value={newEntryUpdates[entry.id]?.password || entry.password} onChange={(e) => setNewEntryUpdates((prev) => ({...prev, [entry.id]: {...prev[entry.id], password: e.target.value,},}))} className="border pl-1 rounded-xl"/>
                            ) : (
                                <input type={showPasswords[entry.id] ? "text" : "password"} value={entry.password} readOnly className=" pl-1 rounded-xl bg-transparent"/>
                            )}
                            <button onClick={() => setShowPasswords((prev) => ({...prev, [entry.id]: !prev[entry.id],}))} className="text-gray-500 hover:text-black cursor-pointer">{showPasswords[entry.id] ? <FaEyeSlash /> : <FaEye />}</button>
                        </div>

                        <div className="flex gap-5 items-center justify-center">
                            <button onClick={() => handleDeletePassword(entry.id)} className="cursor-pointer text-red-500 hover:bg-red-100 rounded-4xl transition-all duration-300 ease-in-out px-2 py-1">Delete</button>
                            
                            {editingEntry[entry.id] ? (
                                <button onClick={() => {handleUpdatePassword(entry.id, entry); setEditingEntry((prev) => ({ ...prev, [entry.id]: false }));}} className="text-violet-500 hover:bg-violet-100 cursor-pointer px-2 py-1 rounded-4xl transition-all duration-300 ease-in-out">Save</button>
                            ) : (
                                <button onClick={() => setEditingEntry((prev) => ({ ...prev, [entry.id]: true }))} className="text-violet-500 hover:bg-violet-100 cursor-pointer px-2 py-1 rounded-4xl transition-all duration-300 ease-in-out">Update</button>
                            )}
                        </div>
                        <p className="text-xs text-gray-400">Created: {new Date(entry.created_at).toLocaleString()}</p>
                    </div>
                ))}
            </div>      
        </div>
    </>
  )
}

export default Dashboard;