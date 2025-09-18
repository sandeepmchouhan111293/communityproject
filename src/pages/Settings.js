

const SettingsView = ({ user, t }) => {
    return (
        <div className="view-container">
            <h1>{t ? t('settings') : 'Settings'}</h1>
            <div className="settings-sections">
                <div className="settings-section">
                    <h3>{t ? t('privacySettings') : 'Privacy Settings'}</h3>
                    <div className="setting-item">
                        <label>
                            <input type="checkbox" defaultChecked />
                            {t ? t('makeProfileVisible') : 'Make my profile visible to community members'}
                        </label>
                    </div>
                    <div className="setting-item">
                        <label>
                            <input type="checkbox" />
                            {t ? t('allowFamilyTreeVisibility') : 'Allow others to see my family tree'}
                        </label>
                    </div>
                    <div className="setting-item">
                        <label>
                            <input type="checkbox" defaultChecked />
                            {t ? t('showInDirectory') : 'Show me in community directory'}
                        </label>
                    </div>
                </div>
                <div className="settings-section">
                    <h3>{t ? t('notificationPreferences') : 'Notification Preferences'}</h3>
                    <div className="setting-item">
                        <label>
                            <input type="checkbox" defaultChecked />
                            {t ? t('emailNewsConnection') : 'Email notifications for new family connections'}
                        </label>
                    </div>
                    <div className="setting-item">
                        <label>
                            <input type="checkbox" defaultChecked />
                            {t ? t('eventReminders') : 'Event reminders'}
                        </label>
                    </div>
                    <div className="setting-item">
                        <label>
                            <input type="checkbox" />
                            {t ? t('weeklyUpdates') : 'Weekly community updates'}
                        </label>
                    </div>
                </div>
                <div className="settings-section">
                    <h3>{t ? t('accountSettings') : 'Account Settings'}</h3>
                    <button className="settings-btn">{t ? t('changePassword') : 'Change Password'}</button>
                    <button className="settings-btn">{t ? t('downloadData') : 'Download my data'}</button>
                    <button className="settings-btn danger">{t ? t('deleteAccount') : 'Delete Account'}</button>
                </div>
            </div>
        </div>
    );
};

export default SettingsView;