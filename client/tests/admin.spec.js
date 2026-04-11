import { test, expect } from '@playwright/test';


test.describe('admin flow', () => {

  // Credentials for admin.
  const email = "SHP_Admin@example.com";
  const password = "password12345678";

  test.beforeEach(async ({ page }) => {
    // Register a dummy user.
    await page.goto('/register');
    await page.check('input[value=user]');
    await page.fill('input[name="given_names"]', "Dummy");
    await page.fill('input[name="family_name"]', "User");
    await page.fill('input[name="date_of_birth"]', "1980-05-24");
    await page.click('#gender-required');
    await page.click(`li:has-text("Male")`);
    await page.fill('input[name="email"]', `testuser_${Date.now()}@example.com`);
    await page.fill('input[name="password"]', "thisisavalidpasswordA1!");
    await page.fill('input[name="confirmPassword"]', "thisisavalidpasswordA1!");
    await page.click('button:has-text("Create Account")');

    // Login
    await page.goto('/login');
    await page.waitForSelector('input[name="email"]');
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.click('button:has-text("Login")');
    await expect(page).toHaveURL(/admin-dashboard/, { timeout: 10000 });
  });

  // Log test each test completion in group.
  test.afterEach(async ({ page }) => {
    console.log(`Finished ${test.info().title} with status ${test.info().status}`);

    if (test.info().status !== test.info().expectedStatus)
      console.log(`Did not run as expected, ended up at ${page.url()}`);
  });

  test.afterAll(async () => {
    console.log('Done with admin tests.');
  });

  // CORE ADMIN E2E TESTS:
  test('search and delete user', async ({ page }) => {
    await page.goto('/admin-users');
    await page.getByPlaceholder('Search by name or email').fill('Dummy');
    const row = page.getByRole('row').nth(1);
    await expect(row).toBeVisible();
    await row.getByRole('checkbox').evaluate((e) => e.click());
    await expect(row.getByRole('checkbox')).toBeChecked();
    await page.getByRole('button', { name: 'Delete Selected' }).click();
    await expect(page.getByText('Confirm Deletion')).toBeVisible();
    await page.getByRole('button', { name: 'Delete' }).click();
  });

  test('filter audit logs', async ({ page }) => {
    await page.goto('/admin-audit-logs');
    await page.getByLabel('Search by Email').fill('Dummy');
    await page.getByRole('combobox', { name: 'Filter by Event Type' }).click();
    await page.locator('[role="option"][data-value="LOGIN"]').click();
  });
});
