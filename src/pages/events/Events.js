import { useEffect, useState } from 'react';
import { DB_TABLES } from '../../config/dbConfig';
import { supabase } from '../../config/supabaseClient';
import './Events.css';

const EventsView = ({ user, t, onNavigate }) => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // 'all', 'upcoming', 'past'
    const [categoryFilter, setCategoryFilter] = useState('all');

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from(DB_TABLES.EVENTS)
                .select('*')
                .order('dateTime', { ascending: true });

            if (error) throw error;
            if (data) setEvents(data);
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRSVP = async (eventId, status) => {
        // Update local state immediately for better UX
        setEvents(prev => prev.map(event =>
            event.id === eventId
                ? {
                    ...event,
                    rsvpStatus: status,
                    currentRSVPs: status === 'attending'
                        ? (event.currentRSVPs || 0) + 1
                        : event.rsvpStatus === 'attending'
                            ? Math.max((event.currentRSVPs || 0) - 1, 0)
                            : (event.currentRSVPs || 0)
                }
                : event
        ));

        // TODO: Update RSVP status in database
        // This would typically involve updating a user_events table
        console.log(`RSVP ${status ? 'confirmed' : 'cancelled'} for event ${eventId}`);
    };
    const formatEventDate = (dateTime) => {
        const date = new Date(dateTime);
        return {
            date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
            time: date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
            fullDate: date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'long'
            })
        };
    };

    const getCategoryIcon = (category) => {
        const icons = {
            community: '🏘️',
            educational: '📚',
            sports: '⚽',
            cultural: '🎭',
            volunteer: '🤝',
            social: '🎉',
            religious: '🕌',
            health: '🏥'
        };
        return icons[category] || '📅';
    };

    const isEventPast = (dateTime) => {
        return new Date(dateTime) < new Date();
    };

    const isEventToday = (dateTime) => {
        const today = new Date();
        const eventDate = new Date(dateTime);
        return eventDate.toDateString() === today.toDateString();
    };

    const getFilteredEvents = () => {
        let filtered = events;

        // Filter by time
        if (filter === 'upcoming') {
            filtered = filtered.filter(event => !isEventPast(event.dateTime));
        } else if (filter === 'past') {
            filtered = filtered.filter(event => isEventPast(event.dateTime));
        }

        // Filter by category
        if (categoryFilter !== 'all') {
            filtered = filtered.filter(event => event.category === categoryFilter);
        }

        return filtered;
    };

    const getUniqueCategories = () => {
        const categories = [...new Set(events.map(event => event.category))];
        return categories.filter(Boolean);
    };

    if (loading) {
        return (
            <div className="view-container">
                <div className="loading-state">
                    <div className="loading-spinner">📅</div>
                    <p>{t ? t('loadingEvents') : 'Loading events...'}</p>
                </div>
            </div>
        );
    }

    const filteredEvents = getFilteredEvents();
    const categories = getUniqueCategories();

    return (
        <div className="view-container">
            <div className="events-header">
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
                        boxShadow: '0 2px 8px #e6c9a0',
                        cursor: 'pointer',
                        transition: 'background 0.2s',
                    }}
                    onClick={() => onNavigate && onNavigate('addEvent')}
                >
                    {t ? t('addEvent') : 'Add Event'}
                </button>
            </div>

            {events.length > 0 && (
                <div className="events-filters">
                    <div className="filter-group">
                        <label>{t ? t('timeFilter') : 'Time'}:</label>
                        <div className="filter-buttons">
                            <button
                                className={filter === 'all' ? 'active' : ''}
                                onClick={() => setFilter('all')}
                            >
                                {t ? t('all') : 'All'}
                            </button>
                            <button
                                className={filter === 'upcoming' ? 'active' : ''}
                                onClick={() => setFilter('upcoming')}
                            >
                                {t ? t('upcoming') : 'Upcoming'}
                            </button>
                            <button
                                className={filter === 'past' ? 'active' : ''}
                                onClick={() => setFilter('past')}
                            >
                                {t ? t('past') : 'Past'}
                            </button>
                        </div>
                    </div>

                    {categories.length > 1 && (
                        <div className="filter-group">
                            <label>{t ? t('category') : 'Category'}:</label>
                            <select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                className="category-select"
                            >
                                <option value="all">{t ? t('allCategories') : 'All Categories'}</option>
                                {categories.map(category => (
                                    <option key={category} value={category}>
                                        {getCategoryIcon(category)} {t ? t(category) : category}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>
            )}

            <div className="events-container">
                {filteredEvents.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">📅</div>
                        <h3>
                            {events.length === 0
                                ? (t ? t('noEventsYet') : 'No events yet')
                                : (t ? t('noEventsMatch') : 'No events match your filters')
                            }
                        </h3>
                        <p>
                            {events.length === 0
                                ? (t ? t('createFirstEvent') : 'Create your first community event')
                                : (t ? t('tryDifferentFilters') : 'Try adjusting your filters')
                            }
                        </p>
                    </div>
                ) : (
                    <div className="events-grid">
                        {filteredEvents.map(event => {
                            const { date, time, fullDate } = formatEventDate(event.dateTime);
                            const isPast = isEventPast(event.dateTime);
                            const isToday = isEventToday(event.dateTime);

                            return (
                                <div key={event.id} className={`event-card ${isPast ? 'past-event' : ''} ${isToday ? 'today-event' : ''}`}>
                                    <div className="event-header">
                                        <div className="event-category">
                                            <span className="category-icon">{getCategoryIcon(event.category)}</span>
                                            <span className="category-name">{t ? t(event.category) : event.category}</span>
                                        </div>
                                        {isToday && <span className="today-badge">{t ? t('today') : 'Today'}</span>}
                                        {isPast && <span className="past-badge">{t ? t('past') : 'Past'}</span>}
                                    </div>

                                    <div className="event-content">
                                        <h3 className="event-title">{event.title}</h3>

                                        <div className="event-datetime">
                                            <div className="date-info">
                                                <span className="date">{date}</span>
                                                <span className="time">{time}</span>
                                            </div>
                                            <div className="full-date">{fullDate}</div>
                                        </div>

                                        {event.location && (
                                            <div className="event-location">
                                                <span className="location-icon">📍</span>
                                                <span>{event.location}</span>
                                            </div>
                                        )}

                                        {event.description && (
                                            <p className="event-description">{event.description}</p>
                                        )}

                                        <div className="event-stats">
                                            {event.currentRSVPs > 0 && (
                                                <span className="rsvp-count">
                                                    👥 {event.currentRSVPs} {t ? t('attending') : 'attending'}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="event-actions">
                                        {!isPast && (
                                            <button
                                                className={`rsvp-btn ${event.rsvpStatus === 'attending' ? 'attending' : ''}`}
                                                onClick={() => handleRSVP(event.id, event.rsvpStatus === 'attending' ? null : 'attending')}
                                            >
                                                {event.rsvpStatus === 'attending'
                                                    ? (t ? t('cancelRSVP') : '✓ Cancel RSVP')
                                                    : (t ? t('rsvp') : 'RSVP')
                                                }
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventsView;