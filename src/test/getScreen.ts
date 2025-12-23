import type { CustomWorld } from '@/test/world';
import { LocatorFilesTyped, type LocatorKey } from '@/slices/locatorFilesTyped';

// ✅ This preserves locator key typing for each screen
export function getScreen<K extends LocatorKey>(world: CustomWorld, key: K) {
  const locators = LocatorFilesTyped[key];
  return world.screens.get(key, locators);
}
