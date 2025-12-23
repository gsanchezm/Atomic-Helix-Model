import { Page, Locator as PwLocator } from '@playwright/test';
import type { UIAdapter, UIElement, UIElementList } from './uiAdapter';

export class PlaywrightAdapter implements UIAdapter {
  constructor(private readonly page: Page) {}

  async findElement(locator: string): Promise<UIElement> {
    const pwLocator = this.page.locator(locator);
    return this.wrapElement(pwLocator);
  }

  async findElements(locator: string): Promise<UIElementList> {
    const pwLocator = this.page.locator(locator);

    const wrap = (loc: PwLocator): UIElement => ({
      click: () => loc.click(),
      type: (text) => loc.fill(text),
      getText: async () => (await loc.textContent()) ?? '',
      isVisible: () => loc.isVisible()
    });

    return {
      async get(index: number): Promise<UIElement> {
        return wrap(pwLocator.nth(index));
      },
      async length(): Promise<number> {
        return pwLocator.count();
      },
      async forEach(fn) {
        const count = await pwLocator.count();
        for (let i = 0; i < count; i++) {
          await fn(wrap(pwLocator.nth(i)), i);
        }
      }
    };
  }

  private wrapElement(locator: PwLocator): UIElement {
    return {
      click: () => locator.click(),
      type: (text) => locator.fill(text),
      getText: async () => (await locator.textContent()) ?? '',
      isVisible: () => locator.isVisible()
    };
  }
}
