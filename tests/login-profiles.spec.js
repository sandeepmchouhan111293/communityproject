const { test, expect } = require('@playwright/test');

test.describe('Login and Profile Tests', () => {

  // Admin login helper function
  async function loginAsAdmin(page) {
    await page.goto('/login');
    await page.fill('#login-email', 'chouhan.sandeep003@gmail.com');
    await page.fill('#login-password', 'asdfgh');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000);
  }

  // Member login helper function (using same credentials for now)
  async function loginAsMember(page) {
    await page.goto('/login');
    await page.fill('#login-email', 'chouhan.sandeep003@gmail.com');
    await page.fill('#login-password', 'asdfgh');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000);
  }

  test.beforeEach(async ({ page }) => {
    // Mock Supabase auth for both admin and member scenarios
    await page.addInitScript(() => {
      // Override Supabase auth methods
      if (window.supabase) {
        window.supabase.auth.signInWithPassword = async (credentials) => {
          if (credentials.email === 'chouhan.sandeep003@gmail.com' && credentials.password === 'asdfgh') {
            return {
              data: {
                user: {
                  id: 'admin-123',
                  email: 'chouhan.sandeep003@gmail.com',
                  user_metadata: {
                    role: 'admin',
                    full_name: 'Admin User'
                  }
                },
                session: { access_token: 'mock-admin-token' }
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
            data: {
              user: {
                id: 'admin-123',
                email: 'chouhan.sandeep003@gmail.com',
                user_metadata: {
                  role: 'admin',
                  full_name: 'Admin User'
                }
              }
            },
            error: null
          };
        };
      }
    });
  });

  test.describe('Login Form Tests', () => {
    test('should display login form with all required elements', async ({ page }) => {
      await page.goto('/');

      // Check if we're on the login page
      await expect(page).toHaveTitle(/Community/);

      // Verify login form elements exist
      await expect(page.locator('#login-email')).toBeVisible();
      await expect(page.locator('#login-password')).toBeVisible();
      await expect(page.locator('button[type="submit"]')).toBeVisible();

      // Verify community branding
      await expect(page.locator('img[alt="Sen Ji Maharaj"]').first()).toBeVisible();
      const titleElement = page.locator('h2');
      if (await titleElement.count() > 0) {
        await expect(titleElement).toContainText('Community');
      }

      // Check for language toggle
      const languageToggle = page.locator('.language-toggle, [role="button"]');
      if (await languageToggle.count() > 0) {
        await expect(languageToggle.first()).toBeVisible();
      }

      // Check for signup link
      const signupLink = page.locator('a[href="/signup"]');
      if (await signupLink.count() > 0) {
        await expect(signupLink).toBeVisible();
      }

      // Check for forgot password link
      const forgotPasswordLink = page.locator('text=Forgot password');
      if (await forgotPasswordLink.count() > 0) {
        await expect(forgotPasswordLink).toBeVisible();
      }
    });

    test('should show validation errors for empty fields', async ({ page }) => {
      await page.goto('/');

      // Try to submit empty form
      await page.click('button[type="submit"]');
      await page.waitForTimeout(1000);

      // Check for HTML5 validation or custom error messages
      const emailInput = page.locator('#login-email');
      const passwordInput = page.locator('#login-password');

      const emailValidation = await emailInput.evaluate(el => el.validationMessage);
      const passwordValidation = await passwordInput.evaluate(el => el.validationMessage);

      // At least one should have validation message since they are required
      expect(emailValidation || passwordValidation).toBeTruthy();
    });

    test('should show validation error for invalid email format', async ({ page }) => {
      await page.goto('/');

      // Enter invalid email format
      await page.fill('#login-email', 'invalid-email-format');
      await page.fill('#login-password', 'somepassword');
      await page.click('button[type="submit"]');
      await page.waitForTimeout(1000);

      // Browser validation should prevent submission
      const emailInput = page.locator('#login-email');
      await expect(emailInput).toHaveAttribute('type', 'email');

      // Check if browser validation is triggered
      const validationMessage = await emailInput.evaluate(el => el.validationMessage);
      expect(validationMessage).toBeTruthy();
    });

    test('should show error for invalid credentials', async ({ page }) => {
      await page.goto('/');

      // Fill in invalid credentials
      await page.fill('#login-email', 'invalid@test.com');
      await page.fill('#login-password', 'wrongpassword');

      // Submit form
      await page.click('button[type="submit"]');
      await page.waitForTimeout(3000);

      // Should show error (either from validation or Supabase)
      const errorElement = page.locator('.error');
      const currentUrl = page.url();

      // Either should show error message or stay on login page
      if (await errorElement.isVisible()) {
        await expect(errorElement).toContainText(/invalid|error|wrong/i);
      } else {
        // Should not be redirected to dashboard with invalid credentials
        expect(currentUrl).not.toContain('/dashboard');
      }
    });
  });

  test.describe('Admin Login Tests', () => {
    test('should successfully login as admin', async ({ page }) => {
      // Login as admin
      await loginAsAdmin(page);

      // Should be redirected to dashboard
      await page.waitForSelector('.dashboard-container', { timeout: 10000 });

      // Verify we're on the dashboard
      const currentUrl = page.url();
      expect(currentUrl).toContain('/dashboard');

      // Verify dashboard elements are visible
      await expect(page.locator('.dashboard-container')).toBeVisible();
      await expect(page.locator('.sidebar')).toBeVisible();
      await expect(page.locator('.nav-menu')).toBeVisible();
    });

    test('should display admin user information correctly', async ({ page }) => {
      await loginAsAdmin(page);
      await page.waitForSelector('.dashboard-container', { timeout: 10000 });

      // Check user info section
      const userInfo = page.locator('.user-info');
      await expect(userInfo).toBeVisible();

      // Check user email
      const userEmail = page.locator('.user-email');
      if (await userEmail.isVisible()) {
        const emailText = await userEmail.textContent();
        expect(emailText).toContain('chouhan.sandeep003@gmail.com');
      }

      // Check user name (if displayed)
      const userName = page.locator('.user-name');
      if (await userName.isVisible()) {
        await expect(userName).toBeVisible();
      }
    });

    test('should show all admin navigation options', async ({ page }) => {
      await loginAsAdmin(page);
      await page.waitForSelector('.dashboard-container', { timeout: 10000 });

      // Admin should have access to all navigation items
      const navButtons = page.locator('.nav-menu button');
      const buttonCount = await navButtons.count();

      // Admin should see multiple navigation items (at least 6)
      expect(buttonCount).toBeGreaterThan(5);

      // Check specific admin-accessible navigation items
      const adminNavItems = [
        '🏠', // Home
        '👤', // Profile
        '🌳', // Family Tree
        '🏘️', // Community Families
        '📅', // Events
        '📁', // Documents
        '📖', // Directory
        '⚙️'  // Settings
      ];

      for (const icon of adminNavItems) {
        const navItem = page.locator(`.nav-menu button:has-text("${icon}")`);
        if (await navItem.count() > 0) {
          await expect(navItem).toBeVisible();
          await expect(navItem).not.toBeDisabled();
        }
      }
    });

    test('should allow admin to access admin-specific features', async ({ page }) => {
      await loginAsAdmin(page);
      await page.waitForSelector('.dashboard-container', { timeout: 10000 });

      // Navigate to Documents section
      await page.click('.nav-menu button:has-text("📁")');
      await page.waitForTimeout(1000);
      await page.waitForSelector('.view-container', { timeout: 5000 });

      // Admin should be able to add documents
      const addDocumentBtn = page.locator('.document-add-btn');
      await expect(addDocumentBtn).toBeVisible();
      await expect(addDocumentBtn).not.toBeDisabled();

      // Test clicking add document
      await addDocumentBtn.click();
      await page.waitForTimeout(1000);

      // Should navigate to add document form
      await page.waitForSelector('.add-document-container', { timeout: 5000 });
      await expect(page.locator('.add-document-title')).toBeVisible();
    });

    test('should allow admin to access profile and edit settings', async ({ page }) => {
      await loginAsAdmin(page);
      await page.waitForSelector('.dashboard-container', { timeout: 10000 });

      // Navigate to Profile section
      await page.click('.nav-menu button:has-text("👤")');
      await page.waitForTimeout(1000);
      await page.waitForSelector('.view-container', { timeout: 5000 });

      // Profile view should be accessible
      const profileContent = page.locator('.view-container');
      await expect(profileContent).toBeVisible();

      // Check for profile form or user information
      const profileForm = page.locator('.profile-form, .user-profile, form');
      const profileInfo = page.locator('.profile-info, .user-info');

      const hasProfileForm = await profileForm.count() > 0;
      const hasProfileInfo = await profileInfo.count() > 0;

      expect(hasProfileForm || hasProfileInfo).toBeTruthy();
    });
  });

  test.describe('Member Login Tests', () => {
    test.beforeEach(async ({ page }) => {
      // Override auth mock for member role
      await page.addInitScript(() => {
        if (window.supabase) {
          window.supabase.auth.signInWithPassword = async (credentials) => {
            if (credentials.email === 'chouhan.sandeep003@gmail.com' && credentials.password === 'asdfgh') {
              return {
                data: {
                  user: {
                    id: 'member-123',
                    email: 'chouhan.sandeep003@gmail.com',
                    user_metadata: {
                      role: 'member',
                      full_name: 'Member User'
                    }
                  },
                  session: { access_token: 'mock-member-token' }
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
              data: {
                user: {
                  id: 'member-123',
                  email: 'chouhan.sandeep003@gmail.com',
                  user_metadata: {
                    role: 'member',
                    full_name: 'Member User'
                  }
                }
              },
              error: null
            };
          };
        }
      });
    });

    test('should successfully login as member', async ({ page }) => {
      // Login as member
      await loginAsMember(page);

      // Should be redirected to dashboard
      await page.waitForSelector('.dashboard-container', { timeout: 10000 });

      // Verify we're on the dashboard
      const currentUrl = page.url();
      expect(currentUrl).toContain('/dashboard');

      // Verify dashboard elements are visible
      await expect(page.locator('.dashboard-container')).toBeVisible();
      await expect(page.locator('.sidebar')).toBeVisible();
      await expect(page.locator('.nav-menu')).toBeVisible();
    });

    test('should display member user information correctly', async ({ page }) => {
      await loginAsMember(page);
      await page.waitForSelector('.dashboard-container', { timeout: 10000 });

      // Check user info section
      const userInfo = page.locator('.user-info');
      await expect(userInfo).toBeVisible();

      // Check user email
      const userEmail = page.locator('.user-email');
      if (await userEmail.isVisible()) {
        const emailText = await userEmail.textContent();
        expect(emailText).toContain('chouhan.sandeep003@gmail.com');
      }

      // Check user name (if displayed)
      const userName = page.locator('.user-name');
      if (await userName.isVisible()) {
        await expect(userName).toBeVisible();
      }
    });

    test('should show member navigation options', async ({ page }) => {
      await loginAsMember(page);
      await page.waitForSelector('.dashboard-container', { timeout: 10000 });

      // Member should have access to basic navigation items
      const navButtons = page.locator('.nav-menu button');
      const buttonCount = await navButtons.count();

      // Member should see basic navigation items (at least 4)
      expect(buttonCount).toBeGreaterThan(3);

      // Check basic member-accessible navigation items
      const memberNavItems = [
        '🏠', // Home
        '👤', // Profile
        '🌳', // Family Tree
        '🏘️'  // Community Families
      ];

      for (const icon of memberNavItems) {
        const navItem = page.locator(`.nav-menu button:has-text("${icon}")`);
        if (await navItem.count() > 0) {
          await expect(navItem).toBeVisible();
          await expect(navItem).not.toBeDisabled();
        }
      }
    });

    test('should allow member to access profile but with limited admin features', async ({ page }) => {
      await loginAsMember(page);
      await page.waitForSelector('.dashboard-container', { timeout: 10000 });

      // Navigate to Profile section
      await page.click('.nav-menu button:has-text("👤")');
      await page.waitForTimeout(1000);
      await page.waitForSelector('.view-container', { timeout: 5000 });

      // Profile view should be accessible
      const profileContent = page.locator('.view-container');
      await expect(profileContent).toBeVisible();

      // Check for profile form or user information
      const profileForm = page.locator('.profile-form, .user-profile, form');
      const profileInfo = page.locator('.profile-info, .user-info');

      const hasProfileForm = await profileForm.count() > 0;
      const hasProfileInfo = await profileInfo.count() > 0;

      expect(hasProfileForm || hasProfileInfo).toBeTruthy();
    });

    test('should allow member to view but restrict admin functions in documents', async ({ page }) => {
      await loginAsMember(page);
      await page.waitForSelector('.dashboard-container', { timeout: 10000 });

      // Navigate to Documents section (if available for members)
      const documentsNav = page.locator('.nav-menu button:has-text("📁")');
      if (await documentsNav.count() > 0) {
        await documentsNav.click();
        await page.waitForTimeout(1000);
        await page.waitForSelector('.view-container', { timeout: 5000 });

        // Documents view should be accessible for viewing
        const documentsContent = page.locator('.view-container');
        await expect(documentsContent).toBeVisible();

        // Check if add document button is restricted (should be hidden or disabled for members)
        const addDocumentBtn = page.locator('.document-add-btn');
        if (await addDocumentBtn.count() > 0) {
          // If visible, it should be disabled for members
          const isDisabled = await addDocumentBtn.isDisabled();
          expect(isDisabled).toBeTruthy();
        }
        // If not visible, that's also correct behavior for member access control
      }
    });

    test('should allow member to view family tree with appropriate permissions', async ({ page }) => {
      await loginAsMember(page);
      await page.waitForSelector('.dashboard-container', { timeout: 10000 });

      // Navigate to Family Tree section
      await page.click('.nav-menu button:has-text("🌳")');
      await page.waitForTimeout(1000);
      await page.waitForSelector('.view-container', { timeout: 5000 });

      // Family Tree view should be accessible
      const familyTreeContent = page.locator('.view-container');
      await expect(familyTreeContent).toBeVisible();

      // Members should be able to view family tree
      const addFamilyBtn = page.locator('button:has-text("Add Family Member")');

      // Members might have limited add capabilities or full access depending on business rules
      if (await addFamilyBtn.count() > 0) {
        await expect(addFamilyBtn).toBeVisible();
      }

      // Check for family member cards or empty state
      const memberCards = page.locator('.family-member-card, .member-card');
      const emptyState = page.locator('.empty-state');

      const hasMembers = await memberCards.count() > 0;
      const hasEmptyState = await emptyState.isVisible();
      const hasAddBtn = await addFamilyBtn.count() > 0;

      expect(hasMembers || hasEmptyState || hasAddBtn).toBeTruthy();
    });
  });

  test.describe('Logout Tests', () => {
    test('should successfully logout admin user', async ({ page }) => {
      // Login first
      await loginAsAdmin(page);
      await page.waitForSelector('.dashboard-container', { timeout: 10000 });

      // Click logout button
      const logoutBtn = page.locator('.logout-btn, button:has-text("Logout"), button:has-text("🚪")');
      await expect(logoutBtn).toBeVisible();
      await logoutBtn.click();
      await page.waitForTimeout(2000);

      // Should be redirected to login page
      const currentUrl = page.url();
      const isOnLoginPage = currentUrl.includes('/login') || currentUrl === 'http://localhost:3000/';
      const hasLoginForm = await page.locator('#login-email').isVisible();

      expect(isOnLoginPage || hasLoginForm).toBeTruthy();

      // Should not be able to access dashboard after logout
      if (hasLoginForm) {
        await expect(page.locator('#login-email')).toBeVisible();
        await expect(page.locator('#login-password')).toBeVisible();
      }
    });

    test('should successfully logout member user', async ({ page }) => {
      // Override for member
      await page.addInitScript(() => {
        if (window.supabase) {
          window.supabase.auth.signInWithPassword = async (credentials) => {
            if (credentials.email === 'chouhan.sandeep003@gmail.com' && credentials.password === 'asdfgh') {
              return {
                data: {
                  user: {
                    id: 'member-123',
                    email: 'chouhan.sandeep003@gmail.com',
                    user_metadata: { role: 'member' }
                  },
                  session: { access_token: 'mock-member-token' }
                },
                error: null
              };
            }
            return { data: null, error: { message: 'Invalid login credentials' } };
          };
        }
      });

      // Login first
      await loginAsMember(page);
      await page.waitForSelector('.dashboard-container', { timeout: 10000 });

      // Click logout button
      const logoutBtn = page.locator('.logout-btn, button:has-text("Logout"), button:has-text("🚪")');
      await expect(logoutBtn).toBeVisible();
      await logoutBtn.click();
      await page.waitForTimeout(2000);

      // Should be redirected to login page
      const currentUrl = page.url();
      const isOnLoginPage = currentUrl.includes('/login') || currentUrl === 'http://localhost:3000/';
      const hasLoginForm = await page.locator('#login-email').isVisible();

      expect(isOnLoginPage || hasLoginForm).toBeTruthy();

      // Should see login form elements
      if (hasLoginForm) {
        await expect(page.locator('#login-email')).toBeVisible();
        await expect(page.locator('#login-password')).toBeVisible();
      }
    });
  });

  test.describe('Password Reset Tests', () => {
    test('should display password reset modal', async ({ page }) => {
      await page.goto('/');

      // Click forgot password link
      const forgotPasswordLink = page.locator('text=Forgot password');
      if (await forgotPasswordLink.count() > 0) {
        await forgotPasswordLink.click();
        await page.waitForTimeout(500);

        // Check if reset modal appears
        const resetModal = page.locator('.reset-modal, .modal-overlay');
        if (await resetModal.count() > 0) {
          await expect(resetModal).toBeVisible();

          // Check if modal has reset form elements
          const resetEmailInput = page.locator('.reset-modal input[type="email"], input[type="email"]');
          if (await resetEmailInput.count() > 0) {
            await expect(resetEmailInput).toBeVisible();
          }

          // Test close modal functionality
          const closeBtn = page.locator('.reset-modal-close, .close-btn, button:has-text("✕")');
          if (await closeBtn.count() > 0) {
            await closeBtn.click();
            await page.waitForTimeout(500);
            await expect(resetModal).not.toBeVisible();
          }
        }
      }
    });

    test('should handle password reset request', async ({ page }) => {
      await page.goto('/');

      const forgotPasswordLink = page.locator('text=Forgot password');
      if (await forgotPasswordLink.count() > 0) {
        await forgotPasswordLink.click();
        await page.waitForTimeout(500);

        const resetModal = page.locator('.reset-modal');
        if (await resetModal.count() > 0) {
          // Fill in email for reset
          const resetEmailInput = page.locator('.reset-modal input[type="email"]');
          if (await resetEmailInput.count() > 0) {
            await resetEmailInput.fill('test@example.com');

            // Submit reset request
            const resetSubmitBtn = page.locator('.reset-modal button[type="submit"]');
            if (await resetSubmitBtn.count() > 0) {
              await resetSubmitBtn.click();
              await page.waitForTimeout(2000);

              // Should show success message or error
              const successMessage = page.locator('.success');
              const errorMessage = page.locator('.error');

              const hasSuccess = await successMessage.count() > 0 && await successMessage.isVisible();
              const hasError = await errorMessage.count() > 0 && await errorMessage.isVisible();

              expect(hasSuccess || hasError).toBeTruthy();
            }
          }
        }
      }
    });
  });

  test.describe('Responsive Login Tests', () => {
    test('should display login form correctly on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');

      // Check if login form is still visible and functional on mobile
      await expect(page.locator('#login-email')).toBeVisible();
      await expect(page.locator('#login-password')).toBeVisible();
      await expect(page.locator('button[type="submit"]')).toBeVisible();

      // Check if community image is visible on mobile
      const communityImage = page.locator('img[alt="Sen Ji Maharaj"]').first();
      if (await communityImage.count() > 0) {
        await expect(communityImage).toBeVisible();
      }

      // Test that login functionality works on mobile
      await page.fill('#login-email', 'chouhan.sandeep003@gmail.com');
      await page.fill('#login-password', 'asdfgh');
      await page.click('button[type="submit"]');
      await page.waitForTimeout(3000);

      // Should redirect to dashboard
      await page.waitForSelector('.dashboard-container', { timeout: 10000 });
      await expect(page.locator('.dashboard-container')).toBeVisible();
    });
  });
});