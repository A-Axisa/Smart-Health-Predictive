import { test, expect } from '@playwright/test';


test.describe('merchant flow', () => {

  // Credentials for merchant.
  let email;
  const clinic = "MyMock Health Center";
  const password = "thisisavalidpasswordA1!";
  const account_type = "merchant";

  test.beforeEach(async ({ page }) => {

    email = `testmerchant_${Date.now()}@example.com`;

    // Register
    await page.goto('/register');
    await page.check(`input[value=${account_type}]`);
    await page.getByRole('combobox', { name: 'Clinic' }).click();
    await page.getByRole('option', { name: clinic }).click();
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.fill('input[name="confirmPassword"]', password);
    await page.click('button:has-text("Create Account")');
    await page.waitForResponse(res => res.url().includes('/register') && res.status() === 200);
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
    console.log('Done with merchant tests.');
  });

  // CORE MERCHANT E2E TESTS:
  test('create patient and generate report', async ({ page }) => {
    // Create a patient.
    await page.goto('/create-patient');
    await page.fill('input[name="given_names"]', 'Test');
    await page.fill('input[name="family_name"]', 'Patient');
    await page.fill('input[name="date_of_birth"]', '1990-01-01');
    await page.getByRole('combobox', { name: 'Gender' }).click();
    await page.getByRole('option', { name: 'Male', exact: true }).click();
    await page.fill('input[name="weight"]', '80');
    await page.fill('input[name="height"]', '180');
    await page.getByRole('button', { name: 'Create Patient' }).click();
    await expect(page.locator('text=Patient Creation Successful')).toBeVisible();
    await page.click('button:has-text("Back to Patient Management")');
    await expect(page).toHaveURL(/patient-management/, { timeout: 10000 });

    // Generate a report for the patient.
    await page.goto('/merchant-generate-report');
    await page.getByRole('combobox', { name: 'Patient' }).click();
    await page.getByRole('option', { name: 'Test Patient' }).click();
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
    await expect(page).toHaveURL(/merchant-reports/, { timeout: 30000 });

    // View report and delete.
    await page.goto('/merchant-reports', {timeout: 30000});
    await page.getByRole('combobox', { name: 'Patient' }).click();
    await page.getByRole('option', { name: 'Test Patient' }).click();
    await page.getByRole('button', { name: 'delete' }).click();
    await expect(page.locator('text=Delete Report')).toBeVisible();
    await page.getByRole('button', { name: 'Delete' }).click();
  });

  test('patient removal', async ({ page }) => {
    // Create a patient.
    await page.goto('/create-patient');
    await page.fill('input[name="given_names"]', 'Test');
    await page.fill('input[name="family_name"]', 'Patient');
    await page.fill('input[name="date_of_birth"]', '1990-06-15');
    await page.getByRole('combobox', { name: 'Gender' }).click();
    await page.getByRole('option', { name: 'Male', exact: true }).click();
    await page.fill('input[name="weight"]', '65');
    await page.fill('input[name="height"]', '165');
    await page.getByRole('button', { name: 'Create Patient' }).click();
    await expect(page.locator('text=Patient Creation Successful')).toBeVisible();
    await page.click('button:has-text("Back to Patient Management")');
    await expect(page).toHaveURL(/patient-management/, { timeout: 10000 });

    // Remove patient.
    await page.goto('/patient-management', {timeout: 30000});
    await page.getByLabel('Search by Given Names').fill('Test');
    await expect(page.getByText('Test')).toBeVisible();
    await page.locator('[data-field="remove"] button').first().click();
    await expect(page.locator('text=Confirm Patient Access Removal')).toBeVisible();
    await page.getByRole('button', { name: 'Delete' }).click();
  });
});
