#!/usr/bin/env node

/**
 * Simple Node.js test script for translation functionality
 * Run with: node tests/test-translations.js
 */

// Mock imports since we're running in Node.js environment
const translations = {
    en: {
        selectState: "State",
        selectDistrict: "District",
        selectSubdistrict: "Subdistrict",
        selectCity: "City",
        selectVillage: "Village",
        allStates: "All States",
        allDistricts: "All Districts",
        allSubdistricts: "All Subdistricts"
    },
    hi: {
        selectState: "राज्य",
        selectDistrict: "जिला",
        selectSubdistrict: "तहसील",
        selectCity: "शहर",
        selectVillage: "गांव",
        allStates: "सभी राज्य",
        allDistricts: "सभी जिले",
        allSubdistricts: "सभी तहसील",

        // Districts
        bhopal: "भोपाल",
        indore: "इंदौर",
        gwalior: "ग्वालियर",
        jabalpur: "जबलपुर",
        ujjain: "उज्जैन",
        raisen: "रायसेन",
        rajgarh: "राजगढ़",
        sehore: "सीहोर",
        vidisha: "विदिशा",
        morena: "मुरैना",
        shivpuri: "शिवपुरी",
        datia: "दतिया",
        guna: "गुना",

        // Subdistricts
        huzur: "हुजूर",
        kolar: "कोलार",
        berasia: "बैरसिया",
        goharganj: "गोहरगंज",
        begamganj: "बेगमगंज",
        gairatganj: "गैरतगंज",
        silwani: "सिलवानी",
        barely: "बैरली",
        badi: "बड़ी",
        udaipura: "उदयपुरा",
        sultanpur: "सुल्तानपुर",
        khilchipur: "खिलचीपुर",
        zirapur: "जीरापुर",
        biaora: "बिअवरा",
        narsinghgarh: "नरसिंहगढ़",
        sarangpur: "सारंगपुर",
        pachore: "पाचोर",
        khujner: "खुजनेर",
        suthaliya: "सुथालिया",
        nasrullaganj: "नसरुल्लागंज",

        // Major cities
        mumbai: "मुंबई",
        delhi: "दिल्ली",
        bengaluru: "बेंगलुरु",
        hyderabad: "हैदराबाद",
        chennai: "चेन्नई",
        kolkata: "कोलकाता",
        pune: "पुणे",
        jaipur: "जयपुर",
        lucknow: "लखनऊ",
        kanpur: "कानपुर"
    }
};

// Mock useTranslation function
const useTranslation = (language) => {
    const t = (key, varsOrDefault = {}) => {
        let str = translations[language]?.[key];
        if (!str) str = typeof varsOrDefault === 'string' ? varsOrDefault : key;
        return str;
    };

    const tLocation = (locationName) => {
        if (!locationName || language === 'en') return locationName;
        const lookupKey = locationName.toLowerCase();
        return translations[language]?.[lookupKey] || locationName;
    };

    return { t, tLocation };
};

// Test functions
function runBasicTranslationTests() {
    console.log('\n🧪 === Basic Translation Tests ===');

    const { t: tEn } = useTranslation('en');
    const { t: tHi } = useTranslation('hi');

    const tests = [
        { key: 'selectState', en: 'State', hi: 'राज्य' },
        { key: 'selectDistrict', en: 'District', hi: 'जिला' },
        { key: 'selectSubdistrict', en: 'Subdistrict', hi: 'तहसील' },
        { key: 'selectCity', en: 'City', hi: 'शहर' },
        { key: 'selectVillage', en: 'Village', hi: 'गांव' }
    ];

    let passed = 0;
    let total = tests.length;

    tests.forEach(test => {
        const enResult = tEn(test.key);
        const hiResult = tHi(test.key);
        const success = enResult === test.en && hiResult === test.hi;

        console.log(`${success ? '✅' : '❌'} ${test.key}: EN="${enResult}", HI="${hiResult}"`);
        if (success) passed++;
    });

    console.log(`\n📊 Basic Tests: ${passed}/${total} passed`);
    return passed === total;
}

function runLocationTranslationTests() {
    console.log('\n🌍 === Location Translation Tests ===');

    const { tLocation } = useTranslation('hi');

    const locationTests = [
        // Districts
        { name: 'Bhopal', expected: 'भोपाल', type: 'District' },
        { name: 'Indore', expected: 'इंदौर', type: 'District' },
        { name: 'Gwalior', expected: 'ग्वालियर', type: 'District' },
        { name: 'Jabalpur', expected: 'जबलपुर', type: 'District' },
        { name: 'Ujjain', expected: 'उज्जैन', type: 'District' },

        // Subdistricts
        { name: 'Huzur', expected: 'हुजूर', type: 'Subdistrict' },
        { name: 'Berasia', expected: 'बैरसिया', type: 'Subdistrict' },
        { name: 'Kolar', expected: 'कोलार', type: 'Subdistrict' },
        { name: 'Goharganj', expected: 'गोहरगंज', type: 'Subdistrict' },
        { name: 'Nasrullaganj', expected: 'नसरुल्लागंज', type: 'Subdistrict' },

        // Cities
        { name: 'Mumbai', expected: 'मुंबई', type: 'City' },
        { name: 'Delhi', expected: 'दिल्ली', type: 'City' },
        { name: 'Chennai', expected: 'चेन्नई', type: 'City' }
    ];

    let passed = 0;
    let total = locationTests.length;

    locationTests.forEach(test => {
        const result = tLocation(test.name);
        const success = result === test.expected;

        console.log(`${success ? '✅' : '❌'} ${test.type}: ${test.name} → ${result} ${success ? '' : `(expected: ${test.expected})`}`);
        if (success) passed++;
    });

    console.log(`\n📊 Location Tests: ${passed}/${total} passed`);
    return passed === total;
}

