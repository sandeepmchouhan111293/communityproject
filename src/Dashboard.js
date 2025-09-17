import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import { useLanguage } from './LanguageContext';
import LanguageToggle from './LanguageToggle';
import { supabase } from './supabaseClient';
import { useTranslation } from './translations';

// --- View Components ---
const HomeView = ({ user, t }) => {
    const [memberHighlight] = useState({
        name: 'Sarah Johnson',
        title: 'Community Volunteer Champion',
        contribution: 'Organized 5 community events this year and helped 15+ families with documentation',
        quote: '"Every family story matters. I love helping our community preserve their heritage for future generations."',
        avatar: null,
        achievementBadge: '🏆'
    });

    const [newsFeed] = useState([
        {
            id: 1,
            type: 'urgent',
            titleKey: 'systemMaintenance',
            contentKey: 'maintenanceDesc',
            timestamp: `2 ${t('hoursAgo') || 'hours ago'}`,
            authorKey: 'systemAdmin'
        },
        {
            id: 2,
            type: 'official',
            titleKey: 'monthlyMeeting',
            contentKey: 'meetingDesc',
            timestamp: `1 ${t('daysAgo') || 'day ago'}`,
            authorKey: 'communityBoard'
        },
        {
            id: 3,
            type: 'milestone',
            titleKey: 'welcomeBaby',
            contentKey: 'babyDesc',
            timestamp: `3 ${t('daysAgo') || 'days ago'}`,
            author: 'Lisa Thompson'
        }
    ]);

    const getNewsFeedIcon = (type) => {
        const icons = {
            urgent: '🚨',
            official: '📢',
            milestone: '🎉'
        };
        return icons[type] || '📝';
    };

    const getNewsFeedClass = (type) => {
        return `news-item news-${type}`;
    };

    return (
        <div className="view-container">
            <div className="home-header">
                <div className="welcome-banner">
                    <img src="/images/Sen Ji Maharaj 1.png" alt="Sen Ji Maharaj" className="welcome-image" />
                    <div className="welcome-content">
                        <h1>{t('welcomeHome') || 'Welcome Home'}, {user?.user_metadata?.full_name?.split(' ')[0] || 'Member'}</h1>
                        <p className="home-subtitle">{t('stayConnected') || 'Stay connected with your community'}</p>
                        <p className="blessing-text">"{t('blessingText') || 'May wisdom guide your path'}"</p>
                    </div>
                </div>
            </div>

            {/* Member Highlight Section */}
            <div className="member-highlight-section">
                <div className="highlight-header">
                    <h2>🌟 {t('memberSpotlight') || 'Member Spotlight'}</h2>
                    <button className="nominate-btn">{t('nominateSomeone') || 'Nominate Someone'}</button>
                </div>
                <div className="member-highlight-card">
                    <div className="highlight-avatar">
                        {memberHighlight.avatar ? (
                            <img src={memberHighlight.avatar} alt={memberHighlight.name} />
                        ) : (
                            <div className="avatar-placeholder-highlight">
                                <span className="achievement-badge">{memberHighlight.achievementBadge}</span>
                            </div>
                        )}
                    </div>
                    <div className="highlight-content">
                        <h3>{memberHighlight.name}</h3>
                        <p className="highlight-title">{memberHighlight.title}</p>
                        <p className="highlight-contribution">{memberHighlight.contribution}</p>
                        <blockquote className="highlight-quote">
                            "{memberHighlight.quote}"
                        </blockquote>
                    </div>
                </div>
            </div>

            <div className="home-dashboard-grid">
                {/* Family Profile Progress */}
                <div className="info-block gradient-border">
                    <div className="block-header">
                        <h3>👨‍👩‍👧‍👦 {t('familyProfile') || 'Family Profile'}</h3>
                        <span className="status-badge success">{t('active') || 'Active'}</span>
                    </div>
                    <div className="completion-status">
                        <div className="progress-bar">
                            <div className="progress-fill" style={{ width: '75%' }}></div>
                        </div>
                        <span className="progress-text">75% {t('complete') || 'Complete'}</span>
                    </div>
                    <p>{t('addMoreMembers') || 'Add more family members to complete your profile'}</p>
                    <button className="block-action-btn">{t('addMembersBtn') || 'Add Members'}</button>
                </div>

                {/* Community News Feed */}
                <div className="info-block">
                    <div className="block-header">
                        <h3>📰 {t('communityUpdates') || 'Community Updates'}</h3>
                        <button className="view-all-btn">{t('viewAll') || 'View All'}</button>
                    </div>
                    <div className="news-feed">
                        {newsFeed.slice(0, 3).map(item => (
                            <div key={item.id} className={getNewsFeedClass(item.type)}>
                                <div className="news-header">
                                    <span className="news-icon">{getNewsFeedIcon(item.type)}</span>
                                    <div className="news-meta">
                                        <h4>{item.titleKey ? (t(item.titleKey) || item.titleKey) : item.title}</h4>
                                        <span className="news-timestamp">{item.timestamp}</span>
                                    </div>
                                </div>
                                <p className="news-content">{item.contentKey ? (t(item.contentKey) || item.contentKey) : item.content}</p>
                                <small className="news-author">{t('author') || 'Author'}: {item.authorKey ? (t(item.authorKey) || item.authorKey) : item.author}</small>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="info-block">
                    <h3>🚀 {t('quickActions') || 'Quick Actions'}</h3>
                    <div className="quick-actions-grid">
                        <button className="quick-action-btn">
                            <span className="action-icon">📅</span>
                            <span>{t('viewEvents') || 'View Events'}</span>
                        </button>
                        <button className="quick-action-btn">
                            <span className="action-icon">🤝</span>
                            <span>{t('volunteer') || 'Volunteer'}</span>
                        </button>
                        <button className="quick-action-btn">
                            <span className="action-icon">💬</span>
                            <span>{t('discussions') || 'Discussions'}</span>
                        </button>
                        <button className="quick-action-btn">
                            <span className="action-icon">📁</span>
                            <span>{t('documents') || 'Documents'}</span>
                        </button>
                    </div>
                </div>

                {/* Community Stats */}
                <div className="info-block stats-block">
                    <h3>📊 {t('communityPulse') || 'Community Pulse'}</h3>
                    <div className="stats-grid">
                        <div className="stat-item">
                            <span className="stat-number">248</span>
                            <span className="stat-label">{t('activeMembers') || 'Active Members'}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">12</span>
                            <span className="stat-label">{t('upcomingEvents') || 'Upcoming Events'}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">89</span>
                            <span className="stat-label">{t('volunteerHours') || 'Volunteer Hours'}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">34</span>
                            <span className="stat-label">{t('newFamilies') || 'New Families'}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ProfileView = ({ user, t }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({
        profilePhoto: null,
        dateOfBirth: '',
        gender: '',
        maritalStatus: '',
        highestQualification: '',
        profession: '',
        specialSkills: ''
    });

    const handleInputChange = (field, value) => {
        setProfileData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSaveProfile = () => {
        console.log('Saving profile:', profileData);
        setIsEditing(false);
    };

    return (
        <div className="view-container">
            <h1>{t('myProfile') || 'My Profile'}</h1>
            <div className="profile-content">
                <div className="profile-header">
                    <div className="profile-avatar-container">
                        <div className="profile-avatar">
                            {profileData.profilePhoto ? (
                                <img src={URL.createObjectURL(profileData.profilePhoto)} alt="Profile" />
                            ) : (
                                <svg width="120" height="120" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="12" cy="8" r="4" fill="#d4a574" />
                                    <rect x="4" y="16" width="16" height="6" rx="3" fill="#d4a574" />
                                </svg>
                            )}
                        </div>
                        {isEditing && (
                            <div className="photo-upload">
                                <input
                                    type="file"
                                    id="profilePhoto"
                                    accept="image/*"
                                    onChange={(e) => handleInputChange('profilePhoto', e.target.files[0])}
                                    style={{ display: 'none' }}
                                />
                                <label htmlFor="profilePhoto" className="upload-btn">
                                    📷 {t('changePhoto') || 'Change Photo'}
                                </label>
                            </div>
                        )}
                    </div>
                    <div className="profile-info">
                        <h2>{user?.user_metadata?.full_name || 'User'}</h2>
                        <p>{user?.email}</p>
                        <p>{t('memberSince') || 'Member since'} {new Date(user?.created_at).toLocaleDateString()}</p>
                    </div>
                </div>

                {!isEditing ? (
                    <div className="profile-cta">
                        <button className="primary-cta-btn" onClick={() => setIsEditing(true)}>
                            {t('completeYourProfile') || 'Complete Your Profile'}
                        </button>
                        <p>{t('addPersonalInfo') || 'Add personal information to help community members connect with you'}</p>
                    </div>
                ) : (
                    <div className="profile-form">
                        <h3>{t('personalInformation') || 'Personal Information'}</h3>
                        <div className="form-grid">
                            <div className="form-group">
                                <label htmlFor="dateOfBirth">{t('dateOfBirth') || 'Date of Birth'}</label>
                                <input
                                    type="date"
                                    id="dateOfBirth"
                                    value={profileData.dateOfBirth}
                                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                                    className="form-input"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="gender">{t('gender') || 'Gender'}</label>
                                <select
                                    id="gender"
                                    value={profileData.gender}
                                    onChange={(e) => handleInputChange('gender', e.target.value)}
                                    className="form-input"
                                >
                                    <option value="">{t('selectGender') || 'Select Gender'}</option>
                                    <option value="male">{t('male') || 'Male'}</option>
                                    <option value="female">{t('female') || 'Female'}</option>
                                    <option value="other">{t('other') || 'Other'}</option>
                                    <option value="prefer-not-to-say">{t('preferNotToSay') || 'Prefer not to say'}</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="maritalStatus">{t('maritalStatus') || 'Marital Status'}</label>
                                <select
                                    id="maritalStatus"
                                    value={profileData.maritalStatus}
                                    onChange={(e) => handleInputChange('maritalStatus', e.target.value)}
                                    className="form-input"
                                >
                                    <option value="">{t('selectStatus') || 'Select Status'}</option>
                                    <option value="single">{t('single') || 'Single'}</option>
                                    <option value="married">{t('married') || 'Married'}</option>
                                    <option value="divorced">{t('divorced') || 'Divorced'}</option>
                                    <option value="widowed">{t('widowed') || 'Widowed'}</option>
                                    <option value="separated">{t('separated') || 'Separated'}</option>
                                </select>
                            </div>
                        </div>

                        <h3>{t('educationAndWork') || 'Education & Work'}</h3>
                        <div className="form-grid">
                            <div className="form-group">
                                <label htmlFor="highestQualification">{t('highestQualification') || 'Highest Qualification'}</label>
                                <select
                                    id="highestQualification"
                                    value={profileData.highestQualification}
                                    onChange={(e) => handleInputChange('highestQualification', e.target.value)}
                                    className="form-input"
                                >
                                    <option value="">{t('selectQualification') || 'Select Qualification'}</option>
                                    <option value="high-school">{t('highSchool') || 'High School'}</option>
                                    <option value="diploma">{t('diploma') || 'Diploma'}</option>
                                    <option value="bachelors">{t('bachelors') || "Bachelor's Degree"}</option>
                                    <option value="masters">{t('masters') || "Master's Degree"}</option>
                                    <option value="phd">{t('phd') || 'PhD'}</option>
                                    <option value="professional">{t('professional') || 'Professional Certification'}</option>
                                    <option value="other">{t('other') || 'Other'}</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="profession">{t('profession') || 'Profession/Occupation'}</label>
                                <input
                                    type="text"
                                    id="profession"
                                    value={profileData.profession}
                                    onChange={(e) => handleInputChange('profession', e.target.value)}
                                    placeholder={t('professionPlaceholder') || 'e.g., Software Engineer, Teacher, Doctor'}
                                    className="form-input"
                                />
                            </div>

                            <div className="form-group full-width">
                                <label htmlFor="specialSkills">{t('specialSkills') || 'Special Skills/Talents'}</label>
                                <textarea
                                    id="specialSkills"
                                    value={profileData.specialSkills}
                                    onChange={(e) => handleInputChange('specialSkills', e.target.value)}
                                    placeholder={t('skillsPlaceholder') || 'e.g., Programming, Music, Cooking, Languages spoken, etc.'}
                                    className="form-input"
                                    rows="3"
                                />
                            </div>
                        </div>

                        <div className="form-actions">
                            <button className="save-btn" onClick={handleSaveProfile}>
                                {t('saveProfile') || 'Save Profile'}
                            </button>
                            <button className="cancel-btn" onClick={() => setIsEditing(false)}>
                                {t('cancel') || 'Cancel'}
                            </button>
                        </div>
                    </div>
                )}

                <div className="profile-stats">
                    <div className="stat">
                        <h3>5</h3>
                        <p>{t('familyMembersAdded') || 'Family Members Added'}</p>
                    </div>
                    <div className="stat">
                        <h3>12</h3>
                        <p>{t('communityConnections') || 'Community Connections'}</p>
                    </div>
                    <div className="stat">
                        <h3>3</h3>
                        <p>{t('eventsAttended') || 'Events Attended'}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

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
            <div className="family-hub-header">
                <h1>{t('familyManagementHub') || 'Family Management Hub'}</h1>
                <div className="family-stats">
                    <span className="stat-badge">{familyMembers.length} {t('members') || 'Members'}</span>
                    <span className="stat-badge">{familyMembers.filter(m => m.age < 18).length} {t('children') || 'Children'}</span>
                    <span className="stat-badge">{familyMembers.filter(m => m.age >= 18).length} {t('adults') || 'Adults'}</span>
                </div>
            </div>

            <div className="primary-cta-section">
                <button className="add-member-cta" onClick={handleAddMember}>
                    <span className="cta-icon">👥</span>
                    <span className="cta-text">{t('addFamilyMember') || 'Add Family Member'}</span>
                    <span className="cta-subtitle">{t('buildFamilyTree') || 'Build your family tree'}</span>
                </button>
            </div>

            <div className="family-controls">
                <div className="view-toggle">
                    <button
                        className={viewMode === 'cards' ? 'active' : ''}
                        onClick={() => setViewMode('cards')}
                    >
                        📋 {t('cardView') || 'Card View'}
                    </button>
                    <button
                        className={viewMode === 'tree' ? 'active' : ''}
                        onClick={() => setViewMode('tree')}
                    >
                        🌳 {t('treeView') || 'Tree View'}
                    </button>
                </div>
            </div>

            {showAddMemberForm && (
                <div className="family-member-form">
                    {memberFormStep === 1 ? (
                        <div className="form-step">
                            <h3>{t('addFamilyMemberStep1') || 'Add Family Member - Step 1'}</h3>
                            <div className="form-group">
                                <label htmlFor="relationship">{t('whatIsTheirRelationship') || 'What is their relationship to you?'}</label>
                                <select
                                    id="relationship"
                                    value={memberData.relationship}
                                    onChange={(e) => handleInputChange('relationship', e.target.value)}
                                    className="form-input"
                                >
                                    <option value="">{t('selectRelationship') || 'Select Relationship'}</option>
                                    <option value="parent">{t('parent') || 'Parent (Father/Mother)'}</option>
                                    <option value="spouse">{t('spouse') || 'Spouse (Husband/Wife)'}</option>
                                    <option value="child">{t('child') || 'Child (Son/Daughter)'}</option>
                                    <option value="sibling">{t('sibling') || 'Sibling (Brother/Sister)'}</option>
                                    <option value="grandparent">{t('grandparent') || 'Grandparent'}</option>
                                    <option value="grandchild">{t('grandchild') || 'Grandchild'}</option>
                                    <option value="uncle-aunt">{t('uncleAunt') || 'Uncle/Aunt'}</option>
                                    <option value="cousin">{t('cousin') || 'Cousin'}</option>
                                    <option value="other">{t('otherRelative') || 'Other Relative'}</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>{t('areTheyAdultOrMinor') || 'Are they an adult or a minor?'}</label>
                                <div className="radio-group">
                                    <label className="radio-label">
                                        <input
                                            type="radio"
                                            name="ageCategory"
                                            value="adult"
                                            checked={memberData.ageCategory === 'adult'}
                                            onChange={(e) => handleInputChange('ageCategory', e.target.value)}
                                        />
                                        {t('adult18Plus') || 'Adult (18+ years)'}
                                    </label>
                                    <label className="radio-label">
                                        <input
                                            type="radio"
                                            name="ageCategory"
                                            value="minor"
                                            checked={memberData.ageCategory === 'minor'}
                                            onChange={(e) => handleInputChange('ageCategory', e.target.value)}
                                        />
                                        {t('minorUnder18') || 'Minor (Under 18 years)'}
                                    </label>
                                </div>
                            </div>

                            <div className="form-actions">
                                <button
                                    className="next-btn"
                                    onClick={handleNextStep}
                                    disabled={!memberData.relationship || !memberData.ageCategory}
                                >
                                    {t('next') || 'Next'}
                                </button>
                                <button className="cancel-btn" onClick={() => setShowAddMemberForm(false)}>
                                    {t('cancel') || 'Cancel'}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="form-step">
                            <h3>{selectedMember ? (t('editFamilyMember') || 'Edit Family Member') : (t('addFamilyMemberStep2') || 'Add Family Member - Step 2')}</h3>

                            <h4>{t('basicInformation') || 'Basic Information'}</h4>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label htmlFor="memberName">{t('fullName') || 'Full Name'} *</label>
                                    <input
                                        type="text"
                                        id="memberName"
                                        value={memberData.name}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                        placeholder={t('enterFullName') || 'Enter full name'}
                                        className="form-input"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="dateOfBirth">{t('dateOfBirth') || 'Date of Birth'} *</label>
                                    <input
                                        type="date"
                                        id="dateOfBirth"
                                        value={memberData.dateOfBirth}
                                        onChange={(e) => {
                                            handleInputChange('dateOfBirth', e.target.value);
                                            const age = new Date().getFullYear() - new Date(e.target.value).getFullYear();
                                            handleInputChange('age', age.toString());
                                        }}
                                        className="form-input"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="memberGender">{t('gender') || 'Gender'} ({t('optional') || 'Optional'})</label>
                                    <select
                                        id="memberGender"
                                        value={memberData.gender}
                                        onChange={(e) => handleInputChange('gender', e.target.value)}
                                        className="form-input"
                                    >
                                        <option value="">{t('selectGender') || 'Select Gender'}</option>
                                        <option value="male">{t('male') || 'Male'}</option>
                                        <option value="female">{t('female') || 'Female'}</option>
                                        <option value="other">{t('other') || 'Other'}</option>
                                        <option value="prefer-not-to-say">{t('preferNotToSay') || 'Prefer not to say'}</option>
                                    </select>
                                </div>
                            </div>

                            {memberData.ageCategory === 'minor' ? (
                                <div>
                                    <h4>{t('educationalInformation') || 'Educational Information'} ({t('requiredForMinors') || 'Required for Minors'})</h4>
                                    <div className="form-grid">
                                        <div className="form-group">
                                            <label htmlFor="school">{t('schoolName') || 'School Name'} *</label>
                                            <input
                                                type="text"
                                                id="school"
                                                value={memberData.school}
                                                onChange={(e) => handleInputChange('school', e.target.value)}
                                                placeholder={t('enterSchoolName') || 'Enter school name'}
                                                className="form-input"
                                                required
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="class">{t('classGrade') || 'Class/Grade'} *</label>
                                            <input
                                                type="text"
                                                id="class"
                                                value={memberData.class}
                                                onChange={(e) => handleInputChange('class', e.target.value)}
                                                placeholder={t('classPlaceholder') || 'e.g., 10th Grade, Class 5, Kindergarten'}
                                                className="form-input"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <h4>{t('additionalInformation') || 'Additional Information'} ({t('optional') || 'Optional'})</h4>
                                    <div className="form-grid">
                                        <div className="form-group">
                                            <label htmlFor="hobbies">{t('hobbiesAndInterests') || 'Hobbies & Interests'}</label>
                                            <input
                                                type="text"
                                                id="hobbies"
                                                value={memberData.hobbies}
                                                onChange={(e) => handleInputChange('hobbies', e.target.value)}
                                                placeholder={t('hobbiesPlaceholder') || 'e.g., Sports, Music, Art, Reading'}
                                                className="form-input"
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="achievements">{t('achievements') || 'Achievements'}</label>
                                            <textarea
                                                id="achievements"
                                                value={memberData.achievements}
                                                onChange={(e) => handleInputChange('achievements', e.target.value)}
                                                placeholder={t('achievementsPlaceholder') || 'Academic awards, sports achievements, etc.'}
                                                className="form-input"
                                                rows="2"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <h4>{t('educationAndProfessionalInfo') || 'Education & Professional Information'} ({t('requiredForAdults') || 'Required for Adults'})</h4>
                                    <div className="form-grid">
                                        <div className="form-group">
                                            <label htmlFor="adultQualification">{t('highestQualification') || 'Highest Qualification'} *</label>
                                            <select
                                                id="adultQualification"
                                                value={memberData.highestQualification}
                                                onChange={(e) => handleInputChange('highestQualification', e.target.value)}
                                                className="form-input"
                                                required
                                            >
                                                <option value="">{t('selectQualification') || 'Select Qualification'}</option>
                                                <option value="no-formal">{t('noFormalEducation') || 'No Formal Education'}</option>
                                                <option value="primary">{t('primarySchool') || 'Primary School'}</option>
                                                <option value="high-school">{t('highSchool') || 'High School'}</option>
                                                <option value="diploma">{t('diplomaCertificate') || 'Diploma/Certificate'}</option>
                                                <option value="bachelors">{t('bachelors') || "Bachelor's Degree"}</option>
                                                <option value="masters">{t('masters') || "Master's Degree"}</option>
                                                <option value="phd">{t('phdDoctorate') || 'PhD/Doctorate'}</option>
                                                <option value="professional">{t('professionalCertification') || 'Professional Certification'}</option>
                                                <option value="trade">{t('tradeVocational') || 'Trade/Vocational Training'}</option>
                                                <option value="other">{t('other') || 'Other'}</option>
                                            </select>
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="adultProfession">{t('professionOccupation') || 'Profession/Occupation'} *</label>
                                            <input
                                                type="text"
                                                id="adultProfession"
                                                value={memberData.profession}
                                                onChange={(e) => handleInputChange('profession', e.target.value)}
                                                placeholder={t('professionPlaceholder') || 'e.g., Software Engineer, Teacher, Business Owner'}
                                                className="form-input"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <h4>{t('additionalProfessionalInfo') || 'Additional Professional Information'} ({t('optional') || 'Optional'})</h4>
                                    <div className="form-grid">
                                        <div className="form-group">
                                            <label htmlFor="employer">{t('employerCompany') || 'Employer/Company'}</label>
                                            <input
                                                type="text"
                                                id="employer"
                                                value={memberData.employer}
                                                onChange={(e) => handleInputChange('employer', e.target.value)}
                                                placeholder={t('employerPlaceholder') || 'Current employer or business name'}
                                                className="form-input"
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="volunteerInterests">{t('volunteerInterests') || 'Volunteer Interests'}</label>
                                            <input
                                                type="text"
                                                id="volunteerInterests"
                                                value={memberData.volunteerInterests}
                                                onChange={(e) => handleInputChange('volunteerInterests', e.target.value)}
                                                placeholder={t('volunteerPlaceholder') || 'Community service, NGO work, etc.'}
                                                className="form-input"
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="adultMaritalStatus">{t('maritalStatus') || 'Marital Status'}</label>
                                            <select
                                                id="adultMaritalStatus"
                                                value={memberData.maritalStatus}
                                                onChange={(e) => handleInputChange('maritalStatus', e.target.value)}
                                                className="form-input"
                                            >
                                                <option value="">{t('selectStatus') || 'Select Status'}</option>
                                                <option value="single">{t('single') || 'Single'}</option>
                                                <option value="married">{t('married') || 'Married'}</option>
                                                <option value="divorced">{t('divorced') || 'Divorced'}</option>
                                                <option value="widowed">{t('widowed') || 'Widowed'}</option>
                                                <option value="separated">{t('separated') || 'Separated'}</option>
                                                <option value="engaged">{t('engaged') || 'Engaged'}</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="form-actions">
                                <button className="save-btn" onClick={handleSaveMember}>
                                    {selectedMember ? (t('updateFamilyMember') || 'Update Family Member') : (t('addFamilyMember') || 'Add Family Member')}
                                </button>
                                <button className="back-btn" onClick={() => setMemberFormStep(1)}>
                                    {t('back') || 'Back'}
                                </button>
                                <button className="cancel-btn" onClick={() => setShowAddMemberForm(false)}>
                                    {t('cancel') || 'Cancel'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {viewMode === 'cards' ? (
                familyMembers.length > 0 ? (
                    <div className="family-members-grid">
                        {familyMembers.map(member => (
                            <div key={member.id} className="member-card-interactive">
                                <div className="member-card-header">
                                    <div className="member-avatar-large">
                                        {member.profileImage ? (
                                            <img src={URL.createObjectURL(member.profileImage)} alt={member.name} />
                                        ) : (
                                            <div className="avatar-placeholder">
                                                {getRelationshipIcon(member.relationship)}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="member-card-content">
                                    <h3>{member.name}</h3>
                                    <div className="member-details">
                                        <p className="relationship">{member.relationship.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                                        <p className="age">{t('age') || 'Age'}: {member.age}</p>
                                        {member.profession && <p className="profession">{member.profession}</p>}
                                        {member.school && <p className="school">{member.school}</p>}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <div className="empty-icon">👥</div>
                        <h3>{t('noFamilyMembers') || 'No family members added yet'}</h3>
                        <p>{t('startBuilding') || 'Start building your family tree by adding your first family member'}</p>
                        <button className="empty-cta-btn" onClick={handleAddMember}>
                            {t('addFirstMember') || 'Add First Member'}
                        </button>
                    </div>
                )
            ) : (
                <div className="family-tree-visual">
                    <div className="tree-node root">
                        <div className="person-card">
                            <div className="person-avatar">👤</div>
                            <p>{user?.user_metadata?.full_name || t('you') || 'You'}</p>
                        </div>
                        <div className="tree-children">
                            {familyMembers.slice(0, 6).map(member => (
                                <div key={member.id} className="tree-node">
                                    <div className="person-card">
                                        <div className="person-avatar">{getRelationshipIcon(member.relationship)}</div>
                                        <p>{member.name}</p>
                                        <small>{member.relationship}</small>
                                    </div>
                                </div>
                            ))}
                            <div className="tree-node">
                                <div className="person-card placeholder" onClick={handleAddMember}>
                                    <div className="person-avatar">+</div>
                                    <p>{t('addMember') || 'Add Member'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const EventsView = ({ user, t }) => {
    const [events, setEvents] = useState([
        {
            id: 1,
            title: 'Community Annual Gathering',
            dateTime: '2024-02-15T18:00:00',
            location: 'Community Center, Main Hall',
            description: 'Join us for our annual community gathering with dinner, presentations, and networking.',
            organizer: 'Community Board',
            rsvpLimit: 100,
            currentRSVPs: 67,
            rsvpStatus: null,
            category: 'community'
        },
        {
            id: 2,
            title: 'Family Heritage Workshop',
            dateTime: '2024-02-20T14:00:00',
            location: 'Library Meeting Room',
            description: 'Learn techniques for researching and documenting your family history.',
            organizer: 'Sarah Johnson',
            rsvpLimit: 25,
            currentRSVPs: 18,
            rsvpStatus: 'attending',
            category: 'educational'
        },
        {
            id: 3,
            title: 'Youth Soccer Tournament',
            dateTime: '2024-02-25T09:00:00',
            location: 'Central Park Sports Field',
            description: 'Annual soccer tournament for community youth. Volunteers needed for coordination.',
            organizer: 'Sports Committee',
            rsvpLimit: 200,
            currentRSVPs: 89,
            rsvpStatus: null,
            category: 'sports'
        }
    ]);

    const handleRSVP = (eventId, status) => {
        setEvents(prev => prev.map(event =>
            event.id === eventId
                ? {
                    ...event,
                    rsvpStatus: status,
                    currentRSVPs: status === 'attending'
                        ? event.currentRSVPs + 1
                        : event.rsvpStatus === 'attending'
                            ? event.currentRSVPs - 1
                            : event.currentRSVPs
                }
                : event
        ));
    };

    const formatEventDate = (dateTime) => {
        const date = new Date(dateTime);
        return {
            date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
            time: date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
        };
    };

    const getCategoryIcon = (category) => {
        const icons = {
            community: '🏘️',
            educational: '📚',
            sports: '⚽',
            cultural: '🎭',
            volunteer: '🤝'
        };
        return icons[category] || '📅';
    };

    return (
        <div className="view-container">
            <div className="events-header">
                <h1>{t('communityEvents') || 'Community Events'}</h1>
                <button className="create-event-btn">{t('createEvent') || '+ Create Event'}</button>
            </div>

            <div className="events-filters">
                <button className="filter-btn active">{t('allEvents') || 'All Events'}</button>
                <button className="filter-btn">{t('myEvents') || 'My Events'}</button>
                <button className="filter-btn">{t('thisMonth') || 'This Month'}</button>
                <button className="filter-btn">{t('upcoming') || 'Upcoming'}</button>
            </div>

            <div className="events-grid">
                {events.map(event => {
                    const eventDate = formatEventDate(event.dateTime);
                    const rsvpPercentage = (event.currentRSVPs / event.rsvpLimit) * 100;

                    return (
                        <div key={event.id} className="event-card">
                            <div className="event-header">
                                <div className="event-date-badge">
                                    <span className="event-month">{eventDate.date}</span>
                                    <span className="event-time">{eventDate.time}</span>
                                </div>
                                <div className="event-category">
                                    <span className="category-icon">{getCategoryIcon(event.category)}</span>
                                </div>
                            </div>

                            <div className="event-content">
                                <h3>{event.title}</h3>
                                <div className="event-details">
                                    <p className="event-location">📍 {event.location}</p>
                                    <p className="event-organizer">👤 {event.organizer}</p>
                                </div>
                                <p className="event-description">{event.description}</p>

                                <div className="event-rsvp-info">
                                    <div className="rsvp-progress">
                                        <div className="rsvp-bar">
                                            <div
                                                className="rsvp-fill"
                                                style={{ width: `${rsvpPercentage}%` }}
                                            ></div>
                                        </div>
                                        <span className="rsvp-count">
                                            {event.currentRSVPs} / {event.rsvpLimit} {t('attending') || 'attending'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="event-actions">
                                {event.rsvpStatus === 'attending' ? (
                                    <div className="rsvp-status">
                                        <span className="attending-badge">✅ {t('youreAttending') || "You're Attending"}</span>
                                        <button
                                            className="cancel-rsvp-btn"
                                            onClick={() => handleRSVP(event.id, null)}
                                        >
                                            {t('cancelRSVP') || 'Cancel RSVP'}
                                        </button>
                                    </div>
                                ) : (
                                    <div className="rsvp-actions">
                                        <button
                                            className="rsvp-btn attend"
                                            onClick={() => handleRSVP(event.id, 'attending')}
                                            disabled={event.currentRSVPs >= event.rsvpLimit}
                                        >
                                            {event.currentRSVPs >= event.rsvpLimit ? (t('eventFull') || 'Event Full') : (t('rsvpYes') || 'RSVP Yes')}
                                        </button>
                                        <button
                                            className="rsvp-btn decline"
                                            onClick={() => handleRSVP(event.id, 'declined')}
                                        >
                                            {t('cantAttend') || "Can't Attend"}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const VolunteerView = ({ user, t }) => {
    const [opportunities, setOpportunities] = useState([
        {
            id: 1,
            role: 'Event Coordinator',
            description: 'Help organize and coordinate community events, manage volunteers, and ensure smooth execution.',
            requiredSkills: ['Event Planning', 'Communication', 'Organization'],
            timeCommitment: '5-10 hours/month',
            urgency: 'high',
            contact: 'Sarah Johnson',
            interested: false,
            volunteers: 3,
            needed: 2
        },
        {
            id: 2,
            role: 'Graphic Designer',
            description: 'Create flyers, social media graphics, and promotional materials for community events.',
            requiredSkills: ['Graphic Design', 'Adobe Creative Suite', 'Social Media'],
            timeCommitment: '2-5 hours/week',
            urgency: 'medium',
            contact: 'Design Team',
            interested: true,
            volunteers: 1,
            needed: 2
        },
        {
            id: 3,
            role: 'Youth Mentor',
            description: 'Guide and support young community members in their personal and academic development.',
            requiredSkills: ['Mentoring', 'Communication', 'Patience'],
            timeCommitment: '3-4 hours/week',
            urgency: 'ongoing',
            contact: 'Youth Committee',
            interested: false,
            volunteers: 8,
            needed: 5
        }
    ]);

    const handleInterest = (opportunityId) => {
        setOpportunities(prev => prev.map(opp =>
            opp.id === opportunityId
                ? { ...opp, interested: !opp.interested }
                : opp
        ));
    };

    const getUrgencyColor = (urgency) => {
        const colors = {
            high: '#e74c3c',
            medium: '#f39c12',
            ongoing: '#27ae60'
        };
        return colors[urgency] || '#7f8c8d';
    };

    return (
        <div className="view-container">
            <div className="volunteer-header">
                <h1>{t('volunteerOpportunities') || 'Volunteer Opportunities'}</h1>
                <div className="volunteer-stats">
                    <div className="stat-item">
                        <span className="stat-number">24</span>
                        <span className="stat-label">{t('activeVolunteers') || 'Active Volunteers'}</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">89</span>
                        <span className="stat-label">{t('hoursThisMonth') || 'Hours This Month'}</span>
                    </div>
                </div>
            </div>

            <div className="volunteer-filters">
                <button className="filter-btn active">{t('allOpportunities') || 'All Opportunities'}</button>
                <button className="filter-btn">{t('myInterests') || 'My Interests'}</button>
                <button className="filter-btn">{t('urgent') || 'Urgent'}</button>
                <button className="filter-btn">{t('ongoing') || 'Ongoing'}</button>
            </div>

            <div className="opportunities-grid">
                {opportunities.map(opportunity => (
                    <div key={opportunity.id} className="opportunity-card">
                        <div className="opportunity-header">
                            <h3>{opportunity.role}</h3>
                            <div
                                className="urgency-badge"
                                style={{ backgroundColor: getUrgencyColor(opportunity.urgency) }}
                            >
                                {opportunity.urgency}
                            </div>
                        </div>

                        <p className="opportunity-description">{opportunity.description}</p>

                        <div className="opportunity-details">
                            <div className="detail-item">
                                <strong>{t('requiredSkills') || 'Required Skills'}:</strong>
                                <div className="skills-tags">
                                    {opportunity.requiredSkills.map(skill => (
                                        <span key={skill} className="skill-tag">{skill}</span>
                                    ))}
                                </div>
                            </div>

                            <div className="detail-item">
                                <strong>{t('timeCommitment') || 'Time Commitment'}:</strong> {opportunity.timeCommitment}
                            </div>

                            <div className="detail-item">
                                <strong>{t('contact') || 'Contact'}:</strong> {opportunity.contact}
                            </div>

                            <div className="volunteer-progress">
                                <span className="volunteer-count">
                                    {opportunity.volunteers} / {opportunity.volunteers + opportunity.needed} {t('volunteers') || 'volunteers'}
                                </span>
                                <div className="progress-bar">
                                    <div
                                        className="progress-fill"
                                        style={{
                                            width: `${(opportunity.volunteers / (opportunity.volunteers + opportunity.needed)) * 100}%`
                                        }}
                                    ></div>
                                </div>
                            </div>
                        </div>

                        <div className="opportunity-actions">
                            <button
                                className={`interest-btn ${opportunity.interested ? 'interested' : ''}`}
                                onClick={() => handleInterest(opportunity.id)}
                            >
                                {opportunity.interested ? (t('youreInterested') || "✅ You're Interested") : (t('imInterested') || "🤝 I'm Interested")}
                            </button>
                            <button className="learn-more-btn">{t('learnMore') || 'Learn More'}</button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="volunteer-cta-section">
                <h2>{t('wantToCreateOpportunity') || 'Want to Create a Volunteer Opportunity?'}</h2>
                <p>{t('createOpportunityDesc') || 'Help the community by creating new volunteer opportunities that match your expertise.'}</p>
                <button className="create-opportunity-btn">{t('createOpportunity') || '+ Create Opportunity'}</button>
            </div>
        </div>
    );
};

const DiscussionsView = ({ user, t }) => {
    const [forums] = useState([
        {
            id: 1,
            title: t('communityEventsAnnouncements') || 'Community Events & Announcements',
            description: t('discussUpcomingEvents') || 'Discuss upcoming events, share announcements, and coordinate community activities.',
            icon: '📅',
            topics: 47,
            posts: 234,
            lastActivity: t('hoursAgo2') || '2 hours ago',
            lastPost: t('annualGatheringPlanning') || 'Annual Gathering Planning',
            moderators: ['Sarah Johnson', 'Mike Chen']
        },
        {
            id: 2,
            title: t('familyHistoryGenealogy') || 'Family History & Genealogy',
            description: t('shareFamilyStories') || 'Share family stories, research tips, and connect with relatives. Help each other build family trees.',
            icon: '🌳',
            topics: 89,
            posts: 456,
            lastActivity: t('hoursAgo5') || '5 hours ago',
            lastPost: t('tipsForFindingRecords') || 'Tips for Finding Birth Records',
            moderators: ['Emma Davis', 'Robert Kim']
        },
        {
            id: 3,
            title: t('communitySupportResources') || 'Community Support & Resources',
            description: t('askForHelp') || 'Ask for help, offer assistance, share local resources, and support each other.',
            icon: '🤝',
            topics: 156,
            posts: 789,
            lastActivity: t('hourAgo1') || '1 hour ago',
            lastPost: t('carpoolingSchoolEvents') || 'Carpooling for School Events',
            moderators: ['Lisa Wong', 'David Park']
        }
    ]);

    const [recentDiscussions] = useState([
        {
            id: 1,
            title: t('planningSpringFestival') || 'Planning the Spring Festival',
            author: 'Sarah Johnson',
            forum: t('communityEvents') || 'Community Events',
            replies: 12,
            lastReply: t('minutesAgo30') || '30 minutes ago',
            isHot: true
        },
        {
            id: 2,
            title: t('lookingForJohnsonFamily') || 'Looking for Johnson family descendants',
            author: 'Mike Johnson',
            forum: t('familyHistory') || 'Family History',
            replies: 8,
            lastReply: t('hoursAgo2') || '2 hours ago',
            isHot: false
        },
        {
            id: 3,
            title: t('volunteerDriversNeeded') || 'Volunteer drivers needed for elderly members',
            author: t('communityBoard') || 'Community Board',
            forum: t('communitySupport') || 'Community Support',
            replies: 15,
            lastReply: t('hoursAgo4') || '4 hours ago',
            isHot: true
        }
    ]);

    return (
        <div className="view-container">
            <div className="discussions-header">
                <h1>{t('communityDiscussions') || 'Community Discussions'}</h1>
                <button className="new-topic-btn">{t('newTopic') || '+ New Topic'}</button>
            </div>

            <div className="discussions-overview">
                <div className="overview-stats">
                    <div className="stat-item">
                        <span className="stat-number">292</span>
                        <span className="stat-label">{t('totalTopics') || 'Total Topics'}</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">1,479</span>
                        <span className="stat-label">{t('totalPosts') || 'Total Posts'}</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">156</span>
                        <span className="stat-label">{t('activeMembers') || 'Active Members'}</span>
                    </div>
                </div>
            </div>

            <div className="forums-section">
                <h2>{t('discussionForums') || 'Discussion Forums'}</h2>
                <div className="forums-grid">
                    {forums.map(forum => (
                        <div key={forum.id} className="forum-card">
                            <div className="forum-header">
                                <span className="forum-icon">{forum.icon}</span>
                                <div className="forum-info">
                                    <h3>{forum.title}</h3>
                                    <p>{forum.description}</p>
                                </div>
                            </div>

                            <div className="forum-stats">
                                <div className="stat">
                                    <span className="stat-value">{forum.topics}</span>
                                    <span className="stat-label">{t('topics') || 'Topics'}</span>
                                </div>
                                <div className="stat">
                                    <span className="stat-value">{forum.posts}</span>
                                    <span className="stat-label">{t('posts') || 'Posts'}</span>
                                </div>
                            </div>

                            <div className="forum-activity">
                                <p className="last-activity">
                                    <strong>{t('latest') || 'Latest'}:</strong> {forum.lastPost}
                                </p>
                                <p className="activity-time">{forum.lastActivity}</p>
                            </div>

                            <div className="forum-moderators">
                                <strong>{t('moderators') || 'Moderators'}:</strong> {forum.moderators.join(', ')}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="recent-discussions-section">
                <h2>{t('recentDiscussions') || 'Recent Discussions'}</h2>
                <div className="discussions-list">
                    {recentDiscussions.map(discussion => (
                        <div key={discussion.id} className="discussion-item">
                            <div className="discussion-content">
                                <div className="discussion-title">
                                    {discussion.isHot && <span className="hot-badge">🔥</span>}
                                    <h4>{discussion.title}</h4>
                                </div>
                                <div className="discussion-meta">
                                    <span className="author">{t('by') || 'by'} {discussion.author}</span>
                                    <span className="forum">{t('in') || 'in'} {discussion.forum}</span>
                                    <span className="replies">{discussion.replies} {t('replies') || 'replies'}</span>
                                </div>
                            </div>
                            <div className="discussion-activity">
                                <span className="last-reply">{discussion.lastReply}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

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
            <div className="documents-header">
                <h1>{t('communityDocuments') || 'Community Documents'}</h1>
                <div className="user-access-info">
                    <span className="access-badge">{t('accessLevel') || 'Access Level'}: {userRole}</span>
                </div>
            </div>

            <div className="documents-controls">
                <div className="search-section">
                    <input
                        type="text"
                        placeholder={t('searchDocuments') || 'Search documents...'}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>

                <div className="filter-section">
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="category-filter"
                    >
                        <option value="all">{t('allCategories') || 'All Categories'}</option>
                        <option value="governance">{t('governance') || 'Governance'}</option>
                        <option value="resources">{t('resources') || 'Resources'}</option>
                        <option value="meetings">{t('meetingMinutes') || 'Meeting Minutes'}</option>
                        <option value="guidelines">{t('guidelines') || 'Guidelines'}</option>
                    </select>
                </div>
            </div>

            <div className="documents-grid">
                {filteredDocuments.map(doc => (
                    <div key={doc.id} className="document-card">
                        <div className="document-header">
                            <div className="document-icon">
                                {getCategoryIcon(doc.category)}
                            </div>
                            <div className="access-indicator">
                                {getAccessIcon(doc.accessLevel)}
                            </div>
                        </div>

                        <div className="document-content">
                            <h3>{doc.title}</h3>
                            <p className="document-description">{doc.description}</p>

                            <div className="document-meta">
                                <div className="meta-item">
                                    <span className="meta-label">{t('type') || 'Type'}:</span>
                                    <span className="meta-value">{doc.fileType}</span>
                                </div>
                                <div className="meta-item">
                                    <span className="meta-label">{t('size') || 'Size'}:</span>
                                    <span className="meta-value">{doc.fileSize}</span>
                                </div>
                                <div className="meta-item">
                                    <span className="meta-label">{t('updated') || 'Updated'}:</span>
                                    <span className="meta-value">{new Date(doc.lastUpdated).toLocaleDateString()}</span>
                                </div>
                                <div className="meta-item">
                                    <span className="meta-label">{t('downloads') || 'Downloads'}:</span>
                                    <span className="meta-value">{doc.downloadCount}</span>
                                </div>
                            </div>
                        </div>

                        <div className="document-actions">
                            <button className="download-btn">📥 {t('download') || 'Download'}</button>
                            <button className="preview-btn">👁️ {t('preview') || 'Preview'}</button>
                        </div>
                    </div>
                ))}
            </div>

            {filteredDocuments.length === 0 && (
                <div className="no-documents">
                    <div className="no-docs-icon">📄</div>
                    <h3>{t('noDocumentsFound') || 'No Documents Found'}</h3>
                    <p>{t('tryAdjustingSearch') || 'Try adjusting your search terms or category filter.'}</p>
                </div>
            )}

            <div className="documents-help">
                <h3>{t('needHelp') || 'Need Help?'}</h3>
                <p>{t('documentsOrganizedByAccess') || 'Documents are organized by access level. Members can access public and member documents, while committee members have additional access to committee documents.'}</p>
            </div>
        </div>
    );
};

const CommunityDirectoryView = ({ user, t }) => {
    return (
        <div className="view-container">
            <h1>{t('directory') || 'Community Directory'}</h1>
            <div className="directory-search">
                <div className="search-bar">
                    <input type="text" placeholder={t('searchMembers') || 'Search members by name, village, or family...'} />
                    <button>🔍</button>
                </div>

                <div className="filters">
                    <select>
                        <option value="">{t('allVillages') || 'All Villages'}</option>
                        <option value="village1">{t('village') || 'Village'} 1</option>
                        <option value="village2">{t('village') || 'Village'} 2</option>
                        <option value="village3">{t('village') || 'Village'} 3</option>
                    </select>
                    <select>
                        <option value="">{t('allFamilies') || 'All Families'}</option>
                        <option value="family1">{t('family') || 'Family'} A</option>
                        <option value="family2">{t('family') || 'Family'} B</option>
                    </select>
                </div>
            </div>

            <div className="directory-grid">
                <div className="member-card">
                    <div className="member-avatar">👤</div>
                    <h3>John Doe</h3>
                    <p>{t('villageCenter') || 'Village Center'}</p>
                    <p>{t('doeFamily') || 'Doe Family'}</p>
                    <button>{t('connect') || 'Connect'}</button>
                </div>
                <div className="member-card">
                    <div className="member-avatar">👤</div>
                    <h3>Jane Smith</h3>
                    <p>{t('northVillage') || 'North Village'}</p>
                    <p>{t('smithFamily') || 'Smith Family'}</p>
                    <button>{t('connect') || 'Connect'}</button>
                </div>
            </div>
        </div>
    );
};

// --- SettingsView Component ---
const SettingsView = ({ user, t }) => {
    return (
        <div className="view-container">
            <h1>{t('settings') || 'Settings'}</h1>
            <div className="settings-sections">
                <div className="settings-section">
                    <h3>{t('privacySettings') || 'Privacy Settings'}</h3>
                    <div className="setting-item">
                        <label>
                            <input type="checkbox" defaultChecked />
                            {t('makeProfileVisible') || 'Make my profile visible to community members'}
                        </label>
                    </div>
                    <div className="setting-item">
                        <label>
                            <input type="checkbox" />
                            {t('allowFamilyTreeVisibility') || 'Allow others to see my family tree'}
                        </label>
                    </div>
                    <div className="setting-item">
                        <label>
                            <input type="checkbox" defaultChecked />
                            {t('showInDirectory') || 'Show me in community directory'}
                        </label>
                    </div>
                </div>

                <div className="settings-section">
                    <h3>{t('notificationPreferences') || 'Notification Preferences'}</h3>
                    <div className="setting-item">
                        <label>
                            <input type="checkbox" defaultChecked />
                            {t('emailNewConnections') || 'Email notifications for new family connections'}
                        </label>
                    </div>
                    <div className="setting-item">
                        <label>
                            <input type="checkbox" defaultChecked />
                            {t('eventReminders') || 'Event reminders'}
                        </label>
                    </div>
                    <div className="setting-item">
                        <label>
                            <input type="checkbox" />
                            {t('weeklyUpdates') || 'Weekly community updates'}
                        </label>
                    </div>
                </div>

                <div className="settings-section">
                    <h3>{t('accountSettings') || 'Account Settings'}</h3>
                    <button className="settings-btn">{t('changePassword') || 'Change Password'}</button>
                    <button className="settings-btn">{t('downloadData') || 'Download My Data'}</button>
                    <button className="settings-btn danger">{t('deleteAccount') || 'Delete Account'}</button>
                </div>
            </div>
        </div>
    );
};

// --- Dashboard Component ---
function Dashboard() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeView, setActiveView] = useState('home');
    const navigate = useNavigate();
    const { language } = useLanguage();
    const { t } = useTranslation(language);

    // Data structure for clean navigation rendering
    const navItems = useMemo(() => [
        { view: 'home', icon: '🏠', translationKey: 'home' },
        { view: 'profile', icon: '👤', translationKey: 'myProfile' },
        { view: 'family', icon: '🌳', translationKey: 'familyTree' },
        { view: 'events', icon: '📅', translationKey: 'events' },
        { view: 'volunteer', icon: '🤝', translationKey: 'volunteer' },
        { view: 'discussions', icon: '💬', translationKey: 'discussions' },
        { view: 'documents', icon: '📁', translationKey: 'documents' },
        { view: 'directory', icon: '📖', translationKey: 'directory' },
        { view: 'settings', icon: '⚙️', translationKey: 'settings' },
    ], []);

    useEffect(() => {
        const getUser = async () => {
            const { data: { user }, error } = await supabase.auth.getUser();

            if (error || !user) {
                navigate('/login');
                return;
            }

            setUser(user);
            setLoading(false);
        };

        getUser();
    }, [navigate]);

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Error signing out:', error);
        } else {
            navigate('/login');
        }
    };

    if (loading) {
        return (
            <div className="dashboard-loading">
                <div className="loading-spinner"></div>
                <p>{t('loading') || 'Loading...'}</p>
            </div>
        );
    }

    const renderContent = () => {
        const ViewComponent = {
            'home': HomeView,
            'profile': ProfileView,
            'family': FamilyTreeView,
            'events': EventsView,
            'volunteer': VolunteerView,
            'discussions': DiscussionsView,
            'documents': DocumentsView,
            'directory': CommunityDirectoryView,
            'settings': SettingsView,
        }[activeView] || HomeView;

        return <ViewComponent user={user} t={t} />;
    };

    return (
        <div className="dashboard-container">
            <nav className="sidebar">
                <div className="sidebar-header">
                    <div className="community-branding">
                        <img src="/images/Sen Ji Maharaj 2.png" alt="Sen Ji Maharaj" className="community-logo" />
                        <h1>{t('communityHub') || 'Community Hub'}</h1>
                        <p className="hub-tagline">{t('guidedByWisdom') || 'Guided by Wisdom'}</p>
                    </div>
                    <LanguageToggle variant="dashboard" />
                    <div className="user-info">
                        <div className="user-avatar-small">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="User Avatar">
                                <title>User Avatar</title>
                                <circle cx="12" cy="8" r="4" fill="#d4a574" />
                                <rect x="4" y="16" width="16" height="6" rx="3" fill="#d4a574" />
                            </svg>
                        </div>
                        <div className="user-details">
                            <p className="user-name">{user?.user_metadata?.full_name ?? user?.user_metadata?.username ?? user?.email?.split('@')[0] ?? (t('user') || 'User')}</p>
                            <p className="user-email">{user?.email}</p>
                        </div>
                    </div>
                </div>

                <ul className="nav-menu">
                    {navItems.map(item => (
                        <li key={item.view} className={activeView === item.view ? 'active' : ''}>
                            <button
                                onClick={() => setActiveView(item.view)}
                                aria-current={activeView === item.view ? 'page' : undefined}
                            >
                                <span className="nav-icon" aria-hidden="true">{item.icon}</span>
                                {t(item.translationKey) || item.translationKey}
                            </button>
                        </li>
                    ))}
                </ul>

                <div className="sidebar-footer">
                    <button className="logout-btn" onClick={handleLogout}>
                        <span className="nav-icon" aria-hidden="true">🚪</span>
                        {t('logout') || 'Logout'}
                    </button>
                </div>
            </nav>

            <main className="main-content">
                {renderContent()}
            </main>
        </div>
    );
}

export default Dashboard;