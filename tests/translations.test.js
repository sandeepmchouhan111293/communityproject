// Test file for translation functionality
import { useTranslation } from '../src/i18n/translations';

describe('Translation System Tests', () => {

    describe('Basic Translation Function', () => {
        test('should return English translations correctly', () => {
            const { t } = useTranslation('en');

            expect(t('selectState')).toBe('State');
            expect(t('selectDistrict')).toBe('District');
            expect(t('selectSubdistrict')).toBe('Subdistrict');
            expect(t('selectCity')).toBe('City');
            expect(t('selectVillage')).toBe('Village');
        });

        test('should return Hindi translations correctly', () => {
            const { t } = useTranslation('hi');

            expect(t('selectState')).toBe('राज्य');
            expect(t('selectDistrict')).toBe('जिला');
            expect(t('selectSubdistrict')).toBe('तहसील');
            expect(t('selectCity')).toBe('शहर');
            expect(t('selectVillage')).toBe('गांव');
        });
    });

    describe('Location Translation Function', () => {
        test('should translate MP districts correctly in Hindi', () => {
            const { tLocation } = useTranslation('hi');

            expect(tLocation('Bhopal')).toBe('भोपाल');
            expect(tLocation('Indore')).toBe('इंदौर');
            expect(tLocation('Gwalior')).toBe('ग्वालियर');
            expect(tLocation('Jabalpur')).toBe('जबलपुर');
            expect(tLocation('Ujjain')).toBe('उज्जैन');
        });

        test('should translate MP subdistricts correctly in Hindi', () => {
            const { tLocation } = useTranslation('hi');

            expect(tLocation('Huzur')).toBe('हुजूर');
            expect(tLocation('Berasia')).toBe('बैरसिया');
            expect(tLocation('Kolar')).toBe('कोलार');
            expect(tLocation('Goharganj')).toBe('गोहरगंज');
            expect(tLocation('Begamganj')).toBe('बेगमगंज');
        });

        test('should return original name if translation not found', () => {
            const { tLocation } = useTranslation('hi');

            expect(tLocation('UnknownPlace')).toBe('UnknownPlace');
            expect(tLocation('Random District')).toBe('Random District');
        });

        test('should return original name for English language', () => {
            const { tLocation } = useTranslation('en');

            expect(tLocation('Bhopal')).toBe('Bhopal');
            expect(tLocation('Indore')).toBe('Indore');
            expect(tLocation('Huzur')).toBe('Huzur');
        });

        test('should handle case insensitive lookups', () => {
            const { tLocation } = useTranslation('hi');

            expect(tLocation('bhopal')).toBe('भोपाल');
            expect(tLocation('INDORE')).toBe('इंदौर');
            expect(tLocation('GwAlIoR')).toBe('ग्वालियर');
        });

        test('should handle null and undefined inputs', () => {
            const { tLocation } = useTranslation('hi');

            expect(tLocation(null)).toBe(null);
            expect(tLocation(undefined)).toBe(undefined);
            expect(tLocation('')).toBe('');
        });
    });

    describe('State and District Coverage', () => {
        test('should have translations for major MP districts', () => {
            const { tLocation } = useTranslation('hi');

            const majorDistricts = [
                'Bhopal', 'Indore', 'Gwalior', 'Jabalpur', 'Ujjain',
                'Sagar', 'Rewa', 'Satna', 'Morena', 'Shivpuri'
            ];

            majorDistricts.forEach(district => {
                const translation = tLocation(district);
                expect(translation).toBeDefined();
                expect(translation).not.toBe(district); // Should be translated
            });
        });

        test('should have translations for major cities', () => {
            const { tLocation } = useTranslation('hi');

            const majorCities = [
                'Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad', 'Chennai',
                'Kolkata', 'Pune', 'Jaipur', 'Lucknow', 'Kanpur'
            ];

            majorCities.forEach(city => {
                const translation = tLocation(city);
                expect(translation).toBeDefined();
                expect(translation).not.toBe(city); // Should be translated
            });
        });
    });

    describe('Integration Tests', () => {
        test('should handle dropdown data correctly', () => {
            const { tLocation } = useTranslation('hi');

            // Simulate dropdown data
            const districts = ['Bhopal', 'Indore', 'Gwalior'];
            const translatedDistricts = districts.map(district => ({
                value: district,
                label: tLocation(district)
            }));

            expect(translatedDistricts[0].label).toBe('भोपाल');
            expect(translatedDistricts[1].label).toBe('इंदौर');
            expect(translatedDistricts[2].label).toBe('ग्वालियर');
        });

        test('should maintain original value for form submission', () => {
            const { tLocation } = useTranslation('hi');

            const originalValue = 'Bhopal';
            const displayValue = tLocation(originalValue);

            // Display should be translated
            expect(displayValue).toBe('भोपाल');

            // But original value should remain for form submission
            expect(originalValue).toBe('Bhopal');
        });
    });

    describe('Performance Tests', () => {
        test('should handle large lists efficiently', () => {
            const { tLocation } = useTranslation('hi');

            const largeList = new Array(1000).fill(0).map((_, i) => `District${i}`);

            const start = performance.now();
            largeList.forEach(item => tLocation(item));
            const end = performance.now();

            // Should complete within reasonable time (less than 100ms)
            expect(end - start).toBeLessThan(100);
        });
    });
});

// Manual test function for development
export const runManualTests = () => {
    console.log('=== Manual Translation Tests ===');

    const { t: tEn, tLocation: tLocationEn } = useTranslation('en');
    const { t: tHi, tLocation: tLocationHi } = useTranslation('hi');

    console.log('English Tests:');
    console.log('State:', tEn('selectState'));
    console.log('Bhopal:', tLocationEn('Bhopal'));
    console.log('Huzur:', tLocationEn('Huzur'));

    console.log('\nHindi Tests:');
    console.log('State:', tHi('selectState'));
    console.log('Bhopal:', tLocationHi('Bhopal'));
    console.log('Huzur:', tLocationHi('Huzur'));

    console.log('\nSubdistrict Tests:');
    const subdistricts = ['Berasia', 'Goharganj', 'Begamganj', 'Nasrullaganj'];
    subdistricts.forEach(sub => {
        console.log(`${sub} -> ${tLocationHi(sub)}`);
    });

    console.log('\nDistrict Tests:');
    const districts = ['Raisen', 'Rajgarh', 'Sehore', 'Vidisha'];
    districts.forEach(dist => {
        console.log(`${dist} -> ${tLocationHi(dist)}`);
    });
};

// Export for browser console testing
if (typeof window !== 'undefined') {
    window.runTranslationTests = runManualTests;
}