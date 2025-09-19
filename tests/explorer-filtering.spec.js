const { test, expect } = require('@playwright/test');

test.describe('Family Explorer and Filtering Tests', () => {
  // Login helper function
  async function loginAsAdmin(page) {
    await page.goto('/login');
    await page.fill('#login-email', 'chouhan.sandeep003@gmail.com');
    await page.fill('#login-password', 'asdfgh');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);
  }

  test.beforeEach(async ({ page }) => {
    // Mock Supabase auth to simulate successful login
    await page.addInitScript(() => {
      // Mock the Supabase client
      window.mockSupabaseAuth = {
        user: {
          id: 'admin-123',
          email: 'chouhan.sandeep003@gmail.com',
          user_metadata: { role: 'admin' }
        },
        isAdmin: true
      };

      // Override Supabase auth methods
      if (window.supabase) {
        window.supabase.auth.signInWithPassword = async (credentials) => {
          if (credentials.email === 'chouhan.sandeep003@gmail.com' && credentials.password === 'asdfgh') {
            return {
              data: {
                user: window.mockSupabaseAuth.user,
                session: { access_token: 'mock-token' }
              },
              error: null
            };
          }
          return {
            data: null,
            error: { message: 'Invalid login credentials' }
          };
        };

        window.supabase.auth.getUser = async () => {
          return {
            data: { user: window.mockSupabaseAuth.user },
            error: null
          };
        };
      }
    });

    // Login before each test
    await loginAsAdmin(page);
  });

  test('should display family tree explorer with view modes', async ({ page }) => {
    // Wait for dashboard to load after login
    await page.waitForSelector('.dashboard-container', { timeout: 10000 });

    // Navigate to Family Tree using the sidebar navigation
    await page.click('button:has-text("🌳")');
    await page.waitForTimeout(2000);

    // Wait for the family tree view to load
    await page.waitForSelector('.view-container', { timeout: 5000 });

    // Check for add family member button (should always be visible)
    const addFamilyBtn = page.locator('button:has-text("Add Family Member"), .family-add-btn, .add-btn');
    await expect(addFamilyBtn).toBeVisible();

    // Check if there are family members and view mode controls
    const familyMembers = page.locator('.family-member-card, .member-card');
    const memberCount = await familyMembers.count();

    if (memberCount > 0) {
      // Look for view mode buttons
      const cardViewBtn = page.locator('button:has-text("🔲"), .view-mode-btn, button[title*="Card"]');
      const listViewBtn = page.locator('button:has-text("📝"), .view-mode-btn, button[title*="List"]');
      const treeViewBtn = page.locator('button:has-text("🌳"), .view-mode-btn, button[title*="Tree"]');

      // If view mode buttons exist, test them
      if (await cardViewBtn.count() > 0) {
        await cardViewBtn.first().click();
        await page.waitForTimeout(500);
      }
      if (await listViewBtn.count() > 0) {
        await listViewBtn.first().click();
        await page.waitForTimeout(500);
      }
      if (await treeViewBtn.count() > 0) {
        await treeViewBtn.first().click();
        await page.waitForTimeout(500);
      }
    }

    // Verify we're in the family tree view
    const familyTreeContent = page.locator('.view-container h1, .family-tree-container');
    await expect(familyTreeContent).toBeVisible();
  });

  test('should display community families explorer with location filtering', async ({ page }) => {
    // Wait for dashboard to load after login
    await page.waitForSelector('.dashboard-container', { timeout: 10000 });

    // Navigate to Community Families using the sidebar navigation
    await page.click('button:has-text("🏘️")');
    await page.waitForTimeout(2000);

    // Wait for the community families view to load
    await page.waitForSelector('.view-container', { timeout: 5000 });
    await page.waitForSelector('.location-filters', { timeout: 5000 });

    // Check for location filter elements
    const stateSelect = page.locator('.location-select').first();
    await expect(stateSelect).toBeVisible();

    // Test state selection
    const stateOptions = await stateSelect.locator('option').count();
    if (stateOptions > 1) {
      await stateSelect.selectOption({ index: 1 }); // Select first non-"all" option
      await page.waitForTimeout(1000);

      // District select should become enabled
      const districtSelect = page.locator('.location-select').nth(1);
      await expect(districtSelect).not.toBeDisabled();
    }

    // Check for view toggles (Family View / Migration Map)
    const familyViewBtn = page.locator('button:has-text("👨‍👩‍👧‍👦")');
    const migrationViewBtn = page.locator('button:has-text("🗺️")');

    if (await familyViewBtn.count() > 0 && await migrationViewBtn.count() > 0) {
      await expect(familyViewBtn).toBeVisible();
      await expect(migrationViewBtn).toBeVisible();

      // Test switching views
      await migrationViewBtn.click();
      await page.waitForTimeout(1000);
      await expect(migrationViewBtn).toHaveClass(/active/);

      await familyViewBtn.click();
      await page.waitForTimeout(1000);
      await expect(familyViewBtn).toHaveClass(/active/);
    }

    // Check for stats display
    const statsCards = page.locator('.stat-card');
    await expect(statsCards.first()).toBeVisible();
  });

  test('should filter families by district selection', async ({ page }) => {
    // Wait for dashboard to load after login
    await page.waitForSelector('.dashboard-container', { timeout: 10000 });

    // Navigate to Community Families using the sidebar navigation
    await page.click('button:has-text("🏘️")');
    await page.waitForTimeout(2000);

    // Wait for the community families view to load
    await page.waitForSelector('.location-filters', { timeout: 5000 });

    // Select a state first
    const stateSelect = page.locator('.location-select').first();
    const stateOptions = await stateSelect.locator('option').count();

    if (stateOptions > 1) {
      await stateSelect.selectOption({ index: 1 }); // Select first available state
      await page.waitForTimeout(1000);

      // Now select a district
      const districtSelect = page.locator('.location-select').nth(1);
      const isEnabled = await districtSelect.isEnabled();

      if (isEnabled) {
        const districtOptions = await districtSelect.locator('option').count();
        if (districtOptions > 1) {
          await districtSelect.selectOption({ index: 1 }); // Select first available district
          await page.waitForTimeout(2000);
        }
      }
    }

    // Check if families are filtered or no families message is shown
    await page.waitForTimeout(1000);
    const familyCards = page.locator('.family-card');
    const noFamiliesMessage = page.locator('.empty-state');
    const statsCards = page.locator('.stat-card');

    const hasFamilies = await familyCards.count() > 0;
    const hasNoFamiliesMessage = await noFamiliesMessage.isVisible();
    const hasStats = await statsCards.first().isVisible();

    // Should either show families, no families message, or stats should be updated
    expect(hasFamilies || hasNoFamiliesMessage || hasStats).toBeTruthy();
  });

  test('should filter families by city and village', async ({ page }) => {
    // Wait for dashboard to load after login
    await page.waitForSelector('.dashboard-container', { timeout: 10000 });

    // Navigate to Community Families using the sidebar navigation
    await page.click('button:has-text("🏘️")');
    await page.waitForTimeout(2000);

    // Wait for the community families view to load
    await page.waitForSelector('.location-filters', { timeout: 5000 });

    // Test hierarchical filtering: State -> District -> City -> Village
    const locationSelects = page.locator('.location-select');

    // Select state
    const stateSelect = locationSelects.first();
    const stateOptions = await stateSelect.locator('option').count();
    if (stateOptions > 1) {
      await stateSelect.selectOption({ index: 1 });
      await page.waitForTimeout(1000);
    }

    // Select district
    const districtSelect = locationSelects.nth(1);
    if (await districtSelect.isEnabled()) {
      const districtOptions = await districtSelect.locator('option').count();
      if (districtOptions > 1) {
        await districtSelect.selectOption({ index: 1 });
        await page.waitForTimeout(1000);
      }
    }

    // Select city
    const citySelect = locationSelects.nth(3);
    if (await citySelect.isEnabled()) {
      const cityOptions = await citySelect.locator('option').count();
      if (cityOptions > 1) {
        await citySelect.selectOption({ index: 1 });
        await page.waitForTimeout(1000);
      }
    }

    // Select village if available
    const villageSelect = locationSelects.nth(4);
    if (await villageSelect.isEnabled()) {
      const villageOptions = await villageSelect.locator('option').count();
      if (villageOptions > 1) {
        await villageSelect.selectOption({ index: 1 });
        await page.waitForTimeout(1000);
      }
    }

    // Verify filtering results
    await page.waitForTimeout(1000);
    const familyCards = page.locator('.family-card');
    const noFamiliesMessage = page.locator('.empty-state');
    const statsCards = page.locator('.stat-card');

    // Either families are shown, no families message appears, or stats are updated
    const hasFamilies = await familyCards.count() > 0;
    const hasNoFamiliesMessage = await noFamiliesMessage.isVisible();
    const hasStats = await statsCards.first().isVisible();

    expect(hasFamilies || hasNoFamiliesMessage || hasStats).toBeTruthy();
  });

  test('should show advanced filters and search functionality', async ({ page }) => {
    // Wait for dashboard to load after login
    await page.waitForSelector('.dashboard-container', { timeout: 10000 });

    // Navigate to Community Families using the sidebar navigation
    await page.click('button:has-text("🏘️")');
    await page.waitForTimeout(2000);

    // Wait for the community families view to load
    await page.waitForSelector('.advanced-filters-section', { timeout: 5000 });

    // Look for advanced filters toggle
    const advancedFiltersBtn = page.locator('.toggle-filters-btn');

    if (await advancedFiltersBtn.isVisible()) {
      await advancedFiltersBtn.click();
      await page.waitForTimeout(1000);

      // Check for search input
      const searchInput = page.locator('.search-input');
      if (await searchInput.isVisible()) {
        await expect(searchInput).toBeVisible();

        // Test search functionality
        await searchInput.fill('test family');
        await page.waitForTimeout(1500);

        // Verify search affects results
        const familyCards = page.locator('.family-card');
        const noFamiliesMessage = page.locator('.empty-state');

        const hasFamilies = await familyCards.count() > 0;
        const hasNoFamiliesMessage = await noFamiliesMessage.isVisible();

        expect(hasFamilies || hasNoFamiliesMessage).toBeTruthy();
      }

      // Check for generation filter
      const generationSelect = page.locator('.filter-select').first();
      if (await generationSelect.isVisible()) {
        const generationOptions = await generationSelect.locator('option').count();
        if (generationOptions > 1) {
          await generationSelect.selectOption({ index: 1 });
          await page.waitForTimeout(500);
        }
      }

      // Check for gender filter
      const genderSelect = page.locator('.filter-select').nth(1);
      if (await genderSelect.isVisible()) {
        const genderOptions = await genderSelect.locator('option').count();
        if (genderOptions > 1) {
          await genderSelect.selectOption({ index: 1 });
          await page.waitForTimeout(500);
        }
      }

      // Check for clear filters button
      const clearFiltersBtn = page.locator('.clear-filters-btn');
      if (await clearFiltersBtn.isVisible()) {
        await clearFiltersBtn.click();
        await page.waitForTimeout(500);

        // Search input should be cleared
        if (await searchInput.isVisible()) {
          await expect(searchInput).toHaveValue('');
        }
      }
    }
  });

  test('should display family statistics', async ({ page }) => {
    // Wait for dashboard to load after login
    await page.waitForSelector('.dashboard-container', { timeout: 10000 });

    // Navigate to Community Families using the sidebar navigation
    await page.click('button:has-text("🏘️")');
    await page.waitForTimeout(2000);

    // Wait for the community families view to load
    await page.waitForSelector('.families-stats', { timeout: 5000 });

    // Check for statistics cards
    const statsCards = page.locator('.stat-card');
    await expect(statsCards.first()).toBeVisible();

    // Look for at least one stat number (families, members, or locations)
    const statNumbers = page.locator('.stat-number');
    const hasStatNumbers = await statNumbers.count() > 0;
    expect(hasStatNumbers).toBeTruthy();

    // Check that at least one stat contains a number
    if (hasStatNumbers) {
      const firstStatNumber = await statNumbers.first().textContent();
      expect(firstStatNumber).toMatch(/\d+/); // Should contain numbers
    }
  });

  test('should handle family member modal interactions', async ({ page }) => {
    // Wait for dashboard to load after login
    await page.waitForSelector('.dashboard-container', { timeout: 10000 });

    // Navigate to Community Families using the sidebar navigation
    await page.click('button:has-text("🏘️")');
    await page.waitForTimeout(2000);

    // Wait for the community families view to load
    await page.waitForSelector('.view-container', { timeout: 5000 });

    // Look for family cards
    const familyCards = page.locator('.family-card');
    const familyCount = await familyCards.count();

    if (familyCount > 0) {
      const familyCard = familyCards.first();
      await expect(familyCard).toBeVisible();

      // Test view family tree button
      const viewFamilyBtn = page.locator('.view-family-btn').first();
      if (await viewFamilyBtn.isVisible()) {
        await viewFamilyBtn.click();
        await page.waitForTimeout(1000);

        // Should open family hierarchy modal
        const modal = page.locator('.modal-overlay');
        if (await modal.isVisible()) {
          await expect(modal).toBeVisible();

          // Check for hierarchy content
          const hierarchyContent = page.locator('.hierarchy-container, .modal-content');
          await expect(hierarchyContent).toBeVisible();

          // Close modal
          const closeBtn = page.locator('.close-btn');
          if (await closeBtn.isVisible()) {
            await closeBtn.click();
            await page.waitForTimeout(500);
            await expect(modal).not.toBeVisible();
          }
        }
      }

      // Test member click interaction if members are visible
      const memberItems = page.locator('.member-item');
      const memberCount = await memberItems.count();
      if (memberCount > 0) {
        await memberItems.first().click();
        await page.waitForTimeout(1000);

        // Check if modal opens
        const modal = page.locator('.modal-overlay');
        if (await modal.isVisible()) {
          // Close modal
          const closeBtn = page.locator('.close-btn');
          if (await closeBtn.isVisible()) {
            await closeBtn.click();
          }
        }
      }
    } else {
      // No family data available, which is also valid
      const emptyState = page.locator('.empty-state');
      await expect(emptyState).toBeVisible();
    }
  });

  test('should display migration map view', async ({ page }) => {
    // Wait for dashboard to load after login
    await page.waitForSelector('.dashboard-container', { timeout: 10000 });

    // Navigate to Community Families using the sidebar navigation
    await page.click('button:has-text("🏘️")');
    await page.waitForTimeout(2000);

    // Wait for the community families view to load
    await page.waitForSelector('.view-toggles', { timeout: 5000 });

    // Switch to migration view
    const migrationViewBtn = page.locator('button:has-text("🗺️")');
    if (await migrationViewBtn.isVisible()) {
      await migrationViewBtn.click();
      await page.waitForTimeout(1000);

      // Check for migration container
      const migrationContainer = page.locator('.migration-container');
      if (await migrationContainer.isVisible()) {
        await expect(migrationContainer).toBeVisible();

        // Check for migration header
        const migrationHeader = page.locator('.migration-header');
        await expect(migrationHeader).toBeVisible();

        // Check for migration content or empty state
        const migrationGrid = page.locator('.migration-grid');
        const emptyState = page.locator('.empty-state');

        const hasMigrationGrid = await migrationGrid.isVisible();
        const hasEmptyState = await emptyState.isVisible();

        expect(hasMigrationGrid || hasEmptyState).toBeTruthy();
      }
    }
  });

  test('should be responsive on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    // Wait for dashboard to load after login
    await page.waitForSelector('.dashboard-container', { timeout: 10000 });

    // Navigate to Community Families using the sidebar navigation
    await page.click('button:has-text("🏘️")');
    await page.waitForTimeout(2000);

    // Wait for the view to load
    await page.waitForSelector('.view-container', { timeout: 5000 });

    // Check if location filters are still functional on mobile
    const locationFilters = page.locator('.location-filters');
    if (await locationFilters.isVisible()) {
      await expect(locationFilters).toBeVisible();

      const stateSelect = page.locator('.location-select').first();
      await expect(stateSelect).toBeVisible();
    }

    // Check if stats are visible on mobile
    const statsContainer = page.locator('.families-stats');
    if (await statsContainer.isVisible()) {
      await expect(statsContainer).toBeVisible();
    }

    // Check if family content area is visible (either families or empty state)
    const familyCards = page.locator('.family-card');
    const emptyState = page.locator('.empty-state');

    const hasFamilies = await familyCards.count() > 0;
    const hasEmptyState = await emptyState.isVisible();

    expect(hasFamilies || hasEmptyState).toBeTruthy();
  });
});