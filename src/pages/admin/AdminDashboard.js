import { useEffect, useState } from 'react';
import { supabase } from '../../config/supabaseClient';
import { DB_TABLES } from '../../config/dbConfig';
import logger from '../../utils/logger';
import './AdminDashboard.css';

const AdminDashboard = ({ user, t, onNavigate }) => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        users: {},
        families: {},
        events: {},
        documents: {},
        auditLogs: {},
        dataQuality: {}
    });
    const [recentActivity, setRecentActivity] = useState([]);
    const [systemHealth, setSystemHealth] = useState('good');
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        if (user?.role === 'admin') {
            loadAdminData();
        }
    }, [user]);

    const loadAdminData = async () => {
        setLoading(true);
        try {
            await Promise.all([
                loadUserStats(),
                loadFamilyStats(),
                loadEventStats(),
                loadDocumentStats(),
                loadRecentActivity(),
                loadNotifications(),
                checkSystemHealth()
            ]);
        } catch (error) {
            logger.error('Error loading admin data', error);
            console.error('Failed to load admin data:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadUserStats = async () => {
        try {
            // Call the stored function for user statistics
            const { data, error } = await supabase.rpc('get_user_statistics');
            if (error) throw error;

            if (data && data.length > 0) {
                setStats(prev => ({
                    ...prev,
                    users: data[0]
                }));
            }
        } catch (error) {
            console.error('Error loading user stats:', error);
        }
    };

    const loadFamilyStats = async () => {
        try {
            // Call the stored function for family statistics
            const { data, error } = await supabase.rpc('get_family_statistics');
            if (error) throw error;

            if (data && data.length > 0) {
                setStats(prev => ({
                    ...prev,
                    families: data[0]
                }));
            }
        } catch (error) {
            console.error('Error loading family stats:', error);
        }
    };

    const loadEventStats = async () => {
        try {
            const { data, error } = await supabase
                .from(DB_TABLES.EVENTS)
                .select('id, status, created_at, date_time')
                .order('created_at', { ascending: false });

            if (error) throw error;

            const now = new Date();
            const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

            const eventStats = {
                total: data?.length || 0,
                upcoming: data?.filter(e => new Date(e.date_time) > now).length || 0,
                past: data?.filter(e => new Date(e.date_time) < now).length || 0,
                recent: data?.filter(e => new Date(e.created_at) > thirtyDaysAgo).length || 0
            };

            setStats(prev => ({
                ...prev,
                events: eventStats
            }));
        } catch (error) {
            console.error('Error loading event stats:', error);
        }
    };

    const loadDocumentStats = async () => {
        try {
            const { data, error } = await supabase
                .from(DB_TABLES.DOCUMENTS)
                .select('id, uploaded_at, file_size, access_level')
                .order('uploaded_at', { ascending: false });

            if (error) throw error;

            const now = new Date();
            const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

            const docStats = {
                total: data?.length || 0,
                recent: data?.filter(d => new Date(d.uploaded_at) > thirtyDaysAgo).length || 0,
                totalSize: data?.reduce((sum, doc) => sum + (doc.file_size || 0), 0) || 0,
                publicDocs: data?.filter(d => d.access_level === 'public').length || 0,
                privateDocs: data?.filter(d => d.access_level === 'private').length || 0
            };

            setStats(prev => ({
                ...prev,
                documents: docStats
            }));
        } catch (error) {
            console.error('Error loading document stats:', error);
        }
    };

    const loadRecentActivity = async () => {
        try {
            const { data, error } = await supabase
                .from('audit_logs')
                .select(`
                    *,
                    profiles:user_id (full_name, role)
                `)
                .order('created_at', { ascending: false })
                .limit(10);

            if (error) throw error;
            setRecentActivity(data || []);
        } catch (error) {
            console.error('Error loading recent activity:', error);
        }
    };

    const loadNotifications = async () => {
        try {
            const { data, error } = await supabase
                .from('notifications')
                .select('*')
                .eq('user_id', user.id)
                .is('read_at', null)
                .order('created_at', { ascending: false })
                .limit(5);

            if (error) throw error;
            setNotifications(data || []);
        } catch (error) {
            console.error('Error loading notifications:', error);
        }
    };

    const checkSystemHealth = async () => {
        try {
            // Simple system health check
            const { data: profilesHealth } = await supabase
                .from('profiles')
                .select('id', { count: 'exact', head: true });

            const { data: familyHealth } = await supabase
                .from(DB_TABLES.FAMILY_MEMBERS)
                .select('id', { count: 'exact', head: true });

            // Check for data quality issues
            const { data: qualityIssues } = await supabase
                .from('data_quality_issues')
                .select('id', { count: 'exact', head: true })
                .eq('status', 'open');

            let health = 'good';
            if (qualityIssues?.length > 10) {
                health = 'warning';
            }
            if (qualityIssues?.length > 50) {
                health = 'critical';
            }

            setSystemHealth(health);
        } catch (error) {
            console.error('Error checking system health:', error);
            setSystemHealth('unknown');
        }
    };

    const runDataQualityCheck = async () => {
        try {
            const { data, error } = await supabase.rpc('detect_data_quality_issues');
            if (error) throw error;

            alert(`Data quality check completed. Found ${data} new issues.`);
            await loadAdminData(); // Refresh stats
        } catch (error) {
            console.error('Error running data quality check:', error);
            alert('Error running data quality check');
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const getHealthColor = (health) => {
        switch (health) {
            case 'good': return 'green';
            case 'warning': return 'orange';
            case 'critical': return 'red';
            default: return 'gray';
        }
    };

    const getActivityIcon = (action) => {
        const icons = {
            'CREATE': '➕',
            'UPDATE': '✏️',
            'DELETE': '🗑️',
            'LOGIN': '🔐',
            'EXPORT': '📤',
            'IMPORT': '📥',
            'APPROVE': '✅',
            'REJECT': '❌'
        };
        return icons[action] || '📝';
    };

    if (!user || user.role !== 'admin') {
        return (
            <div className="view-container">
                <div className="access-denied">
                    <h2>🚫 Access Denied</h2>
                    <p>You need administrator privileges to access this page.</p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="view-container">
                <div className="loading-state">
                    <div className="loading-spinner">⚙️</div>
                    <p>Loading admin dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="view-container">
            <div className="admin-dashboard">
                <div className="admin-header">
                    <h1>🛠️ Admin Dashboard</h1>
                    <div className="system-health">
                        <span className="health-indicator" style={{ color: getHealthColor(systemHealth) }}>
                            ● System Health: {systemHealth}
                        </span>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="quick-actions">
                    <button
                        className="action-btn primary"
                        onClick={() => onNavigate('admin/users')}
                    >
                        👥 Manage Users
                    </button>
                    <button
                        className="action-btn"
                        onClick={() => onNavigate('admin/data-quality')}
                    >
                        🔍 Data Quality
                    </button>
                    <button
                        className="action-btn"
                        onClick={() => onNavigate('admin/import-export')}
                    >
                        📊 Import/Export
                    </button>
                    <button
                        className="action-btn"
                        onClick={runDataQualityCheck}
                    >
                        🔧 Run Quality Check
                    </button>
                </div>

                {/* Statistics Grid */}
                <div className="stats-grid">
                    {/* User Statistics */}
                    <div className="stat-card">
                        <div className="stat-header">
                            <h3>👥 Users</h3>
                            <span className="stat-icon">👥</span>
                        </div>
                        <div className="stat-content">
                            <div className="stat-main">
                                <span className="stat-number">{stats.users.total_users || 0}</span>
                                <span className="stat-label">Total Users</span>
                            </div>
                            <div className="stat-details">
                                <div className="stat-item">
                                    <span className="stat-value">{stats.users.active_users || 0}</span>
                                    <span className="stat-desc">Active</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-value">{stats.users.pending_approvals || 0}</span>
                                    <span className="stat-desc">Pending</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-value">{stats.users.admin_users || 0}</span>
                                    <span className="stat-desc">Admins</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Family Statistics */}
                    <div className="stat-card">
                        <div className="stat-header">
                            <h3>👨‍👩‍👧‍👦 Families</h3>
                            <span className="stat-icon">👨‍👩‍👧‍👦</span>
                        </div>
                        <div className="stat-content">
                            <div className="stat-main">
                                <span className="stat-number">{stats.families.total_families || 0}</span>
                                <span className="stat-label">Total Families</span>
                            </div>
                            <div className="stat-details">
                                <div className="stat-item">
                                    <span className="stat-value">{stats.families.total_members || 0}</span>
                                    <span className="stat-desc">Members</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-value">{stats.families.avg_family_size || 0}</span>
                                    <span className="stat-desc">Avg Size</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-value">{stats.families.cities_count || 0}</span>
                                    <span className="stat-desc">Cities</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Event Statistics */}
                    <div className="stat-card">
                        <div className="stat-header">
                            <h3>📅 Events</h3>
                            <span className="stat-icon">📅</span>
                        </div>
                        <div className="stat-content">
                            <div className="stat-main">
                                <span className="stat-number">{stats.events.total || 0}</span>
                                <span className="stat-label">Total Events</span>
                            </div>
                            <div className="stat-details">
                                <div className="stat-item">
                                    <span className="stat-value">{stats.events.upcoming || 0}</span>
                                    <span className="stat-desc">Upcoming</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-value">{stats.events.past || 0}</span>
                                    <span className="stat-desc">Past</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-value">{stats.events.recent || 0}</span>
                                    <span className="stat-desc">Recent</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Document Statistics */}
                    <div className="stat-card">
                        <div className="stat-header">
                            <h3>📄 Documents</h3>
                            <span className="stat-icon">📄</span>
                        </div>
                        <div className="stat-content">
                            <div className="stat-main">
                                <span className="stat-number">{stats.documents.total || 0}</span>
                                <span className="stat-label">Total Documents</span>
                            </div>
                            <div className="stat-details">
                                <div className="stat-item">
                                    <span className="stat-value">{formatFileSize(stats.documents.totalSize || 0)}</span>
                                    <span className="stat-desc">Total Size</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-value">{stats.documents.recent || 0}</span>
                                    <span className="stat-desc">Recent</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-value">{stats.documents.publicDocs || 0}</span>
                                    <span className="stat-desc">Public</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Activity and Notifications */}
                <div className="dashboard-bottom">
                    <div className="activity-section">
                        <h3>📊 Recent Activity</h3>
                        <div className="activity-list">
                            {recentActivity.length === 0 ? (
                                <div className="empty-state-small">
                                    <p>No recent activity</p>
                                </div>
                            ) : (
                                recentActivity.map(activity => (
                                    <div key={activity.id} className="activity-item">
                                        <div className="activity-icon">
                                            {getActivityIcon(activity.action)}
                                        </div>
                                        <div className="activity-details">
                                            <div className="activity-main">
                                                <span className="activity-user">
                                                    {activity.profiles?.full_name || 'Unknown User'}
                                                </span>
                                                <span className="activity-action">
                                                    {activity.action.toLowerCase()} {activity.table_name}
                                                </span>
                                            </div>
                                            <div className="activity-time">
                                                {new Date(activity.created_at).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        <button
                            className="view-all-btn"
                            onClick={() => onNavigate('admin/audit-logs')}
                        >
                            View All Activity →
                        </button>
                    </div>

                    <div className="notifications-section">
                        <h3>🔔 Notifications</h3>
                        <div className="notifications-list">
                            {notifications.length === 0 ? (
                                <div className="empty-state-small">
                                    <p>No new notifications</p>
                                </div>
                            ) : (
                                notifications.map(notification => (
                                    <div key={notification.id} className="notification-item">
                                        <div className="notification-content">
                                            <h4>{notification.title}</h4>
                                            <p>{notification.message}</p>
                                            <span className="notification-time">
                                                {new Date(notification.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className="notification-priority">
                                            {notification.priority === 'high' && '🔴'}
                                            {notification.priority === 'urgent' && '🚨'}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;