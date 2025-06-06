import React, { useState } from 'react';
import { login } from '../api';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/nav-bar';
import type { LoginData } from '../api';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState<LoginData>({
        email: '',
        password: '',
    });
      const [formError, setFormError] = useState<string | null>(null);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const data = await login(formData);
            localStorage.setItem('access_token', data.access);
            alert('Login successful!');
            navigate('/dashboard');
        } catch (err: any) {
            let errMessage = 'Login failed: Unknown error.';
            
            if (err.data) {
                console.error('Login error:', err.data);
                    
                if (err.data.message) {
                    errMessage = err.data.message;
                }
            } else {
                errMessage = 'Login failed: Network error.';
            }
            setFormError(errMessage);
        }
    };

    return (
        <>
            <NavBar/>
            <div className="bg-violet-50 flex flex-col items-center justify-center min-h-screen px-4 sm:px-0">
                <form onSubmit={handleSubmit} className="bg-white rounded shadow-md w-full max-w-md space-y-4">
                    <div className="w-full">
                        <h1 className="rounded-t font-semibold text-lg w-full text-center  bg-violet-500 text-white p-3">Login To Your Account</h1>
                    </div>
                    <div className="flex flex-col px-8 py-1 pt-5">
                        <label htmlFor="email" className="mb-1 text-sm font-medium">Email</label>
                        <input className="p-2 border border-gray-400 rounded-full" id="email" value={formData.email} type="email" name="email" placeholder="Enter your email" onChange={handleChange} required/>
                    </div>
                    <div className="flex flex-col px-8 py-1">
                        <label htmlFor="password" className="mb-1 text-sm font-medium">Password</label>
                        <div className="relative flex items-center">
                            <input className="p-2 border border-gray-400 rounded-full w-full pr-10" type={showPassword ? "text" : "password"} value={formData.password} name="password" id="password" placeholder="Enter your password" onChange={handleChange} required/>
                            <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="cursor-pointer absolute right-3 text-gray-400 hover:text-gray-700">{showPassword ? <FaEyeSlash /> : <FaEye />}</button>
                        </div>
                    </div>
                    <div className="flex justify-center mt-3 mb-3">
                        <a href="/reset-password" className="text-violet-600 hover:underline text-sm">Forgot Password?</a>
                    </div>
                    <div className="flex justify-center mb-4 px-4 py-3">
                        <button type="submit" className="cursor-pointer bg-violet-500 text-white p-2 px-13 rounded-3xl hover:bg-violet-700 transition ease-in-out duration-200">Login</button>
                    </div>
                    
                    {formError && <p className="text-red-500 text-sm text-center mb-3">{formError}</p>}
                </form>
            </div>
        </>
    );
};


export default Login;