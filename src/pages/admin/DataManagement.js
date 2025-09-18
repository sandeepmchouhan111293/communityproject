import { useEffect, useState } from 'react';
import { supabase } from '../../config/supabaseClient';
import { DB_TABLES } from '../../config/dbConfig';
import logger from '../../utils/logger';
import './DataManagement.css';

const DataManagement = ({ user, t, onNavigate }) => {
    const [loading, setLoading] = useState(false);
    const [jobs, setJobs] = useState([]);
    const [selectedTable, setSelectedTable] = useState('family_members');
    const [importFile, setImportFile] = useState(null);
    const [exportFormat, setExportFormat] = useState('csv');
    const [duplicates, setDuplicates] = useState([]);
    const [qualityIssues, setQualityIssues] = useState([]);

    const availableTables = [
        { value: 'profiles', label: 'User Profiles', description: 'User account information and profiles' },
        { value: 'family_members', label: 'Family Members', description: 'Individual family member records' },
        { value: 'events', label: 'Events', description: 'Community events and activities' },
        { value: 'documents', label: 'Documents', description: 'Uploaded files and documents' },
        { value: 'volunteer', label: 'Volunteers', description: 'Volunteer assignments and records' },
        { value: 'discussions', label: 'Discussions', description: 'Community discussion posts' }
    ];

    useEffect(() => {
        if (user?.role === 'admin') {
            loadDataJobs();
            loadQualityIssues();
        }
    }, [user]);

    const loadDataJobs = async () => {
        try {
            const { data, error } = await supabase
                .from('data_jobs')
                .select(`
                    *,
                    profiles:user_id (full_name)
                `)
                .order('created_at', { ascending: false })
                .limit(20);

            if (error) throw error;
            setJobs(data || []);
        } catch (error) {
            console.error('Error loading data jobs:', error);
        }
    };

    const loadQualityIssues = async () => {
        try {
            const { data, error } = await supabase
                .from('data_quality_issues')
                .select('*')
                .eq('status', 'open')
                .order('severity', { ascending: false })
                .limit(50);

            if (error) throw error;
            setQualityIssues(data || []);
        } catch (error) {
            console.error('Error loading quality issues:', error);
        }
    };

    const exportData = async () => {
        setLoading(true);
        try {
            // Create a job record first
            const { data: job, error: jobError } = await supabase
                .from('data_jobs')
                .insert({
                    user_id: user.id,
                    job_type: 'export',
                    table_name: selectedTable,
                    status: 'processing'
                })
                .select()
                .single();

            if (jobError) throw jobError;

            // Fetch data from selected table
            const { data, error } = await supabase
                .from(selectedTable)
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            let exportData;
            let filename;
            let mimeType;

            if (exportFormat === 'csv') {
                if (data.length > 0) {
                    const headers = Object.keys(data[0]);
                    const csvContent = [
                        headers.join(','),
                        ...data.map(row =>
                            headers.map(header => {
                                const value = row[header];
                                if (value === null || value === undefined) return '';
                                if (typeof value === 'object') return JSON.stringify(value);
                                if (typeof value === 'string' && value.includes(',')) return `"${value}"`;
                                return value;
                            }).join(',')
                        )
                    ].join('\n');
                    exportData = csvContent;
                } else {
                    exportData = '';
                }
                filename = `${selectedTable}_export_${new Date().toISOString().split('T')[0]}.csv`;
                mimeType = 'text/csv';
            } else {
                exportData = JSON.stringify(data, null, 2);
                filename = `${selectedTable}_export_${new Date().toISOString().split('T')[0]}.json`;
                mimeType = 'application/json';
            }

            // Update job as completed
            await supabase
                .from('data_jobs')
                .update({
                    status: 'completed',
                    processed_records: data.length,
                    total_records: data.length,
                    completed_at: new Date().toISOString()
                })
                .eq('id', job.id);

            // Trigger download
            const blob = new Blob([exportData], { type: mimeType });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.click();
            window.URL.revokeObjectURL(url);

            // Log audit event
            await supabase.rpc('log_audit_event', {
                p_user_id: user.id,
                p_action: 'EXPORT',
                p_table_name: selectedTable,
                p_metadata: { format: exportFormat, record_count: data.length }
            });

            alert(`Successfully exported ${data.length} records`);
            await loadDataJobs();

        } catch (error) {
            console.error('Error exporting data:', error);
            alert('Error exporting data: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleFileImport = async () => {
        if (!importFile) {
            alert('Please select a file to import');
            return;
        }

        setLoading(true);
        try {
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    let importData;
                    const content = e.target.result;

                    if (importFile.name.endsWith('.csv')) {
                        // Parse CSV
                        const lines = content.split('\n').filter(line => line.trim());
                        if (lines.length < 2) {
                            throw new Error('CSV file must have at least a header and one data row');
                        }

                        const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
                        importData = lines.slice(1).map(line => {
                            const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
                            const row = {};
                            headers.forEach((header, index) => {
                                row[header] = values[index] || null;
                            });
                            return row;
                        });
                    } else {
                        // Parse JSON
                        importData = JSON.parse(content);
                        if (!Array.isArray(importData)) {
                            throw new Error('JSON file must contain an array of objects');
                        }
                    }

                    // Create job record
                    const { data: job, error: jobError } = await supabase
                        .from('data_jobs')
                        .insert({
                            user_id: user.id,
                            job_type: 'import',
                            table_name: selectedTable,
                            status: 'processing',
                            total_records: importData.length
                        })
                        .select()
                        .single();

                    if (jobError) throw jobError;

                    let successCount = 0;
                    let errorCount = 0;
                    const errors = [];

                    // Process imports in batches
                    const batchSize = 100;
                    for (let i = 0; i < importData.length; i += batchSize) {
                        const batch = importData.slice(i, i + batchSize);

                        try {
                            const { error } = await supabase
                                .from(selectedTable)
                                .insert(batch);

                            if (error) {
                                errorCount += batch.length;
                                errors.push(`Batch ${Math.floor(i/batchSize) + 1}: ${error.message}`);
                            } else {
                                successCount += batch.length;
                            }
                        } catch (batchError) {
                            errorCount += batch.length;
                            errors.push(`Batch ${Math.floor(i/batchSize) + 1}: ${batchError.message}`);
                        }

                        // Update progress
                        await supabase
                            .from('data_jobs')
                            .update({
                                processed_records: i + batch.length,
                                progress: Math.round(((i + batch.length) / importData.length) * 100)
                            })
                            .eq('id', job.id);
                    }

                    // Update final job status
                    await supabase
                        .from('data_jobs')
                        .update({
                            status: errorCount === 0 ? 'completed' : 'completed',
                            completed_at: new Date().toISOString(),
                            error_log: errors.length > 0 ? errors.join('\n') : null
                        })
                        .eq('id', job.id);

                    // Log audit event
                    await supabase.rpc('log_audit_event', {
                        p_user_id: user.id,
                        p_action: 'IMPORT',
                        p_table_name: selectedTable,
                        p_metadata: {
                            success_count: successCount,
                            error_count: errorCount,
                            total_count: importData.length
                        }
                    });

                    alert(`Import completed!\nSuccessful: ${successCount}\nErrors: ${errorCount}`);
                    setImportFile(null);
                    await loadDataJobs();

                } catch (parseError) {
                    console.error('Error parsing import file:', parseError);
                    alert('Error parsing import file: ' + parseError.message);
                }
            };

            reader.readAsText(importFile);

        } catch (error) {
            console.error('Error importing data:', error);
            alert('Error importing data: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const runDataQualityCheck = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase.rpc('detect_data_quality_issues');
            if (error) throw error;

            await loadQualityIssues();
            alert(`Data quality check completed. Found ${data} issues.`);
        } catch (error) {
            console.error('Error running data quality check:', error);
            alert('Error running data quality check');
        } finally {
            setLoading(false);
        }
    };

    const resolveQualityIssue = async (issueId, resolution) => {
        try {
            const { error } = await supabase
                .from('data_quality_issues')
                .update({
                    status: 'resolved',
                    resolved_by: user.id,
                    resolved_at: new Date().toISOString(),
                    resolution_notes: resolution
                })
                .eq('id', issueId);

            if (error) throw error;

            await loadQualityIssues();
            alert('Issue resolved successfully');
        } catch (error) {
            console.error('Error resolving issue:', error);
            alert('Error resolving issue');
        }
    };

    const getJobStatusColor = (status) => {
        switch (status) {
            case 'completed': return '#28a745';
            case 'processing': return '#007bff';
            case 'failed': return '#dc3545';
            case 'pending': return '#ffc107';
            default: return '#6c757d';
        }
    };

    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'critical': return '#dc3545';
            case 'high': return '#fd7e14';
            case 'medium': return '#ffc107';
            case 'low': return '#28a745';
            default: return '#6c757d';
        }
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

    return (
        <div className="view-container">
            <div className="data-management">
                <div className="management-header">
                    <div className="header-left">
                        <h1>📊 Data Management</h1>
                        <p>Import, export, and manage data quality</p>
                    </div>
                    <button className="btn-primary" onClick={() => onNavigate('admin/dashboard')}>
                        ← Back to Dashboard
                    </button>
                </div>

                <div className="management-grid">
                    {/* Import/Export Section */}
                    <div className="management-card">
                        <h3>📤 Export Data</h3>
                        <div className="export-controls">
                            <div className="form-group">
                                <label>Select Table:</label>
                                <select
                                    value={selectedTable}
                                    onChange={(e) => setSelectedTable(e.target.value)}
                                    className="form-select"
                                >
                                    {availableTables.map(table => (
                                        <option key={table.value} value={table.value}>
                                            {table.label}
                                        </option>
                                    ))}
                                </select>
                                <small>{availableTables.find(t => t.value === selectedTable)?.description}</small>
                            </div>

                            <div className="form-group">
                                <label>Export Format:</label>
                                <select
                                    value={exportFormat}
                                    onChange={(e) => setExportFormat(e.target.value)}
                                    className="form-select"
                                >
                                    <option value="csv">CSV (Comma Separated)</option>
                                    <option value="json">JSON (JavaScript Object)</option>
                                </select>
                            </div>

                            <button
                                className="btn-primary"
                                onClick={exportData}
                                disabled={loading}
                            >
                                {loading ? '⏳ Exporting...' : '📤 Export Data'}
                            </button>
                        </div>
                    </div>

                    {/* Import Section */}
                    <div className="management-card">
                        <h3>📥 Import Data</h3>
                        <div className="import-controls">
                            <div className="form-group">
                                <label>Select File:</label>
                                <input
                                    type="file"
                                    accept=".csv,.json"
                                    onChange={(e) => setImportFile(e.target.files[0])}
                                    className="form-file"
                                />
                                <small>Supported formats: CSV, JSON</small>
                            </div>

                            <div className="form-group">
                                <label>Target Table:</label>
                                <select
                                    value={selectedTable}
                                    onChange={(e) => setSelectedTable(e.target.value)}
                                    className="form-select"
                                >
                                    {availableTables.map(table => (
                                        <option key={table.value} value={table.value}>
                                            {table.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <button
                                className="btn-primary"
                                onClick={handleFileImport}
                                disabled={loading || !importFile}
                            >
                                {loading ? '⏳ Importing...' : '📥 Import Data'}
                            </button>
                        </div>
                    </div>

                    {/* Data Quality Section */}
                    <div className="management-card full-width">
                        <div className="card-header">
                            <h3>🔍 Data Quality Issues</h3>
                            <button
                                className="btn-secondary"
                                onClick={runDataQualityCheck}
                                disabled={loading}
                            >
                                {loading ? '⏳ Checking...' : '🔧 Run Quality Check'}
                            </button>
                        </div>

                        <div className="quality-issues">
                            {qualityIssues.length === 0 ? (
                                <div className="empty-state">
                                    <p>✅ No data quality issues found</p>
                                </div>
                            ) : (
                                <div className="issues-list">
                                    {qualityIssues.map(issue => (
                                        <div key={issue.id} className="issue-item">
                                            <div className="issue-header">
                                                <span
                                                    className="severity-badge"
                                                    style={{ backgroundColor: getSeverityColor(issue.severity) }}
                                                >
                                                    {issue.severity}
                                                </span>
                                                <span className="issue-type">{issue.issue_type}</span>
                                                <span className="issue-table">{issue.table_name}</span>
                                            </div>
                                            <div className="issue-description">
                                                {issue.description}
                                            </div>
                                            <div className="issue-actions">
                                                <button
                                                    className="btn-small"
                                                    onClick={() => {
                                                        const resolution = prompt('Enter resolution notes:');
                                                        if (resolution) {
                                                            resolveQualityIssue(issue.id, resolution);
                                                        }
                                                    }}
                                                >
                                                    ✅ Resolve
                                                </button>
                                                <button
                                                    className="btn-small secondary"
                                                    onClick={() => resolveQualityIssue(issue.id, 'Ignored by admin')}
                                                >
                                                    ❌ Ignore
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Recent Jobs */}
                    <div className="management-card full-width">
                        <h3>📋 Recent Data Jobs</h3>
                        <div className="jobs-list">
                            {jobs.length === 0 ? (
                                <div className="empty-state">
                                    <p>No data jobs found</p>
                                </div>
                            ) : (
                                <div className="jobs-table">
                                    <div className="table-header">
                                        <div>Type</div>
                                        <div>Table</div>
                                        <div>Status</div>
                                        <div>Progress</div>
                                        <div>User</div>
                                        <div>Date</div>
                                    </div>
                                    {jobs.map(job => (
                                        <div key={job.id} className="table-row">
                                            <div className="job-type">
                                                {job.job_type === 'import' ? '📥' : '📤'} {job.job_type}
                                            </div>
                                            <div>{job.table_name}</div>
                                            <div>
                                                <span
                                                    className="status-badge"
                                                    style={{ backgroundColor: getJobStatusColor(job.status) }}
                                                >
                                                    {job.status}
                                                </span>
                                            </div>
                                            <div className="progress-cell">
                                                <div className="progress-bar">
                                                    <div
                                                        className="progress-fill"
                                                        style={{ width: `${job.progress || 0}%` }}
                                                    ></div>
                                                </div>
                                                <span>{job.processed_records || 0}/{job.total_records || 0}</span>
                                            </div>
                                            <div>{job.profiles?.full_name || 'Unknown'}</div>
                                            <div>{new Date(job.created_at).toLocaleDateString()}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DataManagement;