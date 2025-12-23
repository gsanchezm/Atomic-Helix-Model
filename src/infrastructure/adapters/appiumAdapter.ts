import type { UIAdapter, UIElement, UIElementList } from './uiAdapter';
import type { Browser, ChainablePromiseElement } from 'webdriverio';

type AnyElement = WebdriverIO.Element | ChainablePromiseElement;

export class AppiumAdapter implements UIAdapter {
  constructor(private readonly driver: Browser) {}

  async findElement(locator: string): Promise<UIElement> {
    const el = this.driver.$(locator); // ChainablePromiseElement
    return this.wrap(el);
  }

  async findElements(locator: string): Promise<UIElementList> {
    const els = this.driver.$$(locator);
  
    const wrap = (el: any): UIElement => this.wrap(el); // <-- closure binds class `this`
  
    return {
      async get(index: number): Promise<UIElement> {
        const el = await els[index];
        if (!el) throw new Error(`No element at index ${index} for locator: ${locator}`);
        return wrap(el);
      },
  
      async length(): Promise<number> {
        return await els.length;
      },
  
      async forEach(fn) {
        const count = await els.length;
        for (let i = 0; i < count; i++) {
          const el = await els[i];
          if (!el) continue;
          await fn(wrap(el), i);
        }
      }
    };
  }  

  private wrap(el: AnyElement): UIElement {
    const resolve = async (): Promise<WebdriverIO.Element> =>
      (await el) as unknown as WebdriverIO.Element;

    return {
      click: async () => {
        const e = await resolve();
        await e.click();
      },
      type: async (text: string) => {
        const e = await resolve();
        await e.setValue(text);
      },
      getText: async () => {
        const e = await resolve();
        return await e.getText();
      },
      isVisible: async () => {
        const e = await resolve();
        return await e.isDisplayed();
      }
    };
  }
}
