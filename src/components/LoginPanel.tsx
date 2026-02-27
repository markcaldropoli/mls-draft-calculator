import React, { useState } from 'react';
import { storeToken } from '../services/TokenService';

type Props = { onSuccess: (token: string) => void };

export default function LoginPanel({ onSuccess }: Props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    function validEmail(e: string) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
    }

    async function submit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        if (!validEmail(email)) {
            setError('Enter a valid email');
            return;
        }

        if (!password) {
            setError('Enter a password');
            return;
        }

        setLoading(true);

        try {
            const payload = { em: email, loy: false, pass: password, rep: {} };
            const res = await fetch('https://api.kickbase.com/v4/user/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                setError(`Login failed (${res.status})`);
                setLoading(false);
                return;
            }

            const json = await res.json();
            const token = json?.tkn;

            if (!token) {
                setError('Login succeeded but no token returned');
                setLoading(false);
                return;
            }

            storeToken(token);
            onSuccess(token);
        } catch {
            setError('Network error');
            setLoading(false);
        }
    }

    return (
        <div
            className="d-flex align-items-center justify-content-center min-vh-100"
            style={{ background: 'linear-gradient(135deg, #354377 15%, #764ba2 100%)' }}
        >
            <div className="card shadow-sm" style={{ maxWidth: 420, width: '100%' }}>
                <div className="card-body card-bordered p-4">
                    <h4 className="card-title mb-3">Kickbase Sign in</h4>
                    <form onSubmit={submit} noValidate>
                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                type="email"
                                className={`form-control ${error === 'Enter a valid email' ? 'is-invalid' : ''}`}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Password</label>
                            <input
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                type="password"
                                className="form-control"
                                required
                            />
                        </div>
                        {error && <div className="alert alert-danger py-2" role="alert">{error}</div>}
                        <div className="d-grid">
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? 'Signing in…' : 'Sign in'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}