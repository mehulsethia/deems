import { useWindowDimensions } from 'react-native';
import { layout } from './tokens';

/** Wide = iPad, Mac window, Android tablet. Re-evaluates on window resize. */
export function useLayout() {
  const { width, height } = useWindowDimensions();
  const isWide = width >= layout.wideBreakpoint;
  return {
    width,
    height,
    isWide,
    contentWidth: isWide ? layout.maxContentWidth : width,
    webWidth: isWide ? layout.webMaxWidth : width,
  };
}
