import { useState } from 'react';
import { DB_TABLES } from '../dbConfig';
import { useLanguage } from '../LanguageContext';
import { useTranslation } from '../translations';
import { supabase } from '../supabaseClient';
import logger from '../utils/logger';
import './AddFamilyMember.css';

const AddFamilyMember = ({ user, onSuccess, onNavigate }) => {
    const { language } = useLanguage();
    const { t } = useTranslation(language);
    const [form, setForm] = useState({
        relationship: '',
        ageCategory: '',
        name: '',
        dateOfBirth: '',
        age: '',
        gender: '',
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
    const [adding, setAdding] = useState(false);

    const relationshipOptions = [
        { value: 'parent', label: 'Parent', icon: '👨‍👩‍👧‍👦' },
        { value: 'spouse', label: 'Spouse', icon: '💑' },
        { value: 'child', label: 'Child', icon: '👶' },
        { value: 'sibling', label: 'Sibling', icon: '👫' },
        { value: 'grandparent', label: 'Grandparent', icon: '👴' },
        { value: 'grandchild', label: 'Grandchild', icon: '🧒' },
        { value: 'uncle-aunt', label: 'Uncle/Aunt', icon: '👨‍👩‍👧' },
        { value: 'cousin', label: 'Cousin', icon: '👥' },
        { value: 'other', label: 'Other Relative', icon: '👤' }
    ];

    const handleChange = (field, value) => {
        setForm(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        if (!user?.id) return;

        setAdding(true);

        const memberData = {
            ...form,
            user_id: user.id,
            age: form.age ? parseInt(form.age) : null
        };

        try {
            logger.log('Saving family member for user', user.id, memberData);

            const { data, error } = await supabase
                .from(DB_TABLES.FAMILY_MEMBERS)
                .insert([memberData])
                .select();

            if (error) throw error;

            logger.log('Family member saved successfully', data);

            if (onSuccess) onSuccess();
            setForm({
                relationship: '',
                ageCategory: '',
                name: '',
                dateOfBirth: '',
                age: '',
                gender: '',
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

            // Navigate back to family tree view
            if (onNavigate) onNavigate('family');
        } catch (error) {
            logger.error('Error saving family member', error);
            console.error("Failed to add family member:", error);
        } finally {
            setAdding(false);
        }
    };

    const getRelationshipIcon = (relationship) => {
        const option = relationshipOptions.find(opt => opt.value === relationship);
        return option ? option.icon : '👤';
    };

    return (
        <div className="add-family-member-container">
            <div className="add-family-member-header">
                <h1 className="add-family-member-title">{t('addFamilyMember', 'Add Family Member')}</h1>
                <button
                    onClick={() => onNavigate && onNavigate('family')}
                    className="back-button"
                >
                    ← {t('back', 'Back')}
                </button>
            </div>

            <div className="add-family-member-form-container">
                <h2 className="form-title">{t('addFamilyMember.title', 'Add New Family Member')}</h2>
                <form onSubmit={handleSubmit} className="family-member-form">

                    {/* Relationship Selection */}
                    <div className="form-section">
                        <div className="relationship-section">
                            <div className="section-title">
                                <span className="section-icon">👥</span>
                                {t('relationshipToYou', 'What is their relationship to you?')}
                            </div>
                            <div className="relationship-grid">
                                {relationshipOptions.map(option => (
                                    <div
                                        key={option.value}
                                        className={`relationship-option ${form.relationship === option.value ? 'selected' : ''}`}
                                        onClick={() => handleChange('relationship', option.value)}
                                    >
                                        <div className="relationship-icon">{option.icon}</div>
                                        <div className="relationship-label">{t(option.value, option.label)}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Age Category */}
                    {form.relationship && (
                        <div className="form-section">
                            <div className="age-category-section">
                                <div className="section-title">
                                    <span className="section-icon">🎂</span>
                                    {t('adultOrMinor', 'Are they an adult or a minor?')}
                                </div>
                                <div className="age-options">
                                    <div
                                        className={`age-option ${form.ageCategory === 'adult' ? 'selected' : ''}`}
                                        onClick={() => handleChange('ageCategory', 'adult')}
                                    >
                                        {t('adult18Plus', 'Adult (18+ years)')}
                                    </div>
                                    <div
                                        className={`age-option ${form.ageCategory === 'minor' ? 'selected' : ''}`}
                                        onClick={() => handleChange('ageCategory', 'minor')}
                                    >
                                        {t('minorUnder18', 'Minor (Under 18 years)')}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Basic Information */}
                    {form.ageCategory && (
                        <div className="form-section">
                            <div className="section-title">
                                <span className="section-icon">📝</span>
                                {t('basicInformation', 'Basic Information')}
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="name" className="form-label">
                                        {t('fullName', 'Full Name')} *
                                    </label>
                                    <input
                                        id="name"
                                        name="name"
                                        required
                                        placeholder={t('enterFullName', 'Enter full name')}
                                        value={form.name}
                                        onChange={e => handleChange('name', e.target.value)}
                                        className="form-input"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="age" className="form-label">
                                        {t('age', 'Age')}
                                    </label>
                                    <input
                                        id="age"
                                        name="age"
                                        type="number"
                                        min="0"
                                        max="150"
                                        placeholder={t('enterAge', 'Enter age')}
                                        value={form.age}
                                        onChange={e => handleChange('age', e.target.value)}
                                        className="form-input"
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="dateOfBirth" className="form-label">
                                        {t('dateOfBirth', 'Date of Birth')}
                                    </label>
                                    <input
                                        id="dateOfBirth"
                                        name="dateOfBirth"
                                        type="date"
                                        value={form.dateOfBirth}
                                        onChange={e => handleChange('dateOfBirth', e.target.value)}
                                        className="form-input"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="gender" className="form-label">
                                        {t('genderOptional', 'Gender (Optional)')}
                                    </label>
                                    <select
                                        id="gender"
                                        name="gender"
                                        value={form.gender}
                                        onChange={e => handleChange('gender', e.target.value)}
                                        className="form-select"
                                    >
                                        <option value="">{t('selectGender', 'Select Gender')}</option>
                                        <option value="male">{t('male', 'Male')}</option>
                                        <option value="female">{t('female', 'Female')}</option>
                                        <option value="other">{t('other', 'Other')}</option>
                                        <option value="prefer-not-to-say">{t('preferNotToSay', 'Prefer not to say')}</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Education/Work Information */}
                    {form.ageCategory === 'minor' && (
                        <div className="form-section">
                            <div className="section-title">
                                <span className="section-icon">🎓</span>
                                {t('educationalInfo', 'Educational Information')}
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="school" className="form-label">
                                        {t('schoolName', 'School Name')}
                                    </label>
                                    <input
                                        id="school"
                                        name="school"
                                        placeholder={t('enterSchoolName', 'Enter school name')}
                                        value={form.school}
                                        onChange={e => handleChange('school', e.target.value)}
                                        className="form-input"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="class" className="form-label">
                                        {t('classGrade', 'Class/Grade')}
                                    </label>
                                    <input
                                        id="class"
                                        name="class"
                                        placeholder={t('classPlaceholder', 'e.g., 10th Grade, Class 5')}
                                        value={form.class}
                                        onChange={e => handleChange('class', e.target.value)}
                                        className="form-input"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {form.ageCategory === 'adult' && (
                        <div className="form-section">
                            <div className="section-title">
                                <span className="section-icon">💼</span>
                                {t('educationProfessional', 'Education & Professional Information')}
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="highestQualification" className="form-label">
                                        {t('highestQualification', 'Highest Qualification')}
                                    </label>
                                    <select
                                        id="highestQualification"
                                        name="highestQualification"
                                        value={form.highestQualification}
                                        onChange={e => handleChange('highestQualification', e.target.value)}
                                        className="form-select"
                                    >
                                        <option value="">{t('selectQualification', 'Select Qualification')}</option>
                                        <option value="no-formal">{t('noFormalEducation', 'No Formal Education')}</option>
                                        <option value="primary">{t('primarySchool', 'Primary School')}</option>
                                        <option value="high-school">{t('highSchool', 'High School')}</option>
                                        <option value="diploma">{t('diploma', 'Diploma')}</option>
                                        <option value="bachelors">{t('bachelors', 'Bachelor\'s Degree')}</option>
                                        <option value="masters">{t('masters', 'Master\'s Degree')}</option>
                                        <option value="phd">{t('phd', 'PhD')}</option>
                                        <option value="professional">{t('professionalCert', 'Professional Certification')}</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="profession" className="form-label">
                                        {t('profession', 'Profession/Occupation')}
                                    </label>
                                    <input
                                        id="profession"
                                        name="profession"
                                        placeholder={t('professionPlaceholder', 'e.g., Software Engineer, Teacher')}
                                        value={form.profession}
                                        onChange={e => handleChange('profession', e.target.value)}
                                        className="form-input"
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="employer" className="form-label">
                                        {t('employerCompany', 'Employer/Company')}
                                    </label>
                                    <input
                                        id="employer"
                                        name="employer"
                                        placeholder={t('employerPlaceholder', 'Current employer or business name')}
                                        value={form.employer}
                                        onChange={e => handleChange('employer', e.target.value)}
                                        className="form-input"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="maritalStatus" className="form-label">
                                        {t('maritalStatusAdult', 'Marital Status')}
                                    </label>
                                    <select
                                        id="maritalStatus"
                                        name="maritalStatus"
                                        value={form.maritalStatus}
                                        onChange={e => handleChange('maritalStatus', e.target.value)}
                                        className="form-select"
                                    >
                                        <option value="">{t('selectStatus', 'Select Status')}</option>
                                        <option value="single">{t('single', 'Single')}</option>
                                        <option value="married">{t('married', 'Married')}</option>
                                        <option value="engaged">{t('engaged', 'Engaged')}</option>
                                        <option value="divorced">{t('divorced', 'Divorced')}</option>
                                        <option value="widowed">{t('widowed', 'Widowed')}</option>
                                        <option value="separated">{t('separated', 'Separated')}</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Additional Information */}
                    {form.name && (
                        <div className="form-section">
                            <div className="section-title">
                                <span className="section-icon">✨</span>
                                {t('additionalInfo', 'Additional Information (Optional)')}
                            </div>
                            <div className="form-group">
                                <label htmlFor="hobbies" className="form-label">
                                    {t('hobbiesInterests', 'Hobbies & Interests')}
                                </label>
                                <textarea
                                    id="hobbies"
                                    name="hobbies"
                                    placeholder={t('hobbiesPlaceholder', 'e.g., Sports, Music, Art, Reading')}
                                    value={form.hobbies}
                                    onChange={e => handleChange('hobbies', e.target.value)}
                                    className="form-textarea"
                                    rows={3}
                                />
                            </div>

                            {form.ageCategory === 'minor' && (
                                <div className="form-group">
                                    <label htmlFor="achievements" className="form-label">
                                        {t('achievements', 'Achievements')}
                                    </label>
                                    <textarea
                                        id="achievements"
                                        name="achievements"
                                        placeholder={t('achievementsPlaceholder', 'Academic awards, sports achievements, etc.')}
                                        value={form.achievements}
                                        onChange={e => handleChange('achievements', e.target.value)}
                                        className="form-textarea"
                                        rows={3}
                                    />
                                </div>
                            )}

                            {form.ageCategory === 'adult' && (
                                <div className="form-group">
                                    <label htmlFor="volunteerInterests" className="form-label">
                                        {t('volunteerInterests', 'Volunteer Interests')}
                                    </label>
                                    <textarea
                                        id="volunteerInterests"
                                        name="volunteerInterests"
                                        placeholder={t('volunteerPlaceholder', 'Community service, NGO work, etc.')}
                                        value={form.volunteerInterests}
                                        onChange={e => handleChange('volunteerInterests', e.target.value)}
                                        className="form-textarea"
                                        rows={3}
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    {/* Preview */}
                    {(form.name || form.relationship) && (
                        <div className="member-preview">
                            <div className="preview-title">👨‍👩‍👧‍👦 Family Member Preview</div>
                            <div className="preview-content">
                                {form.name && <div><strong>{form.name}</strong></div>}
                                {form.relationship && <div>{getRelationshipIcon(form.relationship)} {t(form.relationship, form.relationship)}</div>}
                                {form.age && <div>🎂 {form.age} years old</div>}
                                {form.profession && <div>💼 {form.profession}</div>}
                                {form.school && <div>🎓 {form.school}</div>}
                            </div>
                        </div>
                    )}

                    <div className="form-buttons">
                        <button
                            type="button"
                            onClick={() => onNavigate && onNavigate('family')}
                            className="cancel-button"
                        >
                            {t('cancel', 'Cancel')}
                        </button>
                        <button
                            type="submit"
                            disabled={adding || !form.name || !form.relationship}
                            className="submit-button"
                        >
                            <span className="button-icon">👨‍👩‍👧‍👦</span>
                            {adding ? t('loading', 'Adding...') : t('addFamilyMemberBtn', 'Add Family Member')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddFamilyMember;