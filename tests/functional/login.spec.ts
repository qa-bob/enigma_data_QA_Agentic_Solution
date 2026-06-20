/**
 * tests/functional/login.spec.ts
 *
 * Functional tests for the login page (/auth/login).
 * IMPORTANT: These tests do NOT submit the form or attempt authentication.
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';

test.describe('Login Page @functional', () => {
  test('page loads with Login heading visible @functional', async ({ loginPage }) => {
    await expect(loginPage.heading).toBeVisible();
    await expect(loginPage.heading).toHaveText('Login');
  });

  test('email field is present and accepts text @functional', async ({ loginPage }) => {
    await expect(loginPage.emailField).toBeVisible();
    await loginPage.fillEmail('user@example.com');
    await expect(loginPage.emailField).toHaveValue('user@example.com');
  });

  test('password field is present and accepts text @functional', async ({ loginPage }) => {
    await expect(loginPage.passwordField).toBeVisible();
    await loginPage.fillPassword('testpassword123');
    await expect(loginPage.passwordField).toHaveValue('testpassword123');
  });

  test('My Account radio is checked by default @functional', async ({ loginPage }) => {
    await expect(loginPage.myAccountRadio).toBeChecked();
    await expect(loginPage.myOrganizationRadio).not.toBeChecked();
  });

  test('radio buttons can be toggled @functional', async ({ loginPage }) => {
    await loginPage.selectMyOrganization();
    await expect(loginPage.myOrganizationRadio).toBeChecked();
    await expect(loginPage.myAccountRadio).not.toBeChecked();

    await loginPage.selectMyAccount();
    await expect(loginPage.myAccountRadio).toBeChecked();
    await expect(loginPage.myOrganizationRadio).not.toBeChecked();
  });

  test('Login submit button is visible @functional', async ({ loginPage }) => {
    await expect(loginPage.submitButton).toBeVisible();
    await expect(loginPage.submitButton).toBeEnabled();
  });

  test('Create an account link is visible and points to /register @functional', async ({
    loginPage,
  }) => {
    await expect(loginPage.createAccountLink).toBeVisible();
    await expect(loginPage.createAccountLink).toHaveAttribute('href', '/register');
  });

  test('clicking Create an account link navigates to register page @functional', async ({
    loginPage,
    page,
  }) => {
    await loginPage.clickCreateAccountLink();
    await page.waitForLoadState('domcontentloaded');
    await expect(page).toHaveURL(/\/register/);
    await expect(page.getByRole('heading', { name: 'Create Account', level: 1 })).toBeVisible();
  });

  test('nav Login link is marked active with aria-current @functional', async ({ loginPage }) => {
    await expect(loginPage.loginNavLink).toHaveAttribute('aria-current', 'page');
  });

  test('nav Create Account link links to /register @functional', async ({ loginPage }) => {
    await expect(loginPage.createAccountNavLink).toBeVisible();
    await expect(loginPage.createAccountNavLink).toHaveAttribute('href', '/register');
  });
});
