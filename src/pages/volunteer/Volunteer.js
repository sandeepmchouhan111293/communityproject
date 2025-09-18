
import { useEffect, useState } from 'react';
import { DB_TABLES } from '../../config/dbConfig';
import { supabase } from '../../config/supabaseClient';

const VolunteerView = ({ user, t, onNavigate }) => {
    const [opportunities, setOpportunities] = useState([]);

    useEffect(() => {
        const fetchOpportunities = async () => {
            const { data, error } = await supabase
                .from(DB_TABLES.VOLUNTEER)
                .select('*');
            if (data) setOpportunities(data);
        };
        fetchOpportunities();
    }, []);
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
            <button
                className="add-btn volunteer-add-btn"
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
                onClick={() => onNavigate && onNavigate('addVolunteer')}
            >
                {t ? t('addOpportunity') : 'Add Opportunity'}
            </button>
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