import { useState } from 'react';
import { DB_TABLES } from '../dbConfig';
import { useLanguage } from '../LanguageContext';
import { supabase } from '../supabaseClient';
import { useTranslation } from '../translations';
import './AddDiscussion.css';

const AddDiscussion = ({ user, onSuccess, onNavigate }) => {
    const { language } = useLanguage();
    const { t } = useTranslation(language);
    const [form, setForm] = useState({
        title: '',
        forum: '',
        description: '',
        tags: '',
    });
    const [adding, setAdding] = useState(false);

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setAdding(true);

        const toInsert = {
            ...form,
            tags: form.tags.split(',').map(s => s.trim()),
            type: 'discussion',
            author: user?.email || 'Anonymous',
            replies: 0,
            lastReply: new Date().toISOString(),
        };

        try {
            const { data, error } = await supabase
                .from(DB_TABLES.DISCUSSIONS)
                .insert([toInsert])
                .select();

            if (error) throw error;

            if (onSuccess) onSuccess();
            setForm({ title: '', forum: '', description: '', tags: '' });

            // Navigate back to discussions view
            if (onNavigate) onNavigate('discussions');
        } catch (error) {
            console.error("Failed to add discussion:", error);
        } finally {
            setAdding(false);
        }
    };

    return (
        <div className="add-discussion-container">
            <div className="add-discussion-header">
                <h1 className="add-discussion-title">{t('addDiscussion', 'Start a New Discussion')}</h1>
                <button
                    onClick={() => onNavigate && onNavigate('discussions')}
                    className="back-button"
                >
                    ← {t('back', 'Back')}
                </button>
            </div>

            <div className="add-discussion-form-container">
                <h2 className="form-title">{t('addDiscussion.title', 'Start a New Discussion')}</h2>
                <form onSubmit={handleSubmit} className="discussion-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="title" className="form-label">
                                {t('addDiscussion.titleLabel', 'Discussion Title')}
                            </label>
                            <input
                                id="title"
                                name="title"
                                required
                                placeholder={t('addDiscussion.titlePlaceholder', 'What would you like to discuss?')}
                                value={form.title}
                                onChange={handleChange}
                                className="form-input"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="forum" className="form-label">
                                {t('addDiscussion.forumLabel', 'Forum Category')}
                            </label>
                            <select
                                id="forum"
                                name="forum"
                                required
                                value={form.forum}
                                onChange={handleChange}
                                className="form-select"
                            >
                                <option value="">{t('addDiscussion.selectForum', 'Select a Forum')}</option>
                                <option value="General">{t('addDiscussion.forumGeneral', 'General')}</option>
                                <option value="Community">{t('addDiscussion.forumCommunity', 'Community')}</option>
                                <option value="Spiritual">{t('addDiscussion.forumSpiritual', 'Spiritual')}</option>
                                <option value="Events">{t('addDiscussion.forumEvents', 'Events')}</option>
                                <option value="Support">{t('addDiscussion.forumSupport', 'Support')}</option>
                                <option value="Feedback">{t('addDiscussion.forumFeedback', 'Feedback')}</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="tags" className="form-label">
                            {t('addDiscussion.tagsLabel', 'Tags (Optional)')}
                        </label>
                        <input
                            id="tags"
                            name="tags"
                            placeholder={t('addDiscussion.tagsPlaceholder', 'e.g., family, spirituality, community')}
                            value={form.tags}
                            onChange={handleChange}
                            className="form-input"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description" className="form-label">
                            {t('addDiscussion.descriptionLabel', 'Description')}
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            required
                            placeholder={t('addDiscussion.descriptionPlaceholder', 'Share your thoughts, ask a question, or start a meaningful conversation...')}
                            value={form.description}
                            onChange={handleChange}
                            rows={4}
                            className="form-textarea"
                        />
                    </div>

                    <div className="form-buttons">
                        <button
                            type="button"
                            onClick={() => onNavigate && onNavigate('discussions')}
                            className="cancel-button"
                        >
                            {t('cancel', 'Cancel')}
                        </button>
                        <button
                            type="submit"
                            disabled={adding}
                            className="submit-button"
                        >
                            {adding ? t('loading', 'Loading...') : t('addDiscussion.submitButton', 'Start Discussion')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddDiscussion;
