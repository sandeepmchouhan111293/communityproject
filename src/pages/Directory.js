

import { useEffect, useState } from 'react';
import { DB_TABLES } from '../dbConfig';
import { supabase } from '../supabaseClient';

const CommunityDirectoryView = ({ user, t }) => {
    const [members, setMembers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchMembers = async () => {
            const { data, error } = await supabase
                .from(DB_TABLES.PROFILES)
                .select('*')
                .eq('show_in_directory', true);
            if (data) setMembers(data);
        };
        fetchMembers();
    }, []);

    const filteredMembers = members.filter(member =>
        member.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="view-container">
            <h1>{t ? t('directory') : 'Community Directory'}</h1>
            <div className="directory-search">
                <input
                    type="text"
                    placeholder={t ? t('searchMembers') : 'Search members...'}
                    className="directory-search-input"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
                <button className="directory-search-btn">🔍</button>
            </div>
            <div className="directory-grid">
                {filteredMembers.length === 0 ? (
                    <p>{t ? t('noMembersFound') : 'No members found.'}</p>
                ) : (
                    filteredMembers.map(member => (
                        <div key={member.id} className="member-card">
                            <div className="member-avatar">👤</div>
                            <h3>{member.full_name}</h3>
                            <p>{member.location || ''}</p>
                            <p>{member.family_name || ''}</p>
                            <button>{t ? t('connect') : 'Connect'}</button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CommunityDirectoryView;