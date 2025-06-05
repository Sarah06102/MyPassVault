import React, { useState, useEffect } from 'react'
import NavBar from '../components/nav-bar'
import { MdSettings } from "react-icons/md";
import { MdAdminPanelSettings } from "react-icons/md";
import { FaCircleCheck } from "react-icons/fa6";
import { FaLockOpen } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import { FaArrowRightLong } from "react-icons/fa6";
import { Footer } from '../components/footer';
import { fetchWithRefresh } from '../api';


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
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  }

  useEffect(() => {
    const scrollToHash = () => {
      if (window.location.hash) {
        const id = window.location.hash.substring(1);
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };
  
    scrollToHash();
  }, []);
  
  //Fetching generated password from backend
  const fetchPassword = async (length: number) => {
    try {
      //Get request to backend for password
      const response = await fetchWithRefresh(`/generate-password/?length=${length}&uppercase=${includeUppercase}&lowercase=${includeLowercase}&numbers=${includeNumbers}&symbols=${includeSymbols}`);
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

  const questionsForFaq = [
    {
      question: 'Why should I use a random password generator?',
      answer: 'Randomly generated passwords are harder to guess and crack than personal or reused passwords, enhancing your security.'
    },
    {
      question: 'Do you store my generated passwords?',
      answer: "No, passwords generated in the tool are not stored or logged. However, you can optionally save them to your account if you’re logged in."
    },
    {
      question: 'What happens if I forget my generated password?',
      answer: "If you haven’t saved it in your MyPassVault account, you will need to generate a new one. We recommend securely storing passwords."
    },
    {
      question: 'Is this tool free?',
      answer: 'Yes! You can generate strong, secure passwords for free.'
    },
    {
      question: 'Why should I avoid reusing passwords?',
      answer: 'Reusing passwords across multiple accounts increases the risk of credential stuffing attacks and data breaches.'
    },
    {
      question: 'Can I use this on my mobile device?',
      answer: 'Yes! MyPassVault is mobile-friendly, and you can also download our app for an even smoother experience.'
    },
  ]

  return (
    <>
      {/* Nav bar */}
      <NavBar/>
      <div className="bg-violet-50 overflow-x-hidden">
        <section id="main">
          <div className="gap-40 md:flex-row min-h-screen flex-col flex justify-center items-center p-8 rounded">
          {/* Title */}
            <div className="flex flex-col items-start mx-20">
              <h1 className="text-5xl text-gray-800 font-extrabold mb-4">{ title }</h1>
              <h3 className="text-lg text-gray-500 pl-3">Password security, made simple.</h3>
              <div className="flex gap-4 mt-10 ml-10">
                <FaLockOpen size={50} className="text-gray-600"/><FaArrowRightLong size={50}/><FaLock size={50} className="text-gray-600"/>
              </div>
            </div>
        
            {/* Password Generator */}
            <div className="bg-white rounded-2xl shadow-lg p-18 flex flex-col gap-6">
              {/* Checkbox options */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
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
                <div className="flex items-center justify-center gap-3">
                  <label htmlFor="lengthInput" className="mb-1 whitespace-nowrap font-medium">Password Length:</label>
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
                <div className="flex gap-2 mt-10">
                  <button className="cursor-pointer hover:bg-violet-700 transition-colors duration-300 flex bg-violet-600 text-white py-2 px-3 rounded-full" onClick={handleCopyPassword}>Copy password</button>
                  <button className="cursor-pointer hover:bg-violet-200 transition-colors duration-300 flex bg-violet-100 text-violet-600 py-2 px-3 rounded-full" onClick={handleRefreshPassword}>Regenerate password</button>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* About Section */}
        <section className="mt-30 text-center scroll-mt-90" id="about">
          <h2 className="text-3xl font-bold mb-4">What is MyPassVault?</h2>
          <p className="max-w-xl mx-auto text-gray-600">
            MyPassVault is a secure and easy-to-use password generator that helps you create strong passwords to protect your online accounts.
          </p>
        </section>  
        {/* Tools Section */}
        <section className="scroll-mt-50 mt-50 text-center bg-violet" id="tools">
          <h2 className="text-3xl font-extrabold text-gray-800 mb-10 text-center">Tools</h2>
          <ul className="space-y-6 text-center flex flex-col items-center border border-gray-400 shadow-inner shadow-gray-300/80 bg-white rounded-2xl m-10 p-5 max-w-4xl mx-auto">
            <li className="flex flex-col items-center gap-4">
                  <h3 className="text-xl font-semibold text-gray-800 italic underline-animation flex justify-center items-center gap-3"><MdSettings size={40}/> Password Generator</h3>
                  <p className="text-gray-600 ">Generate secure and random passwords effortlessly.</p>
            </li>
            <li className="flex flex-col items-center gap-4">
                <h3 className="text-xl font-semibold text-gray-800 italic underline-animation flex justify-center items-center gap-3"><FaCircleCheck size={30}/>Password Checker</h3>
                <p className="text-gray-600">Assess the strength of your passwords in real-time.</p>
            </li>
            <li className="flex flex-col items-center gap-4">
                <h3 className="text-xl font-semibold text-gray-800 italic underline-animation flex justify-center items-center gap-3"><MdAdminPanelSettings size={40}/>Password Manager</h3>
                <p className="text-gray-600">Store and manage your passwords securely and conveniently.</p>
            </li>
          </ul>
        </section>
        {/* Features Section */}
        <section className="scroll-mt-20 text-center p-30 mt-20" id="features">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-10">Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
                <h3 className="text-xl font-semibold mb-2">Robust Password Generator</h3>
                <p className="text-gray-600">Create secure, random passwords to keep your accounts safe.</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
                <h3 className="text-xl font-semibold mb-2">Customizable Length</h3>
                <p className="text-gray-600">Choose the perfect password length that fits your needs.</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
                <h3 className="text-xl font-semibold mb-2">Flexible Character Set</h3>
                <p className="text-gray-600">Mix and match uppercase, lowercase, numbers, and symbols.</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
                <h3 className="text-xl font-semibold mb-2">Instant Copy</h3>
                <p className="text-gray-600">Copy your password to the clipboard with a single click.</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
                <h3 className="text-xl font-semibold mb-2">Quick Refresh</h3>
                <p className="text-gray-600">Generate a brand new password in seconds.</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
                <h3 className="text-xl font-semibold mb-2">Secure Storage</h3>
                <p className="text-gray-600">Save your passwords to your MyPassVault account for future use.</p>
              </div>
            </div>
          </div>
        </section>
        {/* FAQ Section */}
        <section className="scroll-mt-24 max-w-2xl mx-auto p-6" id="faqs">
          <div className="flex flex-col items-center">
            <h2 className="text-3xl font-bold text-center">Frequently Asked Questions</h2>
            <h3 className="text-lg text-gray-500 mb-10 mt-3">Answers to question you may have below!</h3>
          </div>
          
          <div className="space-y-4">
            {questionsForFaq.map((faq, index) => (
              <div key={index} className="bg-white border rounded-lg border-gray-300 overflow-hidden shadow-sm">
                <button onClick={() => toggleFAQ(index)} className="w-full text-left flex justify-between items-center p-4 font-medium text-gray-700 hover:text-violet-300 cursor-pointer">
                  <span>{faq.question}</span>
                  <svg className={`transform transition-transform duration-300 ${activeIndex === index ? 'rotate-180' : ''}`} width="20" height="20" viewBox="0 0 20 20">
                    <path fill="currentColor" d="M6 8l4 4 4-4"/>
                  </svg>
                </button>
                <div className={`px-4 pb-4 text-gray-600 overflow-hidden transition-[max-height,opacity] duration-400 ease-in-out ${activeIndex === index ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                  {faq.answer}
                </div>
              </div>
            ))}
          </div>
        </section>
        {/* Footer */}
        <Footer />
      </div>
    </>
  );
};

export default Home;