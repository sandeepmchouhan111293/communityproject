import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import { supabase } from './supabaseClient';

function Dashboard() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeView, setActiveView] = useState('home');
    const navigate = useNavigate();

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
                <p>Loading...</p>
            </div>
        );
    }

    const renderContent = () => {
        switch (activeView) {
            case 'home':
                return <HomeView user={user} />;
            case 'profile':
                return <ProfileView user={user} />;
            case 'family':
                return <FamilyTreeView user={user} />;
            case 'events':
                return <EventsView user={user} />;
            case 'volunteer':
                return <VolunteerView user={user} />;
            case 'discussions':
                return <DiscussionsView user={user} />;
            case 'documents':
                return <DocumentsView user={user} />;
            case 'directory':
                return <CommunityDirectoryView user={user} />;
            case 'settings':
                return <SettingsView user={user} />;
            default:
                return <HomeView user={user} />;
        }
    };

    return (
        <div className="dashboard-container">
            <nav className="sidebar">
                <div className="sidebar-header">
                    <h1>Community Hub</h1>
                    <div className="user-info">
                        <div className="user-avatar-small">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="12" cy="8" r="4" fill="#388e3c" />
                                <rect x="4" y="16" width="16" height="6" rx="3" fill="#388e3c" />
                            </svg>
                        </div>
                        <div className="user-details">
                            <p className="user-name">{user?.user_metadata?.full_name || user?.user_metadata?.username || user?.email?.split('@')[0] || 'User'}</p>
                            <p className="user-email">{user?.email}</p>
                        </div>
                    </div>
                </div>

                <ul className="nav-menu">
                    <li className={activeView === 'home' ? 'active' : ''}>
                        <button onClick={() => setActiveView('home')}>
                            <span className="nav-icon">🏠</span>
                            Home
                        </button>
                    </li>
                    <li className={activeView === 'profile' ? 'active' : ''}>
                        <button onClick={() => setActiveView('profile')}>
                            <span className="nav-icon">👤</span>
                            My Profile
                        </button>
                    </li>
                    <li className={activeView === 'family' ? 'active' : ''}>
                        <button onClick={() => setActiveView('family')}>
                            <span className="nav-icon">🌳</span>
                            Family Tree
                        </button>
                    </li>
                    <li className={activeView === 'events' ? 'active' : ''}>
                        <button onClick={() => setActiveView('events')}>
                            <span className="nav-icon">📅</span>
                            Events
                        </button>
                    </li>
                    <li className={activeView === 'volunteer' ? 'active' : ''}>
                        <button onClick={() => setActiveView('volunteer')}>
                            <span className="nav-icon">🤝</span>
                            Volunteer
                        </button>
                    </li>
                    <li className={activeView === 'discussions' ? 'active' : ''}>
                        <button onClick={() => setActiveView('discussions')}>
                            <span className="nav-icon">💬</span>
                            Discussions
                        </button>
                    </li>
                    <li className={activeView === 'documents' ? 'active' : ''}>
                        <button onClick={() => setActiveView('documents')}>
                            <span className="nav-icon">📁</span>
                            Documents
                        </button>
                    </li>
                    <li className={activeView === 'directory' ? 'active' : ''}>
                        <button onClick={() => setActiveView('directory')}>
                            <span className="nav-icon">📖</span>
                            Directory
                        </button>
                    </li>
                    <li className={activeView === 'settings' ? 'active' : ''}>
                        <button onClick={() => setActiveView('settings')}>
                            <span className="nav-icon">⚙️</span>
                            Settings
                        </button>
                    </li>
                </ul>

                <div className="sidebar-footer">
                    <button className="logout-btn" onClick={handleLogout}>
                        <span className="nav-icon">🚪</span>
                        Logout
                    </button>
                </div>
            </nav>

            <main className="main-content">
                {renderContent()}
            </main>
        </div>
    );
}

