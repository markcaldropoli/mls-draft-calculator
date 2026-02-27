export type TokenObj = { token: string; acquiredAt: number };
const TOKEN_KEY = 'kb_auth';
const CONFIG_URL = 'https://api.kickbase.com/v4/config';
const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;
const FETCH_TIMEOUT_MS = 8000;

export function storeToken(token: string) {
    localStorage.setItem(TOKEN_KEY, JSON.stringify({ token, acquiredAt: Date.now() }));
}

export function clearToken() {
    localStorage.removeItem(TOKEN_KEY);
}

export async function getValidToken(): Promise<string | null> {
    const raw = localStorage.getItem(TOKEN_KEY);

    if (!raw) {
        return null;
    }

    let obj: TokenObj;

    try {
        obj = JSON.parse(raw);
    } catch {
        clearToken();
        return null;
    }

    if (!obj?.token || (Date.now() - obj.acquiredAt) > ONE_WEEK_MS) {
        clearToken();
        return null;
    }

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    try {
        const res = await fetch(CONFIG_URL, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${obj.token}` },
            signal: controller.signal
        });

        clearTimeout(id);

        if (res.status === 200) {
            return obj.token;
        }

        clearToken();

        return null;
    } catch {
        clearTimeout(id);
        // Network error, timeout or CORS — treat as no valid token so UI shows login instead of hanging
        return null;
    }
}