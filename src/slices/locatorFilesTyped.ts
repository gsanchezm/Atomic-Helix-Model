import authSignInLocators from '@/slices/auth/locators/auth-sign-in.locators.json';
import hamburgerMenuLocators from '@/slices/shared/locators/hamburger-menu.locators.json';

export const LocatorFilesTyped = {
  'auth:signIn': authSignInLocators,
  'shared:hamburgerMenu': hamburgerMenuLocators
} as const;

export type LocatorKey = keyof typeof LocatorFilesTyped;
