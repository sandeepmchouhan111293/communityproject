# Location Data Structure

This directory contains static location data for the Community Families feature.

## Files Structure

### 📍 `madhyaPradeshDistricts.js`
Contains all 55 districts of Madhya Pradesh in alphabetical order.
- **Export**: `madhyaPradeshDistricts` (array)
- **Format**: Simple sorted array of district names

### 🏙️ `districtCities.js`
Maps districts to their major cities and towns.
- **Export**: `districtCitiesMap` (object)
- **Format**: `{ districtName: [cityName1, cityName2, ...] }`
- **Coverage**: All 55 districts with major cities/towns

### 🏡 `cityVillages.js`
Maps cities/towns to their villages.
- **Export**: `cityVillagesMap` (object)
- **Format**: `{ cityName: [villageName1, villageName2, ...] }`
- **Coverage**: Sample villages for major cities (expandable)

### 📦 `index.js`
Central export file for all location data.
- **Exports**: All three data structures
- **Usage**: `import { madhyaPradeshDistricts, districtCitiesMap, cityVillagesMap } from '../../data'`

## Data Expansion Guidelines

### Adding New Cities to a District
1. Open `districtCities.js`
2. Find the district key
3. Add city name to the array
4. Update villages in `cityVillages.js` if needed

### Adding New Villages to a City
1. Open `cityVillages.js`
2. Find the city key
3. Add village names to the array

### Adding New Districts
1. Add district name to `madhyaPradeshDistricts.js`
2. Add district entry with cities in `districtCities.js`
3. Add village data for cities in `cityVillages.js`

## Future Enhancements

### Database Integration
For large-scale deployment, consider moving this data to:
- **Database tables**: `districts`, `cities`, `villages`
- **API endpoints**: Dynamic loading based on selection
- **Caching**: Local storage for frequently accessed data

### Data Validation
- Ensure district names match official government records
- Validate city-district relationships
- Verify village-city mappings

### Performance Optimization
- Implement lazy loading for village data
- Add search indices for large datasets
- Consider data compression for mobile devices

## Usage Example

```javascript
import { madhyaPradeshDistricts, districtCitiesMap, cityVillagesMap } from '../data';

// Get all districts
const districts = madhyaPradeshDistricts;

// Get cities in Bhopal district
const bhopalCities = districtCitiesMap['Bhopal'];

// Get villages in Bhopal City
const bhopalVillages = cityVillagesMap['Bhopal City'];
```

## Maintenance Notes

- Keep data sorted alphabetically for better user experience
- Regular updates as new administrative divisions are created
- Coordinate with government records for accuracy
- Test imports after any structural changes