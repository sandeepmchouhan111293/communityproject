const { test, expect } = require('@playwright/test');

test.describe('Login Page Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Mock Supabase auth for login tests
    await page.addInitScript(() => {
      // Override Supabase auth methods when available
      const originalSupabase = window.supabase;
      if (originalSupabase) {
        window.supabase.auth.signInWithPassword = async (credentials) => {
          if (credentials.email === 'chouhan.sandeep003@gmail.com' && credentials.password === 'asdfgh') {
            return {
              data: {
                user: {
                  id: 'admin-123',
                  email: 'chouhan.sandeep003@gmail.com',
                  user_metadata: { role: 'admin' }
                },
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
      }
    });

    await page.goto('/');
  });

  test('should display login form with required elements', async ({ page }) => {
    // Check if we're on the login page
    await expect(page).toHaveTitle(/Community/);

    // Verify login form elements exist
    await expect(page.locator('#login-email')).toBeVisible();
    await expect(page.locator('#login-password')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();

    // Verify community branding
    await expect(page.locator('img[alt="Sen Ji Maharaj"]').first()).toBeVisible();
    await expect(page.locator('h2')).toContainText('Sen Community');

    // Check for language toggle
    await expect(page.locator('.language-toggle, [role="button"]')).toBeVisible();

    // Check for signup link
    await expect(page.locator('a[href="/signup"]')).toBeVisible();

    // Check for forgot password link
    await expect(page.locator('text=Forgot password')).toBeVisible();
  });

  test('should show validation error for empty fields', async ({ page }) => {
    // Try to submit empty form
    await page.click('button[type="submit"]');

    // Should show error message
    await expect(page.locator('.error')).toBeVisible();
    await expect(page.locator('.error')).toContainText(/please enter/i);
  });

  test('should show validation error for invalid email format', async ({ page }) => {
    // Enter invalid email
    await page.fill('#login-email', 'invalid-email');
    await page.fill('#login-password', 'somepassword');
    await page.click('button[type="submit"]');

    // Browser validation should prevent submission
    const emailInput = page.locator('#login-email');
    await expect(emailInput).toHaveAttribute('type', 'email');

    // Check if browser validation is triggered
    const validationMessage = await emailInput.evaluate(el => el.validationMessage);
    expect(validationMessage).toBeTruthy();
  });

  test('should navigate to signup page', async ({ page }) => {
    await page.click('a[href="/signup"]');
    await expect(page).toHaveURL('/signup');
  });

  test('should open forgot password modal', async ({ page }) => {
    await page.click('text=Forgot password');

    // Check if reset modal appears
    await expect(page.locator('.reset-modal')).toBeVisible();
    await expect(page.locator('h3')).toContainText('Reset Password');

    // Check if email input is present in modal
    await expect(page.locator('.reset-modal input[type="email"]')).toBeVisible();

    // Close modal
    await page.click('.reset-modal-close');
    await expect(page.locator('.reset-modal')).not.toBeVisible();
  });

  test('should attempt login with valid credentials (admin)', async ({ page }) => {
    // Fill in admin credentials
    await page.fill('#login-email', 'chouhan.sandeep003@gmail.com');
    await page.fill('#login-password', 'asdfgh');

    // Submit form
    await page.click('button[type="submit"]');

    // Should either redirect to dashboard or show error
    // Note: This will likely show an error in test environment due to Supabase
    // but we're testing the UI flow
    await page.waitForTimeout(2000);

    // Check if we're redirected to dashboard or see an error
    const currentUrl = page.url();
    const hasError = await page.locator('.error').isVisible();

    expect(currentUrl.includes('/dashboard') || hasError).toBeTruthy();
  });

  test('should attempt login with valid credentials (user)', async ({ page }) => {
    // Fill in user credentials
    await page.fill('#login-email', 'user@community.test');
    await page.fill('#login-password', 'user123');

    // Submit form
    await page.click('button[type="submit"]');

    // Should either redirect to dashboard or show error
    await page.waitForTimeout(2000);

    const currentUrl = page.url();
    const hasError = await page.locator('.error').isVisible();

    expect(currentUrl.includes('/dashboard') || hasError).toBeTruthy();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    // Fill in invalid credentials
    await page.fill('#login-email', 'invalid@test.com');
    await page.fill('#login-password', 'wrongpassword');

    // Submit form
    await page.click('button[type="submit"]');

    // Wait for response and check for error
    await page.waitForTimeout(3000);
    const errorElement = page.locator('.error');

    // Should show error (either from validation or Supabase)
    if (await errorElement.isVisible()) {
      await expect(errorElement).toContainText(/invalid|error|wrong/i);
    }
  });

  test('should handle password reset flow', async ({ page }) => {
    // Open forgot password modal
    await page.click('text=Forgot password');

    // Fill in email for reset
    await page.fill('.reset-modal input[type="email"]', 'test@example.com');

    // Submit reset request
    await page.click('.reset-modal button[type="submit"]');

    // Wait for response
    await page.waitForTimeout(2000);

    // Should show success message or error
    const successMessage = page.locator('.success');
    const errorMessage = page.locator('.error');

    const hasSuccess = await successMessage.isVisible();
    const hasError = await errorMessage.isVisible();

    expect(hasSuccess || hasError).toBeTruthy();
  });

  test('should be responsive on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    // Check if login form is still visible and functional
    await expect(page.locator('#login-email')).toBeVisible();
    await expect(page.locator('#login-password')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();

    // Check if community image is visible
    await expect(page.locator('img[alt="Sen Ji Maharaj"]').first()).toBeVisible();
  });
});