function runCaseInsensitiveTests() {
    console.log('\n🔤 === Case Insensitive Tests ===');

    const { tLocation } = useTranslation('hi');

    const caseTests = [
        { name: 'bhopal', expected: 'भोपाल' },
        { name: 'INDORE', expected: 'इंदौर' },
        { name: 'GwAlIoR', expected: 'ग्वालियर' },
        { name: 'hUzUr', expected: 'हुजूर' }
    ];

    let passed = 0;
    let total = caseTests.length;

    caseTests.forEach(test => {
        const result = tLocation(test.name);
        const success = result === test.expected;

        console.log(`${success ? '✅' : '❌'} "${test.name}" → ${result} ${success ? '' : `(expected: ${test.expected})`}`);
        if (success) passed++;
    });

    console.log(`\n📊 Case Tests: ${passed}/${total} passed`);
    return passed === total;
}

function runFallbackTests() {
    console.log('\n🔄 === Fallback Tests ===');

    const { tLocation } = useTranslation('hi');

    const fallbackTests = [
        { name: 'UnknownPlace', expected: 'UnknownPlace' },
        { name: 'Random District', expected: 'Random District' },
        { name: 'XYZ City', expected: 'XYZ City' }
    ];

    let passed = 0;
    let total = fallbackTests.length;

    fallbackTests.forEach(test => {
        const result = tLocation(test.name);
        const success = result === test.expected;

        console.log(`${success ? '✅' : '❌'} "${test.name}" → "${result}" (fallback test)`);
        if (success) passed++;
    });

    console.log(`\n📊 Fallback Tests: ${passed}/${total} passed`);
    return passed === total;
}

function runEnglishModeTests() {
    console.log('\n🇬🇧 === English Mode Tests ===');

    const { tLocation } = useTranslation('en');

    const englishTests = [
        'Bhopal', 'Indore', 'Huzur', 'Mumbai', 'Delhi'
    ];

    let passed = 0;
    let total = englishTests.length;

    englishTests.forEach(test => {
        const result = tLocation(test);
        const success = result === test; // Should return unchanged in English mode

        console.log(`${success ? '✅' : '❌'} "${test}" → "${result}" (should be unchanged)`);
        if (success) passed++;
    });

    console.log(`\n📊 English Mode Tests: ${passed}/${total} passed`);
    return passed === total;
}

function runPerformanceTests() {
    console.log('\n⚡ === Performance Tests ===');

    const { tLocation } = useTranslation('hi');

    // Test with large dataset
    const largeDataset = [];
    for (let i = 0; i < 1000; i++) {
        largeDataset.push(`TestLocation${i}`);
    }

    const start = Date.now();
    largeDataset.forEach(location => tLocation(location));
    const end = Date.now();

    const duration = end - start;
    const success = duration < 100; // Should complete in under 100ms

    console.log(`${success ? '✅' : '❌'} Processed 1000 locations in ${duration}ms ${success ? '(Good!)' : '(Too slow!)'}`);

    console.log(`\n📊 Performance Tests: ${success ? '1/1' : '0/1'} passed`);
    return success;
}

// Main test runner
function runAllTests() {
    console.log('🌐 === Translation System Test Suite ===');
    console.log('Testing Hindi translations for Indian locations\n');

    const results = [
        runBasicTranslationTests(),
        runLocationTranslationTests(),
        runCaseInsensitiveTests(),
        runFallbackTests(),
        runEnglishModeTests(),
        runPerformanceTests()
    ];

    const passed = results.filter(r => r).length;
    const total = results.length;
    const success = passed === total;

    console.log('\n' + '='.repeat(50));
    console.log(`🎯 FINAL RESULT: ${passed}/${total} test suites passed`);
    console.log(`${success ? '🎉 ALL TESTS PASSED!' : '❌ Some tests failed'}`);
    console.log('='.repeat(50));

    return success;
}

// Demo function to show translations in action
function runDemo() {
    console.log('\n🎬 === Translation Demo ===');

    const { t, tLocation } = useTranslation('hi');

    console.log('\n📍 UI Element Translations:');
    console.log(`State: ${t('selectState')}`);
    console.log(`District: ${t('selectDistrict')}`);
    console.log(`Subdistrict: ${t('selectSubdistrict')}`);

    console.log('\n🗺️ Location Name Translations:');
    const locations = ['Bhopal', 'Huzur', 'Berasia', 'Indore', 'Mumbai'];
    locations.forEach(location => {
        console.log(`${location} → ${tLocation(location)}`);
    });

    console.log('\n💡 Usage in React Component:');
    console.log('// In dropdown:');
    console.log('availableDistricts.map(district => (');
    console.log('  <option key={district} value={district}>');
    console.log('    {tLocation(district)}');
    console.log('  </option>');
    console.log('))');
}

// Run tests based on command line arguments
const args = process.argv.slice(2);
if (args.includes('--demo')) {
    runDemo();
} else if (args.includes('--help')) {
    console.log('Translation Test Suite');
    console.log('Usage: node test-translations.js [options]');
    console.log('Options:');
    console.log('  --demo    Run translation demo');
    console.log('  --help    Show this help message');
    console.log('  (no args) Run all tests');
} else {
    const success = runAllTests();
    process.exit(success ? 0 : 1);
}