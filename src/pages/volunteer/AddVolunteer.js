import { useState } from 'react';
import { DB_TABLES } from '../../config/dbConfig';
import { useLanguage } from '../../i18n/LanguageContext';
import { supabase } from '../../config/supabaseClient';
import { useTranslation } from '../../i18n/translations';

import './AddVolunteer.css';

const AddVolunteer = ({ user, onSuccess, onNavigate }) => {
    const { language } = useLanguage();
    const { t } = useTranslation(language);
    const [form, setForm] = useState({
        title: '',
        description: '',
        requiredSkills: '',
        timeCommitment: '',
        location: '',
        category: 'community',
        contactInfo: '',
    });
    const [adding, setAdding] = useState(false);

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setAdding(true);

        try {
            const { data, error } = await supabase
                .from(DB_TABLES.VOLUNTEER)
                .insert([form])
                .select();

            if (error) throw error;

            if (onSuccess) onSuccess();
            setForm({
                title: '',
                description: '',
                requiredSkills: '',
                timeCommitment: '',
                location: '',
                category: 'community',
                contactInfo: ''
            });

            // Navigate back to volunteer view
            if (onNavigate) onNavigate('volunteer');
        } catch (error) {
            console.error("Failed to add volunteer opportunity:", error);
        } finally {
            setAdding(false);
        }
    };

    return (
        <div className="add-volunteer-container">
            <div className="add-volunteer-header">
                <h1 className="add-volunteer-title">{t('addOpportunity', 'Add Volunteer Opportunity')}</h1>
                <button
                    onClick={() => onNavigate && onNavigate('volunteer')}
                    className="back-button"
                >
                    ← {t('back', 'Back')}
                </button>
            </div>

            <div className="add-volunteer-form-container">
                <h2 className="form-title">{t('addVolunteer.title', 'Create Volunteer Opportunity')}</h2>
                <form onSubmit={handleSubmit} className="volunteer-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="title" className="form-label">
                                {t('addVolunteer.titleLabel', 'Opportunity Title')}
                            </label>
                            <input
                                id="title"
                                name="title"
                                required
                                placeholder={t('addVolunteer.titlePlaceholder', 'Opportunity Title')}
                                value={form.title}
                                onChange={handleChange}
                                className="form-input"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="category" className="form-label">
                                {t('addVolunteer.categoryLabel', 'Category')}
                            </label>
                            <select
                                id="category"
                                name="category"
                                value={form.category}
                                onChange={handleChange}
                                className="form-select"
                            >
                                <option value="community">{t('addVolunteer.categoryCommunity', 'Community')}</option>
                                <option value="education">{t('addVolunteer.categoryEducation', 'Education')}</option>
                                <option value="environment">{t('addVolunteer.categoryEnvironment', 'Environment')}</option>
                                <option value="elderly">{t('addVolunteer.categoryElderly', 'Elderly Care')}</option>
                                <option value="youth">{t('addVolunteer.categoryYouth', 'Youth Programs')}</option>
                                <option value="events">{t('addVolunteer.categoryEvents', 'Event Support')}</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="timeCommitment" className="form-label">
                                {t('timeCommitment', 'Time Commitment')}
                            </label>
                            <input
                                id="timeCommitment"
                                name="timeCommitment"
                                required
                                placeholder={t('addVolunteer.timeCommitmentPlaceholder', 'e.g., 2 hours/week, One-time event')}
                                value={form.timeCommitment}
                                onChange={handleChange}
                                className="form-input"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="contactInfo" className="form-label">
                                {t('contact', 'Contact Information')}
                            </label>
                            <input
                                id="contactInfo"
                                name="contactInfo"
                                required
                                placeholder={t('addVolunteer.contactPlaceholder', 'Email or phone number')}
                                value={form.contactInfo}
                                onChange={handleChange}
                                className="form-input"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="location" className="form-label">
                            {t('location', 'Location')}
                        </label>
                        <input
                            id="location"
                            name="location"
                            required
                            placeholder={t('addVolunteer.locationPlaceholder', 'Location or Remote')}
                            value={form.location}
                            onChange={handleChange}
                            className="form-input"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="requiredSkills" className="form-label">
                            {t('requiredSkills', 'Required Skills')}
                        </label>
                        <input
                            id="requiredSkills"
                            name="requiredSkills"
                            placeholder={t('addVolunteer.skillsPlaceholder', 'e.g., Teaching, Computer skills, Physical work')}
                            value={form.requiredSkills}
                            onChange={handleChange}
                            className="form-input"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description" className="form-label">
                            {t('addVolunteer.descriptionLabel', 'Description')}
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            required
                            placeholder={t('addVolunteer.descriptionPlaceholder', 'Describe the volunteer opportunity and its impact')}
                            value={form.description}
                            onChange={handleChange}
                            className="form-textarea"
                            rows={4}
                        />
                    </div>

                    <div className="form-buttons">
                        <button
                            type="button"
                            onClick={() => onNavigate && onNavigate('volunteer')}
                            className="cancel-button"
                        >
                            {t('cancel', 'Cancel')}
                        </button>
                        <button
                            type="submit"
                            disabled={adding}
                            className="submit-button"
                        >
                            {adding ? t('loading', 'Loading...') : t('addVolunteer.submitButton', 'Add Opportunity')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddVolunteer;