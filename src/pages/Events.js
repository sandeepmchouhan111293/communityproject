import { useState } from 'react';

const EventsView = ({ user, t }) => {
    const [events, setEvents] = useState([
        {
            id: 1,
            title: 'Community Annual Gathering',
            dateTime: '2024-02-15T18:00:00',
            location: 'Community Center, Main Hall',
            description: 'Join us for our annual community gathering with dinner, presentations, and networking.',
            organizer: 'Community Board',
            rsvpLimit: 100,
            currentRSVPs: 67,
            rsvpStatus: null,
            category: 'community'
        },
        {
            id: 2,
            title: 'Family Heritage Workshop',
            dateTime: '2024-02-20T14:00:00',
            location: 'Library Meeting Room',
            description: 'Learn techniques for researching and documenting your family history.',
            organizer: 'Sarah Johnson',
            rsvpLimit: 25,
            currentRSVPs: 18,
            rsvpStatus: 'attending',
            category: 'educational'
        },
        {
            id: 3,
            title: 'Youth Soccer Tournament',
            dateTime: '2024-02-25T09:00:00',
            location: 'Central Park Sports Field',
            description: 'Annual soccer tournament for community youth. Volunteers needed for coordination.',
            organizer: 'Sports Committee',
            rsvpLimit: 200,
            currentRSVPs: 89,
            rsvpStatus: null,
            category: 'sports'
        }
    ]);
    const handleRSVP = (eventId, status) => {
        setEvents(prev => prev.map(event =>
            event.id === eventId
                ? {
                    ...event,
                    rsvpStatus: status,
                    currentRSVPs: status === 'attending'
                        ? event.currentRSVPs + 1
                        : event.rsvpStatus === 'attending'
                            ? event.currentRSVPs - 1
                            : event.currentRSVPs
                }
                : event
        ));
    };
    const formatEventDate = (dateTime) => {
        const date = new Date(dateTime);
        return {
            date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
            time: date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
        };
    };
    const getCategoryIcon = (category) => {
        const icons = {
            community: '🏘️',
            educational: '📚',
            sports: '⚽',
            cultural: '🎭',
            volunteer: '🤝'
        };
        return icons[category] || '📅';
    };
    return (
        <div className="view-container">
            <h1>{t ? t('events') : 'Events'}</h1>
            <div className="events-list">
                {events.length === 0 ? (
                    <p>{t ? t('noEvents') : 'No events found.'}</p>
                ) : (
                    events.map(event => {
                        const { date, time } = formatEventDate(event.dateTime);
                        return (
                            <div key={event.id} className="event-card">
                                <div className="event-icon" style={{ fontSize: 28 }}>{getCategoryIcon(event.category)}</div>
                                <div className="event-info">
                                    <h3>{event.title}</h3>
                                    <p>{date} | {time}</p>
                                    <p>{event.location}</p>
                                    <p>{event.description}</p>
                                    <button
                                        className="rsvp-btn"
                                        onClick={() => handleRSVP(event.id, event.rsvpStatus === 'attending' ? null : 'attending')}
                                    >
                                        {event.rsvpStatus === 'attending' ? (t ? t('cancelRSVP') : 'Cancel RSVP') : (t ? t('rsvp') : 'RSVP')}
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default EventsView;