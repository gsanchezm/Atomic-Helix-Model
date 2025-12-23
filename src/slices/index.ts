import type { LocatorKey } from '@/slices/locatorFilesTyped';

export const Screens = {
    Auth: {
      SignIn: 'auth:signIn'
    },
    Shared: {
      HamburgerMenu: 'shared:hamburgerMenu'
    }
    // ,
    // Inventory: {
    //   Products: 'inventory:products'
    // },
    // Cart: {
    //   Cart: 'cart:cart'
    // },
    // Checkout: {
    //   Info: 'checkout:info',
    //   Overview: 'checkout:overview',
    //   Complete: 'checkout:complete'
    // }
  } as const;

  // ✅ derive ScreenKey from the real registry
  export type ScreenKey = LocatorKey;
  