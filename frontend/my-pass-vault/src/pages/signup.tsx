import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/nav-bar';
import { signup } from '../api'; 
import type { SignUpData } from '../api';


const SignUp: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<SignUpData>({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
    });
    
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const [formError, setFormError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await signup(formData);
            alert('Account created successfully!');
            navigate('/dashboard');
        } catch (err: any) {
            let errMessage = 'Signup failed: Unknown error.';
            
            if (err.data) {
                console.error('Signup error:', err.data);

                if (err.data.error?.email) {
                    errMessage = err.data.error.email[0];
                } else if (err.data.message) {
                    errMessage = err.data.message;
                }
            } else {
                errMessage = 'Signup failed: Network error.';
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
                        <h1 className="rounded-t font-semibold text-lg w-full text-center  bg-violet-500 text-white p-3">Create an Account</h1>
                    </div>
                    <div className="flex flex-col px-8 py-1">
                        <label htmlFor="first_name" className="mb-1 text-sm font-medium">First Name</label>
                        <input className="p-2 border border-gray-400 rounded-lg" value={formData.first_name} type="text" name="first_name" placeholder="Enter your first name" onChange={handleChange} required/>
                    </div>
                    <div className="flex flex-col px-8 py-1">
                        <label htmlFor="last_name" className="mb-1 text-sm font-medium">Last Name</label>
                        <input className="p-2 border border-gray-400 rounded-lg" value={formData.last_name} type="text" name="last_name" placeholder="Enter your last name" onChange={handleChange} required/>
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
                        <button type="submit" className="cursor-pointer bg-violet-500 text-white p-2  px-8 rounded-3xl hover:bg-violet-700 transition ease-in-out duration-200">Sign Up</button>
                    </div>
                    {formError && <p className="text-red-500 text-sm mb-3 text-center">{formError}</p>}
                </form>
            </div>
        </>
    );
};

export default SignUp;