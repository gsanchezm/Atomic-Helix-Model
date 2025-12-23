import type { LocatorMap } from '@/infrastructure/locators/locatorTypes';
import type { ScreenKey } from '@/slices';

import authSignInLocators from '@/slices/auth/locators/auth-sign-in.locators.json';
import hamburgerMenuLocators from '@/slices/shared/locators/hamburger-menu.locators.json';

// (Optional) add later:
// import inventoryProductsLocators from '@/slices/inventory/locators/inventory-products.locators.json';
// import cartLocators from '@/slices/cart/locators/cart.locators.json';
// import checkoutInfoLocators from '@/slices/checkout/locators/checkout-info.locators.json';
// ...

export const LocatorFiles: Partial<Record<ScreenKey, LocatorMap>> = {
  'auth:signIn': authSignInLocators as unknown as LocatorMap,
  'shared:hamburgerMenu': hamburgerMenuLocators as unknown as LocatorMap

  // add others here as you create them:
  // 'inventory:products': inventoryProductsLocators as unknown as LocatorMap,
  // 'cart:cart': cartLocators as unknown as LocatorMap,
  // 'checkout:info': checkoutInfoLocators as unknown as LocatorMap,
  // ...
};