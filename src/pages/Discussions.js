import { useState } from 'react';

const DiscussionsView = ({ user, t }) => {
    const [forums] = useState([
        {
            id: 1,
            title: t('communityEventsAnnouncements') || 'Community Events & Announcements',
            description: t('discussUpcomingEvents') || 'Discuss upcoming events, share announcements, and coordinate community activities.',
            icon: '📅',
            topics: 47,
            posts: 234,
            lastActivity: t('hoursAgo2') || '2 hours ago',
            lastPost: t('annualGatheringPlanning') || 'Annual Gathering Planning',
            moderators: ['Sarah Johnson', 'Mike Chen']
        },
        {
            id: 2,
            title: t('familyHistoryGenealogy') || 'Family History & Genealogy',
            description: t('shareFamilyStories') || 'Share family stories, research tips, and connect with relatives. Help each other build family trees.',
            icon: '🌳',
            topics: 89,
            posts: 456,
            lastActivity: t('hoursAgo5') || '5 hours ago',
            lastPost: t('tipsForFindingRecords') || 'Tips for Finding Birth Records',
            moderators: ['Emma Davis', 'Robert Kim']
        },
        {
            id: 3,
            title: t('communitySupportResources') || 'Community Support & Resources',
            description: t('askForHelp') || 'Ask for help, offer assistance, share local resources, and support each other.',
            icon: '🤝',
            topics: 156,
            posts: 789,
            lastActivity: t('hourAgo1') || '1 hour ago',
            lastPost: t('carpoolingSchoolEvents') || 'Carpooling for School Events',
            moderators: ['Lisa Wong', 'David Park']
        }
    ]);
    const [recentDiscussions] = useState([
        {
            id: 1,
            title: t('planningSpringFestival') || 'Planning the Spring Festival',
            author: 'Sarah Johnson',
            forum: t('communityEvents') || 'Community Events',
            replies: 12,
            lastReply: t('minutesAgo30') || '30 minutes ago',
            isHot: true
        },
        {
            id: 2,
            title: t('lookingForJohnsonFamily') || 'Looking for Johnson family descendants',
            author: 'Mike Johnson',
            forum: t('familyHistory') || 'Family History',
            replies: 8,
            lastReply: t('hoursAgo2') || '2 hours ago',
            isHot: false
        },
        {
            id: 3,
            title: t('volunteerDriversNeeded') || 'Volunteer drivers needed for elderly members',
            author: t('communityBoard') || 'Community Board',
            forum: t('communitySupport') || 'Community Support',
            replies: 15,
            lastReply: t('hoursAgo4') || '4 hours ago',
            isHot: true
        }
    ]);
    return (
        <div className="view-container">
            <h1>{t ? t('communityDiscussions') : 'Community Discussions'}</h1>
            <div className="forums-section">
                <h2>{t ? t('discussionForums') : 'Discussion Forums'}</h2>
                <div className="forums-list">
                    {forums.map(forum => (
                        <div key={forum.id} className="forum-card">
                            <span className="forum-icon">{forum.icon}</span>
                            <div className="forum-info">
                                <h3>{forum.title}</h3>
                                <p>{forum.description}</p>
                                <p><strong>{t ? t('topics') : 'Topics'}:</strong> {forum.topics} | <strong>{t ? t('posts') : 'Posts'}:</strong> {forum.posts}</p>
                                <p><strong>{t ? t('moderators') : 'Moderators'}:</strong> {forum.moderators.join(', ')}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="recent-discussions-section">
                <h2>{t ? t('recentDiscussions') : 'Recent Discussions'}</h2>
                <div className="discussions-list">
                    {recentDiscussions.map(discussion => (
                        <div key={discussion.id} className="discussion-item">
                            <div className="discussion-title">
                                {discussion.isHot && <span className="hot-badge">🔥</span>}
                                <h4>{discussion.title}</h4>
                            </div>
                            <div className="discussion-meta">
                                <span className="author">{t ? t('by') : 'by'} {discussion.author}</span>
                                <span className="forum">{t ? t('in') : 'in'} {discussion.forum}</span>
                                <span className="replies">{discussion.replies} {t ? t('replies') : 'replies'}</span>
                                <span className="last-reply">{discussion.lastReply}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DiscussionsView;