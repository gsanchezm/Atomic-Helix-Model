import dotenv from 'dotenv';

dotenv.config();

const required = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required env var: ${key}`);
  }
  return value;
};

const assertOneOf = <T extends string>(
  key: string,
  value: string,
  allowed: readonly T[]
): T => {
  if (!allowed.includes(value as T)) {
    throw new Error(`Invalid value for ${key}: ${value}. Allowed: ${allowed.join(', ')}`);
  }
  return value as T;
};

export type Platform = 'web' | 'mobile';
export type WebViewport = 'desktop' | 'responsive';
export type MobileOS = 'android' | 'ios';

export const env = {
  sauce: {
    username: required('SAUCE_USERNAME'),
    accessKey: required('SAUCE_ACCESS_KEY'),
    region: process.env.SAUCE_REGION ?? 'us-west-1',
    buildName: process.env.SAUCE_BUILD_NAME ?? 'ahm-proxy-build'
  },

  playwright: {
    headless: process.env.PW_HEADLESS !== 'false',
    deviceName:
      process.env.WEB_VIEWPORT === 'responsive'
        ? (process.env.PW_DEVICE ?? '')
        : ''
  },

  web: {
    baseUrl: required('WEB_BASE_URL')
  },

  platform: assertOneOf('PLATFORM', process.env.PLATFORM ?? 'web', ['web', 'mobile']),
  webViewport: assertOneOf('WEB_VIEWPORT', process.env.WEB_VIEWPORT ?? 'desktop', ['desktop', 'responsive']),
  mobileOS: assertOneOf('MOBILE_OS', process.env.MOBILE_OS ?? 'android', ['android', 'ios']),
  nodeEnv: process.env.NODE_ENV ?? 'local',
  logLevel: process.env.LOG_LEVEL ?? 'info'
};