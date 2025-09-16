import { useState } from 'react';
import './Signup.css';
import { supabase } from './supabaseClient'; // ✅ import supabase client

function Signup() {
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [gender, setGender] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!fullName || !username || !email || !mobile || !gender || !password || !confirmPassword) {
            setError('Please fill in all fields.');
            setSuccess('');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            setSuccess('');
            return;
        }

        // Supabase signup
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                    username: username,
                    mobile: mobile,
                    gender: gender,
                },
            },
        });

        if (error) {
            setError(error.message);
            setSuccess('');
        } else {
            setError('');
            setSuccess('Account created successfully! Please check your email to verify your account.');
            console.log('New user:', data);
        }
    };

    return (
        <div className="signup-container">
            <form className="signup-form" onSubmit={handleSubmit}>
                <div className="signup-avatar">
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="8" r="4" fill="#388e3c" />
                        <rect x="4" y="16" width="16" height="6" rx="3" fill="#388e3c" />
                    </svg>
                </div>
                <h2>Sign Up</h2>

                {error && <div className="error">{error}</div>}
                {success && <div className="success">{success}</div>}

                <div className="form-group">
                    <label htmlFor="signup-fullname">Full Name</label>
                    <input
                        type="text"
                        id="signup-fullname"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        placeholder="Enter your full name"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="signup-username">Username</label>
                    <input
                        type="text"
                        id="signup-username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        placeholder="Choose a username"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="signup-email">Email</label>
                    <input
                        type="email"
                        id="signup-email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="Enter your email"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="signup-mobile">Mobile Number</label>
                    <input
                        type="tel"
                        id="signup-mobile"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        required
                        placeholder="Enter your mobile number"
                        pattern="[0-9]{10}"
                    />
                </div>

                <div className="form-group">
                    <label>Gender</label>
                    <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        required
                    >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="signup-password">Password</label>
                    <input
                        type="password"
                        id="signup-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="Create a password"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="signup-confirm-password">Confirm Password</label>
                    <input
                        type="password"
                        id="signup-confirm-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        placeholder="Confirm your password"
                    />
                </div>

                <button type="submit">Sign Up</button>

                <div className="signup-link">
                    <span>Already have an account? </span>
                    <a href="/login" style={{ color: '#1976d2', textDecoration: 'underline' }}>Login</a>
                </div>
            </form>
        </div>
    );
}

export default Signup;
