import { useEffect, useState } from 'react';
import { supabase } from '../../config/supabaseClient';
import logger from '../../utils/logger';
import './AuditLogs.css';

const AuditLogs = ({ user, t, onNavigate }) => {
    const [loading, setLoading] = useState(true);
    const [logs, setLogs] = useState([]);
    const [filteredLogs, setFilteredLogs] = useState([]);
    const [filters, setFilters] = useState({
        action: 'all',
        table: 'all',
        user: 'all',
        dateRange: '7',
        search: ''
    });
    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: 50,
        total: 0
    });
    const [users, setUsers] = useState([]);
    const [tables, setTables] = useState([]);

    useEffect(() => {
        if (user?.role === 'admin') {
            loadAuditLogs();
            loadFilterOptions();
        }
    }, [user, pagination.page, pagination.pageSize]);

    useEffect(() => {
        applyFilters();
    }, [logs, filters]);

    const loadAuditLogs = async () => {
        setLoading(true);
        try {
            let query = supabase
                .from('audit_logs')
                .select(`
                    *,
                    profiles:user_id (full_name, email)
                `, { count: 'exact' })
                .order('created_at', { ascending: false });

            // Apply pagination
            const from = (pagination.page - 1) * pagination.pageSize;
            const to = from + pagination.pageSize - 1;
            query = query.range(from, to);

            const { data, error, count } = await query;

            if (error) throw error;

            setLogs(data || []);
            setPagination(prev => ({ ...prev, total: count || 0 }));
            logger.log('Audit logs loaded', data);
        } catch (error) {
            logger.error('Error loading audit logs', error);
            console.error('Failed to load audit logs:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadFilterOptions = async () => {
        try {
            // Get unique users who have audit logs
            const { data: userLogs } = await supabase
                .from('audit_logs')
                .select('user_id, profiles:user_id (full_name)')
                .not('user_id', 'is', null);

            const uniqueUsers = userLogs?.reduce((acc, log) => {
                if (log.user_id && log.profiles) {
                    acc[log.user_id] = log.profiles.full_name;
                }
                return acc;
            }, {}) || {};

            setUsers(Object.entries(uniqueUsers).map(([id, name]) => ({ id, name })));

            // Get unique tables
            const { data: tableLogs } = await supabase
                .from('audit_logs')
                .select('table_name')
                .not('table_name', 'is', null);

            const uniqueTables = [...new Set(tableLogs?.map(log => log.table_name).filter(Boolean))] || [];
            setTables(uniqueTables);

        } catch (error) {
            console.error('Error loading filter options:', error);
        }
    };

    const applyFilters = () => {
        let filtered = [...logs];

        // Search filter
        if (filters.search.trim()) {
            const searchLower = filters.search.toLowerCase();
            filtered = filtered.filter(log =>
                log.action?.toLowerCase().includes(searchLower) ||
                log.table_name?.toLowerCase().includes(searchLower) ||
                log.profiles?.full_name?.toLowerCase().includes(searchLower) ||
                log.ip_address?.includes(searchLower)
            );
        }

        // Action filter
        if (filters.action !== 'all') {
            filtered = filtered.filter(log => log.action === filters.action);
        }

        // Table filter
        if (filters.table !== 'all') {
            filtered = filtered.filter(log => log.table_name === filters.table);
        }

        // User filter
        if (filters.user !== 'all') {
            filtered = filtered.filter(log => log.user_id === filters.user);
        }

        // Date range filter
        if (filters.dateRange !== 'all') {
            const days = parseInt(filters.dateRange);
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - days);
            filtered = filtered.filter(log => new Date(log.created_at) >= cutoffDate);
        }

        setFilteredLogs(filtered);
    };

    const exportLogs = async () => {
        try {
            const csvData = [
                ['Date', 'User', 'Action', 'Table', 'Record ID', 'IP Address', 'User Agent'].join(','),
                ...filteredLogs.map(log => [
                    new Date(log.created_at).toLocaleString(),
                    log.profiles?.full_name || 'Unknown',
                    log.action || '',
                    log.table_name || '',
                    log.record_id || '',
                    log.ip_address || '',
                    log.user_agent || ''
                ].map(field => `"${field.toString().replace(/"/g, '""')}"`).join(','))
            ].join('\n');

            const blob = new Blob([csvData], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `audit_logs_${new Date().toISOString().split('T')[0]}.csv`;
            a.click();
            window.URL.revokeObjectURL(url);

            // Log the export action
            await supabase.rpc('log_audit_event', {
                p_user_id: user.id,
                p_action: 'EXPORT',
                p_table_name: 'audit_logs',
                p_metadata: { export_type: 'csv', record_count: filteredLogs.length }
            });

        } catch (error) {
            console.error('Error exporting logs:', error);
            alert('Error exporting logs');
        }
    };

    const clearOldLogs = async () => {
        const days = prompt('Delete audit logs older than how many days?', '90');
        if (!days || isNaN(days)) return;

        if (!confirm(`Are you sure you want to delete audit logs older than ${days} days? This action cannot be undone.`)) {
            return;
        }

        try {
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - parseInt(days));

            const { data, error } = await supabase
                .from('audit_logs')
                .delete()
                .lt('created_at', cutoffDate.toISOString());

            if (error) throw error;

            alert(`Successfully deleted old audit logs`);
            await loadAuditLogs();

        } catch (error) {
            console.error('Error clearing old logs:', error);
            alert('Error clearing old logs');
        }
    };

    const getActionIcon = (action) => {
        const icons = {
            'CREATE': '➕',
            'UPDATE': '✏️',
            'DELETE': '🗑️',
            'LOGIN': '🔐',
            'LOGOUT': '🔓',
            'EXPORT': '📤',
            'IMPORT': '📥',
            'APPROVE': '✅',
            'REJECT': '❌',
            'VIEW': '👁️'
        };
        return icons[action] || '📝';
    };

    const getActionColor = (action) => {
        const colors = {
            'CREATE': '#28a745',
            'UPDATE': '#007bff',
            'DELETE': '#dc3545',
            'LOGIN': '#17a2b8',
            'LOGOUT': '#6c757d',
            'EXPORT': '#fd7e14',
            'IMPORT': '#20c997',
            'APPROVE': '#28a745',
            'REJECT': '#dc3545',
            'VIEW': '#6f42c1'
        };
        return colors[action] || '#6c757d';
    };

    const formatJsonData = (data) => {
        if (!data) return '-';
        try {
            return JSON.stringify(data, null, 2);
        } catch {
            return data.toString();
        }
    };

    const totalPages = Math.ceil(pagination.total / pagination.pageSize);

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
                    <div className="loading-spinner">📋</div>
                    <p>Loading audit logs...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="view-container">
            <div className="audit-logs">
                <div className="logs-header">
                    <div className="header-left">
                        <h1>📋 Audit Logs</h1>
                        <p>{filteredLogs.length} of {pagination.total} records</p>
                    </div>
                    <div className="header-actions">
                        <button className="btn-secondary" onClick={exportLogs}>
                            📤 Export CSV
                        </button>
                        <button className="btn-danger" onClick={clearOldLogs}>
                            🗑️ Clear Old Logs
                        </button>
                        <button className="btn-primary" onClick={() => onNavigate('admin/dashboard')}>
                            ← Back to Dashboard
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="filters-section">
                    <div className="search-box">
                        <input
                            type="text"
                            placeholder="Search logs..."
                            value={filters.search}
                            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                            className="search-input"
                        />
                    </div>

                    <div className="filter-controls">
                        <select
                            value={filters.action}
                            onChange={(e) => setFilters(prev => ({ ...prev, action: e.target.value }))}
                            className="filter-select"
                        >
                            <option value="all">All Actions</option>
                            <option value="CREATE">Create</option>
                            <option value="UPDATE">Update</option>
                            <option value="DELETE">Delete</option>
                            <option value="LOGIN">Login</option>
                            <option value="EXPORT">Export</option>
                            <option value="IMPORT">Import</option>
                        </select>

                        <select
                            value={filters.table}
                            onChange={(e) => setFilters(prev => ({ ...prev, table: e.target.value }))}
                            className="filter-select"
                        >
                            <option value="all">All Tables</option>
                            {tables.map(table => (
                                <option key={table} value={table}>{table}</option>
                            ))}
                        </select>

                        <select
                            value={filters.user}
                            onChange={(e) => setFilters(prev => ({ ...prev, user: e.target.value }))}
                            className="filter-select"
                        >
                            <option value="all">All Users</option>
                            {users.map(u => (
                                <option key={u.id} value={u.id}>{u.name}</option>
                            ))}
                        </select>

                        <select
                            value={filters.dateRange}
                            onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                            className="filter-select"
                        >
                            <option value="all">All Time</option>
                            <option value="1">Last 24 Hours</option>
                            <option value="7">Last 7 Days</option>
                            <option value="30">Last 30 Days</option>
                            <option value="90">Last 90 Days</option>
                        </select>
                    </div>
                </div>

                {/* Logs Table */}
                <div className="logs-table-container">
                    <table className="logs-table">
                        <thead>
                            <tr>
                                <th>Time</th>
                                <th>User</th>
                                <th>Action</th>
                                <th>Table</th>
                                <th>Record ID</th>
                                <th>IP Address</th>
                                <th>Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredLogs.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="empty-state">
                                        No audit logs found matching the current filters
                                    </td>
                                </tr>
                            ) : (
                                filteredLogs.map(log => (
                                    <tr key={log.id} className="log-row">
                                        <td className="time-cell">
                                            <div className="time-primary">
                                                {new Date(log.created_at).toLocaleDateString()}
                                            </div>
                                            <div className="time-secondary">
                                                {new Date(log.created_at).toLocaleTimeString()}
                                            </div>
                                        </td>
                                        <td className="user-cell">
                                            <div className="user-name">
                                                {log.profiles?.full_name || 'System'}
                                            </div>
                                            <div className="user-email">
                                                {log.profiles?.email || '-'}
                                            </div>
                                        </td>
                                        <td className="action-cell">
                                            <span
                                                className="action-badge"
                                                style={{ backgroundColor: getActionColor(log.action) }}
                                            >
                                                {getActionIcon(log.action)} {log.action}
                                            </span>
                                        </td>
                                        <td className="table-cell">
                                            {log.table_name || '-'}
                                        </td>
                                        <td className="record-cell">
                                            {log.record_id ? (
                                                <code className="record-id">
                                                    {log.record_id.slice(0, 8)}...
                                                </code>
                                            ) : '-'}
                                        </td>
                                        <td className="ip-cell">
                                            {log.ip_address || '-'}
                                        </td>
                                        <td className="details-cell">
                                            <div className="details-dropdown">
                                                <button className="details-btn">👁️ View</button>
                                                <div className="dropdown-details">
                                                    {log.old_values && (
                                                        <div className="detail-section">
                                                            <h4>Old Values:</h4>
                                                            <pre>{formatJsonData(log.old_values)}</pre>
                                                        </div>
                                                    )}
                                                    {log.new_values && (
                                                        <div className="detail-section">
                                                            <h4>New Values:</h4>
                                                            <pre>{formatJsonData(log.new_values)}</pre>
                                                        </div>
                                                    )}
                                                    {log.metadata && (
                                                        <div className="detail-section">
                                                            <h4>Metadata:</h4>
                                                            <pre>{formatJsonData(log.metadata)}</pre>
                                                        </div>
                                                    )}
                                                    {log.user_agent && (
                                                        <div className="detail-section">
                                                            <h4>User Agent:</h4>
                                                            <p>{log.user_agent}</p>
                                                        </div>
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

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="pagination">
                        <button
                            className="pagination-btn"
                            onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                            disabled={pagination.page === 1}
                        >
                            ← Previous
                        </button>

                        <span className="pagination-info">
                            Page {pagination.page} of {totalPages}
                        </span>

                        <button
                            className="pagination-btn"
                            onClick={() => setPagination(prev => ({ ...prev, page: Math.min(totalPages, prev.page + 1) }))}
                            disabled={pagination.page === totalPages}
                        >
                            Next →
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AuditLogs;