import type { ExecutionContext } from '@/infrastructure/locators/locatorTypes';
import type { UIAdapter } from '@/infrastructure/adapters/uiAdapter';
import { createScreen } from '@/infrastructure/locators/screenFactory';
import type { LocatorMap } from '@/infrastructure/locators/locatorTypes';

type ScreenKey = string;

export class ScreenRegistry {
  private readonly cache = new Map<ScreenKey, unknown>();

  constructor(
    private readonly ctx: ExecutionContext,
    private readonly adapter: UIAdapter
  ) {}

  // ✅ Resilient: caller provides locators, returns proxy, cached by key
  get<TLocators extends LocatorMap>(key: ScreenKey, locators: TLocators) {
    const existing = this.cache.get(key);
    if (existing) return existing as ReturnType<typeof createScreen<TLocators>>;

    const screen = createScreen<TLocators>(locators, this.ctx, this.adapter);
    this.cache.set(key, screen);
    return screen;
  }

  // Optional: allow clearing per scenario
  clear(): void {
    this.cache.clear();
  }
}
