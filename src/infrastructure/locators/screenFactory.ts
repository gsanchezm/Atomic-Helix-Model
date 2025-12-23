import { LocatorResolver } from './locatorResolver';
import type { LocatorMap, ExecutionContext } from './locatorTypes';
import type { UIAdapter, UIElement, UIElementList } from '../adapters/uiAdapter';

type ScreenProxy<TLocators extends LocatorMap> = {
  [K in keyof TLocators]:
    K extends `${string}List`
      ? UIElementList
      : UIElement;
};

export function createScreen<TLocators extends LocatorMap>(
  locators: TLocators,
  context: ExecutionContext,
  adapter: UIAdapter
): ScreenProxy<TLocators> {
  const resolver = new LocatorResolver(locators, context);

  // ✅ Lazy element wrapper: returns UIElement immediately (no Promise at property access)
  const createLazyElement = (locator: string): UIElement => ({
    click: async () => {
      const el = await adapter.findElement(locator);
      await el.click();
    },
    type: async (text: string) => {
      const el = await adapter.findElement(locator);
      await el.type(text);
    },
    getText: async () => {
      const el = await adapter.findElement(locator);
      return el.getText();
    },
    isVisible: async () => {
      const el = await adapter.findElement(locator);
      return el.isVisible();
    }
  });

  // ✅ Lazy list wrapper: UIElementList immediately
  const createLazyList = (locator: string): UIElementList => ({
    get: async (index: number) => {
      const list = await adapter.findElements(locator);
      return list.get(index);
    },
    length: async () => {
      const list = await adapter.findElements(locator);
      return list.length();
    },
    forEach: async (fn) => {
      const list = await adapter.findElements(locator);
      return list.forEach(fn);
    }
  });

  const handler: ProxyHandler<Record<string, unknown>> = {
    get(_target, prop: string | symbol) {
      if (typeof prop !== 'string') {
        throw new Error('Symbol-based properties are not supported on screen proxies');
      }

      const locator = resolver.get(prop);

      return prop.endsWith('List')
        ? createLazyList(locator)
        : createLazyElement(locator);
    }
  };

  return new Proxy<Record<string, unknown>>({}, handler) as ScreenProxy<TLocators>;
}
