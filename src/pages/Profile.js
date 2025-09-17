import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import logger from '../utils/logger';

const ProfileView = ({ user, t }) => {

    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({
        profilePhoto: null,
        date_of_birth: '',
        gender: '',
        marital_status: '',
        highest_qualification: '',
        profession: '',
        special_skills: ''
    });
    // Fetch profile from Supabase on mount
    useEffect(() => {
        const fetchProfile = async () => {
            if (!user?.id) return;
            logger.log('Fetching profile for user', user.id);
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();
            if (data) {
                setProfileData(prev => ({
                    ...prev,
                    ...data,
                    profilePhoto: null // Don't auto-load photo file
                }));
                logger.log('Profile data loaded', data);
            }
            if (error) {
                logger.error('Error fetching profile', error);
            }
        };
        fetchProfile();
    }, [user]);

    const handleInputChange = (field, value) => {
        setProfileData(prev => ({
            ...prev,
            [field]: value
        }));
    };


    const handleSaveProfile = async () => {
        if (!user?.id) return;
        logger.log('Saving profile for user', user.id, profileData);
        // Upload photo if present
        let profile_photo_url = undefined;
        if (profileData.profilePhoto) {
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('profile-photos')
                .upload(`${user.id}/${profileData.profilePhoto.name}`, profileData.profilePhoto, { upsert: true });
            if (!uploadError && uploadData) {
                const { data: publicUrl } = supabase.storage.from('profile-photos').getPublicUrl(uploadData.path);
                profile_photo_url = publicUrl?.publicUrl;
                logger.log('Profile photo uploaded', profile_photo_url);
            }
            if (uploadError) {
                logger.error('Error uploading profile photo', uploadError);
            }
        }
        const updateData = {
            ...profileData,
            profile_photo_url: profile_photo_url || undefined,
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name || '',
        };
        // Remove profilePhoto (file) from update
        delete updateData.profilePhoto;
        const { error } = await supabase
            .from('profiles')
            .upsert(updateData, { onConflict: ['id'] });
        if (!error) {
            logger.log('Profile saved successfully');
            setIsEditing(false);
        } else {
            logger.error('Error saving profile', error);
            alert('Error saving profile');
        }
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
                                <label htmlFor="date_of_birth">{t('dateOfBirth') || 'Date of Birth'}</label>
                                <input
                                    type="date"
                                    id="date_of_birth"
                                    value={profileData.date_of_birth}
                                    onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
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
                                <label htmlFor="marital_status">{t('maritalStatus') || 'Marital Status'}</label>
                                <select
                                    id="marital_status"
                                    value={profileData.marital_status}
                                    onChange={(e) => handleInputChange('marital_status', e.target.value)}
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
                                <label htmlFor="highest_qualification">{t('highestQualification') || 'Highest Qualification'}</label>
                                <select
                                    id="highest_qualification"
                                    value={profileData.highest_qualification}
                                    onChange={(e) => handleInputChange('highest_qualification', e.target.value)}
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
                                <label htmlFor="special_skills">{t('specialSkills') || 'Special Skills/Talents'}</label>
                                <textarea
                                    id="special_skills"
                                    value={profileData.special_skills}
                                    onChange={(e) => handleInputChange('special_skills', e.target.value)}
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