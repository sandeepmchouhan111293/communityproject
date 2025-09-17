import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import logger from '../utils/logger';

const FamilyTreeView = ({ user, t }) => {
    const [viewMode, setViewMode] = useState('cards');
    const [showAddMemberForm, setShowAddMemberForm] = useState(false);
    const [memberFormStep, setMemberFormStep] = useState(1);
    const [selectedMember, setSelectedMember] = useState(null);
    const [showMemberDetail, setShowMemberDetail] = useState(false);
    const [familyMembers, setFamilyMembers] = useState([]);
    // Fetch family members from Supabase on mount
    useEffect(() => {
        const fetchMembers = async () => {
            if (!user?.id) return;
            logger.log('Fetching family members for user', user.id);
            const { data, error } = await supabase
                .from('family_members')
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
    const [memberData, setMemberData] = useState({
        relationship: '',
        ageCategory: '',
        name: '',
        dateOfBirth: '',
        age: '',
        gender: '',
        profileImage: null,
        school: '',
        class: '',
        hobbies: '',
        achievements: '',
        highestQualification: '',
        profession: '',
        employer: '',
        maritalStatus: '',
        volunteerInterests: ''
    });
    const handleAddMember = () => {
        setShowAddMemberForm(true);
        setMemberFormStep(1);
        setSelectedMember(null);
        setMemberData({
            relationship: '',
            ageCategory: '',
            name: '',
            dateOfBirth: '',
            age: '',
            gender: '',
            profileImage: null,
            school: '',
            class: '',
            hobbies: '',
            achievements: '',
            highestQualification: '',
            profession: '',
            employer: '',
            maritalStatus: '',
            volunteerInterests: ''
        });
    };
    const handleInputChange = (field, value) => {
        setMemberData(prev => ({
            ...prev,
            [field]: value
        }));
    };
    const handleNextStep = () => {
        if (memberFormStep === 1) {
            setMemberFormStep(2);
        }
    };
    const handleSaveMember = async () => {
        if (!user?.id) return;
        logger.log('Saving family member for user', user.id, memberData);
        const newMember = {
            ...memberData,
            user_id: user.id,
            id: selectedMember ? selectedMember.id : undefined,
            age: parseInt(memberData.age)
        };
        // Remove profileImage (file) from update
        delete newMember.profileImage;
        let upsertData = { ...newMember };
        // Insert or update
        const { error } = await supabase
            .from('family_members')
            .upsert(upsertData, { onConflict: ['id'] });
        if (!error) {
            logger.log('Family member saved successfully');
            // Refresh list
            const { data } = await supabase
                .from('family_members')
                .select('*')
                .eq('user_id', user.id);
            if (data) setFamilyMembers(data);
            setShowAddMemberForm(false);
            setMemberFormStep(1);
            setSelectedMember(null);
        } else {
            logger.error('Error saving family member', error);
            alert('Error saving family member');
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
            <button className="add-member-btn" onClick={handleAddMember} style={{ marginTop: 20 }}>
                {t ? t('addFamilyMember') : '+ Add Family Member'}
            </button>
        </div>
    );
};

export default FamilyTreeView;