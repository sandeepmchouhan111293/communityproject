import { useEffect, useState } from 'react';
import { DB_TABLES } from '../dbConfig';
import { supabase } from '../supabaseClient';

const EventsView = ({ user, t, onNavigate }) => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            const { data, error } = await supabase
                .from(DB_TABLES.EVENTS)
                .select('*')
                .order('dateTime', { ascending: true });
            if (data) setEvents(data);
        };
        fetchEvents();
    }, []);
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
            <button
                className="add-btn event-add-btn"
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
                onClick={() => onNavigate && onNavigate('addEvent')}
            >
                {t ? t('addEvent') : 'Add Event'}
            </button>
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