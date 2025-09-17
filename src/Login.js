import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { supabase } from './supabaseClient';
import { useLanguage } from './LanguageContext';
import { useTranslation } from './translations';
import LanguageToggle from './LanguageToggle';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
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
            </form>
        </div>
    );
}

export default Login;
