import { useEffect, useState } from 'react';
import { DB_TABLES } from '../../config/dbConfig';
import { supabase } from '../../config/supabaseClient';
import logger from '../../utils/logger';
import './FamilyTree.css';

const FamilyTreeView = ({ user, t, onNavigate }) => {
    const [familyMembers, setFamilyMembers] = useState([]);
    const [viewMode, setViewMode] = useState('cards'); // 'cards', 'tree', 'list'
    const [selectedMember, setSelectedMember] = useState(null);
    const [showMemberModal, setShowMemberModal] = useState(false);
    const [editingMember, setEditingMember] = useState(null);

    // Fetch family members from Supabase on mount
    useEffect(() => {
        fetchMembers();
    }, [user]);

    const fetchMembers = async () => {
        if (!user?.id) return;
        logger.log('Fetching family members for user', user.id);
        const { data, error } = await supabase
            .from(DB_TABLES.FAMILY_MEMBERS)
            .select('*')
            .eq('user_id', user.id);
        if (data) {
            setFamilyMembers(data);
            logger.log('Family members loaded', data);
        }
        if (error) {
            logger.error('Error fetching family members', error);
        }
    };

    const handleAddMember = () => {
        if (onNavigate) {
            onNavigate('addFamilyMember');
        }
    };

    const handleViewMember = (member) => {
        setSelectedMember(member);
        setEditingMember(null);
        setShowMemberModal(true);
    };

    const handleEditMember = (member) => {
        setSelectedMember(member);
        setEditingMember({ ...member });
        setShowMemberModal(true);
    };

    const handleDeleteMember = async (memberId) => {
        if (!window.confirm(t ? t('confirmDelete') : 'Are you sure you want to delete this family member?')) {
            return;
        }

        try {
            const { error } = await supabase
                .from(DB_TABLES.FAMILY_MEMBERS)
                .delete()
                .eq('id', memberId);

            if (error) throw error;

            logger.log('Family member deleted successfully');
            fetchMembers(); // Refresh the list
        } catch (error) {
            logger.error('Error deleting family member', error);
            alert(t ? t('errorDeleting') : 'Error deleting family member');
        }
    };

    const handleSaveMember = async () => {
        if (!editingMember) return;

        try {
            const { error } = await supabase
                .from(DB_TABLES.FAMILY_MEMBERS)
                .update(editingMember)
                .eq('id', editingMember.id);

            if (error) throw error;

            logger.log('Family member updated successfully');
            fetchMembers(); // Refresh the list
            setShowMemberModal(false);
            setEditingMember(null);
        } catch (error) {
            logger.error('Error updating family member', error);
            alert(t ? t('errorUpdating') : 'Error updating family member');
        }
    };

    const handleInputChange = (field, value) => {
        setEditingMember(prev => ({
            ...prev,
            [field]: value
        }));
    };
    const getRelationshipIcon = (relationship) => {
        const icons = {
            spouse: '💑',
            parent: '👨‍👩‍👧‍👦',
            child: '👶',
            sibling: '👫',
            grandparent: '👴',
            grandchild: '🧒',
            'uncle-aunt': '👨‍👩‍👧',
            cousin: '👥',
            other: '👤'
        };
        return icons[relationship] || '👤';
    };
    const renderFamilyTreeView = () => {
        if (familyMembers.length === 0) {
            return (
                <div className="empty-state">
                    <div className="empty-icon">👨‍👩‍👧‍👦</div>
                    <h3>{t ? t('noFamilyMembers') : 'No family members found'}</h3>
                    <p>{t ? t('startByAdding') : 'Start by adding your first family member'}</p>
                </div>
            );
        }

        if (viewMode === 'list') {
            return (
                <div className="family-list-view">
                    {familyMembers.map(member => (
                        <div key={member.id} className="family-list-item">
                            <div className="list-item-icon">{getRelationshipIcon(member.relationship)}</div>
                            <div className="list-item-info">
                                <h4>{member.name}</h4>
                                <span className="relationship-tag">{t ? t(member.relationship) : member.relationship}</span>
                                <span className="age-info">{member.age} {t ? t('yearsOld') : 'years old'}</span>
                            </div>
                            <div className="list-item-actions">
                                <button onClick={() => handleViewMember(member)} className="view-btn">👁️</button>
                                <button onClick={() => handleEditMember(member)} className="edit-btn">✏️</button>
                                <button onClick={() => handleDeleteMember(member.id)} className="delete-btn">🗑️</button>
                            </div>
                        </div>
                    ))}
                </div>
            );
        }

        if (viewMode === 'tree') {
            const groupedMembers = familyMembers.reduce((acc, member) => {
                if (!acc[member.relationship]) acc[member.relationship] = [];
                acc[member.relationship].push(member);
                return acc;
            }, {});

            return (
                <div className="family-tree-view">
                    {Object.entries(groupedMembers).map(([relationship, members]) => (
                        <div key={relationship} className="relationship-group">
                            <h3 className="relationship-header">
                                {getRelationshipIcon(relationship)} {t ? t(relationship) : relationship}
                            </h3>
                            <div className="members-in-group">
                                {members.map(member => (
                                    <div key={member.id} className="tree-member-card">
                                        <div className="tree-member-info">
                                            <h4>{member.name}</h4>
                                            <p>{member.age} {t ? t('yearsOld') : 'years old'}</p>
                                            {member.profession && <p className="profession">{member.profession}</p>}
                                            {member.school && <p className="school">{member.school}</p>}
                                        </div>
                                        <div className="tree-member-actions">
                                            <button onClick={() => handleViewMember(member)} className="view-btn">👁️</button>
                                            <button onClick={() => handleEditMember(member)} className="edit-btn">✏️</button>
                                            <button onClick={() => handleDeleteMember(member.id)} className="delete-btn">🗑️</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            );
        }

        // Default cards view
        return (
            <div className="family-tree-cards">
                {familyMembers.map(member => (
                    <div key={member.id} className="family-member-card">
                        <div className="member-icon" style={{ fontSize: 32 }}>{getRelationshipIcon(member.relationship)}</div>
                        <div className="member-info">
                            <h3>{member.name}</h3>
                            <p>{t ? t(member.relationship) : member.relationship} | {member.age} {t ? t('yearsOld') : 'years old'}</p>
                            {member.profession && <p>{member.profession}</p>}
                            {member.school && <p>{member.school}</p>}
                        </div>
                        <div className="member-actions">
                            <button onClick={() => handleViewMember(member)} className="view-btn" title={t ? t('view') : 'View'}>👁️</button>
                            <button onClick={() => handleEditMember(member)} className="edit-btn" title={t ? t('edit') : 'Edit'}>✏️</button>
                            <button onClick={() => handleDeleteMember(member.id)} className="delete-btn" title={t ? t('delete') : 'Delete'}>🗑️</button>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="view-container">
            <div className="family-tree-header">
                <h1>{t ? t('familyTree') : 'Family Tree'}</h1>

                {familyMembers.length > 0 && (
                    <div className="view-mode-selector">
                        <button
                            className={`view-mode-btn ${viewMode === 'cards' ? 'active' : ''}`}
                            onClick={() => setViewMode('cards')}
                            title={t ? t('cardView') : 'Card View'}
                        >
                            🔲
                        </button>
                        <button
                            className={`view-mode-btn ${viewMode === 'list' ? 'active' : ''}`}
                            onClick={() => setViewMode('list')}
                            title={t ? t('listView') : 'List View'}
                        >
                            📝
                        </button>
                        <button
                            className={`view-mode-btn ${viewMode === 'tree' ? 'active' : ''}`}
                            onClick={() => setViewMode('tree')}
                            title={t ? t('treeView') : 'Tree View'}
                        >
                            🌳
                        </button>
                    </div>
                )}
            </div>

            {renderFamilyTreeView()}

            <button
                className="add-btn family-add-btn"
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
                onClick={handleAddMember}
            >
                {t ? t('addFamilyMember') : 'Add Family Member'}
            </button>

            {/* Member Detail/Edit Modal */}
            {showMemberModal && selectedMember && (
                <div className="modal-overlay" onClick={() => setShowMemberModal(false)}>
                    <div className="member-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editingMember ? (t ? t('editMember') : 'Edit Member') : (t ? t('memberDetails') : 'Member Details')}</h2>
                            <button className="close-btn" onClick={() => setShowMemberModal(false)}>✕</button>
                        </div>

                        <div className="modal-content">
                            {editingMember ? (
                                <div className="edit-form">
                                    <div className="form-group">
                                        <label>{t ? t('name') : 'Name'}:</label>
                                        <input
                                            type="text"
                                            value={editingMember.name || ''}
                                            onChange={(e) => handleInputChange('name', e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>{t ? t('age') : 'Age'}:</label>
                                        <input
                                            type="number"
                                            value={editingMember.age || ''}
                                            onChange={(e) => handleInputChange('age', e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>{t ? t('relationship') : 'Relationship'}:</label>
                                        <select
                                            value={editingMember.relationship || ''}
                                            onChange={(e) => handleInputChange('relationship', e.target.value)}
                                        >
                                            <option value="parent">{t ? t('parent') : 'Parent'}</option>
                                            <option value="spouse">{t ? t('spouse') : 'Spouse'}</option>
                                            <option value="child">{t ? t('child') : 'Child'}</option>
                                            <option value="sibling">{t ? t('sibling') : 'Sibling'}</option>
                                            <option value="grandparent">{t ? t('grandparent') : 'Grandparent'}</option>
                                            <option value="grandchild">{t ? t('grandchild') : 'Grandchild'}</option>
                                            <option value="uncle-aunt">{t ? t('uncle-aunt') : 'Uncle/Aunt'}</option>
                                            <option value="cousin">{t ? t('cousin') : 'Cousin'}</option>
                                            <option value="other">{t ? t('other') : 'Other'}</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>{t ? t('profession') : 'Profession'}:</label>
                                        <input
                                            type="text"
                                            value={editingMember.profession || ''}
                                            onChange={(e) => handleInputChange('profession', e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>{t ? t('school') : 'School'}:</label>
                                        <input
                                            type="text"
                                            value={editingMember.school || ''}
                                            onChange={(e) => handleInputChange('school', e.target.value)}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="member-details">
                                    <div className="detail-icon">{getRelationshipIcon(selectedMember.relationship)}</div>
                                    <h3>{selectedMember.name}</h3>
                                    <p><strong>{t ? t('relationship') : 'Relationship'}:</strong> {t ? t(selectedMember.relationship) : selectedMember.relationship}</p>
                                    <p><strong>{t ? t('age') : 'Age'}:</strong> {selectedMember.age} {t ? t('yearsOld') : 'years old'}</p>
                                    {selectedMember.profession && <p><strong>{t ? t('profession') : 'Profession'}:</strong> {selectedMember.profession}</p>}
                                    {selectedMember.school && <p><strong>{t ? t('school') : 'School'}:</strong> {selectedMember.school}</p>}
                                    {selectedMember.dateOfBirth && <p><strong>{t ? t('dateOfBirth') : 'Date of Birth'}:</strong> {selectedMember.dateOfBirth}</p>}
                                    {selectedMember.gender && <p><strong>{t ? t('gender') : 'Gender'}:</strong> {selectedMember.gender}</p>}
                                    {selectedMember.hobbies && <p><strong>{t ? t('hobbies') : 'Hobbies'}:</strong> {selectedMember.hobbies}</p>}
                                </div>
                            )}
                        </div>

                        <div className="modal-actions">
                            {editingMember ? (
                                <>
                                    <button className="cancel-btn" onClick={() => setEditingMember(null)}>
                                        {t ? t('cancel') : 'Cancel'}
                                    </button>
                                    <button className="save-btn" onClick={handleSaveMember}>
                                        {t ? t('save') : 'Save'}
                                    </button>
                                </>
                            ) : (
                                <button className="edit-btn" onClick={() => handleEditMember(selectedMember)}>
                                    {t ? t('edit') : 'Edit'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FamilyTreeView;