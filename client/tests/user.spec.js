import { test, expect } from '@playwright/test';


test.describe('user flow', () => {

  // Credentials for user.
  let email;
  const given_names = "Test";
  const family_name = "User";
  const date_of_birth = "1980-05-24";
  const gender = "Male";
  const password = "thisisavalidpasswordA1!";
  const account_type = "user";

  test.beforeEach(async ({ page }) => {

    email = `testuser_${Date.now()}@example.com`;

    // Register
    await page.goto('/register');
    await page.check(`input[value=${account_type}]`);
    await page.fill('input[name="given_names"]', given_names);
    await page.fill('input[name="family_name"]', family_name);
    await page.fill('input[name="date_of_birth"]', date_of_birth);
    await page.click('#gender-required');
    await page.click(`li:has-text("${gender}")`);
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.fill('input[name="confirmPassword"]', password);
    await page.click('button:has-text("Create Account")');
    await expect(page.locator('text=Account Creation Successful')).toBeVisible();
    await page.click('button:has-text("Back to login")');
    await expect(page).toHaveURL(/login/);

    // Login
    await page.goto('/login');
    await page.waitForSelector('input[name="email"]');
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.click('button:has-text("Login")');
    await expect(page).toHaveURL(/landing/, { timeout: 10000 });
  });

  // Log test each test completion in group.
  test.afterEach(async ({ page }) => {
    console.log(`Finished ${test.info().title} with status ${test.info().status}`);

    if (test.info().status !== test.info().expectedStatus)
      console.log(`Did not run as expected, ended up at ${page.url()}`);
  });

  test.afterAll(async () => {
    console.log('Done with user tests.');
  });

  test('navigate dashboard', async ({ page }) => {
    await page.goto('/landing', { timeout: 10000 })
    await expect(page.locator('text=Health Overview')).toBeVisible();
  });

  // CORE USER E2E TESTS:
  test('health report generation and deletion', async ({ page }) => {
    // Test health report generation.
    await page.goto('/generate-report', { timeout: 10000 });
    await page.getByLabel('Weight (Kg)').fill('80');
    await page.getByLabel('Age').fill('30');
    await page.getByLabel('Height (cm)').fill('180');
    await page.getByLabel('Gender').click();
    await page.locator('[role="option"][data-value="Male"]').click();
    await page.getByLabel('Blood Glucose (mmol/L)').fill('5.5');
    await page.getByLabel('Systolic Blood Pressure (mmHg)').fill('120');
    await page.getByLabel('Diastolic Blood Pressure (mmHg)').fill('80');
    await page.getByLabel('Marital Status').click();
    await page.getByRole('option', { name: 'Single' }).click();
    await page.getByLabel('Working Status').click();
    await page.getByRole('option', { name: 'Private' }).click();
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page).toHaveURL(/ai-health-prediction/, { timeout: 10000 });

    // Test health analytics.
    await page.goto('/health-analytics', { timeout: 10000 })
    await expect(page.getByRole('heading', { name: 'Health Analytics' })).toBeVisible();
    await page.getByLabel('Stroke Probability').uncheck();

    // Test delete report.
    await page.goto('/ai-health-prediction', { timeout: 10000 })
    await page.getByRole('button', { name: 'delete' }).click();
    await expect(page.locator('text=Delete Report')).toBeVisible();
    await page.getByRole('button', { name: 'Delete' }).click();
  });

  test('delete account', async ({ page }) => {
    await page.goto('/user-settings', { timeout: 10000 })
    await page.getByRole('listitem').filter({ hasText: 'Account Details' }).click();
    await page.getByRole('button', { name: 'Delete My Account' }).click();
    await page.getByRole('button', { name: 'Delete' }).click();
    await expect(page).toHaveURL(/login/, { timeout: 10000 });
  });
});
