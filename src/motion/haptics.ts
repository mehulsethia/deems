import * as Haptics from 'expo-haptics';

/** Fire-and-forget haptics; failures (simulator, unsupported device) are ignored. */
export const tick = () => {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
};
export const thud = () => {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
};
export const select = () => {
  Haptics.selectionAsync().catch(() => {});
};
