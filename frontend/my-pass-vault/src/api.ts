const apiUrl = import.meta.env.VITE_API_URL;

export interface SignUpData {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
}

export const signup = async (userData: SignUpData) => {
    try {
        const response = await fetch(`${apiUrl}/signup/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });
        if (!response.ok) {
            const errData = await response.json();
            const err: any = new Error(errData.message || 'Signup failed');
            err.data = errData;
            throw err;
        }
        return await response.json();
    } catch (err) {
        console.error('Signup error:', err);
        throw err;
    }
};

export interface LoginData {
    email: string;
    password: string;
}

export const login = async (userData: LoginData) => {
    try {
        const response = await fetch(`${apiUrl}/login/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
            
        });
        if (!response.ok) { 
            const errorData = await response.json();
            const error: any = new Error(errorData.message || 'Login failed');
            error.response = response;
            error.data = errorData;
            throw error;
        }
        const data = await response.json();
        console.log('Login API response:', data);
        return data;
        
    } catch(err) {
        console.error('Login error:', err);
        throw err;
    }
};

export const fetchPassword = async (token: string) => {
    const response = await fetch (`${apiUrl}/passwords/`, {
        headers: {Authorization: `Bearer ${token}`},
    });
    if (!response.ok) throw new Error('Failed to fetch passwords.');
    return response.json();
};

export const createPassword = async (data:any, token:string) => {
    const response = await fetch(`${apiUrl}/passwords/`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create password.');
    return response.json();
};

export const updatePassword = async (id: number, data: any, token: string) => {
    const response = await fetch(`${apiUrl}/passwords/${id}/`, {
        method:'PUT',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update password.');
    return response.json();
};

export const deletePassword = async (id: number, token: string) => {
    const response = await fetch(`${apiUrl}/passwords/${id}/`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}`},
    });
    if (!response.ok) throw new Error('Failed to delete password.');
};