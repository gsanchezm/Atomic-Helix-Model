import { Given, When, Then, After } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

import type { CustomWorld } from '@/test/world';
import { env } from '@/config/env';
import { Screens } from '@/slices';
import { getScreen } from '@/test/getScreen';

/**
 * -------------------------
 * Helpers (DRY + guards)
 * -------------------------
 */

async function ensureWebAndInit(world: CustomWorld) {
  if (world.ctx.executionContext.platform !== 'web') {
    throw new Error('Auth feature supports only PLATFORM=web');
  }
  await world.initWeb();
}

async function submitValidCredentials(world: CustomWorld) {
  const auth = getScreen(world, Screens.Auth.SignIn);

  await auth.userNameInput.type('standard_user');
  await auth.passwordInput.type('secret_sauce');
  await auth.loginButton.click();
}

/**
 * -------------------------
 * Step Definitions
 * -------------------------
 */

Given('the application is launched', async function (this: CustomWorld) {
  await ensureWebAndInit(this);

  const page = this.ctx.playwright!.page;
  await page.goto(env.web.baseUrl, { waitUntil: 'networkidle' });

  const auth = getScreen(this, Screens.Auth.SignIn);
  const visible = await auth.userNameInput.isVisible();

  if (!visible) {
    throw new Error('Login page not visible (username input not found)');
  }
});

/**
 * Reused in:
 * - Valid login
 * - Session handling (Given SauceLab user submit credentials)
 */
When('SauceLab user submit credentials', async function (this: CustomWorld) {
  await ensureWebAndInit(this);
  await submitValidCredentials(this);
});

When('SauceLab user submit locked credentials', async function (this: CustomWorld) {
  await ensureWebAndInit(this);

  const auth = getScreen(this, Screens.Auth.SignIn);

  await auth.userNameInput.type('locked_out_user');
  await auth.passwordInput.type('secret_sauce');
  await auth.loginButton.click();
});

When('SauceLab user submit empty credentials', async function (this: CustomWorld) {
  await ensureWebAndInit(this);

  const auth = getScreen(this, Screens.Auth.SignIn);
  await auth.loginButton.click();
});

Then('the system should grant access', async function (this: CustomWorld) {
  const page = this.ctx.playwright!.page;
  await expect(page).toHaveURL(/inventory\.html/);
});

Then('the system should show the error {string}', async function (
  this: CustomWorld,
  expectedMessage: string
) {
  const auth = getScreen(this, Screens.Auth.SignIn);

  const visible = await auth.errorLabel.isVisible();
  if (!visible) {
    throw new Error('Expected error label to be visible');
  }

  const text = await auth.errorLabel.getText();
  if (!text.includes(expectedMessage)) {
    throw new Error(
      `Expected error message:\n"${expectedMessage}"\n\nBut got:\n"${text}"`
    );
  }
});

When('he log out', async function (this: CustomWorld) {
  const menu = getScreen(this, Screens.Shared.HamburgerMenu);

  await menu.burgerMenuButton.click();

  const count = await menu.menuItemList.length();
  for (let i = 0; i < count; i++) {
    const item = await menu.menuItemList.get(i);
    const text = (await item.getText()).trim();

    if (text.toLowerCase() === 'logout') {
      await item.click();
      return;
    }
  }

  throw new Error('Logout menu item not found');
});

Then('the system should return to the login page', async function (this: CustomWorld) {
  const page = this.ctx.playwright!.page;

  // URL back to base login
  await expect(page).toHaveURL(
    new RegExp(env.web.baseUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  );

  const auth = getScreen(this, Screens.Auth.SignIn);
  const visible = await auth.userNameInput.isVisible();

  if (!visible) {
    throw new Error('Login page not visible after logout');
  }
});

After(async function (this: CustomWorld) {
  await this.dispose();
});