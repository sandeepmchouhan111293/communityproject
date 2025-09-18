
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import { useLanguage } from './LanguageContext';
import LanguageToggle from './LanguageToggle';
import AddDiscussion from './pages/AddDiscussion';
import AddDocument from './pages/AddDocument';
import AddEvent from './pages/AddEvent';
import AddFamilyMember from './pages/AddFamilyMember';
import AddVolunteer from './pages/AddVolunteer';
import CommunityDirectoryView from './pages/Directory';
import DiscussionsView from './pages/Discussions';
import DocumentsView from './pages/Documents';
import EventsView from './pages/Events';
import FamilyTreeView from './pages/FamilyTree';
import HomeView from './pages/Home';
import ProfileView from './pages/Profile';
import SettingsView from './pages/Settings';
import VolunteerView from './pages/Volunteer';
import { supabase } from './supabaseClient';
import { useTranslation } from './translations';

function Dashboard() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeView, setActiveView] = useState('home');
    const navigate = useNavigate();
    const { language } = useLanguage();
    const { t } = useTranslation(language);

    const navItems = useMemo(() => [
        { view: 'home', icon: '🏠', translationKey: 'home' },
        { view: 'profile', icon: '👤', translationKey: 'myProfile' },
        { view: 'family', icon: '🌳', translationKey: 'familyTree' },
        { view: 'events', icon: '📅', translationKey: 'events' },
        { view: 'volunteer', icon: '🤝', translationKey: 'volunteer' },
        { view: 'discussions', icon: '💬', translationKey: 'discussions' },
        { view: 'documents', icon: '📁', translationKey: 'documents' },
        { view: 'directory', icon: '📖', translationKey: 'directory' },
        { view: 'settings', icon: '⚙️', translationKey: 'settings' },
    ], []);

    useEffect(() => {
        const getUser = async () => {
            const { data: { user }, error } = await supabase.auth.getUser();
            if (error || !user) {
                navigate('/login');
                return;
            }
            setUser(user);
            setLoading(false);
        };
        getUser();
    }, [navigate]);

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Error signing out:', error);
        } else {
            navigate('/login');
        }
    };

    if (loading) {
        return (
            <div className="dashboard-loading">
                <div className="loading-spinner"></div>
                <p>{t('loading') || 'Loading...'}</p>
            </div>
        );
    }

    const handleNavigation = (view) => {
        setActiveView(view);
    };

    const renderContent = () => {
        const ViewComponent = {
            'home': HomeView,
            'profile': ProfileView,
            'family': FamilyTreeView,
            'addFamilyMember': AddFamilyMember,
            'events': EventsView,
            'addEvent': AddEvent,
            'volunteer': VolunteerView,
            'addVolunteer': AddVolunteer,
            'discussions': DiscussionsView,
            'addDiscussion': AddDiscussion,
            'documents': DocumentsView,
            'addDocument': AddDocument,
            'directory': CommunityDirectoryView,
            'settings': SettingsView,
        }[activeView] || HomeView;
        return <ViewComponent user={user} t={t} onNavigate={handleNavigation} />;
    };

    return (
        <div className="dashboard-container">
            <nav className="sidebar">
                <div className="sidebar-header">
                    <div className="community-branding">
                        <img src="/images/Sen Ji Maharaj 2.png" alt="Sen Ji Maharaj" className="community-logo" />
                        <h1>{t('communityHub') || 'Community Hub'}</h1>
                        <p className="hub-tagline">{t('guidedByWisdom') || 'Guided by Wisdom'}</p>
                    </div>
                    <LanguageToggle variant="dashboard" />
                    <div className="user-info">
                        <div className="user-avatar-small">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="User Avatar">
                                <title>User Avatar</title>
                                <circle cx="12" cy="8" r="4" fill="#d4a574" />
                                <rect x="4" y="16" width="16" height="6" rx="3" fill="#d4a574" />
                            </svg>
                        </div>
                        <div className="user-details">
                            <p className="user-name">{user?.user_metadata?.full_name ?? user?.user_metadata?.username ?? user?.email?.split('@')[0] ?? (t('user') || 'User')}</p>
                            <p className="user-email">{user?.email}</p>
                        </div>
                    </div>
                </div>

                <ul className="nav-menu">
                    {navItems.map(item => (
                        <li key={item.view} className={activeView === item.view ? 'active' : ''}>
                            <button
                                onClick={() => setActiveView(item.view)}
                                aria-current={activeView === item.view ? 'page' : undefined}
                            >
                                <span className="nav-icon" aria-hidden="true">{item.icon}</span>
                                {t(item.translationKey) || item.translationKey}
                            </button>
                        </li>
                    ))}
                </ul>

                <div className="sidebar-footer">
                    <button className="logout-btn" onClick={handleLogout}>
                        <span className="nav-icon" aria-hidden="true">🚪</span>
                        {t('logout') || 'Logout'}
                    </button>
                </div>
            </nav>

            <main className="main-content">
                {renderContent()}
            </main>

        </div>
    );
}

export default Dashboard;
