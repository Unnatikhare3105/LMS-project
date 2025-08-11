import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const VerifyOTP = () => {
    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 6);
        setOtp(value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (otp.length !== 6) {
            return alert('Please enter a valid 6-digit OTP');
        }
        setIsLoading(true);
        setError('');
        try {
            const response = await fetch('http://localhost:3000/user/verify-otp', {
                method: 'POST',
                
                body: JSON.stringify({ otp }),
            });
            if (!response.ok) throw new Error('Invalid OTP');
            // If verification is successful, navigate to home
            navigate('/');
        } catch (err) {
            setError(err.message || 'Verification failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ maxWidth: 300, margin: '0 auto' }}>
            <h2>Verify OTP</h2>
            <input
                type="text"
                value={otp}
                onChange={handleChange}
                placeholder="Enter 6-digit OTP"
                maxLength={6}
                style={{ width: '100%', padding: '8px', fontSize: '16px', marginBottom: '10px' }}
                autoFocus
            />
            <button
                type="submit"
                disabled={otp.length !== 6 || isLoading}
                style={{ width: '100%', padding: '10px', fontSize: '16px' }}
            >
                {isLoading ? 'Verifying...' : 'Verify'}
            </button>
            {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
        </form>
    );
};

export default VerifyOTP;