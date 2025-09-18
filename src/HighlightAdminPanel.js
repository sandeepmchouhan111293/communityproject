import { useEffect, useState } from 'react';
import { DB_TABLES } from './dbConfig';
import { supabase } from './supabaseClient';

const HighlightAdminPanel = ({ t }) => {
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [highlightedId, setHighlightedId] = useState(null);

    useEffect(() => {
        const fetchProfiles = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from(DB_TABLES.PROFILES)
                .select('id, full_name, is_highlighted');
            if (error) setError(error.message);
            else {
                setProfiles(data);
                const highlighted = data.find(p => p.is_highlighted);
                setHighlightedId(highlighted ? highlighted.id : null);
            }
            setLoading(false);
        };

        fetchProfiles();
    }, []);

    const handleHighlight = async (id) => {
        setLoading(true);
        const { error } = await supabase
            .from(DB_TABLES.PROFILES)
            .update({ is_highlighted: false })
            .neq('id', id);
        if (!error) {
            const { error: highlightError } = await supabase
                .from(DB_TABLES.PROFILES)
                .update({ is_highlighted: true })
                .eq('id', id);
            if (highlightError) setError(highlightError.message);
            else setHighlightedId(id);
        } else {
            setError(error.message);
        }
        setLoading(false);
    };

    return (
        <div>
            <h2>{t('adminHighlightTitle') || 'Set Highlighted Member'}</h2>
            {error && <div className="error-msg">{error}</div>}
            {loading && <div>{t('loading') || 'Loading...'}</div>}
            <ul>
                {profiles.map(profile => (
                    <li key={profile.id} style={{ marginBottom: 8 }}>
                        <span>{profile.full_name}</span>
                        {profile.id === highlightedId ? (
                            <span style={{ marginLeft: 8, color: 'green' }}>{t('currentlyHighlighted') || 'Highlighted'}</span>
                        ) : (
                            <button style={{ marginLeft: 8 }} onClick={() => handleHighlight(profile.id)}>
                                {t('highlightThisMember') || 'Highlight'}
                            </button>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default HighlightAdminPanel;
