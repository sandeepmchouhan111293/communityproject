import { useEffect, useState } from 'react';
import { DB_TABLES } from '../../config/dbConfig';
import { supabase } from '../../config/supabaseClient';

const HomeView = ({ user, t }) => {
    const [memberHighlight, setMemberHighlight] = useState(null);

    useEffect(() => {
        const fetchHighlightedProfile = async () => {
            const { data, error } = await supabase
                .from(DB_TABLES.PROFILES)
                .select('*')
                .eq('is_highlighted', true)
                .single();
            if (data) {
                setMemberHighlight({
                    name: data.full_name,
                    title: data.title || t('volunteerChampion'),
                    contribution: data.contribution || t('organizedEvents'),
                    quote: data.quote || t('familyStoryMatters'),
                    avatar: data.profile_photo_url || null,
                    achievementBadge: data.achievement_badge || '🏆',
                });
            } else {
                setMemberHighlight(null);
            }
        };
        fetchHighlightedProfile();
    }, [t]);

    const [newsFeed] = useState(() => [
        {
            id: 1,
            type: 'urgent',
            titleKey: 'systemMaintenance',
            contentKey: 'maintenanceDesc',
            timestamp: `2 ${t('hoursAgo')}`,
            authorKey: 'systemAdmin'
        },
        {
            id: 2,
            type: 'official',
            titleKey: 'monthlyMeeting',
            contentKey: 'meetingDesc',
            timestamp: `1 ${t('daysAgo')}`,
            authorKey: 'communityBoard'
        },
        {
            id: 3,
            type: 'milestone',
            titleKey: 'welcomeBaby',
            contentKey: 'babyDesc',
            timestamp: `3 ${t('daysAgo')}`,
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
                <div className="welcome-banner">
                    <img src="/images/Sen Ji Maharaj 1.png" alt="Sen Ji Maharaj" className="welcome-image" />
                    <div className="welcome-content">
                        <h1>{t('welcomeHome')}, {user?.user_metadata?.full_name?.split(' ')[0] || t('member')}</h1>
                        <p className="home-subtitle">{t('stayConnected')}</p>
                        <p className="blessing-text">"{t('blessingText')}"</p>
                    </div>
                </div>
            </div>
            {/* Member Highlight Section */}
            <div className="member-highlight-section">
                <div className="highlight-header">
                    <h2>🌟 {t('memberSpotlight')}</h2>
                    <button className="nominate-btn">{t('nominateSomeone')}</button>
                </div>
                <div className="member-highlight-card">
                    {memberHighlight ? (
                        <>
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
                        </>
                    ) : (
                        <div className="highlight-content">
                            <p>{t('noMemberHighlight')}</p>
                        </div>
                    )}
                </div>
            </div>
            <div className="home-dashboard-grid">
                {/* Family Profile Progress */}
                <div className="info-block gradient-border">
                    <div className="block-header">
                        <h3>👨‍👩‍👧‍👦 {t('familyProfile')}</h3>
                        <span className="status-badge success">{t('active')}</span>
                    </div>
                    <div className="completion-status">
                        <div className="progress-bar">
                            <div className="progress-fill" style={{ width: '75%' }}></div>
                        </div>
                        <span className="progress-text">75% {t('complete')}</span>
                    </div>
                    <p>{t('addMoreMembers')}</p>
                    <button className="block-action-btn">{t('addMembersBtn')}</button>
                </div>
                {/* Community News Feed */}
                <div className="info-block">
                    <div className="block-header">
                        <h3>📰 {t('communityUpdates')}</h3>
                        <button className="view-all-btn">{t('viewAll')}</button>
                    </div>
                    <div className="news-feed">
                        {newsFeed.slice(0, 3).map(item => (
                            <div key={item.id} className={getNewsFeedClass(item.type)}>
                                <div className="news-header">
                                    <span className="news-icon">{getNewsFeedIcon(item.type)}</span>
                                    <div className="news-meta">
                                        <h4>{t(item.titleKey)}</h4>
                                        <span className="news-timestamp">{item.timestamp}</span>
                                    </div>
                                </div>
                                <p className="news-content">{t(item.contentKey)}</p>
                                <small className="news-author">{t('author')}: {item.authorKey ? t(item.authorKey) : item.author}</small>
                            </div>
                        ))}
                    </div>
                </div>
                {/* Quick Actions */}
                <div className="info-block">
                    <h3>🚀 {t('quickActions')}</h3>
                    <div className="quick-actions-grid">
                        <button className="quick-action-btn">
                            <span className="action-icon">📅</span>
                            <span>{t('viewEvents')}</span>
                        </button>
                        <button className="quick-action-btn">
                            <span className="action-icon">🤝</span>
                            <span>{t('volunteer')}</span>
                        </button>
                        <button className="quick-action-btn">
                            <span className="action-icon">💬</span>
                            <span>{t('discussions')}</span>
                        </button>
                        <button className="quick-action-btn">
                            <span className="action-icon">📁</span>
                            <span>{t('documents')}</span>
                        </button>
                    </div>
                </div>
                {/* Community Stats */}
                <div className="info-block stats-block">
                    <h3>📊 {t('communityPulse')}</h3>
                    <div className="stats-grid">
                        <div className="stat-item">
                            <span className="stat-number">248</span>
                            <span className="stat-label">{t('activeMembers')}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">12</span>
                            <span className="stat-label">{t('upcomingEvents')}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">89</span>
                            <span className="stat-label">{t('volunteerHours')}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">34</span>
                            <span className="stat-label">{t('newFamilies')}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomeView;