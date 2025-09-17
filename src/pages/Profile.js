import { useState } from 'react';

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

export default ProfileView;