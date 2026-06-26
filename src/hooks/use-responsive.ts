import { useWindowDimensions } from 'react-native';

/**
 * Hook that provides responsive breakpoint information.
 * Uses React Native's useWindowDimensions for cross-platform support.
 * 
 * Breakpoints:
 * - Mobile: 0–480px
 * - Tablet: 481–768px
 * - Desktop: 769+
 */
export function useResponsive() {
  const { width, height } = useWindowDimensions();

  return {
    screenWidth: width,
    screenHeight: height,
    isMobile: width <= 480,
    isTablet: width > 480 && width <= 768,
    isDesktop: width > 768,
    // Responsive padding: 16 on mobile, 20 on tablet, 24 on desktop
    horizontalPadding: width <= 480 ? 16 : width <= 768 ? 20 : 24,
  };
}
