const DEFAULT_API_BASE_URL = 'https://app.cortecertoapp.com.br/api';
const DEFAULT_PRIVACY_POLICY_URL = 'https://cortecertoapp.com.br/privacidade';
const DEFAULT_ACCOUNT_DELETION_URL = 'https://cortecertoapp.com.br/exclusao-de-conta';

module.exports = ({ config }) => ({
  ...config,
  name: process.env.EXPO_PUBLIC_APP_NAME || config.name || 'CorteCertoApp',
  slug: process.env.EXPO_PUBLIC_APP_SLUG || config.slug || 'cortecertoapp',
  scheme: process.env.EXPO_PUBLIC_APP_SCHEME || config.scheme || 'cortecertoapp',
  version: process.env.EXPO_PUBLIC_APP_VERSION || config.version || '1.0.0',
  android: {
    ...config.android,
    package: process.env.EXPO_PUBLIC_ANDROID_PACKAGE || config.android?.package || 'br.com.cortecertoapp.mobile',
    versionCode: Number(process.env.EXPO_PUBLIC_ANDROID_VERSION_CODE || config.android?.versionCode || 1),
  },
  extra: {
    ...config.extra,
    apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL || config.extra?.apiBaseUrl || DEFAULT_API_BASE_URL,
    privacyPolicyUrl:
      process.env.EXPO_PUBLIC_PRIVACY_POLICY_URL || config.extra?.privacyPolicyUrl || DEFAULT_PRIVACY_POLICY_URL,
    accountDeletionUrl:
      process.env.EXPO_PUBLIC_ACCOUNT_DELETION_URL || config.extra?.accountDeletionUrl || DEFAULT_ACCOUNT_DELETION_URL,
  },
});
