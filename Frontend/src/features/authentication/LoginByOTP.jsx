import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginByOTP = () => {
    const [email, setEmail] = useState('');
    const [otp, setOTP] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const VERIFY_OTP_API = '/api/auth/verify-otp';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await fetch(VERIFY_OTP_API, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp }),
            });
            const data = await res.json();
            if (res.ok) {
                navigate('/home');
            } else {
                setError(data.message || 'Invalid OTP');
            }
        } catch (err) {
            setError('Network error');
        }
        setLoading(false);
    };

    return (
        <div style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
            <h2>Login by OTP</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Email:
                    <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        placeholder="Enter your email"
                    />
                </label>
                <br />
                <label>
                    OTP:
                    <input
                        type="text"
                        value={otp}
                        onChange={e => setOTP(e.target.value)}
                        required
                        placeholder="Enter OTP"
                    />
                </label>
                <br />
                <button type="submit" disabled={loading}>
                    {loading ? 'Verifying...' : 'Verify OTP'}
                </button>
            </form>
            {error && <div style={{ color: 'red', marginTop: 10 }}>{error}</div>}
        </div>
    );
};

export default LoginByOTP;
