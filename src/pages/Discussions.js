import { useEffect, useState } from 'react';
import { DB_TABLES } from '../dbConfig';
import { supabase } from '../supabaseClient';

const DiscussionsView = ({ user, t, onNavigate }) => {
    const [forums, setForums] = useState([]);
    const [recentDiscussions, setRecentDiscussions] = useState([]);

    useEffect(() => {
        const fetchDiscussions = async () => {
            const { data: forumsData } = await supabase
                .from(DB_TABLES.DISCUSSIONS)
                .select('*')
                .eq('type', 'forum');
            setForums(forumsData || []);
            const { data: discussionsData } = await supabase
                .from(DB_TABLES.DISCUSSIONS)
                .select('*')
                .eq('type', 'discussion')
                .order('lastReply', { ascending: false });
            setRecentDiscussions(discussionsData || []);
        };
        fetchDiscussions();
    }, []);
    return (
        <div className="view-container">
            <h1>{t ? t('communityDiscussions') : 'Community Discussions'}</h1>
            <button
                className="add-btn discussion-add-btn"
                style={{
                    background: 'linear-gradient(90deg, #d4a574 0%, #f7e7ce 100%)',
                    color: '#6d3d14',
                    border: 'none',
                    borderRadius: '24px',
                    fontWeight: 600,
                    fontSize: '1.1rem',
                    padding: '10px 28px',
                    margin: '16px 0 24px 0',
                    boxShadow: '0 2px 8px #e6c9a0',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                }}
                onClick={() => onNavigate && onNavigate('addDiscussion')}
            >
                {t ? t('addDiscussion') : 'Add Discussion'}
            </button>
            <div className="forums-section">
                <h2>{t ? t('discussionForums') : 'Discussion Forums'}</h2>
                <div className="forums-list">
                    {forums.length === 0 ? (
                        <p>{t ? t('noForums') : 'No forums found.'}</p>
                    ) : (
                        forums.map(forum => (
                            <div key={forum.id} className="forum-card">
                                <span className="forum-icon">{forum.icon || '💬'}</span>
                                <div className="forum-info">
                                    <h3>{forum.title}</h3>
                                    <p>{forum.description}</p>
                                    <p><strong>{t ? t('topics') : 'Topics'}:</strong> {forum.topics} | <strong>{t ? t('posts') : 'Posts'}:</strong> {forum.posts}</p>
                                    {forum.moderators && <p><strong>{t ? t('moderators') : 'Moderators'}:</strong> {Array.isArray(forum.moderators) ? forum.moderators.join(', ') : forum.moderators}</p>}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
            <div className="recent-discussions-section">
                <h2>{t ? t('recentDiscussions') : 'Recent Discussions'}</h2>
                <div className="discussions-list">
                    {recentDiscussions.length === 0 ? (
                        <p>{t ? t('noDiscussions') : 'No discussions found.'}</p>
                    ) : (
                        recentDiscussions.map(discussion => (
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
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};
export default DiscussionsView;