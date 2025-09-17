import { useState } from 'react';

const DocumentsView = ({ user, t }) => {
    const [userRole] = useState('member');
    const [documents] = useState([
        {
            id: 1,
            title: t('communityCharterBylaws') || 'Community Charter & Bylaws',
            description: t('officialCommunityCharter') || 'Official community charter and governing bylaws.',
            category: 'governance',
            accessLevel: 'public',
            fileType: 'PDF',
            fileSize: '2.3 MB',
            lastUpdated: '2024-01-15',
            downloadCount: 89
        },
        {
            id: 2,
            title: t('familyTreeTemplate') || 'Family Tree Template',
            description: t('downloadableTemplate') || 'Downloadable template for documenting your family tree.',
            category: 'resources',
            accessLevel: 'member',
            fileType: 'DOCX',
            fileSize: '156 KB',
            lastUpdated: '2024-01-20',
            downloadCount: 234
        },
        {
            id: 3,
            title: t('meetingMinutesDec') || 'Meeting Minutes - December 2024',
            description: t('minutesFromDecember') || 'Minutes from the December community board meeting.',
            category: 'meetings',
            accessLevel: 'committee',
            fileType: 'PDF',
            fileSize: '1.1 MB',
            lastUpdated: '2024-12-15',
            downloadCount: 45
        },
        {
            id: 4,
            title: t('eventPlanningGuidelines') || 'Event Planning Guidelines',
            description: t('comprehensiveGuide') || 'Comprehensive guide for organizing community events.',
            category: 'guidelines',
            accessLevel: 'committee',
            fileType: 'PDF',
            fileSize: '3.2 MB',
            lastUpdated: '2024-01-10',
            downloadCount: 67
        }
    ]);
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