
import { useState } from 'react';
import { DB_TABLES } from '../../config/dbConfig';
import { useLanguage } from '../../i18n/LanguageContext';
import { useTranslation } from '../../i18n/translations';
import { supabase } from '../../config/supabaseClient';
import './AddEvent.css';

const AddEvent = ({ user, onSuccess, onNavigate }) => {
    const { language } = useLanguage();
    const { t } = useTranslation(language);
    const [form, setForm] = useState({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        category: 'community',
    });
    const [adding, setAdding] = useState(false);
    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    const handleSubmit = async e => {
        e.preventDefault();
        setAdding(true);

        const dateTime = form.date && form.time ? `${form.date}T${form.time}` : '';
        const toInsert = { ...form, dateTime };

        try {
            const { data, error } = await supabase
                .from(DB_TABLES.EVENTS)
                .insert([toInsert])
                .select();

            if (error) throw error;

            if (onSuccess) onSuccess();
            setForm({ title: '', description: '', date: '', time: '', location: '', category: 'community' });

            // Navigate back to events view
            if (onNavigate) onNavigate('events');
        } catch (error) {
            console.error("Failed to add event:", error);
        } finally {
            setAdding(false);
        }
    };
    return (
        <div className="add-event-container">
            <div className="add-event-header">
                <h1 className="add-event-title">{t('addEvent', 'Create Event')}</h1>
                <button
                    onClick={() => onNavigate && onNavigate('events')}
                    className="back-button"
                >
                    ← {t('back', 'Back')}
                </button>
            </div>

            <div className="add-event-form-container">
                <h2 className="form-title">{t('addEvent.title', 'Create New Event')}</h2>
                <form onSubmit={handleSubmit} className="event-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="title" className="form-label">
                                {t('addEvent.titleLabel', 'Event Title')}
                            </label>
                            <input
                                id="title"
                                name="title"
                                required
                                placeholder={t('addEvent.titlePlaceholder', 'What\'s the name of your event?')}
                                value={form.title}
                                onChange={handleChange}
                                className="form-input"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="category" className="form-label">
                                {t('addEvent.categoryLabel', 'Event Category')}
                            </label>
                            <select
                                id="category"
                                name="category"
                                value={form.category}
                                onChange={handleChange}
                                className="form-select"
                            >
                                <option value="community">{t('addEvent.categoryCommunity', 'Community')}</option>
                                <option value="educational">{t('addEvent.categoryEducational', 'Educational')}</option>
                                <option value="sports">{t('addEvent.categorySports', 'Sports')}</option>
                                <option value="cultural">{t('addEvent.categoryCultural', 'Cultural')}</option>
                                <option value="volunteer">{t('addEvent.categoryVolunteer', 'Volunteer')}</option>
                            </select>
                        </div>
                    </div>

                    <div className="date-time-section">
                        <div className="date-time-title">
                            <span className="date-time-icon">📅</span>
                            {t('addEvent.whenLabel', 'When is your event?')}
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="date" className="form-label">
                                    {t('addEvent.dateLabel', 'Date')}
                                </label>
                                <input
                                    id="date"
                                    name="date"
                                    type="date"
                                    required
                                    value={form.date}
                                    onChange={handleChange}
                                    className="form-input"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="time" className="form-label">
                                    {t('addEvent.timeLabel', 'Start Time')}
                                </label>
                                <input
                                    id="time"
                                    name="time"
                                    type="time"
                                    required
                                    value={form.time}
                                    onChange={handleChange}
                                    className="form-input"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="location" className="form-label">
                            {t('addEvent.locationLabel', 'Event Location')}
                        </label>
                        <input
                            id="location"
                            name="location"
                            required
                            placeholder={t('addEvent.locationPlaceholder', 'Where will this event take place?')}
                            value={form.location}
                            onChange={handleChange}
                            className="form-input"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description" className="form-label">
                            {t('addEvent.descriptionLabel', 'Event Description')}
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            required
                            placeholder={t('addEvent.descriptionPlaceholder', 'Tell people what this event is about and what to expect...')}
                            value={form.description}
                            onChange={handleChange}
                            className="form-textarea"
                            rows={4}
                        />
                    </div>

                    {(form.title || form.date || form.time) && (
                        <div className="event-preview">
                            <div className="preview-title">📋 Event Preview</div>
                            <div className="preview-content">
                                {form.title && <div><strong>{form.title}</strong></div>}
                                {form.date && <div>📅 {new Date(form.date).toLocaleDateString()}</div>}
                                {form.time && <div>🕐 {form.time}</div>}
                                {form.location && <div>📍 {form.location}</div>}
                            </div>
                        </div>
                    )}

                    <div className="form-buttons">
                        <button
                            type="button"
                            onClick={() => onNavigate && onNavigate('events')}
                            className="cancel-button"
                        >
                            {t('cancel', 'Cancel')}
                        </button>
                        <button
                            type="submit"
                            disabled={adding}
                            className="submit-button"
                        >
                            <span className="button-icon">🎉</span>
                            {adding ? t('loading', 'Creating...') : t('addEvent.submitButton', 'Create Event')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddEvent;
