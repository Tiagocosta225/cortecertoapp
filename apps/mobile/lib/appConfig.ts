import Constants from 'expo-constants';

type PublicConfig = {
  apiBaseUrl?: string;
  privacyPolicyUrl?: string;
  accountDeletionUrl?: string;
};

const extra = (Constants.expoConfig?.extra || {}) as PublicConfig;

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || extra.apiBaseUrl || 'https://app.cortecertoapp.com.br/api';

export const PRIVACY_POLICY_URL =
  process.env.EXPO_PUBLIC_PRIVACY_POLICY_URL || extra.privacyPolicyUrl || 'https://cortecertoapp.com.br/privacidade';

export const ACCOUNT_DELETION_URL =
  process.env.EXPO_PUBLIC_ACCOUNT_DELETION_URL ||
  extra.accountDeletionUrl ||
  'https://cortecertoapp.com.br/exclusao-de-conta';
