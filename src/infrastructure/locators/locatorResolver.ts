import { ExecutionContext, ElementLocator, LocatorMap } from './locatorTypes';

export class LocatorResolver {
    private readonly platformResolvers = new Map<
        ExecutionContext['platform'],
        (entry: ElementLocator, name: string) => string
    >();

    constructor(
        private readonly locators: LocatorMap,
        private readonly context: ExecutionContext
    ) {
        this.platformResolvers.set('web', this.resolveWeb.bind(this));
        this.platformResolvers.set('mobile', this.resolveMobile.bind(this));
    }

    get(name: string): string {
        const entry = this.locators[name];
        if (!entry) {
            throw new Error(`Locator '${name}' not found`);
        }

        const resolver = this.platformResolvers.get(this.context.platform);
        if (!resolver) {
            throw new Error(`Unsupported platform '${this.context.platform}' for '${name}'`);
        }

        return resolver(entry, name);
    }

    private resolveWeb(entry: ElementLocator, name: string): string {
        const web = entry.web;
        if (!web) {
            throw new Error(`Web locator missing for '${name}'`);
        }

        if (typeof web === 'string') {
            return web;
        }

        const viewportStrategies = new Map<
            NonNullable<ExecutionContext['webViewport']>,
            () => string | undefined
        >([
            ['desktop', () => web.desktop],
            ['responsive', () => web.responsive]
        ]);

        const requested = this.context.webViewport;
        if (requested) {
            const strategy = viewportStrategies.get(requested);
            const candidate = strategy?.();
            if (candidate) return candidate;
        }

        if (web.desktop) return web.desktop;
        if (web.responsive) return web.responsive;

        throw new Error(`No matching web locator for '${name}'`);
    }

    private resolveMobile(entry: ElementLocator, name: string): string {
        const mobile = entry.mobile;
        if (!mobile) {
            throw new Error(`Mobile locator missing for '${name}'`);
        }

        const osStrategies = new Map<
            NonNullable<ExecutionContext['mobileOS']>,
            () => string | undefined
        >([
            ['android', () => mobile.android],
            ['ios', () => mobile.ios]
        ]);

        const requested = this.context.mobileOS;
        if (requested) {
            const strategy = osStrategies.get(requested);
            const candidate = strategy?.();
            if (candidate) return candidate;
        }

        if (mobile.android) return mobile.android;
        if (mobile.ios) return mobile.ios;

        throw new Error(`No matching mobile locator for '${name}'`);
    }
}
