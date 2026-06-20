import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './base.page';
import type { SiteConfig } from '@config/site-config.types';

export class RegisterPage extends BasePage {
  readonly heading: Locator;
  readonly fullNameField: Locator;
  readonly emailField: Locator;
  readonly passwordField: Locator;
  readonly form: Locator;
  readonly submitButton: Locator;
  // "Login" link inside the form footer ("Have an account? Login")
  readonly loginLink: Locator;
  readonly loginNavLink: Locator;
  readonly createAccountNavLink: Locator;

  constructor(page: Page, config: SiteConfig) {
    super(page, config);
    this.heading = page.getByRole('heading', { name: 'Create Account', level: 1 });
    this.fullNameField = page.getByLabel('Full Name');
    this.emailField = page.getByLabel('Email');
    this.passwordField = page.getByLabel('Password');
    // noValidate is set on this form — custom JS validation, not browser native
    this.form = page.locator('form[action="/register-action"]');
    this.submitButton = page.getByRole('button', { name: 'Create Account' });
    // The form contains a "Login" link distinct from the nav's "Login" link
    this.loginLink = this.form.getByRole('link', { name: 'Login' });
    this.loginNavLink = page.locator('nav').getByRole('link', { name: 'Login' });
    this.createAccountNavLink = page.locator('nav').getByRole('link', { name: 'Create Account' });
  }

  async navigateToRegister(): Promise<void> {
    await this.page.goto(`${this.url}/register`, { waitUntil: 'domcontentloaded' });
  }

  async fillFullName(name: string): Promise<void> {
    await this.fullNameField.fill(name);
  }

  async fillEmail(email: string): Promise<void> {
    await this.emailField.fill(email);
  }

  async fillPassword(password: string): Promise<void> {
    await this.passwordField.fill(password);
  }

  async clickLoginLink(): Promise<void> {
    await this.loginLink.click();
  }
}