const HomeView = ({ user }) => {
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
            title: 'System Maintenance Tonight',
            content: 'The platform will be unavailable from 11 PM to 1 AM for scheduled maintenance.',
            timestamp: '2 hours ago',
            author: 'System Admin'
        },
        {
            id: 2,
            type: 'official',
            title: 'Monthly Community Meeting Minutes Posted',
            content: 'Review the decisions made in our December community meeting, including new family tree features.',
            timestamp: '1 day ago',
            author: 'Community Board'
        },
        {
            id: 3,
            type: 'milestone',
            title: '🎉 Welcome Baby Emma Thompson!',
            content: 'The Thompson family welcomes their newest member. Congratulations to the proud parents!',
            timestamp: '3 days ago',
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
                <h1>Welcome Home, {user?.user_metadata?.full_name?.split(' ')[0] || 'Member'}</h1>
                <p className="home-subtitle">Stay connected with your community</p>
            </div>

            {/* Member Highlight Section */}
            <div className="member-highlight-section">
                <div className="highlight-header">
                    <h2>🌟 Member Spotlight</h2>
                    <button className="nominate-btn">Nominate Someone</button>
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
                        <h3>👨‍👩‍👧‍👦 Family Profile</h3>
                        <span className="status-badge success">Active</span>
                    </div>
                    <div className="completion-status">
                        <div className="progress-bar">
                            <div className="progress-fill" style={{ width: '75%' }}></div>
                        </div>
                        <span className="progress-text">75% Complete</span>
                    </div>
                    <p>Add 3 more family members to complete your family tree</p>
                    <button className="block-action-btn">Add Members</button>
                </div>

                {/* Community News Feed */}
                <div className="info-block">
                    <div className="block-header">
                        <h3>📰 Community Updates</h3>
                        <button className="view-all-btn">View All</button>
                    </div>
                    <div className="news-feed">
                        {newsFeed.slice(0, 3).map(item => (
                            <div key={item.id} className={getNewsFeedClass(item.type)}>
                                <div className="news-header">
                                    <span className="news-icon">{getNewsFeedIcon(item.type)}</span>
                                    <div className="news-meta">
                                        <h4>{item.title}</h4>
                                        <span className="news-timestamp">{item.timestamp}</span>
                                    </div>
                                </div>
                                <p className="news-content">{item.content}</p>
                                <small className="news-author">By {item.author}</small>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="info-block">
                    <h3>🚀 Quick Actions</h3>
                    <div className="quick-actions-grid">
                        <button className="quick-action-btn">
                            <span className="action-icon">📅</span>
                            <span>View Events</span>
                        </button>
                        <button className="quick-action-btn">
                            <span className="action-icon">🤝</span>
                            <span>Volunteer</span>
                        </button>
                        <button className="quick-action-btn">
                            <span className="action-icon">💬</span>
                            <span>Discussions</span>
                        </button>
                        <button className="quick-action-btn">
                            <span className="action-icon">📁</span>
                            <span>Documents</span>
                        </button>
                    </div>
                </div>

                {/* Community Stats */}
                <div className="info-block stats-block">
                    <h3>📊 Community Pulse</h3>
                    <div className="stats-grid">
                        <div className="stat-item">
                            <span className="stat-number">248</span>
                            <span className="stat-label">Active Members</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">12</span>
                            <span className="stat-label">Upcoming Events</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">89</span>
                            <span className="stat-label">Volunteer Hours</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">34</span>
                            <span className="stat-label">New Families</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ProfileView = ({ user }) => {
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
            <h1>My Profile</h1>
            <div className="profile-content">
                <div className="profile-header">
                    <div className="profile-avatar-container">
                        <div className="profile-avatar">
                            {profileData.profilePhoto ? (
                                <img src={URL.createObjectURL(profileData.profilePhoto)} alt="Profile" />
                            ) : (
                                <svg width="120" height="120" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="12" cy="8" r="4" fill="#388e3c" />
                                    <rect x="4" y="16" width="16" height="6" rx="3" fill="#388e3c" />
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
                                    📷 Change Photo
                                </label>
                            </div>
                        )}
                    </div>
                    <div className="profile-info">
                        <h2>{user?.user_metadata?.full_name || 'User'}</h2>
                        <p>{user?.email}</p>
                        <p>Member since: {new Date(user?.created_at).toLocaleDateString()}</p>
                    </div>
                </div>

                {!isEditing ? (
                    <div className="profile-cta">
                        <button className="primary-cta-btn" onClick={() => setIsEditing(true)}>
                            Complete Your Profile
                        </button>
                        <p>Add your personal information, education, and professional details</p>
                    </div>
                ) : (
                    <div className="profile-form">
                        <h3>Personal Information</h3>
                        <div className="form-grid">
                            <div className="form-group">
                                <label htmlFor="dateOfBirth">Date of Birth</label>
                                <input
                                    type="date"
                                    id="dateOfBirth"
                                    value={profileData.dateOfBirth}
                                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                                    className="form-input"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="gender">Gender</label>
                                <select
                                    id="gender"
                                    value={profileData.gender}
                                    onChange={(e) => handleInputChange('gender', e.target.value)}
                                    className="form-input"
                                >
                                    <option value="">Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                    <option value="prefer-not-to-say">Prefer not to say</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="maritalStatus">Marital Status</label>
                                <select
                                    id="maritalStatus"
                                    value={profileData.maritalStatus}
                                    onChange={(e) => handleInputChange('maritalStatus', e.target.value)}
                                    className="form-input"
                                >
                                    <option value="">Select Status</option>
                                    <option value="single">Single</option>
                                    <option value="married">Married</option>
                                    <option value="divorced">Divorced</option>
                                    <option value="widowed">Widowed</option>
                                    <option value="separated">Separated</option>
                                </select>
                            </div>
                        </div>

                        <h3>Education & Work</h3>
                        <div className="form-grid">
                            <div className="form-group">
                                <label htmlFor="highestQualification">Highest Qualification</label>
                                <select
                                    id="highestQualification"
                                    value={profileData.highestQualification}
                                    onChange={(e) => handleInputChange('highestQualification', e.target.value)}
                                    className="form-input"
                                >
                                    <option value="">Select Qualification</option>
                                    <option value="high-school">High School</option>
                                    <option value="diploma">Diploma</option>
                                    <option value="bachelors">Bachelor's Degree</option>
                                    <option value="masters">Master's Degree</option>
                                    <option value="phd">PhD</option>
                                    <option value="professional">Professional Certification</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="profession">Profession/Occupation</label>
                                <input
                                    type="text"
                                    id="profession"
                                    value={profileData.profession}
                                    onChange={(e) => handleInputChange('profession', e.target.value)}
                                    placeholder="e.g., Software Engineer, Teacher, Doctor"
                                    className="form-input"
                                />
                            </div>

                            <div className="form-group full-width">
                                <label htmlFor="specialSkills">Special Skills/Talents</label>
                                <textarea
                                    id="specialSkills"
                                    value={profileData.specialSkills}
                                    onChange={(e) => handleInputChange('specialSkills', e.target.value)}
                                    placeholder="e.g., Programming, Music, Cooking, Languages spoken, etc."
                                    className="form-input"
                                    rows="3"
                                />
                            </div>
                        </div>

                        <div className="form-actions">
                            <button className="save-btn" onClick={handleSaveProfile}>
                                Save Profile
                            </button>
                            <button className="cancel-btn" onClick={() => setIsEditing(false)}>
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                <div className="profile-stats">
                    <div className="stat">
                        <h3>5</h3>
                        <p>Family Members Added</p>
                    </div>
                    <div className="stat">
                        <h3>12</h3>
                        <p>Community Connections</p>
                    </div>
                    <div className="stat">
                        <h3>3</h3>
                        <p>Events Attended</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const FamilyTreeView = ({ user }) => {
    const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'tree'
    const [showAddMemberForm, setShowAddMemberForm] = useState(false);
    const [memberFormStep, setMemberFormStep] = useState(1);
    const [selectedMember, setSelectedMember] = useState(null);
    const [showMemberDetail, setShowMemberDetail] = useState(false);
    const [familyMembers, setFamilyMembers] = useState([
        // Sample data - in real app this would come from database
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
        // Minor-specific fields
        school: '',
        class: '',
        hobbies: '',
        achievements: '',
        // Adult-specific fields
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

    const handleEditMember = (member) => {
        setSelectedMember(member);
        setMemberData({
            ...member,
            ageCategory: member.age < 18 ? 'minor' : 'adult'
        });
        setShowAddMemberForm(true);
        setMemberFormStep(1);
    };

    const handleDeleteMember = (memberId) => {
        if (window.confirm('Are you sure you want to remove this family member?')) {
            setFamilyMembers(prev => prev.filter(member => member.id !== memberId));
        }
    };

    const handleViewMember = (member) => {
        setSelectedMember(member);
        setShowMemberDetail(true);
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
            // Update existing member
            setFamilyMembers(prev => prev.map(member =>
                member.id === selectedMember.id ? newMember : member
            ));
        } else {
            // Add new member
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

    const renderStepOne = () => (
        <div className="form-step">
            <h3>Add Family Member - Step 1</h3>
            <div className="form-group">
                <label htmlFor="relationship">What is their relationship to you?</label>
                <select
                    id="relationship"
                    value={memberData.relationship}
                    onChange={(e) => handleInputChange('relationship', e.target.value)}
                    className="form-input"
                >
                    <option value="">Select Relationship</option>
                    <option value="parent">Parent (Father/Mother)</option>
                    <option value="spouse">Spouse (Husband/Wife)</option>
                    <option value="child">Child (Son/Daughter)</option>
                    <option value="sibling">Sibling (Brother/Sister)</option>
                    <option value="grandparent">Grandparent</option>
                    <option value="grandchild">Grandchild</option>
                    <option value="uncle-aunt">Uncle/Aunt</option>
                    <option value="cousin">Cousin</option>
                    <option value="other">Other Relative</option>
                </select>
            </div>

            <div className="form-group">
                <label>Are they an adult or a minor?</label>
                <div className="radio-group">
                    <label className="radio-label">
                        <input
                            type="radio"
                            name="ageCategory"
                            value="adult"
                            checked={memberData.ageCategory === 'adult'}
                            onChange={(e) => handleInputChange('ageCategory', e.target.value)}
                        />
                        Adult (18+ years)
                    </label>
                    <label className="radio-label">
                        <input
                            type="radio"
                            name="ageCategory"
                            value="minor"
                            checked={memberData.ageCategory === 'minor'}
                            onChange={(e) => handleInputChange('ageCategory', e.target.value)}
                        />
                        Minor (Under 18 years)
                    </label>
                </div>
            </div>

            <div className="form-actions">
                <button
                    className="next-btn"
                    onClick={handleNextStep}
                    disabled={!memberData.relationship || !memberData.ageCategory}
                >
                    Next
                </button>
                <button className="cancel-btn" onClick={() => setShowAddMemberForm(false)}>
                    Cancel
                </button>
            </div>
        </div>
    );

    const renderStepTwo = () => (
        <div className="form-step">
            <h3>{selectedMember ? 'Edit' : 'Add'} Family Member - Step 2</h3>

            {/* Core Information - Required for All */}
            <h4>Basic Information</h4>
            <div className="form-grid">
                <div className="form-group">
                    <label htmlFor="memberName">Full Name *</label>
                    <input
                        type="text"
                        id="memberName"
                        value={memberData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Enter full name"
                        className="form-input"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="dateOfBirth">Date of Birth *</label>
                    <input
                        type="date"
                        id="dateOfBirth"
                        value={memberData.dateOfBirth}
                        onChange={(e) => {
                            handleInputChange('dateOfBirth', e.target.value);
                            // Auto-calculate age
                            const age = new Date().getFullYear() - new Date(e.target.value).getFullYear();
                            handleInputChange('age', age.toString());
                        }}
                        className="form-input"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="memberGender">Gender (Optional)</label>
                    <select
                        id="memberGender"
                        value={memberData.gender}
                        onChange={(e) => handleInputChange('gender', e.target.value)}
                        className="form-input"
                    >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                        <option value="prefer-not-to-say">Prefer not to say</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="profileImage">Profile Image (Optional)</label>
                    <input
                        type="file"
                        id="profileImage"
                        accept="image/*"
                        onChange={(e) => handleInputChange('profileImage', e.target.files[0])}
                        className="form-input"
                    />
                </div>
            </div>

            {memberData.ageCategory === 'minor' ? (
                <div>
                    <h4>Educational Information (Required for Minors)</h4>
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="school">School Name *</label>
                            <input
                                type="text"
                                id="school"
                                value={memberData.school}
                                onChange={(e) => handleInputChange('school', e.target.value)}
                                placeholder="Enter school name"
                                className="form-input"
                                required
                            />
                            <small className="field-note">Free text field - Enter exact school name</small>
                        </div>

                        <div className="form-group">
                            <label htmlFor="class">Class/Grade *</label>
                            <input
                                type="text"
                                id="class"
                                value={memberData.class}
                                onChange={(e) => handleInputChange('class', e.target.value)}
                                placeholder="e.g., 10th Grade, Class 5, Kindergarten"
                                className="form-input"
                                required
                            />
                        </div>
                    </div>

                    <h4>Additional Information (Optional)</h4>
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="hobbies">Hobbies & Interests</label>
                            <input
                                type="text"
                                id="hobbies"
                                value={memberData.hobbies}
                                onChange={(e) => handleInputChange('hobbies', e.target.value)}
                                placeholder="e.g., Sports, Music, Art, Reading"
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="achievements">Achievements</label>
                            <textarea
                                id="achievements"
                                value={memberData.achievements}
                                onChange={(e) => handleInputChange('achievements', e.target.value)}
                                placeholder="Academic awards, sports achievements, etc."
                                className="form-input"
                                rows="2"
                            />
                        </div>
                    </div>
                </div>
            ) : (
                <div>
                    <h4>Education & Professional Information (Required for Adults)</h4>
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="adultQualification">Highest Qualification *</label>
                            <select
                                id="adultQualification"
                                value={memberData.highestQualification}
                                onChange={(e) => handleInputChange('highestQualification', e.target.value)}
                                className="form-input"
                                required
                            >
                                <option value="">Select Qualification</option>
                                <option value="no-formal">No Formal Education</option>
                                <option value="primary">Primary School</option>
                                <option value="high-school">High School</option>
                                <option value="diploma">Diploma/Certificate</option>
                                <option value="bachelors">Bachelor's Degree</option>
                                <option value="masters">Master's Degree</option>
                                <option value="phd">PhD/Doctorate</option>
                                <option value="professional">Professional Certification</option>
                                <option value="trade">Trade/Vocational Training</option>
                                <option value="other">Other</option>
                            </select>
                            <small className="field-note">Multi-degree capture supported - select highest level</small>
                        </div>

                        <div className="form-group">
                            <label htmlFor="adultProfession">Profession/Occupation *</label>
                            <input
                                type="text"
                                id="adultProfession"
                                value={memberData.profession}
                                onChange={(e) => handleInputChange('profession', e.target.value)}
                                placeholder="e.g., Software Engineer, Teacher, Business Owner"
                                className="form-input"
                                required
                            />
                        </div>
                    </div>

                    <h4>Additional Professional Information (Optional)</h4>
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="employer">Employer/Company</label>
                            <input
                                type="text"
                                id="employer"
                                value={memberData.employer}
                                onChange={(e) => handleInputChange('employer', e.target.value)}
                                placeholder="Current employer or business name"
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="volunteerInterests">Volunteer Interests</label>
                            <input
                                type="text"
                                id="volunteerInterests"
                                value={memberData.volunteerInterests}
                                onChange={(e) => handleInputChange('volunteerInterests', e.target.value)}
                                placeholder="Community service, NGO work, etc."
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="adultMaritalStatus">Marital Status</label>
                            <select
                                id="adultMaritalStatus"
                                value={memberData.maritalStatus}
                                onChange={(e) => handleInputChange('maritalStatus', e.target.value)}
                                className="form-input"
                            >
                                <option value="">Select Status</option>
                                <option value="single">Single</option>
                                <option value="married">Married</option>
                                <option value="divorced">Divorced</option>
                                <option value="widowed">Widowed</option>
                                <option value="separated">Separated</option>
                                <option value="engaged">Engaged</option>
                            </select>
                        </div>
                    </div>
                </div>
            )}

            <div className="form-actions">
                <button className="save-btn" onClick={handleSaveMember}>
                    {selectedMember ? 'Update' : 'Add'} Family Member
                </button>
                <button className="back-btn" onClick={() => setMemberFormStep(1)}>
                    Back
                </button>
                <button className="cancel-btn" onClick={() => setShowAddMemberForm(false)}>
                    Cancel
                </button>
            </div>
        </div>
    );

    const renderMemberCards = () => (
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
                        <div className="member-actions">
                            <button className="action-menu-btn" onClick={() => handleViewMember(member)}>
                                ⋮
                            </button>
                            <div className="action-menu">
                                <button onClick={() => handleViewMember(member)}>👁️ View</button>
                                <button onClick={() => handleEditMember(member)}>✏️ Edit</button>
                                <button onClick={() => handleDeleteMember(member.id)} className="delete-action">🗑️ Delete</button>
                            </div>
                        </div>
                    </div>

                    <div className="member-card-content" onClick={() => handleViewMember(member)}>
                        <h3>{member.name}</h3>
                        <div className="member-details">
                            <p className="relationship">{member.relationship.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                            <p className="age">Age: {member.age}</p>
                            {member.profession && <p className="profession">{member.profession}</p>}
                            {member.school && <p className="school">{member.school}</p>}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    const renderMemberDetail = () => (
        <div className="member-detail-modal">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>{selectedMember?.name}</h2>
                    <button className="close-btn" onClick={() => setShowMemberDetail(false)}>×</button>
                </div>
                <div className="modal-body">
                    <div className="detail-avatar">
                        {selectedMember?.profileImage ? (
                            <img src={URL.createObjectURL(selectedMember.profileImage)} alt={selectedMember.name} />
                        ) : (
                            <div className="avatar-placeholder-large">
                                {getRelationshipIcon(selectedMember?.relationship)}
                            </div>
                        )}
                    </div>
                    <div className="detail-info">
                        <div className="info-section">
                            <h4>Basic Information</h4>
                            <p><strong>Relationship:</strong> {selectedMember?.relationship}</p>
                            <p><strong>Age:</strong> {selectedMember?.age}</p>
                            <p><strong>Date of Birth:</strong> {selectedMember?.dateOfBirth}</p>
                            {selectedMember?.gender && <p><strong>Gender:</strong> {selectedMember.gender}</p>}
                        </div>

                        {selectedMember?.age < 18 ? (
                            <div className="info-section">
                                <h4>Educational Information</h4>
                                <p><strong>School:</strong> {selectedMember?.school}</p>
                                <p><strong>Class:</strong> {selectedMember?.class}</p>
                                {selectedMember?.hobbies && <p><strong>Hobbies:</strong> {selectedMember.hobbies}</p>}
                                {selectedMember?.achievements && <p><strong>Achievements:</strong> {selectedMember.achievements}</p>}
                            </div>
                        ) : (
                            <div className="info-section">
                                <h4>Professional Information</h4>
                                <p><strong>Qualification:</strong> {selectedMember?.highestQualification}</p>
                                <p><strong>Profession:</strong> {selectedMember?.profession}</p>
                                {selectedMember?.employer && <p><strong>Employer:</strong> {selectedMember.employer}</p>}
                                {selectedMember?.volunteerInterests && <p><strong>Volunteer Work:</strong> {selectedMember.volunteerInterests}</p>}
                                {selectedMember?.maritalStatus && <p><strong>Marital Status:</strong> {selectedMember.maritalStatus}</p>}
                            </div>
                        )}
                    </div>
                </div>
                <div className="modal-actions">
                    <button className="edit-btn" onClick={() => {
                        setShowMemberDetail(false);
                        handleEditMember(selectedMember);
                    }}>
                        Edit Member
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="view-container">
            <div className="family-hub-header">
                <h1>Family Management Hub</h1>
                <div className="family-stats">
                    <span className="stat-badge">{familyMembers.length} Members</span>
                    <span className="stat-badge">{familyMembers.filter(m => m.age < 18).length} Children</span>
                    <span className="stat-badge">{familyMembers.filter(m => m.age >= 18).length} Adults</span>
                </div>
            </div>

            {/* Prominent Add Member CTA */}
            <div className="primary-cta-section">
                <button className="add-member-cta" onClick={handleAddMember}>
                    <span className="cta-icon">👥</span>
                    <span className="cta-text">Add Family Member</span>
                    <span className="cta-subtitle">Build your family tree</span>
                </button>
            </div>

            {/* View Mode Controls */}
            <div className="family-controls">
                <div className="view-toggle">
                    <button
                        className={viewMode === 'cards' ? 'active' : ''}
                        onClick={() => setViewMode('cards')}
                    >
                        📋 Card View
                    </button>
                    <button
                        className={viewMode === 'tree' ? 'active' : ''}
                        onClick={() => setViewMode('tree')}
                    >
                        🌳 Tree View
                    </button>
                </div>
            </div>

            {/* Family Member Forms */}
            {showAddMemberForm && (
                <div className="family-member-form">
                    {memberFormStep === 1 ? renderStepOne() : renderStepTwo()}
                </div>
            )}

            {/* Family Members Display */}
            {viewMode === 'cards' ? (
                familyMembers.length > 0 ? (
                    renderMemberCards()
                ) : (
                    <div className="empty-state">
                        <div className="empty-icon">👥</div>
                        <h3>No Family Members Added Yet</h3>
                        <p>Start building your family tree by adding your first family member</p>
                        <button className="empty-cta-btn" onClick={handleAddMember}>
                            Add Your First Member
                        </button>
                    </div>
                )
            ) : (
                <div className="family-tree-visual">
                    <div className="tree-node root">
                        <div className="person-card">
                            <div className="person-avatar">👤</div>
                            <p>{user?.user_metadata?.full_name || 'You'}</p>
                        </div>
                        <div className="tree-children">
                            {familyMembers.slice(0, 6).map(member => (
                                <div key={member.id} className="tree-node">
                                    <div className="person-card" onClick={() => handleViewMember(member)}>
                                        <div className="person-avatar">{getRelationshipIcon(member.relationship)}</div>
                                        <p>{member.name}</p>
                                        <small>{member.relationship}</small>
                                    </div>
                                </div>
                            ))}
                            <div className="tree-node">
                                <div className="person-card placeholder" onClick={handleAddMember}>
                                    <div className="person-avatar">+</div>
                                    <p>Add Member</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Member Detail Modal */}
            {showMemberDetail && renderMemberDetail()}
        </div>
    );
};

const CommunityDirectoryView = ({ user }) => (
    <div className="view-container">
        <h1>Community Directory</h1>
        <div className="directory-search">
            <div className="search-bar">
                <input type="text" placeholder="Search members by name, village, or family..." />
                <button>🔍</button>
            </div>

            <div className="filters">
                <select>
                    <option value="">All Villages</option>
                    <option value="village1">Village 1</option>
                    <option value="village2">Village 2</option>
                    <option value="village3">Village 3</option>
                </select>
                <select>
                    <option value="">All Families</option>
                    <option value="family1">Family A</option>
                    <option value="family2">Family B</option>
                </select>
            </div>
        </div>

        <div className="directory-grid">
            <div className="member-card">
                <div className="member-avatar">👤</div>
                <h3>John Doe</h3>
                <p>Village Center</p>
                <p>Doe Family</p>
                <button>Connect</button>
            </div>
            <div className="member-card">
                <div className="member-avatar">👤</div>
                <h3>Jane Smith</h3>
                <p>North Village</p>
                <p>Smith Family</p>
                <button>Connect</button>
            </div>
        </div>
    </div>
);

const SettingsView = ({ user }) => (
    <div className="view-container">
        <h1>Settings</h1>
        <div className="settings-sections">
            <div className="settings-section">
                <h3>Privacy Settings</h3>
                <div className="setting-item">
                    <label>
                        <input type="checkbox" defaultChecked />
                        Make my profile visible to community members
                    </label>
                </div>
                <div className="setting-item">
                    <label>
                        <input type="checkbox" />
                        Allow others to see my family tree
                    </label>
                </div>
                <div className="setting-item">
                    <label>
                        <input type="checkbox" defaultChecked />
                        Show me in community directory
                    </label>
                </div>
            </div>

            <div className="settings-section">
                <h3>Notification Preferences</h3>
                <div className="setting-item">
                    <label>
                        <input type="checkbox" defaultChecked />
                        Email notifications for new family connections
                    </label>
                </div>
                <div className="setting-item">
                    <label>
                        <input type="checkbox" defaultChecked />
                        Event reminders
                    </label>
                </div>
                <div className="setting-item">
                    <label>
                        <input type="checkbox" />
                        Weekly community updates
                    </label>
                </div>
            </div>

            <div className="settings-section">
                <h3>Account Settings</h3>
                <button className="settings-btn">Change Password</button>
                <button className="settings-btn">Download My Data</button>
                <button className="settings-btn danger">Delete Account</button>
            </div>
        </div>
    </div>
);

// Events View Component
const EventsView = ({ user }) => {
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
            rsvpStatus: null, // null, 'attending', 'declined'
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
                <h1>Community Events</h1>
                <button className="create-event-btn">+ Create Event</button>
            </div>

            <div className="events-filters">
                <button className="filter-btn active">All Events</button>
                <button className="filter-btn">My Events</button>
                <button className="filter-btn">This Month</button>
                <button className="filter-btn">Upcoming</button>
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
                                            {event.currentRSVPs} / {event.rsvpLimit} attending
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="event-actions">
                                {event.rsvpStatus === 'attending' ? (
                                    <div className="rsvp-status">
                                        <span className="attending-badge">✅ You're Attending</span>
                                        <button
                                            className="cancel-rsvp-btn"
                                            onClick={() => handleRSVP(event.id, null)}
                                        >
                                            Cancel RSVP
                                        </button>
                                    </div>
                                ) : (
                                    <div className="rsvp-actions">
                                        <button
                                            className="rsvp-btn attend"
                                            onClick={() => handleRSVP(event.id, 'attending')}
                                            disabled={event.currentRSVPs >= event.rsvpLimit}
                                        >
                                            {event.currentRSVPs >= event.rsvpLimit ? 'Event Full' : 'RSVP Yes'}
                                        </button>
                                        <button
                                            className="rsvp-btn decline"
                                            onClick={() => handleRSVP(event.id, 'declined')}
                                        >
                                            Can't Attend
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

// Volunteer View Component
const VolunteerView = ({ user }) => {
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
                <h1>Volunteer Opportunities</h1>
                <div className="volunteer-stats">
                    <div className="stat-item">
                        <span className="stat-number">24</span>
                        <span className="stat-label">Active Volunteers</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">89</span>
                        <span className="stat-label">Hours This Month</span>
                    </div>
                </div>
            </div>

            <div className="volunteer-filters">
                <button className="filter-btn active">All Opportunities</button>
                <button className="filter-btn">My Interests</button>
                <button className="filter-btn">Urgent</button>
                <button className="filter-btn">Ongoing</button>
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
                                <strong>Required Skills:</strong>
                                <div className="skills-tags">
                                    {opportunity.requiredSkills.map(skill => (
                                        <span key={skill} className="skill-tag">{skill}</span>
                                    ))}
                                </div>
                            </div>

                            <div className="detail-item">
                                <strong>Time Commitment:</strong> {opportunity.timeCommitment}
                            </div>

                            <div className="detail-item">
                                <strong>Contact:</strong> {opportunity.contact}
                            </div>

                            <div className="volunteer-progress">
                                <span className="volunteer-count">
                                    {opportunity.volunteers} / {opportunity.volunteers + opportunity.needed} volunteers
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
                                {opportunity.interested ? '✅ You\'re Interested' : '🤝 I\'m Interested'}
                            </button>
                            <button className="learn-more-btn">Learn More</button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="volunteer-cta-section">
                <h2>Want to Create a Volunteer Opportunity?</h2>
                <p>Help the community by creating new volunteer opportunities that match your expertise.</p>
                <button className="create-opportunity-btn">+ Create Opportunity</button>
            </div>
        </div>
    );
};

// Discussions View Component
const DiscussionsView = ({ user }) => {
    const [forums] = useState([
        {
            id: 1,
            title: 'Community Events & Announcements',
            description: 'Discuss upcoming events, share announcements, and coordinate community activities.',
            icon: '📅',
            topics: 47,
            posts: 234,
            lastActivity: '2 hours ago',
            lastPost: 'Annual Gathering Planning',
            moderators: ['Sarah Johnson', 'Mike Chen']
        },
        {
            id: 2,
            title: 'Family History & Genealogy',
            description: 'Share family stories, research tips, and connect with relatives. Help each other build family trees.',
            icon: '🌳',
            topics: 89,
            posts: 456,
            lastActivity: '5 hours ago',
            lastPost: 'Tips for Finding Birth Records',
            moderators: ['Emma Davis', 'Robert Kim']
        },
        {
            id: 3,
            title: 'Community Support & Resources',
            description: 'Ask for help, offer assistance, share local resources, and support each other.',
            icon: '🤝',
            topics: 156,
            posts: 789,
            lastActivity: '1 hour ago',
            lastPost: 'Carpooling for School Events',
            moderators: ['Lisa Wong', 'David Park']
        }
    ]);

    const [recentDiscussions] = useState([
        {
            id: 1,
            title: 'Planning the Spring Festival',
            author: 'Sarah Johnson',
            forum: 'Community Events',
            replies: 12,
            lastReply: '30 minutes ago',
            isHot: true
        },
        {
            id: 2,
            title: 'Looking for Johnson family descendants',
            author: 'Mike Johnson',
            forum: 'Family History',
            replies: 8,
            lastReply: '2 hours ago',
            isHot: false
        },
        {
            id: 3,
            title: 'Volunteer drivers needed for elderly members',
            author: 'Community Board',
            forum: 'Community Support',
            replies: 15,
            lastReply: '4 hours ago',
            isHot: true
        }
    ]);

    return (
        <div className="view-container">
            <div className="discussions-header">
                <h1>Community Discussions</h1>
                <button className="new-topic-btn">+ New Topic</button>
            </div>

            <div className="discussions-overview">
                <div className="overview-stats">
                    <div className="stat-item">
                        <span className="stat-number">292</span>
                        <span className="stat-label">Total Topics</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">1,479</span>
                        <span className="stat-label">Total Posts</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">156</span>
                        <span className="stat-label">Active Members</span>
                    </div>
                </div>
            </div>

            <div className="forums-section">
                <h2>Discussion Forums</h2>
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
                                    <span className="stat-label">Topics</span>
                                </div>
                                <div className="stat">
                                    <span className="stat-value">{forum.posts}</span>
                                    <span className="stat-label">Posts</span>
                                </div>
                            </div>

                            <div className="forum-activity">
                                <p className="last-activity">
                                    <strong>Latest:</strong> {forum.lastPost}
                                </p>
                                <p className="activity-time">{forum.lastActivity}</p>
                            </div>

                            <div className="forum-moderators">
                                <strong>Moderators:</strong> {forum.moderators.join(', ')}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="recent-discussions-section">
                <h2>Recent Discussions</h2>
                <div className="discussions-list">
                    {recentDiscussions.map(discussion => (
                        <div key={discussion.id} className="discussion-item">
                            <div className="discussion-content">
                                <div className="discussion-title">
                                    {discussion.isHot && <span className="hot-badge">🔥</span>}
                                    <h4>{discussion.title}</h4>
                                </div>
                                <div className="discussion-meta">
                                    <span className="author">by {discussion.author}</span>
                                    <span className="forum">in {discussion.forum}</span>
                                    <span className="replies">{discussion.replies} replies</span>
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

// Documents View Component
const DocumentsView = ({ user }) => {
    const [userRole] = useState('member'); // 'member', 'committee', 'admin'
    const [documents] = useState([
        {
            id: 1,
            title: 'Community Charter & Bylaws',
            description: 'Official community charter and governing bylaws.',
            category: 'governance',
            accessLevel: 'public',
            fileType: 'PDF',
            fileSize: '2.3 MB',
            lastUpdated: '2024-01-15',
            downloadCount: 89
        },
        {
            id: 2,
            title: 'Family Tree Template',
            description: 'Downloadable template for documenting your family tree.',
            category: 'resources',
            accessLevel: 'member',
            fileType: 'DOCX',
            fileSize: '156 KB',
            lastUpdated: '2024-01-20',
            downloadCount: 234
        },
        {
            id: 3,
            title: 'Meeting Minutes - December 2024',
            description: 'Minutes from the December community board meeting.',
            category: 'meetings',
            accessLevel: 'committee',
            fileType: 'PDF',
            fileSize: '1.1 MB',
            lastUpdated: '2024-12-15',
            downloadCount: 45
        },
        {
            id: 4,
            title: 'Event Planning Guidelines',
            description: 'Comprehensive guide for organizing community events.',
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
                <h1>Community Documents</h1>
                <div className="user-access-info">
                    <span className="access-badge">Access Level: {userRole}</span>
                </div>
            </div>

            <div className="documents-controls">
                <div className="search-section">
                    <input
                        type="text"
                        placeholder="Search documents..."
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
                        <option value="all">All Categories</option>
                        <option value="governance">Governance</option>
                        <option value="resources">Resources</option>
                        <option value="meetings">Meeting Minutes</option>
                        <option value="guidelines">Guidelines</option>
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
                                    <span className="meta-label">Type:</span>
                                    <span className="meta-value">{doc.fileType}</span>
                                </div>
                                <div className="meta-item">
                                    <span className="meta-label">Size:</span>
                                    <span className="meta-value">{doc.fileSize}</span>
                                </div>
                                <div className="meta-item">
                                    <span className="meta-label">Updated:</span>
                                    <span className="meta-value">{new Date(doc.lastUpdated).toLocaleDateString()}</span>
                                </div>
                                <div className="meta-item">
                                    <span className="meta-label">Downloads:</span>
                                    <span className="meta-value">{doc.downloadCount}</span>
                                </div>
                            </div>
                        </div>

                        <div className="document-actions">
                            <button className="download-btn">📥 Download</button>
                            <button className="preview-btn">👁️ Preview</button>
                        </div>
                    </div>
                ))}
            </div>

            {filteredDocuments.length === 0 && (
                <div className="no-documents">
                    <div className="no-docs-icon">📄</div>
                    <h3>No Documents Found</h3>
                    <p>Try adjusting your search terms or category filter.</p>
                </div>
            )}

            <div className="documents-help">
                <h3>Need Help?</h3>
                <p>Documents are organized by access level. Members can access public and member documents,
                    while committee members have additional access to committee documents.</p>
            </div>
        </div>
    );
};

export default Dashboard;