import { useEffect, useState } from 'react';
import { supabase } from '../../config/supabaseClient';
import logger from '../../utils/logger';
import './UserManagement.css';

const UserManagement = ({ user, t, onNavigate }) => {
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showUserModal, setShowUserModal] = useState(false);
    const [filters, setFilters] = useState({
        role: 'all',
        status: 'all',
        search: ''
    });
    const [sortBy, setSortBy] = useState('created_at');
    const [sortOrder, setSortOrder] = useState('desc');

    useEffect(() => {
        if (user?.role === 'admin') {
            loadUsers();
        }
    }, [user]);

    useEffect(() => {
        applyFilters();
    }, [users, filters, sortBy, sortOrder]);

    const loadUsers = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select(`
                    *,
                    created_by:created_by (full_name),
                    approved_by:approved_by (full_name)
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setUsers(data || []);
            logger.log('Users loaded', data);
        } catch (error) {
            logger.error('Error loading users', error);
            console.error('Failed to load users:', error);
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let filtered = [...users];

        // Search filter
        if (filters.search.trim()) {
            const searchLower = filters.search.toLowerCase();
            filtered = filtered.filter(u =>
                u.full_name?.toLowerCase().includes(searchLower) ||
                u.email?.toLowerCase().includes(searchLower) ||
                u.city?.toLowerCase().includes(searchLower)
            );
        }

        // Role filter
        if (filters.role !== 'all') {
            filtered = filtered.filter(u => u.role === filters.role);
        }

        // Status filter
        if (filters.status !== 'all') {
            if (filters.status === 'pending') {
                filtered = filtered.filter(u => !u.approved_at);
            } else {
                filtered = filtered.filter(u => u.status === filters.status);
            }
        }

        // Sort
        filtered.sort((a, b) => {
            let aValue = a[sortBy];
            let bValue = b[sortBy];

            if (sortBy === 'created_at' || sortBy === 'last_login' || sortBy === 'approved_at') {
                aValue = new Date(aValue || 0);
                bValue = new Date(bValue || 0);
            }

            if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });

        setFilteredUsers(filtered);
    };

    const updateUserRole = async (userId, newRole) => {
        try {
            const { error } = await supabase
                .from('profiles')
                .update({ role: newRole })
                .eq('id', userId);

            if (error) throw error;

            // Log the action
            await logAuditEvent('UPDATE', 'profiles', userId, { role: newRole });

            await loadUsers();
            alert('User role updated successfully');
        } catch (error) {
            console.error('Error updating user role:', error);
            alert('Error updating user role');
        }
    };

    const updateUserStatus = async (userId, newStatus) => {
        try {
            const updates = { status: newStatus };
            if (newStatus === 'active' && !users.find(u => u.id === userId)?.approved_at) {
                updates.approved_at = new Date().toISOString();
                updates.approved_by = user.id;
            }

            const { error } = await supabase
                .from('profiles')
                .update(updates)
                .eq('id', userId);

            if (error) throw error;

            // Log the action
            await logAuditEvent('UPDATE', 'profiles', userId, updates);

            await loadUsers();
            alert('User status updated successfully');
        } catch (error) {
            console.error('Error updating user status:', error);
            alert('Error updating user status');
        }
    };

    const deleteUser = async (userId) => {
        if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            return;
        }

        try {
            // First delete related records
            await supabase.from('family_members').delete().eq('user_id', userId);
            await supabase.from('audit_logs').delete().eq('user_id', userId);
            await supabase.from('notifications').delete().eq('user_id', userId);

            // Then delete the profile
            const { error } = await supabase
                .from('profiles')
                .delete()
                .eq('id', userId);

            if (error) throw error;

            // Log the action
            await logAuditEvent('DELETE', 'profiles', userId);

            await loadUsers();
            alert('User deleted successfully');
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Error deleting user');
        }
    };

    const logAuditEvent = async (action, tableName, recordId, newValues = null) => {
        try {
            await supabase.rpc('log_audit_event', {
                p_user_id: user.id,
                p_action: action,
                p_table_name: tableName,
                p_record_id: recordId,
                p_new_values: newValues
            });
        } catch (error) {
            console.error('Error logging audit event:', error);
        }
    };

    const exportUsers = async () => {
        try {
            const csvData = [
                ['Name', 'Email', 'Role', 'Status', 'City', 'Created Date', 'Last Login'].join(','),
                ...filteredUsers.map(u => [
                    u.full_name || '',
                    u.email || '',
                    u.role || '',
                    u.status || '',
                    u.city || '',
                    u.created_at ? new Date(u.created_at).toLocaleDateString() : '',
                    u.last_login ? new Date(u.last_login).toLocaleDateString() : ''
                ].join(','))
            ].join('\n');

            const blob = new Blob([csvData], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `users_export_${new Date().toISOString().split('T')[0]}.csv`;
            a.click();
            window.URL.revokeObjectURL(url);

            // Log the export action
            await logAuditEvent('EXPORT', 'profiles', null, { export_type: 'csv', record_count: filteredUsers.length });
        } catch (error) {
            console.error('Error exporting users:', error);
            alert('Error exporting users');
        }
    };

    const sendWelcomeEmail = async (userId) => {
        try {
            // In a real implementation, this would trigger an email service
            await supabase
                .from('notifications')
                .insert({
                    user_id: userId,
                    type: 'welcome',
                    title: 'Welcome to the Community!',
                    message: 'Welcome to our community family directory. Please complete your profile to get started.',
                    priority: 'normal'
                });

            alert('Welcome notification sent');
        } catch (error) {
            console.error('Error sending welcome email:', error);
            alert('Error sending welcome notification');
        }
    };

    const getRoleColor = (role) => {
        switch (role) {
            case 'admin': return '#dc3545';
            case 'contributor': return '#007bff';
            case 'viewer': return '#28a745';
            default: return '#6c757d';
        }
    };

    const getStatusColor = (status, approvedAt) => {
        if (!approvedAt) return '#ffc107'; // pending
        switch (status) {
            case 'active': return '#28a745';
            case 'inactive': return '#6c757d';
            case 'suspended': return '#dc3545';
            default: return '#6c757d';
        }
    };

    const getStatusText = (status, approvedAt) => {
        if (!approvedAt) return 'Pending';
        return status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown';
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
                    <div className="loading-spinner">👥</div>
                    <p>Loading user management...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="view-container">
            <div className="user-management">
                <div className="management-header">
                    <div className="header-left">
                        <h1>👥 User Management</h1>
                        <p>{filteredUsers.length} of {users.length} users</p>
                    </div>
                    <div className="header-actions">
                        <button className="btn-secondary" onClick={exportUsers}>
                            📤 Export CSV
                        </button>
                        <button className="btn-primary" onClick={() => onNavigate('admin/dashboard')}>
                            ← Back to Dashboard
                        </button>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="filters-section">
                    <div className="search-box">
                        <input
                            type="text"
                            placeholder="Search by name, email, or city..."
                            value={filters.search}
                            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                            className="search-input"
                        />
                    </div>

                    <div className="filter-controls">
                        <select
                            value={filters.role}
                            onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value }))}
                            className="filter-select"
                        >
                            <option value="all">All Roles</option>
                            <option value="admin">Admin</option>
                            <option value="contributor">Contributor</option>
                            <option value="viewer">Viewer</option>
                        </select>

                        <select
                            value={filters.status}
                            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                            className="filter-select"
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="suspended">Suspended</option>
                            <option value="pending">Pending Approval</option>
                        </select>

                        <select
                            value={`${sortBy}-${sortOrder}`}
                            onChange={(e) => {
                                const [field, order] = e.target.value.split('-');
                                setSortBy(field);
                                setSortOrder(order);
                            }}
                            className="filter-select"
                        >
                            <option value="created_at-desc">Newest First</option>
                            <option value="created_at-asc">Oldest First</option>
                            <option value="full_name-asc">Name A-Z</option>
                            <option value="full_name-desc">Name Z-A</option>
                            <option value="last_login-desc">Last Login</option>
                        </select>
                    </div>
                </div>

                {/* Users Table */}
                <div className="users-table-container">
                    <table className="users-table">
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Location</th>
                                <th>Joined</th>
                                <th>Last Login</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="empty-state">
                                        No users found matching the current filters
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map(userData => (
                                    <tr key={userData.id} className="user-row">
                                        <td className="user-info">
                                            <div className="user-avatar">
                                                {userData.full_name?.charAt(0) || '👤'}
                                            </div>
                                            <div className="user-details">
                                                <div className="user-name">{userData.full_name || 'Unnamed User'}</div>
                                                <div className="user-email">{userData.email}</div>
                                            </div>
                                        </td>
                                        <td>
                                            <span
                                                className="role-badge"
                                                style={{ backgroundColor: getRoleColor(userData.role) }}
                                            >
                                                {userData.role || 'viewer'}
                                            </span>
                                        </td>
                                        <td>
                                            <span
                                                className="status-badge"
                                                style={{ backgroundColor: getStatusColor(userData.status, userData.approved_at) }}
                                            >
                                                {getStatusText(userData.status, userData.approved_at)}
                                            </span>
                                        </td>
                                        <td>{userData.city || '-'}</td>
                                        <td>
                                            {userData.created_at ?
                                                new Date(userData.created_at).toLocaleDateString() : '-'}
                                        </td>
                                        <td>
                                            {userData.last_login ?
                                                new Date(userData.last_login).toLocaleDateString() : 'Never'}
                                        </td>
                                        <td className="user-actions">
                                            <div className="action-dropdown">
                                                <button className="action-btn">⋮</button>
                                                <div className="dropdown-menu">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedUser(userData);
                                                            setShowUserModal(true);
                                                        }}
                                                    >
                                                        👁️ View Details
                                                    </button>

                                                    {!userData.approved_at && (
                                                        <button onClick={() => updateUserStatus(userData.id, 'active')}>
                                                            ✅ Approve User
                                                        </button>
                                                    )}

                                                    {userData.role !== 'admin' && (
                                                        <button onClick={() => updateUserRole(userData.id, 'admin')}>
                                                            👑 Make Admin
                                                        </button>
                                                    )}

                                                    {userData.role === 'admin' && user.id !== userData.id && (
                                                        <button onClick={() => updateUserRole(userData.id, 'contributor')}>
                                                            👤 Remove Admin
                                                        </button>
                                                    )}

                                                    <button onClick={() => sendWelcomeEmail(userData.id)}>
                                                        📧 Send Welcome
                                                    </button>

                                                    {userData.status === 'active' && (
                                                        <button onClick={() => updateUserStatus(userData.id, 'suspended')}>
                                                            ⏸️ Suspend User
                                                        </button>
                                                    )}

                                                    {userData.status === 'suspended' && (
                                                        <button onClick={() => updateUserStatus(userData.id, 'active')}>
                                                            ▶️ Reactivate User
                                                        </button>
                                                    )}

                                                    {user.id !== userData.id && (
                                                        <button
                                                            onClick={() => deleteUser(userData.id)}
                                                            className="danger"
                                                        >
                                                            🗑️ Delete User
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* User Details Modal */}
                {showUserModal && selectedUser && (
                    <div className="modal-overlay" onClick={() => setShowUserModal(false)}>
                        <div className="user-modal" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h3>User Details</h3>
                                <button
                                    className="close-btn"
                                    onClick={() => setShowUserModal(false)}
                                >
                                    ✕
                                </button>
                            </div>
                            <div className="modal-content">
                                <div className="user-detail-grid">
                                    <div className="detail-item">
                                        <label>Full Name</label>
                                        <span>{selectedUser.full_name || 'Not provided'}</span>
                                    </div>
                                    <div className="detail-item">
                                        <label>Email</label>
                                        <span>{selectedUser.email || 'Not provided'}</span>
                                    </div>
                                    <div className="detail-item">
                                        <label>Role</label>
                                        <span className="role-badge" style={{ backgroundColor: getRoleColor(selectedUser.role) }}>
                                            {selectedUser.role || 'viewer'}
                                        </span>
                                    </div>
                                    <div className="detail-item">
                                        <label>Status</label>
                                        <span className="status-badge" style={{ backgroundColor: getStatusColor(selectedUser.status, selectedUser.approved_at) }}>
                                            {getStatusText(selectedUser.status, selectedUser.approved_at)}
                                        </span>
                                    </div>
                                    <div className="detail-item">
                                        <label>City</label>
                                        <span>{selectedUser.city || 'Not provided'}</span>
                                    </div>
                                    <div className="detail-item">
                                        <label>Community</label>
                                        <span>{selectedUser.community_name || 'Not provided'}</span>
                                    </div>
                                    <div className="detail-item">
                                        <label>Original Family</label>
                                        <span>{selectedUser.original_family || 'Not provided'}</span>
                                    </div>
                                    <div className="detail-item">
                                        <label>Joined Date</label>
                                        <span>
                                            {selectedUser.created_at ?
                                                new Date(selectedUser.created_at).toLocaleDateString() :
                                                'Unknown'}
                                        </span>
                                    </div>
                                    <div className="detail-item">
                                        <label>Last Login</label>
                                        <span>
                                            {selectedUser.last_login ?
                                                new Date(selectedUser.last_login).toLocaleString() :
                                                'Never'}
                                        </span>
                                    </div>
                                    <div className="detail-item">
                                        <label>Approved By</label>
                                        <span>{selectedUser.approved_by?.full_name || 'Not approved'}</span>
                                    </div>
                                    <div className="detail-item">
                                        <label>Approved Date</label>
                                        <span>
                                            {selectedUser.approved_at ?
                                                new Date(selectedUser.approved_at).toLocaleDateString() :
                                                'Not approved'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserManagement;