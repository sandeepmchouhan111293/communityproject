import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import LanguageToggle from '../i18n/LanguageToggle';
import './Login.css';
import { supabase } from '../config/supabaseClient';
import { useTranslation } from '../i18n/translations';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [resetEmail, setResetEmail] = useState('');
    const [resetSent, setResetSent] = useState(false);
    const [showReset, setShowReset] = useState(false);
    const navigate = useNavigate();
    const { language } = useLanguage();
    const { t } = useTranslation(language);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            setError(t('pleaseEnterBoth'));
            return;
        }

        // Supabase login
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
        } else {
            setError('');
            console.log('Logged in user:', data);
            navigate('/dashboard');
        }
    };

    // Password reset via email/OTP
    const handlePasswordReset = async (e) => {
        e.preventDefault();
        if (!resetEmail) {
            setError(t('pleaseEnterEmail'));
            return;
        }
        const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
            redirectTo: window.location.origin + '/reset-password',
        });
        if (error) {
            setError(error.message);
            setResetSent(false);
        } else {
            setError('');
            setResetSent(true);
        }
    };

    return (
        <div className="login-container">
            <LanguageToggle variant="login" />
            <div className="community-hero">
                <img src="/images/Sen Ji Maharaj 1.png" alt="Sen Ji Maharaj" className="community-image" />
            </div>
            <form className="login-form" onSubmit={handleSubmit}>
                <div className="login-header">
                    <img src="/images/Sen Ji Maharaj 2.png" alt="Sen Ji Maharaj" className="login-avatar" />
                    <h2>{t('welcomeToSenCommunity')}</h2>
                    <p className="community-tagline">{t('connectWithFamily')}</p>
                </div>

                {error && <div className="error">{error}</div>}

                <div className="form-group">
                    <label htmlFor="login-email">{t('email')}</label>
                    <input
                        type="email"
                        id="login-email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder={t('enterEmail')}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="login-password">{t('password')}</label>
                    <input
                        type="password"
                        id="login-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder={t('enterPassword')}
                    />
                </div>

                <button type="submit">{t('login')}</button>

                <div className="login-link">
                    <span>{t('dontHaveAccount')} </span>
                    <a href="/signup">{t('signUp')}</a>
                </div>

                <div className="reset-link">
                    <a href="#" onClick={e => { e.preventDefault(); setShowReset(true); }}>{t('Forgot Password') || 'Forgot password?'}</a>
                </div>
            </form>
            {/* Password Reset Modal */}
            {showReset && (
                <div className="reset-modal-overlay" onClick={() => setShowReset(false)}>
                    <div className="reset-modal" onClick={e => e.stopPropagation()}>
                        <button className="reset-modal-close" onClick={() => setShowReset(false)}>&times;</button>
                        <form className="reset-form" onSubmit={handlePasswordReset}>
                            <h3>{t('resetPassword') || 'Reset Password'}</h3>
                            {resetSent ? (
                                <div className="success">{t('resetEmailSent') || 'Password reset email sent! Check your inbox.'}</div>
                            ) : (
                                <>
                                    <input
                                        type="email"
                                        value={resetEmail}
                                        onChange={e => setResetEmail(e.target.value)}
                                        placeholder={t('enterEmail')}
                                        required
                                    />
                                    <button type="submit">{t('sendResetLink') || 'Send Reset Link'}</button>
                                </>
                            )}
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Login;
