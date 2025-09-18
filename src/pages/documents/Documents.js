import { useEffect, useState } from 'react';
import { DB_TABLES } from '../../config/dbConfig';
import { supabase } from '../../config/supabaseClient';

const DocumentsView = ({ user, t, onNavigate }) => {
    const [userRole] = useState('member');
    const [documents, setDocuments] = useState([]);

    useEffect(() => {
        const fetchDocuments = async () => {
            const { data, error } = await supabase
                .from(DB_TABLES.DOCUMENTS)
                .select('*');
            if (data) setDocuments(data);
        };
        fetchDocuments();
    }, []);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const getAccessIcon = (accessLevel) => {
        const icons = {
            public: '🌐',
            member: '👤',
            committee: '👥',
            admin: '🔒'
        };
        return icons[accessLevel] || '📄';
    };
    const getCategoryIcon = (category) => {
        const icons = {
            governance: '⚖️',
            resources: '📚',
            meetings: '📝',
            guidelines: '📋',
            forms: '📑'
        };
        return icons[category] || '📄';
    };
    const canAccess = (docAccessLevel) => {
        const accessHierarchy = ['public', 'member', 'committee', 'admin'];
        const userIndex = accessHierarchy.indexOf(userRole);
        const docIndex = accessHierarchy.indexOf(docAccessLevel);
        return userIndex >= docIndex;
    };
    const filteredDocuments = documents.filter(doc => {
        const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doc.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
        const hasAccess = canAccess(doc.accessLevel);
        return matchesSearch && matchesCategory && hasAccess;
    });
    return (
        <div className="view-container">
            <h1>{t ? t('communityDocuments') : 'Community Documents'}</h1>
            <button
                className="add-btn document-add-btn"
                style={{
                    background: 'linear-gradient(90deg, #d4a574 0%, #f7e7ce 100%)',
                    color: '#6d3d14',
                    border: 'none',
                    borderRadius: '24px',
                    fontWeight: 600,
                    fontSize: '1.1rem',
                    padding: '10px 28px',
                    margin: '16px 0 24px 0',
                    boxShadow: '0 2px 8px #e6c9a0',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                }}
                onClick={() => onNavigate && onNavigate('addDocument')}
            >
                {t ? t('addDocument') : 'Add Document'}
            </button>
            <div className="documents-list">
                {filteredDocuments.length === 0 ? (
                    <p>{t ? t('noDocumentsFound') : 'No documents found.'}</p>
                ) : (
                    filteredDocuments.map(doc => (
                        <div key={doc.id} className="document-card">
                            <div className="document-header">
                                <span className="document-icon">{getCategoryIcon(doc.category)}</span>
                                <span className="access-indicator">{getAccessIcon(doc.accessLevel)}</span>
                            </div>
                            <div className="document-content">
                                <h3>{doc.title}</h3>
                                <p>{doc.description}</p>
                                <div className="document-meta">
                                    <span>{doc.fileType}</span> | <span>{doc.fileSize}</span> | <span>{new Date(doc.lastUpdated).toLocaleDateString()}</span>
                                </div>
                                <div className="document-actions">
                                    <button className="download-btn">{t ? t('download') : 'Download'}</button>
                                    <button className="preview-btn">{t ? t('preview') : 'Preview'}</button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default DocumentsView;