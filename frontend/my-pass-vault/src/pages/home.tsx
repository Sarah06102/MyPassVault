import React, { useState, useEffect } from 'react'
import NavBar from '../components/nav-bar'


interface HomeProps {
    title: string;
}

const Home: React.FC<HomeProps> = ({ title }) => {
  //Create usestate for each filter
  const [length, setLength] = useState<number>(10);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [includeUppercase, setIncludeUppercase] = useState(false);
  const [includeLowercase, setIncludeLowercase] = useState(false);
  const [includeNumbers, setIncludeNumbers] = useState(false);
  const [includeSymbols, setIncludeSymbols] = useState(false);
  
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
      {/* Nav bar */}
      <NavBar/>
      <div className="gap-40 md:flex-row min-h-screen flex-col flex bg-violet-50 justify-center items-center p-8 rounded">
      {/* Title */}
      <div className="flex flex-col items-start mx-20">
        <h1 className="text-5xl text-gray-800 font-extrabold mb-4">{ title }</h1>
        <h3 className="text-xl text-gray-400">Password security, made simple.</h3>
      </div>
    
      {/* Password Generator */}
        <div className="bg-white rounded-2xl shadow-lg p-15 w-full max-w-lg flex flex-col gap-6">
          {/* Checkbox options */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 whitespace-nowrap">
              <input className="accent-violet-600" id="uppercase" checked={includeUppercase} onChange={(e) => setIncludeUppercase(e.target.checked)} type="checkbox"/>
              <label htmlFor="uppercase" className="mb-1">Include Uppercase(A-Z)</label>
            </div>
            <div className="flex items-center gap-2 whitespace-nowrap">
              <input className="accent-violet-600" id="lowercase" checked={includeLowercase} onChange={(e) => setIncludeLowercase(e.target.checked)} type="checkbox"/>
              <label htmlFor="lowercase" className="mb-1">Include Lowercase(a-z)</label>
            </div>
            <div className="flex items-center gap-2 whitespace-nowrap">
              <input className="accent-violet-600" id="numbers" checked={includeNumbers} onChange={(e) => setIncludeNumbers(e.target.checked)} type="checkbox"/>
              <label htmlFor="numbers" className="mb-1">Include Numbers</label>
            </div>
            <div className="flex items-center gap-2 whitespace-nowrap">
              <input className="accent-violet-600" id="symbols" checked={includeSymbols} onChange={(e) => setIncludeSymbols(e.target.checked)} type="checkbox"/>
              <label htmlFor="symbols" className="mb-1">Include Symbols</label>
            </div>
          </div>

          <div className="mt-5 mb-5 flex flex-col items-center justify-center gap-4">
            <div className="flex items-center justify-center gap-3">
              <label htmlFor="lengthInput" className="mb-1 font-medium">Password Length:</label>
              {/* Editable length*/}
              <input className="w-14 p-1 border border-gray-300 rounded text-center shadow-inner" id="lengthInput" type="number" min="4" max="36" value={length} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {const newLength = Number(e.target.value); if (newLength >= 4 && newLength <= 36) {
                setLength(newLength);}}} />
              {/* Slider */}
              <input id="lengthSlider" className="accent-violet-600 w-64" type="range" min="4" max="36" value={length} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setLength(Number(e.target.value))}/>
            </div>

            {/* Show Password */}
            <div className="mt-6 flex justify-center text-center">
              <label className="font-medium text-lg">Your Password:</label>
              <span className="ml-2 shadow-inner border px-3 border-gray-300 rounded">{generatedPassword ? generatedPassword : null}</span>
            </div>
            <div className="flex gap-2 mt-10">
              <button className="cursor-pointer hover:bg-violet-700 transition-colors duration-300 flex bg-violet-600 text-white py-2 px-3 rounded-3xl" onClick={handleCopyPassword}>Copy password</button>
              <button className="cursor-pointer hover:bg-violet-200 transition-colors duration-300 flex bg-violet-100 text-violet-600 py-2 px-3 rounded-3xl" onClick={handleRefreshPassword}>Regenerate password</button>
            </div>
          </div>
        </div>  
      </div>
    </>
  );
};

export default Home;