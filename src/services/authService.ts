export const login = async (credentials: { username: string; password: string }) => {
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });
        if (!response.ok) {
            throw new Error('Login failed');
        }
        return response.json();
    } catch (error) {
        console.error('Error during login:', error);
        throw error;
    }
};