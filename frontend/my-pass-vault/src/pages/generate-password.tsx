import React, { useEffect, useState } from 'react'
import DashboardNavBar from '../components/dashboard-nav-bar';
import { fetchWithRefresh } from '../api';

const GeneratePassword: React.FC = () => {
  const [length, setLength] = useState<number>(10);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [includeUppercase, setIncludeUppercase] = useState(false);
  const [includeLowercase, setIncludeLowercase] = useState(false);
  const [includeNumbers, setIncludeNumbers] = useState(false);
  const [includeSymbols, setIncludeSymbols] = useState(false);
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

  //Fetching generated password from backend
    const fetchPassword = async (length: number) => {
      try {
        //Get request to backend for password
        const response = await fetch(`/api/generate-password/?length=${length}&uppercase=${includeUppercase}&lowercase=${includeLowercase}&numbers=${includeNumbers}&symbols=${includeSymbols}`);
        //Convert fetched response into json
        const data: {password: string} = await response.json(); 
        console.log('Fetched password:', data.password);
        setGeneratedPassword(data.password);
      } catch(err) {
        console.error('Error fetching password:', err);
      } 
    };
  
    useEffect(() => {
      fetchPassword(length);
    }, [length, includeSymbols, includeUppercase, includeLowercase, includeNumbers]);
  
    const handleCopyPassword = () => {
      navigator.clipboard.writeText(generatedPassword).then(() => alert('Password copied to clipboard!')).catch((err) => console.error('Could not copy password: ', err));
    };
  
    const handleRefreshPassword = () => {
      fetchPassword(length);
    }
  
  return (
    <>
      <div className="bg-violet-50 min-h-screen w-full overflow-hidden relative z-0">
        <DashboardNavBar first_name={userFirstName} last_name={userLastName} email={userEmail} onLogout={handleLogout} isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen}/>
        
        {isSidebarOpen && (
            <div className={`fixed inset-0 backdrop-blur-sm bg-opacity-30 z-40 transition-opacity duration-300 ease-in-out ${isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}></div>
        )}
        
        <div className="flex justify-center mt-35">
          <div className="bg-white flex relative flex-col p-10 gap-3 border rounded-3xl border-gray-300 shadow-md">
            <h1 className="font-extrabold text-3xl">Generate Strong Passwords</h1>
            <p className="text-gray-500">Create secure, unique passwords for your accounts, and manage them all in one place.</p>
          </div>
        </div>

        {/* Checkbox options */}
        <div className="flex justify-center items-center mt-20 ">
          <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-2xl flex flex-col items-center border border-gray-300">
            <h2 className="font-bold text-2xl mb-4">Password Generator</h2>
            <div className="grid grid-cols-2 gap-x-10 gap-y-2 pt-3">
              <div className="flex items-center gap-2 whitespace-nowrap">
                <input className="accent-violet-600 cursor-pointer" id="uppercase" checked={includeUppercase} onChange={(e) => setIncludeUppercase(e.target.checked)} type="checkbox"/>
                <label htmlFor="uppercase" className="mb-1">Include Uppercase(A-Z)</label>
              </div>
              <div className="flex items-center gap-2 whitespace-nowrap">
                <input className="accent-violet-600 cursor-pointer" id="lowercase" checked={includeLowercase} onChange={(e) => setIncludeLowercase(e.target.checked)} type="checkbox"/>
                <label htmlFor="lowercase" className="mb-1">Include Lowercase(a-z)</label>
              </div>

              <div className="flex items-center gap-2 whitespace-nowrap">
                <input className="accent-violet-600 cursor-pointer" id="numbers" checked={includeNumbers} onChange={(e) => setIncludeNumbers(e.target.checked)} type="checkbox"/>
                <label htmlFor="numbers" className="mb-1">Include Numbers</label>
              </div>
                
              <div className="flex items-center gap-2 whitespace-nowrap">
                <input className="accent-violet-600 cursor-pointer" id="symbols" checked={includeSymbols} onChange={(e) => setIncludeSymbols(e.target.checked)} type="checkbox"/>
                <label htmlFor="symbols" className="mb-1">Include Symbols</label>
              </div>
            </div>

              <div className="mt-5 mb-5 flex flex-col items-center justify-center gap-4">
                <div className="flex items-center justify-center gap-3 pt-5">
                  <label htmlFor="lengthInput" className="text-lg whitespace-nowrap font-medium">Password Length:</label>
                  {/* Editable length*/}
                  <input className="w-14 p-1 border border-gray-300 rounded text-center shadow-inner" id="lengthInput" type="number" min="4" max="36" value={length} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {const newLength = Number(e.target.value); if (newLength >= 4 && newLength <= 36) {
                    setLength(newLength);}}} />
                  {/* Slider */}
                  <input id="lengthSlider" className="cursor-pointer accent-violet-600 w-64" type="range" min="4" max="36" value={length} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setLength(Number(e.target.value))}/>
                </div>

                {/* Show Password */}
                <div className="mt-6 flex justify-center text-center">
                  <label className="font-medium text-lg">Your Password:</label>
                  <span className="ml-2 shadow-inner border px-3 border-gray-300 rounded">{generatedPassword ? generatedPassword : null}</span>
                </div>
        
                <div className="flex justify-center items-center gap-2 mt-10 w-full">
                  <button className="cursor-pointer hover:bg-violet-700 transition-colors duration-300 bg-violet-600 text-white py-2 px-6 rounded-full" onClick={handleCopyPassword}>Copy password</button>
                  <button className="cursor-pointer hover:bg-violet-200 transition-colors duration-300 bg-violet-100 text-violet-600 py-2 px-6 rounded-full" onClick={handleRefreshPassword}>Regenerate password</button>
                </div>
              </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default GeneratePassword;