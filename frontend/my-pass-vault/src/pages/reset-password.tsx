import React, { useState, useEffect } from 'react';
import NavBar from '../components/nav-bar';
const apiUrl = import.meta.env.VITE_API_URL;

const ResetPassword: React.FC = () => {
    const [emailSent, setEmailSent] = useState(false);
    const [enteredEmail, setEnteredEmail] = useState('');
    const [csrfToken, setCsrfToken] = useState('');

    useEffect(() => {
        const fetchCsrfToken = async () => {
            const res = await fetch(`${apiUrl}/csrf/`, { credentials: 'include' });
            const data = await res.json();
            if (data.csrfToken) setCsrfToken(data.csrfToken);
        };
        fetchCsrfToken();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!csrfToken) {
            alert('CSRF token not available. Please refresh and try again.');
            return;
        }

        try {
            const formData = new URLSearchParams();
            formData.append('email', enteredEmail);
            const response = await fetch(`${apiUrl}/password_reset/`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'X-CSRFToken': csrfToken, 'Referer': 'https://my-pass-vault.vercel.app/reset-password', },
              credentials: 'include',
              body: formData.toString(),
            });
            if (response.ok) {
                setEmailSent(true);
            } else {
                alert('There was an issue sending the reset email.');
            }
        } catch (err) {
            console.error(err);
            alert('An error occurred.');
        }
    };

    return (
        <>
            <NavBar />
            <div className="flex flex-col items-center justify-center min-h-screen bg-violet-50">
                {emailSent ? (
                    <div className="bg-white rounded shadow-md w-full max-w-md space-y-4">
                        <div className="text-center space-y-4 p-10">
                            <h2 className="text-lg font-bold text-violet-600">Reset link sent to {enteredEmail}</h2>
                            <p className="text-gray-500">If you don’t receive an email, please check your spam folder or try again.</p>
                            <button onClick={() => {setEmailSent(false);}} className="bg-violet-500 cursor-pointer text-white py-2 px-6 rounded-3xl hover:bg-violet-700 transition ease-in-out duration-200">
                                Resend link
                            </button>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="bg-white rounded shadow-md w-full max-w-md space-y-4">
                        <div className="w-full">
                            <h1 className="rounded-t font-semibold text-lg w-full text-center bg-violet-500 text-white p-3">Reset Your Password</h1>
                        </div>

                        <p className="text-gray-500 mb-6 text-center">Enter your email to reset your password.</p>

                        <div className="flex flex-col px-8 py-1">
                            <label htmlFor="email" className="mb-1 text-sm font-medium">Email</label>
                            <input type="email" value={enteredEmail} onChange={(e) => setEnteredEmail(e.target.value)} placeholder="Enter your email" className="p-2 border border-gray-400 rounded-lg w-full" required/>
                            
                        </div>
                        <div className="flex justify-center mb-4 px-4 py-3">
                            <button type="submit" className="bg-violet-600 cursor-pointer text-white py-2 px-4 rounded-full hover:bg-violet-700 transition">Reset Password</button>
                        </div>
                    </form>
                )}
            </div>
        </>
    );
};

export default ResetPassword;