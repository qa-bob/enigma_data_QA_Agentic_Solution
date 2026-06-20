/**
 * tests/functional/register.spec.ts
 *
 * Functional tests for the registration page (/register).
 * IMPORTANT: These tests do NOT submit the form or create any accounts.
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';

test.describe('Register Page @functional', () => {
  test('page loads with Create Account heading visible @functional', async ({ registerPage }) => {
    await expect(registerPage.heading).toBeVisible();
    await expect(registerPage.heading).toHaveText('Create Account');
  });

  test('Full Name field is present and accepts text @functional', async ({ registerPage }) => {
    await expect(registerPage.fullNameField).toBeVisible();
    await registerPage.fillFullName('Jane Doe');
    await expect(registerPage.fullNameField).toHaveValue('Jane Doe');
  });

  test('email field is present and accepts text @functional', async ({ registerPage }) => {
    await expect(registerPage.emailField).toBeVisible();
    await registerPage.fillEmail('jane@example.com');
    await expect(registerPage.emailField).toHaveValue('jane@example.com');
  });

  test('password field is present and accepts text @functional', async ({ registerPage }) => {
    await expect(registerPage.passwordField).toBeVisible();
    await registerPage.fillPassword('securepassword');
    await expect(registerPage.passwordField).toHaveValue('securepassword');
  });

  test('all three fields are marked required @functional', async ({ registerPage }) => {
    const fullNameRequired = await registerPage.fullNameField.evaluate(
      (el) => (el as HTMLInputElement).required
    );
    const emailRequired = await registerPage.emailField.evaluate(
      (el) => (el as HTMLInputElement).required
    );
    const passwordRequired = await registerPage.passwordField.evaluate(
      (el) => (el as HTMLInputElement).required
    );

    expect(fullNameRequired, 'Full Name should be required').toBeTruthy();
    expect(emailRequired, 'Email should be required').toBeTruthy();
    expect(passwordRequired, 'Password should be required').toBeTruthy();
  });

  test('Create Account submit button is visible and enabled @functional', async ({
    registerPage,
  }) => {
    await expect(registerPage.submitButton).toBeVisible();
    await expect(registerPage.submitButton).toBeEnabled();
  });

  test('Login link in form is visible and points to /auth/login @functional', async ({
    registerPage,
  }) => {
    await expect(registerPage.loginLink).toBeVisible();
    await expect(registerPage.loginLink).toHaveAttribute('href', '/auth/login');
  });

  test('clicking Login link navigates to the login page @functional', async ({
    registerPage,
    page,
  }) => {
    await registerPage.clickLoginLink();
    await page.waitForLoadState('domcontentloaded');
    await expect(page).toHaveURL(/\/auth\/login/);
    await expect(page.getByRole('heading', { name: 'Login', level: 1 })).toBeVisible();
  });

  test('nav Create Account link is marked active with aria-current @functional', async ({
    registerPage,
  }) => {
    await expect(registerPage.createAccountNavLink).toHaveAttribute('aria-current', 'page');
  });

  test('nav Login link links to /auth/login @functional', async ({ registerPage }) => {
    await expect(registerPage.loginNavLink).toBeVisible();
    await expect(registerPage.loginNavLink).toHaveAttribute('href', '/auth/login');
  });
});
