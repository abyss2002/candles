// Admin authentication using localStorage for session management
// Password verification is done server-side via API

const AUTH_KEY = 'admin_authenticated';
const AUTH_EXPIRY_KEY = 'admin_auth_expiry';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export async function verifyAdminPassword(password: string): Promise<boolean> {
    try {
        const response = await fetch('/api/admin/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password }),
        });

        const data = await response.json();
        return data.success === true;
    } catch (error) {
        console.error('Error verifying password:', error);
        return false;
    }
}

export function setAdminAuthenticated(): void {
    if (typeof window === 'undefined') return;

    const expiryTime = Date.now() + SESSION_DURATION;
    localStorage.setItem(AUTH_KEY, 'true');
    localStorage.setItem(AUTH_EXPIRY_KEY, expiryTime.toString());
}

export function isAdminAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;

    const isAuth = localStorage.getItem(AUTH_KEY) === 'true';
    const expiryTime = localStorage.getItem(AUTH_EXPIRY_KEY);

    if (!isAuth || !expiryTime) return false;

    // Check if session has expired
    if (Date.now() > parseInt(expiryTime, 10)) {
        logoutAdmin();
        return false;
    }

    return true;
}

export function logoutAdmin(): void {
    if (typeof window === 'undefined') return;

    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(AUTH_EXPIRY_KEY);
}
