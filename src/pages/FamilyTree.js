import { useState } from 'react';

const FamilyTreeView = ({ user, t }) => {
    const [viewMode, setViewMode] = useState('cards');
    const [showAddMemberForm, setShowAddMemberForm] = useState(false);
    const [memberFormStep, setMemberFormStep] = useState(1);
    const [selectedMember, setSelectedMember] = useState(null);
    const [showMemberDetail, setShowMemberDetail] = useState(false);
    const [familyMembers, setFamilyMembers] = useState([
        {
            id: 1,
            name: 'John Smith',
            relationship: 'spouse',
            age: 35,
            dateOfBirth: '1989-03-15',
            gender: 'male',
            profileImage: null,
            highestQualification: 'bachelors',
            profession: 'Software Engineer',
            employer: 'Tech Corp',
            maritalStatus: 'married'
        },
        {
            id: 2,
            name: 'Emma Smith',
            relationship: 'child',
            age: 12,
            dateOfBirth: '2012-07-22',
            gender: 'female',
            profileImage: null,
            school: 'Central Elementary',
            class: '7th Grade',
            hobbies: 'Drawing, Reading'
        }
    ]);
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
    const handleSaveMember = () => {
        const newMember = {
            ...memberData,
            id: selectedMember ? selectedMember.id : Date.now(),
            age: parseInt(memberData.age)
        };
        if (selectedMember) {
            setFamilyMembers(prev => prev.map(member =>
                member.id === selectedMember.id ? newMember : member
            ));
        } else {
            setFamilyMembers(prev => [...prev, newMember]);
        }
        setShowAddMemberForm(false);
        setMemberFormStep(1);
        setSelectedMember(null);
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