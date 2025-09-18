import { useLanguage } from './LanguageContext';
import './LanguageToggle.css';

function LanguageToggle({ variant = 'default' }) {
    const { language, toggleLanguage, isHindi } = useLanguage();

    return (
        <div className={`language-toggle ${variant}`}>
            <button
                onClick={toggleLanguage}
                className="language-toggle-btn"
                title={isHindi ? "Switch to English" : "हिंदी में बदलें"}
            >
                <div className="language-display">
                    <span className="language-text">
                        {isHindi ? 'हिं' : 'EN'}
                    </span>
                    <span className="language-icon">🌐</span>
                </div>
                <div className="language-tooltip">
                    {isHindi ? 'English' : 'हिंदी'}
                </div>
            </button>
        </div>
    );
}

export default LanguageToggle;