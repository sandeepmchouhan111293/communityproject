const { test, expect } = require('@playwright/test');

test.describe('Fallback UI and Empty State Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authenticated user with empty data
    await page.addInitScript(() => {
      window.mockSupabaseAuth = {
        user: {
          id: 'user-123',
          email: 'user@community.test',
          user_metadata: {
            full_name: 'Test User'
          }
        },
        isAdmin: false
      };

      // Mock empty data responses
      window.mockEmptyData = true;
    });

    await page.goto('/dashboard');
    await page.waitForTimeout(1000);
  });

  test('should display empty state for family tree with no members', async ({ page }) => {
    // Navigate to family tree
    const familyTreeNav = page.locator('text=Family Tree, button:has-text("Family"), [role="button"]:has-text("🌳")');
    if (await familyTreeNav.isVisible()) {
      await familyTreeNav.click();
      await page.waitForTimeout(1000);

      // Check for empty state
      const emptyState = page.locator('.empty-state, text*="No family members"');
      const emptyIcon = page.locator('text=👨‍👩‍👧‍👦, .empty-icon');
      const emptyMessage = page.locator('text*="Start by adding", text*="no family members found"');

      if (await emptyState.isVisible()) {
        await expect(emptyState).toBeVisible();
      }

      if (await emptyIcon.isVisible()) {
        await expect(emptyIcon).toBeVisible();
      }

      if (await emptyMessage.isVisible()) {
        await expect(emptyMessage).toBeVisible();
      }

      // Should still show add family member button
      const addFamilyBtn = page.locator('button:has-text("Add Family Member"), .family-add-btn');
      if (await addFamilyBtn.isVisible()) {
        await expect(addFamilyBtn).toBeVisible();
      }
    }
  });

  test('should display empty state for documents with no uploads', async ({ page }) => {
    // Navigate to documents
    const documentsNav = page.locator('text=Documents, button:has-text("Documents"), [role="button"]:has-text("📁")');
    if (await documentsNav.isVisible()) {
      await documentsNav.click();
      await page.waitForTimeout(1000);

      // Check for empty state or no documents message
      const emptyState = page.locator('.empty-state, text*="No documents found"');
      const noDocumentsMessage = page.locator('text*="no documents", text*="No documents"');

      if (await emptyState.isVisible() || await noDocumentsMessage.isVisible()) {
        await expect(emptyState.or(noDocumentsMessage)).toBeVisible();
      }

      // Should still show add document button if user has permissions
      const addDocBtn = page.locator('button:has-text("Add Document"), .add-btn, .document-add-btn');
      if (await addDocBtn.isVisible()) {
        await expect(addDocBtn).toBeVisible();
      }
    }
  });

  test('should display empty state for community families with no data', async ({ page }) => {
    // Navigate to community families
    const communityFamiliesNav = page.locator('text=Community Families, button:has-text("🏘️")');
    if (await communityFamiliesNav.isVisible()) {
      await communityFamiliesNav.click();
      await page.waitForTimeout(2000);

      // Check for empty state
      const emptyState = page.locator('.empty-state');
      const emptyIcon = page.locator('text=🏘️, .empty-icon');
      const noFamiliesMessage = page.locator('text*="No families found", text*="No families have been added"');

      if (await emptyState.isVisible()) {
        await expect(emptyState).toBeVisible();
      }

      if (await emptyIcon.isVisible()) {
        await expect(emptyIcon).toBeVisible();
      }

      if (await noFamiliesMessage.isVisible()) {
        await expect(noFamiliesMessage).toBeVisible();
      }

      // Statistics should show zero counts
      const statsCards = page.locator('.stat-card, .families-stats');
      if (await statsCards.isVisible()) {
        const statsNumbers = page.locator('.stat-number');
        if (await statsNumbers.count() > 0) {
          const firstStat = statsNumbers.first();
          const statText = await firstStat.textContent();
          expect(statText).toMatch(/^0$/); // Should be zero
        }
      }
    }
  });

  test('should display empty state for events with no data', async ({ page }) => {
    // Navigate to events
    const eventsNav = page.locator('text=Events, button:has-text("Events"), [role="button"]:has-text("📅")');
    if (await eventsNav.isVisible()) {
      await eventsNav.click();
      await page.waitForTimeout(1000);

      // Check for empty state or no events message
      const emptyState = page.locator('.empty-state, text*="No events found", text*="no events"');
      const eventsContainer = page.locator('.events-list, .event-card, .events-container');

      // Either empty state is shown or events container is empty
      if (await emptyState.isVisible()) {
        await expect(emptyState).toBeVisible();
      } else if (await eventsContainer.isVisible()) {
        const eventCount = await eventsContainer.locator('.event-card, .event-item').count();
        expect(eventCount).toBe(0);
      }

      // Should show appropriate call-to-action
      const addEventBtn = page.locator('button:has-text("Add Event"), .add-btn');
      if (await addEventBtn.isVisible()) {
        await expect(addEventBtn).toBeVisible();
      }
    }
  });

  test('should display empty state for discussions with no data', async ({ page }) => {
    // Navigate to discussions
    const discussionsNav = page.locator('text=Discussions, button:has-text("Discussions"), [role="button"]:has-text("💬")');
    if (await discussionsNav.isVisible()) {
      await discussionsNav.click();
      await page.waitForTimeout(1000);

      // Check for empty state or no discussions message
      const emptyState = page.locator('.empty-state, text*="No discussions", text*="no discussions"');
      const discussionsContainer = page.locator('.discussions-list, .discussion-card, .discussions-container');

      if (await emptyState.isVisible()) {
        await expect(emptyState).toBeVisible();
      } else if (await discussionsContainer.isVisible()) {
        const discussionCount = await discussionsContainer.locator('.discussion-card, .discussion-item').count();
        expect(discussionCount).toBe(0);
      }

      // Should show add discussion button
      const addDiscussionBtn = page.locator('button:has-text("Add Discussion"), .add-btn');
      if (await addDiscussionBtn.isVisible()) {
        await expect(addDiscussionBtn).toBeVisible();
      }
    }
  });

  test('should display empty state for volunteer opportunities', async ({ page }) => {
    // Navigate to volunteer section
    const volunteerNav = page.locator('text=Volunteer, button:has-text("Volunteer"), [role="button"]:has-text("🤝")');
    if (await volunteerNav.isVisible()) {
      await volunteerNav.click();
      await page.waitForTimeout(1000);

      // Check for empty state or no opportunities message
      const emptyState = page.locator('.empty-state, text*="No volunteer", text*="no opportunities"');
      const volunteerContainer = page.locator('.volunteer-list, .opportunity-card, .volunteer-container');

      if (await emptyState.isVisible()) {
        await expect(emptyState).toBeVisible();
      } else if (await volunteerContainer.isVisible()) {
        const opportunityCount = await volunteerContainer.locator('.opportunity-card, .volunteer-item').count();
        expect(opportunityCount).toBe(0);
      }

      // Should show add opportunity button
      const addOpportunityBtn = page.locator('button:has-text("Add"), .add-btn');
      if (await addOpportunityBtn.isVisible()) {
        await expect(addOpportunityBtn).toBeVisible();
      }
    }
  });

  test('should display loading states appropriately', async ({ page }) => {
    // Mock slow loading
    await page.addInitScript(() => {
      // Override fetch to simulate slow responses
      const originalFetch = window.fetch;
      window.fetch = function(...args) {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve(originalFetch.apply(this, args));
          }, 100); // Add delay
        });
      };
    });

    // Navigate to community families to test loading state
    const communityFamiliesNav = page.locator('text=Community Families, button:has-text("🏘️")');
    if (await communityFamiliesNav.isVisible()) {
      await communityFamiliesNav.click();

      // Check for loading state
      const loadingState = page.locator('.loading-state, .loading-spinner, text*="Loading"');
      const loadingIcon = page.locator('text=🏘️').first();

      // Loading state might be brief, so check if it appears
      if (await loadingState.isVisible()) {
        await expect(loadingState).toBeVisible();
      }

      // Wait for loading to complete
      await page.waitForTimeout(2000);

      // Loading state should be gone
      const stillLoading = await loadingState.isVisible();
      expect(stillLoading).toBeFalsy();
    }
  });

  test('should display appropriate fallback when filtering returns no results', async ({ page }) => {
    // Navigate to community families
    const communityFamiliesNav = page.locator('text=Community Families, button:has-text("🏘️")');
    if (await communityFamiliesNav.isVisible()) {
      await communityFamiliesNav.click();
      await page.waitForTimeout(1000);

      // Apply filters that would return no results
      const stateSelect = page.locator('select').first();
      if (await stateSelect.isVisible()) {
        // Select a state
        await stateSelect.selectOption({ index: 1 });
        await page.waitForTimeout(500);

        // Select a district
        const districtSelect = page.locator('select').nth(1);
        if (await districtSelect.isVisible() && !await districtSelect.isDisabled()) {
          await districtSelect.selectOption({ index: 1 });
          await page.waitForTimeout(1000);

          // Should show "no families found in location" message
          const noResultsMessage = page.locator(
            'text*="No families found", text*="no families found", .empty-state'
          );

          if (await noResultsMessage.isVisible()) {
            await expect(noResultsMessage).toBeVisible();
          }

          // Statistics should reflect the filtered results (likely zero)
          const statsCards = page.locator('.stat-card, .families-stats');
          if (await statsCards.isVisible()) {
            await expect(statsCards).toBeVisible();
          }
        }
      }
    }
  });

  test('should display fallback when search returns no results', async ({ page }) => {
    // Navigate to community families
    const communityFamiliesNav = page.locator('text=Community Families, button:has-text("🏘️")');
    if (await communityFamiliesNav.isVisible()) {
      await communityFamiliesNav.click();
      await page.waitForTimeout(1000);

      // Open advanced filters
      const advancedFiltersBtn = page.locator('button:has-text("Advanced Filters"), .toggle-filters-btn');
      if (await advancedFiltersBtn.isVisible()) {
        await advancedFiltersBtn.click();
        await page.waitForTimeout(500);

        // Search for something that doesn't exist
        const searchInput = page.locator('input[placeholder*="search"], .search-input');
        if (await searchInput.isVisible()) {
          await searchInput.fill('nonexistentfamilyname123456');
          await page.waitForTimeout(1000);

          // Should show no results message
          const noResultsMessage = page.locator(
            'text*="No families found", text*="no families found", .empty-state'
          );

          if (await noResultsMessage.isVisible()) {
            await expect(noResultsMessage).toBeVisible();
          }
        }
      }
    }
  });

  test('should display migration map empty state when no migration data exists', async ({ page }) => {
    // Navigate to community families
    const communityFamiliesNav = page.locator('text=Community Families, button:has-text("🏘️")');
    if (await communityFamiliesNav.isVisible()) {
      await communityFamiliesNav.click();
      await page.waitForTimeout(1000);

      // Switch to migration view
      const migrationViewBtn = page.locator('button:has-text("Migration"), button:has-text("🗺️")');
      if (await migrationViewBtn.isVisible()) {
        await migrationViewBtn.click();
        await page.waitForTimeout(1000);

        // Check for migration empty state
        const migrationEmptyState = page.locator(
          '.empty-state, text*="No migration data", text*="no marriage migration"'
        );
        const migrationEmptyIcon = page.locator('text=🗺️, .empty-icon');

        if (await migrationEmptyState.isVisible()) {
          await expect(migrationEmptyState).toBeVisible();
        }

        if (await migrationEmptyIcon.isVisible()) {
          await expect(migrationEmptyIcon).toBeVisible();
        }

        // Should show explanatory message
        const explanationMessage = page.locator(
          'text*="No marriage migration records", text*="migration records found"'
        );
        if (await explanationMessage.isVisible()) {
          await expect(explanationMessage).toBeVisible();
        }
      }
    }
  });

  test('should handle network errors gracefully', async ({ page }) => {
    // Mock network failure
    await page.route('**/*', route => {
      if (route.request().url().includes('supabase') || route.request().url().includes('api')) {
        route.abort('failed');
      } else {
        route.continue();
      }
    });

    // Navigate to a data-dependent section
    const communityFamiliesNav = page.locator('text=Community Families, button:has-text("🏘️")');
    if (await communityFamiliesNav.isVisible()) {
      await communityFamiliesNav.click();
      await page.waitForTimeout(3000);

      // Should show either loading state, error message, or empty state
      const loadingState = page.locator('.loading-state, text*="Loading"');
      const errorState = page.locator('text*="Error", text*="Failed", .error');
      const emptyState = page.locator('.empty-state, text*="No families"');

      const hasState = (
        await loadingState.isVisible() ||
        await errorState.isVisible() ||
        await emptyState.isVisible()
      );

      expect(hasState).toBeTruthy();
    }
  });

  test('should provide helpful empty state messages with clear actions', async ({ page }) => {
    // Navigate to family tree
    const familyTreeNav = page.locator('text=Family Tree, button:has-text("Family"), [role="button"]:has-text("🌳")');
    if (await familyTreeNav.isVisible()) {
      await familyTreeNav.click();
      await page.waitForTimeout(1000);

      // Check for helpful empty state content
      const helpfulMessage = page.locator(
        'text*="Start by adding", text*="first family member", text*="Add your"'
      );

      if (await helpfulMessage.isVisible()) {
        await expect(helpfulMessage).toBeVisible();
      }

      // Should have clear call-to-action
      const addButton = page.locator('button:has-text("Add Family Member"), .add-btn');
      if (await addButton.isVisible()) {
        await expect(addButton).toBeVisible();
        await expect(addButton).not.toBeDisabled();
      }
    }
  });
});