import { Platform } from 'react-native';

/** Store help pages explaining how to cancel a subscription. */
export const HOW_TO_CANCEL_URL =
  Platform.OS === 'ios' ? 'https://support.apple.com/en-us/118428' : 'https://support.google.com/googleplay/answer/7018481';
