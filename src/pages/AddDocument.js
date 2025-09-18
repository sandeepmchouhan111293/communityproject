
import { useState } from 'react';
import { DB_TABLES } from '../dbConfig';
import { useLanguage } from '../LanguageContext';
import { useTranslation } from '../translations';
import { supabase } from '../supabaseClient';
import './AddDocument.css';

const AddDocument = ({ user, onSuccess, onNavigate }) => {
    const { language } = useLanguage();
    const { t } = useTranslation(language);
    const [form, setForm] = useState({
        title: '',
        description: '',
        category: 'resources',
        accessLevel: 'public',
        fileType: '',
        fileSize: '',
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
            lastUpdated: new Date().toISOString(),
        };

        try {
            const { data, error } = await supabase
                .from(DB_TABLES.DOCUMENTS)
                .insert([toInsert])
                .select();

            if (error) throw error;

            if (onSuccess) onSuccess();
            setForm({
                title: '',
                description: '',
                category: 'resources',
                accessLevel: 'public',
                fileType: '',
                fileSize: '',
            });

            // Navigate back to documents view
            if (onNavigate) onNavigate('documents');
        } catch (error) {
            console.error("Failed to add document:", error);
        } finally {
            setAdding(false);
        }
    };
    return (
        <div className="add-document-container">
            <div className="add-document-header">
                <h1 className="add-document-title">{t('addDocument', 'Add Document')}</h1>
                <button
                    onClick={() => onNavigate && onNavigate('documents')}
                    className="back-button"
                >
                    ← {t('back', 'Back')}
                </button>
            </div>

            <div className="add-document-form-container">
                <h2 className="form-title">{t('addDocument.title', 'Upload Document')}</h2>
                <form onSubmit={handleSubmit} className="document-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="title" className="form-label">
                                {t('addDocument.titleLabel', 'Document Title')}
                            </label>
                            <input
                                id="title"
                                name="title"
                                required
                                placeholder={t('addDocument.titlePlaceholder', 'Document Title')}
                                value={form.title}
                                onChange={handleChange}
                                className="form-input"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="fileType" className="form-label">
                                {t('addDocument.typeLabel', 'File Type')}
                            </label>
                            <input
                                id="fileType"
                                name="fileType"
                                required
                                placeholder={t('addDocument.typePlaceholder', 'e.g., PDF, DOC, XLSX')}
                                value={form.fileType}
                                onChange={handleChange}
                                className="form-input"
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="category" className="form-label">
                                {t('addDocument.categoryLabel', 'Category')}
                            </label>
                            <select
                                id="category"
                                name="category"
                                value={form.category}
                                onChange={handleChange}
                                className="form-select"
                            >
                                <option value="governance">{t('governance', 'Governance')}</option>
                                <option value="resources">{t('resources', 'Resources')}</option>
                                <option value="meetings">{t('meetingMinutes', 'Meeting Minutes')}</option>
                                <option value="guidelines">{t('guidelines', 'Guidelines')}</option>
                                <option value="forms">{t('forms', 'Forms')}</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="accessLevel" className="form-label">
                                {t('accessLevel', 'Access Level')}
                            </label>
                            <select
                                id="accessLevel"
                                name="accessLevel"
                                value={form.accessLevel}
                                onChange={handleChange}
                                className="form-select"
                            >
                                <option value="public">{t('public', 'Public')}</option>
                                <option value="member">{t('member', 'Member')}</option>
                                <option value="committee">{t('committee', 'Committee')}</option>
                                <option value="admin">{t('admin', 'Admin')}</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="fileSize" className="form-label">
                            {t('addDocument.fileSizeLabel', 'File Size')}
                        </label>
                        <input
                            id="fileSize"
                            name="fileSize"
                            placeholder={t('addDocument.fileSizePlaceholder', 'e.g., 2.5 MB')}
                            value={form.fileSize}
                            onChange={handleChange}
                            className="form-input"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">
                            {t('addDocument.fileUploadLabel', 'Upload File')}
                        </label>
                        <div className="file-upload-area">
                            <div className="upload-icon">📎</div>
                            <div className="upload-text">
                                {t('addDocument.uploadText', 'Click to upload or drag and drop')}
                            </div>
                            <div className="upload-hint">
                                {t('addDocument.uploadHint', 'Supports PDF, DOC, XLSX, and more')}
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="description" className="form-label">
                            {t('addDocument.descriptionLabel', 'Description')}
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            required
                            placeholder={t('addDocument.descriptionPlaceholder', 'Describe the document content and purpose')}
                            value={form.description}
                            onChange={handleChange}
                            className="form-textarea"
                            rows={4}
                        />
                    </div>

                    <div className="form-buttons">
                        <button
                            type="button"
                            onClick={() => onNavigate && onNavigate('documents')}
                            className="cancel-button"
                        >
                            {t('cancel', 'Cancel')}
                        </button>
                        <button
                            type="submit"
                            disabled={adding}
                            className="submit-button"
                        >
                            {adding ? t('loading', 'Loading...') : t('addDocument.submitButton', 'Upload Document')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddDocument;
