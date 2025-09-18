import { useEffect, useState } from 'react';
import { DB_TABLES } from '../../config/dbConfig';
import { supabase } from '../../config/supabaseClient';
import logger from '../../utils/logger';
import { madhyaPradeshDistricts, districtCitiesMap, cityVillagesMap } from '../../data';
import './CommunityFamilies.css';


const CommunityFamilies = ({ user, t, onNavigate }) => {
    const [families, setFamilies] = useState([]);
    const [allFamilies, setAllFamilies] = useState([]); // Store all families for filtering
    const [selectedDistrict, setSelectedDistrict] = useState('all');
    const [selectedCity, setSelectedCity] = useState('all');
    const [selectedVillage, setSelectedVillage] = useState('all');
    const [availableCities, setAvailableCities] = useState([]);
    const [availableVillages, setAvailableVillages] = useState([]);
    const [selectedFamily, setSelectedFamily] = useState(null);
    const [selectedMember, setSelectedMember] = useState(null);
    const [showHierarchy, setShowHierarchy] = useState(false);
    const [loading, setLoading] = useState(true);
    const [communityName, setCommunityName] = useState('Community');

    // Advanced filters
    const [searchTerm, setSearchTerm] = useState('');
    const [filterGeneration, setFilterGeneration] = useState('all');
    const [filterGender, setFilterGender] = useState('all');
    const [filterMaritalStatus, setFilterMaritalStatus] = useState('all');
    const [filterOccupation, setFilterOccupation] = useState('all');
    const [showFilters, setShowFilters] = useState(false);
    const [showMigrationView, setShowMigrationView] = useState(false);

    useEffect(() => {
        fetchCommunityData();
    }, [selectedDistrict, selectedCity, selectedVillage]);

    // Apply advanced filters whenever filter criteria change
    useEffect(() => {
        applyAdvancedFilters();
    }, [allFamilies, searchTerm, filterGeneration, filterGender, filterMaritalStatus, filterOccupation]);

    // Handle district selection change
    const handleDistrictChange = (district) => {
        setSelectedDistrict(district);
        setSelectedCity('all');
        setSelectedVillage('all');

        if (district === 'all') {
            setAvailableCities([]);
            setAvailableVillages([]);
        } else {
            const cities = districtCitiesMap[district] || [];
            // Add the district name itself as a city option (for data like "Bhopal", "Indore")
            const allCities = cities.includes(district) ? cities : [district, ...cities];
            console.log('District selected:', district, 'Available cities:', allCities);
            setAvailableCities(allCities);
            setAvailableVillages([]);
        }
    };

    // Handle city selection change
    const handleCityChange = (city) => {
        setSelectedCity(city);
        setSelectedVillage('all');

        if (city === 'all') {
            setAvailableVillages([]);
        } else {
            // Try both formats: "Bhopal" and "Bhopal City"
            const villages = cityVillagesMap[city] ||
                            cityVillagesMap[city + ' City'] ||
                            cityVillagesMap[city.replace(' City', '')] || [];
            console.log('City selected:', city, 'Available villages:', villages);
            setAvailableVillages(villages);
        }
    };

    // Handle village selection change
    const handleVillageChange = (village) => {
        setSelectedVillage(village);
    };

    // Advanced filtering function
    const applyAdvancedFilters = () => {
        if (!allFamilies.length) return;

        let filtered = [...allFamilies];

        // Search filter
        if (searchTerm.trim()) {
            const searchLower = searchTerm.toLowerCase();
            filtered = filtered.filter(family =>
                family.familyHead.toLowerCase().includes(searchLower) ||
                family.city.toLowerCase().includes(searchLower) ||
                family.members.some(member =>
                    member.name.toLowerCase().includes(searchLower) ||
                    (member.profession && member.profession.toLowerCase().includes(searchLower))
                )
            );
        }

        // Generation filter
        if (filterGeneration !== 'all') {
            filtered = filtered.filter(family =>
                family.members.some(member => {
                    const generation = getGenerationLevel(member);
                    return generation.toString() === filterGeneration;
                })
            );
        }

        // Gender filter
        if (filterGender !== 'all') {
            filtered = filtered.filter(family =>
                family.members.some(member => member.gender === filterGender)
            );
        }

        // Marital status filter
        if (filterMaritalStatus !== 'all') {
            filtered = filtered.filter(family =>
                family.members.some(member => {
                    if (filterMaritalStatus === 'married') {
                        return member.relationship === 'spouse' || member.marriedInto;
                    } else if (filterMaritalStatus === 'unmarried') {
                        return member.age >= 18 && !member.marriedInto && member.relationship !== 'spouse';
                    }
                    return false;
                })
            );
        }

        // Occupation filter
        if (filterOccupation !== 'all') {
            filtered = filtered.filter(family =>
                family.members.some(member =>
                    member.profession && member.profession.toLowerCase().includes(filterOccupation.toLowerCase())
                )
            );
        }

        setFamilies(filtered);
    };

    // Clear all filters
    const clearAllFilters = () => {
        setSearchTerm('');
        setFilterGeneration('all');
        setFilterGender('all');
        setFilterMaritalStatus('all');
        setFilterOccupation('all');
    };

    // Get marriage migration data
    const getMigrationData = () => {
        if (!allFamilies.length) return [];

        const migrations = [];
        allFamilies.forEach(family => {
            family.members.forEach(member => {
                if (member.marriedInto) {
                    migrations.push({
                        name: member.name,
                        originalFamily: family.familyHead,
                        originalLocation: family.city,
                        marriedToLocation: member.marriedInto.city,
                        marriedToFamily: member.marriedInto.family,
                        marriageYear: member.marriedInto.marriageYear
                    });
                }
            });
        });
        return migrations;
    };

    const fetchCommunityData = async () => {
        setLoading(true);
        try {
            // Fetch all family members with user profile data
            const { data: members, error: membersError } = await supabase
                .from(DB_TABLES.FAMILY_MEMBERS)
                .select(`
                    *,
                    profiles:user_id (
                        full_name,
                        city,
                        community_name
                    )
                `)
                .order('user_id');

            if (membersError) throw membersError;

            // Group members by family (user_id)
            const familyGroups = {};
            const citySet = new Set();

            if (members) {
                members.forEach(member => {
                    const userId = member.user_id;
                    const city = member.profiles?.city || 'Unknown';

                    citySet.add(city);

                    if (!familyGroups[userId]) {
                        familyGroups[userId] = {
                            id: userId,
                            familyHead: member.profiles?.full_name || 'Unknown Family',
                            city: city,
                            communityName: member.profiles?.community_name || communityName,
                            members: []
                        };
                    }

                    // Check for marital connections (daughters married into other families)
                    let marriedInto = null;
                    if (member.relationship === 'child' && member.gender === 'female' && member.age >= 18) {
                        // Look for marital status indicators or separate family connection
                        if (member.maritalStatus === 'married' && member.spouseFamily) {
                            marriedInto = {
                                city: member.spouseCity || 'Unknown',
                                family: member.spouseFamily || 'Unknown Family',
                                marriageYear: member.marriageYear || null
                            };
                        }
                    }

                    familyGroups[userId].members.push({
                        ...member,
                        city: city,
                        marriedInto: marriedInto
                    });
                });
            }

            // Filter by hierarchical location selection
            let filteredFamilies = Object.values(familyGroups);

            // Apply location filters based on the current selection
            if (selectedVillage !== 'all') {
                // Filter by village - check if family city matches selected village
                console.log('Filtering by village:', selectedVillage);
                filteredFamilies = filteredFamilies.filter(family => family.city === selectedVillage);
            } else if (selectedCity !== 'all') {
                // Filter by city - check if family city matches selected city or city variant
                console.log('Filtering by city:', selectedCity);
                console.log('Available families before filter:', filteredFamilies.map(f => f.city));
                filteredFamilies = filteredFamilies.filter(family => {
                    // Handle both "Bhopal" and "Bhopal City" formats
                    const cityVariants = [
                        selectedCity,
                        selectedCity.replace(' City', ''),
                        selectedCity + ' City'
                    ];
                    return cityVariants.includes(family.city);
                });
                console.log('Families after city filter:', filteredFamilies.length);
            } else if (selectedDistrict !== 'all') {
                // Filter by district - check if family city is in the selected district's cities
                const districtCities = districtCitiesMap[selectedDistrict] || [];
                console.log('Filtering by district:', selectedDistrict);
                console.log('District cities:', districtCities);
                console.log('Available families before filter:', filteredFamilies.map(f => f.city));
                filteredFamilies = filteredFamilies.filter(family => {
                    // Check direct match or if city is in district cities (handling variants)
                    const cityVariants = [
                        family.city,
                        family.city + ' City',
                        family.city.replace(' City', '')
                    ];
                    return districtCities.some(districtCity => cityVariants.includes(districtCity)) ||
                           family.city === selectedDistrict;
                });
                console.log('Families after district filter:', filteredFamilies.length);
            }

            setAllFamilies(filteredFamilies);
            setFamilies(filteredFamilies);

            // Set community name from first family if available
            if (filteredFamilies.length > 0 && filteredFamilies[0].communityName) {
                setCommunityName(filteredFamilies[0].communityName);
            }

            logger.log('Community families loaded', filteredFamilies);
        } catch (error) {
            logger.error('Error fetching community data', error);
            console.error('Failed to fetch community data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleMemberClick = (member, family) => {
        setSelectedMember(member);
        setSelectedFamily(family);
        setShowHierarchy(true);
    };

    const getMemberRole = (member, family) => {
        // Determine role based on relationship and age
        const relationship = member.relationship;
        const age = member.age || 0;

        switch (relationship) {
            case 'spouse':
                return age > 40 ? 'Father/Mother' : 'Husband/Wife';
            case 'parent':
                return 'Parent';
            case 'child':
                return age < 18 ? 'Child' : 'Son/Daughter';
            case 'sibling':
                return 'Sibling';
            case 'grandparent':
                return 'Grandparent';
            case 'grandchild':
                return 'Grandchild';
            default:
                return relationship;
        }
    };

    const getGenerationLevel = (member) => {
        // Calculate generation based on relationship
        const relationship = member.relationship;
        switch (relationship) {
            case 'grandparent':
                return 1;
            case 'parent':
                return 2;
            case 'spouse':
                return 3; // Same generation as user
            case 'sibling':
                return 3;
            case 'child':
                return 4;
            case 'grandchild':
                return 5;
            default:
                return 3; // Default to same generation
        }
    };

    const getBirthYear = (member) => {
        if (member.dateOfBirth) {
            return new Date(member.dateOfBirth).getFullYear();
        }
        if (member.age) {
            return new Date().getFullYear() - member.age;
        }
        return 'Unknown';
    };

    const getRelationshipIcon = (relationship) => {
        const icons = {
            spouse: '💑',
            parent: '👨‍👩‍👧‍👦',
            child: '👶',
            sibling: '👫',
            grandparent: '👴',
            grandchild: '🧒',
            'uncle-aunt': '👨‍👩‍👧',
            cousin: '👥',
            other: '👤'
        };
        return icons[relationship] || '👤';
    };

    const renderFamilyHierarchy = (member, family) => {
        if (!member || !family) return null;

        // Group family members by generation
        const generations = {};
        family.members.forEach(m => {
            const gen = getGenerationLevel(m);
            if (!generations[gen]) generations[gen] = [];
            generations[gen].push(m);
        });

        const sortedGenerations = Object.keys(generations).sort((a, b) => a - b);

        return (
            <div className="hierarchy-container">
                <h3>Family Hierarchy - {family.familyHead}</h3>
                <div className="generations">
                    {sortedGenerations.map(gen => (
                        <div key={gen} className="generation-level">
                            <div className="generation-header">
                                <span className="generation-number">Generation {gen}</span>
                            </div>
                            <div className="generation-members">
                                {generations[gen].map(m => (
                                    <div
                                        key={m.id}
                                        className={`hierarchy-member ${m.id === member.id ? 'selected' : ''}`}
                                        onClick={() => setSelectedMember(m)}
                                    >
                                        <div className="member-icon">{getRelationshipIcon(m.relationship)}</div>
                                        <div className="member-details">
                                            <h4>{m.name}</h4>
                                            <p className="member-role">{getMemberRole(m, family)}</p>
                                            <p className="birth-year">Born: {getBirthYear(m)}</p>
                                            {m.profession && <p className="occupation">{m.profession}</p>}
                                            {m.marriedInto && (
                                                <p className="married-into">
                                                    Married into: {m.marriedInto.city}, {m.marriedInto.family}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="view-container">
                <div className="loading-state">
                    <div className="loading-spinner">🏘️</div>
                    <p>{t ? t('loadingFamilies') : 'Loading community families...'}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="view-container">
            <div className="community-families-header">
                <h1>{t ? t('communityFamilies') : `${communityName} Community Families`}</h1>

                <div className="view-toggles">
                    <button
                        className={`view-toggle-btn ${!showMigrationView ? 'active' : ''}`}
                        onClick={() => setShowMigrationView(false)}
                    >
                        👨‍👩‍👧‍👦 {t ? t('familyView') : 'Family View'}
                    </button>
                    <button
                        className={`view-toggle-btn ${showMigrationView ? 'active' : ''}`}
                        onClick={() => setShowMigrationView(true)}
                    >
                        🗺️ {t ? t('migrationView') : 'Migration Map'}
                    </button>
                </div>

                <div className="location-filters">
                    <div className="filter-group">
                        <label>{t ? t('selectDistrict') : 'District'}:</label>
                        <select
                            value={selectedDistrict}
                            onChange={(e) => handleDistrictChange(e.target.value)}
                            className="location-select"
                        >
                            <option value="all">{t ? t('allDistricts') : 'All Districts'}</option>
                            {madhyaPradeshDistricts.map(district => (
                                <option key={district} value={district}>
                                    {district}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-group">
                        <label>{t ? t('selectCity') : 'City'}:</label>
                        <select
                            value={selectedCity}
                            onChange={(e) => handleCityChange(e.target.value)}
                            className="location-select"
                            disabled={selectedDistrict === 'all'}
                        >
                            <option value="all">{t ? t('allCities') : 'All Cities'}</option>
                            {availableCities.map(city => (
                                <option key={city} value={city}>
                                    {city}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-group">
                        <label>{t ? t('selectVillage') : 'Village'}:</label>
                        <select
                            value={selectedVillage}
                            onChange={(e) => handleVillageChange(e.target.value)}
                            className="location-select"
                            disabled={selectedCity === 'all'}
                        >
                            <option value="all">{t ? t('noVillage') : 'No Specific Village'}</option>
                            {availableVillages.map(village => (
                                <option key={village} value={village}>
                                    {village}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Advanced Filters Section */}
                <div className="advanced-filters-section">
                    <button
                        className="toggle-filters-btn"
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        🔍 {t ? t('advancedFilters') : 'Advanced Filters'}
                        <span className={`arrow ${showFilters ? 'up' : 'down'}`}>▼</span>
                    </button>

                    {showFilters && (
                        <div className="advanced-filters">
                            <div className="search-section">
                                <input
                                    type="text"
                                    placeholder={t ? t('searchFamilies') : 'Search families, names, professions...'}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="search-input"
                                />
                            </div>

                            <div className="filter-controls">
                                <div className="filter-group">
                                    <label>{t ? t('generation') : 'Generation'}:</label>
                                    <select
                                        value={filterGeneration}
                                        onChange={(e) => setFilterGeneration(e.target.value)}
                                        className="filter-select"
                                    >
                                        <option value="all">{t ? t('allGenerations') : 'All Generations'}</option>
                                        <option value="1">1st Generation (Grandparents)</option>
                                        <option value="2">2nd Generation (Parents)</option>
                                        <option value="3">3rd Generation (Self/Spouse)</option>
                                        <option value="4">4th Generation (Children)</option>
                                        <option value="5">5th Generation (Grandchildren)</option>
                                    </select>
                                </div>

                                <div className="filter-group">
                                    <label>{t ? t('gender') : 'Gender'}:</label>
                                    <select
                                        value={filterGender}
                                        onChange={(e) => setFilterGender(e.target.value)}
                                        className="filter-select"
                                    >
                                        <option value="all">{t ? t('allGenders') : 'All'}</option>
                                        <option value="male">{t ? t('male') : 'Male'}</option>
                                        <option value="female">{t ? t('female') : 'Female'}</option>
                                    </select>
                                </div>

                                <div className="filter-group">
                                    <label>{t ? t('maritalStatus') : 'Marital Status'}:</label>
                                    <select
                                        value={filterMaritalStatus}
                                        onChange={(e) => setFilterMaritalStatus(e.target.value)}
                                        className="filter-select"
                                    >
                                        <option value="all">{t ? t('allStatuses') : 'All'}</option>
                                        <option value="married">{t ? t('married') : 'Married'}</option>
                                        <option value="unmarried">{t ? t('unmarried') : 'Unmarried'}</option>
                                    </select>
                                </div>

                                <div className="filter-group">
                                    <label>{t ? t('occupation') : 'Occupation'}:</label>
                                    <select
                                        value={filterOccupation}
                                        onChange={(e) => setFilterOccupation(e.target.value)}
                                        className="filter-select"
                                    >
                                        <option value="all">{t ? t('allOccupations') : 'All Occupations'}</option>
                                        <option value="teacher">{t ? t('teacher') : 'Teacher'}</option>
                                        <option value="engineer">{t ? t('engineer') : 'Engineer'}</option>
                                        <option value="doctor">{t ? t('doctor') : 'Doctor'}</option>
                                        <option value="farmer">{t ? t('farmer') : 'Farmer'}</option>
                                        <option value="business">{t ? t('business') : 'Business'}</option>
                                        <option value="government">{t ? t('government') : 'Government Service'}</option>
                                        <option value="student">{t ? t('student') : 'Student'}</option>
                                    </select>
                                </div>

                                <div className="filter-actions">
                                    <button
                                        className="clear-filters-btn"
                                        onClick={clearAllFilters}
                                    >
                                        {t ? t('clearFilters') : 'Clear All'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="families-stats">
                <div className="stat-card">
                    <span className="stat-number">{families.length}</span>
                    <span className="stat-label">{t ? t('families') : 'Families'}</span>
                </div>
                <div className="stat-card">
                    <span className="stat-number">
                        {families.reduce((total, family) => total + family.members.length, 0)}
                    </span>
                    <span className="stat-label">{t ? t('members') : 'Members'}</span>
                </div>
                <div className="stat-card">
                    <span className="stat-number">
                        {selectedDistrict === 'all'
                            ? madhyaPradeshDistricts.length
                            : selectedCity === 'all'
                                ? availableCities.length
                                : availableVillages.length
                        }
                    </span>
                    <span className="stat-label">
                        {selectedDistrict === 'all'
                            ? (t ? t('districts') : 'Districts')
                            : selectedCity === 'all'
                                ? (t ? t('cities') : 'Cities')
                                : (t ? t('villages') : 'Villages')
                        }
                    </span>
                </div>
            </div>

            {showMigrationView ? (
                <div className="migration-container">
                    <div className="migration-header">
                        <h2>🗺️ {t ? t('marriageMigrationMap') : 'Marriage Migration Map'}</h2>
                        <p>{t ? t('migrationDescription') : 'Track where daughters from community families have married and settled'}</p>
                    </div>

                    {getMigrationData().length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">🗺️</div>
                            <h3>{t ? t('noMigrationData') : 'No migration data available'}</h3>
                            <p>{t ? t('migrationEmptyMessage') : 'No marriage migration records found in the current selection'}</p>
                        </div>
                    ) : (
                        <div className="migration-grid">
                            {getMigrationData().map((migration, index) => (
                                <div key={index} className="migration-card">
                                    <div className="migration-header-card">
                                        <h4>{migration.name}</h4>
                                        {migration.marriageYear && (
                                            <span className="marriage-year">{migration.marriageYear}</span>
                                        )}
                                    </div>

                                    <div className="migration-route">
                                        <div className="origin">
                                            <div className="location-badge from">
                                                <span className="location-icon">🏠</span>
                                                <div>
                                                    <div className="family-name">{migration.originalFamily}</div>
                                                    <div className="location-name">{migration.originalLocation}</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="migration-arrow">
                                            <span>💒</span>
                                            <div className="arrow-line">→</div>
                                        </div>

                                        <div className="destination">
                                            <div className="location-badge to">
                                                <span className="location-icon">🏡</span>
                                                <div>
                                                    <div className="family-name">{migration.marriedToFamily}</div>
                                                    <div className="location-name">{migration.marriedToLocation}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ) : families.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">🏘️</div>
                    <h3>{t ? t('noFamiliesFound') : 'No families found'}</h3>
                    <p>
                        {selectedVillage !== 'all'
                            ? (t ? t('noFamiliesInLocation') : `No families found in ${selectedVillage}`)
                            : selectedCity !== 'all'
                                ? (t ? t('noFamiliesInLocation') : `No families found in ${selectedCity}`)
                                : selectedDistrict !== 'all'
                                    ? (t ? t('noFamiliesInLocation') : `No families found in ${selectedDistrict}`)
                                    : (t ? t('noFamiliesYet') : 'No families have been added to the community yet')
                        }
                    </p>
                </div>
            ) : (
                <div className="families-container">
                    <div className="families-grid">
                        {families.map(family => (
                            <div key={family.id} className="family-card">
                                <div className="family-header">
                                    <h3 className="family-name">{family.familyHead}</h3>
                                    <div className="family-location">
                                        <span className="location-icon">📍</span>
                                        <span>{family.city}</span>
                                    </div>
                                </div>

                                <div className="family-members">
                                    <div className="members-count">
                                        {family.members.length} {t ? t('members') : 'members'}
                                    </div>

                                    <div className="members-list">
                                        {family.members.map(member => (
                                            <div
                                                key={member.id}
                                                className="member-item"
                                                onClick={() => handleMemberClick(member, family)}
                                            >
                                                <div className="member-avatar">
                                                    {getRelationshipIcon(member.relationship)}
                                                </div>
                                                <div className="member-info">
                                                    <h4>{member.name}</h4>
                                                    <p className="member-role">
                                                        {getMemberRole(member, family)}
                                                    </p>
                                                    <p className="member-age">
                                                        {member.age ? `${member.age} years old` : ''}
                                                    </p>
                                                    {member.profession && (
                                                        <p className="member-profession">{member.profession}</p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="family-actions">
                                    <button
                                        className="view-family-btn"
                                        onClick={() => {
                                            setSelectedFamily(family);
                                            setSelectedMember(family.members[0]);
                                            setShowHierarchy(true);
                                        }}
                                    >
                                        {t ? t('viewFamilyTree') : 'View Family Tree'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Family Hierarchy Modal */}
            {showHierarchy && selectedMember && selectedFamily && (
                <div className="modal-overlay" onClick={() => setShowHierarchy(false)}>
                    <div className="hierarchy-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{t ? t('familyHierarchy') : 'Family Hierarchy'}</h2>
                            <button
                                className="close-btn"
                                onClick={() => setShowHierarchy(false)}
                            >
                                ✕
                            </button>
                        </div>

                        <div className="modal-content">
                            {renderFamilyHierarchy(selectedMember, selectedFamily)}

                            {selectedMember && (
                                <div className="selected-member-details">
                                    <h3>{t ? t('memberDetails') : 'Member Details'}</h3>
                                    <div className="detail-card">
                                        <div className="detail-icon">
                                            {getRelationshipIcon(selectedMember.relationship)}
                                        </div>
                                        <div className="detail-info">
                                            <h4>{selectedMember.name}</h4>
                                            <p><strong>{t ? t('role') : 'Role'}:</strong> {getMemberRole(selectedMember, selectedFamily)}</p>
                                            <p><strong>{t ? t('generation') : 'Generation'}:</strong> {getGenerationLevel(selectedMember)}</p>
                                            <p><strong>{t ? t('birthYear') : 'Birth Year'}:</strong> {getBirthYear(selectedMember)}</p>
                                            {selectedMember.age && <p><strong>{t ? t('age') : 'Age'}:</strong> {selectedMember.age}</p>}
                                            {selectedMember.profession && <p><strong>{t ? t('occupation') : 'Occupation'}:</strong> {selectedMember.profession}</p>}
                                            {selectedMember.school && <p><strong>{t ? t('education') : 'Education'}:</strong> {selectedMember.school}</p>}
                                            {selectedMember.hobbies && <p><strong>{t ? t('interests') : 'Interests'}:</strong> {selectedMember.hobbies}</p>}
                                            {selectedMember.achievements && <p><strong>{t ? t('achievements') : 'Achievements'}:</strong> {selectedMember.achievements}</p>}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CommunityFamilies;