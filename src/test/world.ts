import { setWorldConstructor, World, IWorldOptions, setDefaultTimeout } from '@cucumber/cucumber';

import { env } from '@/config/env';
import { logger } from '@/logger/logger';
import type { ExecutionContext } from '@/infrastructure/locators/locatorTypes';

import { PlaywrightAdapter } from '@/infrastructure/adapters/playwrightAdapter';
import { createPlaywrightSession, type PlaywrightSession } from '@/infrastructure/drivers/playwrightDriver';

import { ScreenRegistry } from '@/test/screenRegistry';

export interface TestWorldContext {
  executionContext: ExecutionContext;
  playwright?: PlaywrightSession;

  adapters: {
    web?: PlaywrightAdapter;
  };

  screens?: ScreenRegistry;
}

export class CustomWorld extends World {
  ctx: TestWorldContext = {
    executionContext: {
      platform: env.platform,
      webViewport: env.webViewport,
      mobileOS: env.mobileOS
    },
    adapters: {}
  };

  constructor(options: IWorldOptions) {
    super(options);
  }

  private ensureWebPlatform(): void {
    if (this.ctx.executionContext.platform !== 'web') {
      throw new Error(`This scenario requires PLATFORM=web. Got: ${this.ctx.executionContext.platform}`);
    }
  }

  get webAdapter(): PlaywrightAdapter {
    const adapter = this.ctx.adapters.web;
    if (!adapter) throw new Error('Web adapter not initialized. Call initWeb() first.');
    return adapter;
  }

  get screens(): ScreenRegistry {
    const reg = this.ctx.screens;
    if (!reg) throw new Error('ScreenRegistry not initialized. Call initWeb() first.');
    return reg;
  }

  async initWeb(): Promise<void> {
    this.ensureWebPlatform();

    // idempotent init
    if (this.ctx.playwright && this.ctx.adapters.web && this.ctx.screens) return;

    const session = await createPlaywrightSession();
    const adapter = new PlaywrightAdapter(session.page);

    this.ctx.playwright = session;
    this.ctx.adapters.web = adapter;
    this.ctx.screens = new ScreenRegistry(this.ctx.executionContext, adapter);

    logger.info('Web session + adapter + ScreenRegistry initialized');
  }

  async dispose(): Promise<void> {
    if (this.ctx.playwright) await this.ctx.playwright.browser.close();
    this.ctx.playwright = undefined;

    this.ctx.adapters.web = undefined;
    this.ctx.screens?.clear();
    this.ctx.screens = undefined;
  }
}

setWorldConstructor(CustomWorld);
setDefaultTimeout(60_000);
