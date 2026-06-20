import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './base.page';
import type { SiteConfig } from '@config/site-config.types';

export class LoginPage extends BasePage {
  readonly heading: Locator;
  readonly emailField: Locator;
  readonly passwordField: Locator;
  readonly myOrganizationRadio: Locator;
  readonly myAccountRadio: Locator;
  readonly form: Locator;
  readonly submitButton: Locator;
  readonly createAccountLink: Locator;
  readonly loginNavLink: Locator;
  readonly createAccountNavLink: Locator;

  constructor(page: Page, config: SiteConfig) {
    super(page, config);
    this.heading = page.getByRole('heading', { name: 'Login', level: 1 });
    this.emailField = page.getByLabel('Email');
    this.passwordField = page.getByLabel('Password');
    // Radio buttons live outside the <form> element (sibling div above it)
    this.myOrganizationRadio = page
      .locator('label')
      .filter({ hasText: 'My Organization' })
      .locator('input[type="radio"]');
    this.myAccountRadio = page
      .locator('label')
      .filter({ hasText: 'My Account' })
      .locator('input[type="radio"]');
    this.form = page.locator('form[action="/auth/login-action"]');
    this.submitButton = page.getByRole('button', { name: 'Login' });
    // "Create an account" (lowercase 'a') is the form link; nav says "Create Account"
    this.createAccountLink = page.getByRole('link', { name: 'Create an account' });
    this.loginNavLink = page.locator('nav').getByRole('link', { name: 'Login' });
    this.createAccountNavLink = page.locator('nav').getByRole('link', { name: 'Create Account' });
  }

  async navigateToLogin(): Promise<void> {
    await this.page.goto(this.config.auth.loginUrl, { waitUntil: 'domcontentloaded' });
  }

  async fillEmail(email: string): Promise<void> {
    await this.emailField.fill(email);
  }

  async fillPassword(password: string): Promise<void> {
    await this.passwordField.fill(password);
  }

  async selectMyOrganization(): Promise<void> {
    await this.myOrganizationRadio.check();
  }

  async selectMyAccount(): Promise<void> {
    await this.myAccountRadio.check();
  }

  async clickCreateAccountLink(): Promise<void> {
    await this.createAccountLink.click();
  }
}
