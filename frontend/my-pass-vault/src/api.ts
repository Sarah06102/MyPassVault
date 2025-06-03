const apiUrl = import.meta.env.VITE_API_URL;

export interface SignUpData {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
}

export const signup = async (userData: SignUpData) => {
    try {
        const response = await fetch(`${apiUrl}/api/signup/`, {
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
        const response = await fetch(`${apiUrl}/api/login/`, {
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

export const fetchPassword = async () => {
    const response = await fetchWithRefresh(`/api/passwords/`);
    if (!response.ok) throw new Error('Failed to fetch passwords.');
    return response.json();
};

export const createPassword = async (data: any) => {
    const response = await fetchWithRefresh(`/api/passwords/`, {
        method: 'POST',
        body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create password.');
    return response.json();
};

export const updatePassword = async (id: number, data: any) => {
    const response = await fetchWithRefresh(`/api/passwords/${id}/`, {
        method:'PUT',
        body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update password.');
    return response.json();
};

export const deletePassword = async (id: number) => {
    const response = await fetchWithRefresh(`/api/passwords/${id}/`, {
        method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete password.');
};

export const fetchWithRefresh = async (url: string, options: any = {}) => {
    let token = localStorage.getItem('access_token');
    
    const defaultHeaders: any = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    let response = await fetch(`${apiUrl}${url.startsWith('/') ? url : `/${url}`}`, {
        ...options,
        headers: {
          ...options.headers,
          ...defaultHeaders,
        },
    });

    if (response.status === 401) {
        const refresh = localStorage.getItem('refresh_token');
        console.log("refresh_token", localStorage.getItem('refresh_token'));
        const refreshResponse = await fetch(`${apiUrl}/token/refresh/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh }),
        });

        if (refreshResponse.ok) {
            const refreshData = await refreshResponse.json();
            localStorage.setItem('access_token', refreshData.access);
            if (refreshData.refresh) { 
                localStorage.setItem('refresh_token', refreshData.refresh);
            }

            response = await fetch(`${apiUrl}${url}`, {
                ...options,
                headers: {
                    ...options.headers,
                    Authorization: `Bearer ${refreshData.access}`,
                    'Content-Type': 'application/json',
                },
            });
            } else {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                window.location.href = '/login';
            }
        }
        return response;
};