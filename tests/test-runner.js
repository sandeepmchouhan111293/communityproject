const { execSync } = require('child_process');

/**
 * Test Runner Script for Community Project
 *
 * This script runs all Playwright tests in headless Chromium mode
 * and provides a summary of results.
 */

console.log('🚀 Starting Playwright Test Suite for Community Project');
console.log('=' .repeat(60));

const testSuites = [
  {
    name: 'Login Tests',
    file: 'login.spec.js',
    description: 'Tests for authentication and login functionality'
  },
  {
    name: 'Admin Upload Tests',
    file: 'admin-upload.spec.js',
    description: 'Tests for admin document upload functionality'
  },
  {
    name: 'Explorer & Filtering Tests',
    file: 'explorer-filtering.spec.js',
    description: 'Tests for family tree explorer and location filtering'
  },
  {
    name: 'Role-Based Access Tests',
    file: 'role-based-access.spec.js',
    description: 'Tests for admin/user access control'
  },
  {
    name: 'Fallback UI Tests',
    file: 'fallback-ui.spec.js',
    description: 'Tests for empty states and fallback scenarios'
  }
];

function runTestSuite(testFile) {
  try {
    console.log(`\n▶️  Running ${testFile}...`);
    const output = execSync(`npx playwright test tests/${testFile}`, {
      encoding: 'utf8',
      timeout: 300000 // 5 minutes timeout
    });
    console.log('✅ PASSED');
    return { success: true, output };
  } catch (error) {
    console.log('❌ FAILED');
    console.log(error.stdout || error.message);
    return { success: false, error: error.stdout || error.message };
  }
}

function main() {
  const results = [];

  console.log('\n📋 Test Suite Overview:');
  testSuites.forEach((suite, index) => {
    console.log(`${index + 1}. ${suite.name} - ${suite.description}`);
  });

  console.log('\n🏃 Running Tests...');

  for (const suite of testSuites) {
    const result = runTestSuite(suite.file);
    results.push({
      ...suite,
      ...result
    });
  }

  // Summary
  console.log('\n' + '=' .repeat(60));
  console.log('📊 TEST RESULTS SUMMARY');
  console.log('=' .repeat(60));

  const passed = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${((passed / results.length) * 100).toFixed(1)}%`);

  console.log('\n📋 Detailed Results:');
  results.forEach((result, index) => {
    const status = result.success ? '✅' : '❌';
    console.log(`${index + 1}. ${status} ${result.name}`);
    if (!result.success) {
      console.log(`   Error: ${result.error.split('\n')[0]}`);
    }
  });

  if (failed > 0) {
    console.log('\n⚠️  Some tests failed. Check the detailed output above.');
    console.log('💡 Tip: Run individual test files to see more details:');
    console.log('   npx playwright test tests/[test-file].spec.js');
  } else {
    console.log('\n🎉 All tests passed! Your application is working correctly.');
  }

  console.log('\n📖 To view detailed HTML report, run:');
  console.log('   npx playwright show-report');
}

if (require.main === module) {
  main();
}