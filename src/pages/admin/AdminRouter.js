import { useState } from 'react';
import AdminDashboard from './AdminDashboard';
import UserManagement from './UserManagement';
import DataManagement from './DataManagement';
import AuditLogs from './AuditLogs';
import SystemSettings from './SystemSettings';
import AdminAnalytics from './AdminAnalytics';
import './AdminRouter.css';

const AdminRouter = ({ user, t, onNavigate }) => {
    const [currentView, setCurrentView] = useState('dashboard');

    // Handle navigation within admin section
    const handleAdminNavigate = (path) => {
        if (path.startsWith('admin/')) {
            setCurrentView(path.replace('admin/', ''));
        } else {
            onNavigate(path);
        }
    };

    // Check if user has admin access
    if (!user || user.role !== 'admin') {
        return (
            <div className="view-container">
                <div className="access-denied">
                    <h2>🚫 Access Denied</h2>
                    <p>You need administrator privileges to access this section.</p>
                    <button
                        className="btn-primary"
                        onClick={() => onNavigate('home')}
                    >
                        Return Home
                    </button>
                </div>
            </div>
        );
    }

    const renderCurrentView = () => {
        switch (currentView) {
            case 'dashboard':
                return <AdminDashboard user={user} t={t} onNavigate={handleAdminNavigate} />;
            case 'users':
                return <UserManagement user={user} t={t} onNavigate={handleAdminNavigate} />;
            case 'data-management':
            case 'import-export':
                return <DataManagement user={user} t={t} onNavigate={handleAdminNavigate} />;
            case 'audit-logs':
                return <AuditLogs user={user} t={t} onNavigate={handleAdminNavigate} />;
            case 'settings':
                return <SystemSettings user={user} t={t} onNavigate={handleAdminNavigate} />;
            case 'analytics':
                return <AdminAnalytics user={user} t={t} onNavigate={handleAdminNavigate} />;
            case 'data-quality':
                return <DataManagement user={user} t={t} onNavigate={handleAdminNavigate} />;
            default:
                return <AdminDashboard user={user} t={t} onNavigate={handleAdminNavigate} />;
        }
    };

    return (
        <div className="admin-router">
            <div className="admin-sidebar">
                <div className="sidebar-header">
                    <h2>🛠️ Admin Panel</h2>
                    <p>Welcome, {user.full_name}</p>
                </div>

                <nav className="admin-nav">
                    <button
                        className={`nav-item ${currentView === 'dashboard' ? 'active' : ''}`}
                        onClick={() => setCurrentView('dashboard')}
                    >
                        <span className="nav-icon">📊</span>
                        <span className="nav-label">Dashboard</span>
                    </button>

                    <button
                        className={`nav-item ${currentView === 'users' ? 'active' : ''}`}
                        onClick={() => setCurrentView('users')}
                    >
                        <span className="nav-icon">👥</span>
                        <span className="nav-label">User Management</span>
                    </button>

                    <button
                        className={`nav-item ${currentView === 'data-management' ? 'active' : ''}`}
                        onClick={() => setCurrentView('data-management')}
                    >
                        <span className="nav-icon">📁</span>
                        <span className="nav-label">Data Management</span>
                    </button>

                    <button
                        className={`nav-item ${currentView === 'audit-logs' ? 'active' : ''}`}
                        onClick={() => setCurrentView('audit-logs')}
                    >
                        <span className="nav-icon">📋</span>
                        <span className="nav-label">Audit Logs</span>
                    </button>

                    <button
                        className={`nav-item ${currentView === 'analytics' ? 'active' : ''}`}
                        onClick={() => setCurrentView('analytics')}
                    >
                        <span className="nav-icon">📈</span>
                        <span className="nav-label">Analytics</span>
                    </button>

                    <button
                        className={`nav-item ${currentView === 'settings' ? 'active' : ''}`}
                        onClick={() => setCurrentView('settings')}
                    >
                        <span className="nav-icon">⚙️</span>
                        <span className="nav-label">System Settings</span>
                    </button>

                    <div className="nav-divider"></div>

                    <button
                        className="nav-item exit"
                        onClick={() => onNavigate('home')}
                    >
                        <span className="nav-icon">🏠</span>
                        <span className="nav-label">Return to App</span>
                    </button>
                </nav>
            </div>

            <div className="admin-content">
                {renderCurrentView()}
            </div>
        </div>
    );
};

export default AdminRouter;