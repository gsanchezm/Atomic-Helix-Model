import { chromium, devices, type Browser, type Page } from '@playwright/test';
import { env } from '@/config/env';
import { logger } from '@/logger/logger';

export interface PlaywrightSession {
  browser: Browser;
  page: Page;
}

export async function createPlaywrightSession() {
  const browser = await chromium.launch({
    headless: env.playwright.headless,
    slowMo: env.playwright.headless ? 0 : 150,
    args:
      env.webViewport === 'desktop'
        ? ['--start-maximized']
        : []
  });

  let contextOptions = {};

  // ✅ Desktop: real maximized window
  if (env.webViewport === 'desktop') {
    contextOptions = {
      viewport: null // 👈 THIS is the key
    };
  }

  // ✅ Responsive: emulate a device
  if (env.webViewport === 'responsive' && env.playwright.deviceName) {
    const device = devices[env.playwright.deviceName];
    if (!device) {
      throw new Error(`Unknown Playwright device: ${env.playwright.deviceName}`);
    }
    contextOptions = device;
  }

  logger.info(
    { webViewport: env.webViewport, device: env.playwright.deviceName },
    'Creating Playwright browser context'
  );

  const context = await browser.newContext(contextOptions as any);
  const page = await context.newPage();

  await page.goto(env.web.baseUrl, { waitUntil: 'networkidle' });

  return { browser, page };
}