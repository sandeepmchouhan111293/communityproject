import { useState } from 'react';

const VolunteerView = ({ user, t }) => {
    const [opportunities, setOpportunities] = useState([
        {
            id: 1,
            role: 'Event Coordinator',
            description: 'Help organize and coordinate community events, manage volunteers, and ensure smooth execution.',
            requiredSkills: ['Event Planning', 'Communication', 'Organization'],
            timeCommitment: '5-10 hours/month',
            urgency: 'high',
            contact: 'Sarah Johnson',
            interested: false,
            volunteers: 3,
            needed: 2
        },
        {
            id: 2,
            role: 'Graphic Designer',
            description: 'Create flyers, social media graphics, and promotional materials for community events.',
            requiredSkills: ['Graphic Design', 'Adobe Creative Suite', 'Social Media'],
            timeCommitment: '2-5 hours/week',
            urgency: 'medium',
            contact: 'Design Team',
            interested: true,
            volunteers: 1,
            needed: 2
        },
        {
            id: 3,
            role: 'Youth Mentor',
            description: 'Guide and support young community members in their personal and academic development.',
            requiredSkills: ['Mentoring', 'Communication', 'Patience'],
            timeCommitment: '3-4 hours/week',
            urgency: 'ongoing',
            contact: 'Youth Committee',
            interested: false,
            volunteers: 8,
            needed: 5
        }
    ]);
    const handleInterest = (opportunityId) => {
        setOpportunities(prev => prev.map(opp =>
            opp.id === opportunityId
                ? { ...opp, interested: !opp.interested }
                : opp
        ));
    };
    const getUrgencyColor = (urgency) => {
        const colors = {
            high: '#e74c3c',
            medium: '#f39c12',
            ongoing: '#27ae60'
        };
        return colors[urgency] || '#7f8c8d';
    };
    return (
        <div className="view-container">
            <h1>{t ? t('volunteerOpportunities') : 'Volunteer Opportunities'}</h1>
            <div className="volunteer-list">
                {opportunities.length === 0 ? (
                    <p>{t ? t('noOpportunities') : 'No volunteer opportunities found.'}</p>
                ) : (
                    opportunities.map(opp => (
                        <div key={opp.id} className="volunteer-card" style={{ borderLeft: `6px solid ${getUrgencyColor(opp.urgency)}` }}>
                            <h3>{opp.role}</h3>
                            <p>{opp.description}</p>
                            <p><strong>{t ? t('skills') : 'Skills'}:</strong> {opp.requiredSkills.join(', ')}</p>
                            <p><strong>{t ? t('timeCommitment') : 'Time'}:</strong> {opp.timeCommitment}</p>
                            <p><strong>{t ? t('contact') : 'Contact'}:</strong> {opp.contact}</p>
                            <button
                                className={`interest-btn${opp.interested ? ' interested' : ''}`}
                                onClick={() => handleInterest(opp.id)}
                            >
                                {opp.interested ? (t ? t('youreInterested') : "✅ You're Interested") : (t ? t('imInterested') : "🤝 I'm Interested")}
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default VolunteerView;