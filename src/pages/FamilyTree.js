import { useEffect, useState } from 'react';
import { DB_TABLES } from '../dbConfig';
import { supabase } from '../supabaseClient';
import logger from '../utils/logger';

const FamilyTreeView = ({ user, t, onNavigate }) => {
    const [familyMembers, setFamilyMembers] = useState([]);

    // Fetch family members from Supabase on mount
    useEffect(() => {
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
        fetchMembers();
    }, [user]);

    const handleAddMember = () => {
        if (onNavigate) {
            onNavigate('addFamilyMember');
        }
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
    return (
        <div className="view-container">
            <h1>{t ? t('familyTree') : 'Family Tree'}</h1>
            <div className="family-tree-cards">
                {familyMembers.length === 0 ? (
                    <p>{t ? t('noFamilyMembers') : 'No family members found.'}</p>
                ) : (
                    familyMembers.map(member => (
                        <div key={member.id} className="family-member-card">
                            <div className="member-icon" style={{ fontSize: 32 }}>{getRelationshipIcon(member.relationship)}</div>
                            <div className="member-info">
                                <h3>{member.name}</h3>
                                <p>{t ? t(member.relationship) : member.relationship} | {member.age} {t ? t('yearsOld') : 'years old'}</p>
                                {member.profession && <p>{member.profession}</p>}
                                {member.school && <p>{member.school}</p>}
                            </div>
                        </div>
                    ))
                )}
            </div>
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
        </div>
    );
};

export default FamilyTreeView;