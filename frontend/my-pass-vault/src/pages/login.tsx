import React, { useState } from 'react';
import { login } from '../api';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/nav-bar';
import type { LoginData } from '../api';

const Login: React.FC = () => {
    const navigate = useNavigate();

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
            <div className="flex flex-col items-center justify-center min-h-screen">
                <form onSubmit={handleSubmit} className="bg-white rounded shadow-md w-full max-w-md space-y-4">
                    <div className="w-full">
                        <h1 className="rounded-t font-semibold text-lg w-full text-center  bg-violet-500 text-white p-3">Login To Your Account</h1>
                    </div>
                    <div className="flex flex-col px-8 py-1">
                        <label htmlFor="email" className="mb-1 text-sm font-medium">Email</label>
                        <input className="p-2 border border-gray-400 rounded-lg" value={formData.email} type="email" name="email" placeholder="Enter your email" onChange={handleChange} required/>
                    </div>
                    <div className="flex flex-col px-8 py-1">
                        <label htmlFor="password" className="mb-1 text-sm font-medium">Password</label>
                        <input className="p-2 border border-gray-400 rounded-lg" value={formData.password} type="password" name="password" placeholder="Enter your password" onChange={handleChange} required/>
                    </div>
                    <div className="flex justify-center mb-4 px-4 py-3">
                        <button type="submit" className="cursor-pointer bg-violet-500 text-white p-2  px-8 rounded-3xl hover:bg-violet-700 transition ease-in-out duration-200">Login</button>
                    </div>
                    {formError && <p className="text-red-500 text-sm text-center mb-3">{formError}</p>}
                </form>
            </div>
        </>
    );
};


export default Login;