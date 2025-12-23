import type { Platform, WebViewport, MobileOS } from '../../config/env';

export interface ExecutionContext {
    platform: Platform;
    webViewport?: WebViewport;
    mobileOS?: MobileOS;
}

export type WebLocator =
    | string
    | {
        desktop?: string;
        responsive?: string;
    };

export interface MobileLocator {
    android?: string;
    ios?: string;
}

export interface ElementLocator {
    web?: WebLocator;
    mobile?: MobileLocator;
}

export type LocatorMap = Record<string, ElementLocator>;