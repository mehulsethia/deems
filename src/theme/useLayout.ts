import { useWindowDimensions } from 'react-native';
import { layoutFor } from './breakpoints';

/** Window-based layout; re-evaluates on rotation, iPad resizing and iPhone Duo fold/unfold. */
export function useLayout() {
  const { width, height, fontScale } = useWindowDimensions();
  return { ...layoutFor(width, height), fontScale };
}
