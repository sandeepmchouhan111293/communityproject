

const CommunityDirectoryView = ({ user, t }) => {
    return (
        <div className="view-container">
            <h1>{t ? t('directory') : 'Community Directory'}</h1>
            <div className="directory-search">
                <input type="text" placeholder={t ? t('searchMembers') : 'Search members...'} className="directory-search-input" />
                <button className="directory-search-btn">🔍</button>
            </div>
            <div className="directory-grid">
                <div className="member-card">
                    <div className="member-avatar">👤</div>
                    <h3>John Doe</h3>
                    <p>{t ? t('villageCenter') : 'Village Center'}</p>
                    <p>{t ? t('doeFamily') : 'Doe Family'}</p>
                    <button>{t ? t('connect') : 'Connect'}</button>
                </div>
                <div className="member-card">
                    <div className="member-avatar">👤</div>
                    <h3>Jane Smith</h3>
                    <p>{t ? t('northVillage') : 'North Village'}</p>
                    <p>{t ? t('smithFamily') : 'Smith Family'}</p>
                    <button>{t ? t('connect') : 'Connect'}</button>
                </div>
            </div>
        </div>
    );
};

export default CommunityDirectoryView;