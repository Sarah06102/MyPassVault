import React, { useState, useEffect } from 'react'
import NavBar from '../components/nav-bar'


interface HomeProps {
    title: string;
}

const Home: React.FC<HomeProps> = ({ title }) => {
  const [length, setLength] = useState<number>(10);
  const [generatedPassword, setGeneratedPassword] = useState('');
  
  //Fetching generated password from backend
  const fetchPassword = async (length: number) => {
    try {
      //Get request to backend for password
      const response = await fetch(`/api/generate-password/?length=${length}`);
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
  }, [length]);

  return (
    <>
      {/* Nav bar */}
      <NavBar/>
      <div className="h-screen flex justify-between items-center p-8 ml-20">
      {/* Title */}
        <h1 className="font-bold text-5xl">{ title }</h1>
      
      {/* Password Generator */}
        <div className="flex flex-col items-center justify-center shadow-md mr-10 p-20">
          {/* Filter options */}
          <div className="flex flex-wrap justify-center space-x-5 space-y- gap-3">
            <div className="flex items-center space-x-3">
              <input id="uppercase" type="checkbox"/>
              <label htmlFor="uppercase" className="mb-1">Include Uppercase(A-Z)</label>
            </div>
            <div className="flex items-center space-x-3">
              <input id="lowercase" type="checkbox"/>
              <label htmlFor="lowercase" className="mb-1">Include Lowercase(a-z)</label>
            </div>
            <div className="flex items-center space-x-3">
              <input id="numbers" type="checkbox"/>
              <label htmlFor="numbers" className="mb-1">Include Numbers</label>
            </div>
            <div className="flex items-center space-x-3">
              <input id="symbols" type="checkbox"/>
              <label htmlFor="symbols" className="mb-1">Include Symbols</label>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-center justify-center gap-4">
            <div className="flex items-center justify-center gap-3">
              <label htmlFor="lengthInput" className="mb-1 font-medium">Password Length:</label>
              {/* Editable length*/}
              <input className="w-14 p-1 border border-gray-300 rounded text-center shadow-inner" id="lengthInput" type="number" min="4" max="36" value={length} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {const newLength = Number(e.target.value); if (newLength >= 4 && newLength <= 36) {
                setLength(newLength);}}} />
              {/* Slider */}
              <input id="lengthSlider" className="w-64" type="range" min="4" max="36" value={length} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setLength(Number(e.target.value))}/>
            </div>

            {/* Show Password */}
            <div className="mt-4 flex justify-center">
              <label className="font-medium text-lg">Your Password:</label>
              <span className="ml-2 shadow-inner border px-3 border-gray-300 rounded">{generatedPassword ? generatedPassword : null}</span>
            </div>
          </div>  
        </div>  
      </div>
    </>
  );
};

export default Home;