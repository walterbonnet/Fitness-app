import { useWindowDimensions } from 'react-native';
import { Layout } from '@/constants/theme';

/**
 * Hook that provides responsive breakpoint information and layout values.
 * Uses React Native's useWindowDimensions for cross-platform support.
 * 
 * Breakpoints:
 * - Mobile: 0–480px
 * - Tablet: 481–768px
 * - Desktop: 769+
 * 
 * Layout tokens (from theme.ts Layout):
 * - XS: 12px → internal gaps, badge padding
 * - SM: 16px → card padding, mobile container padding
 * - MD: 20px → tablet container padding
 * - LG: 24px → desktop container padding, section spacing
 */
export function useResponsive() {
  const { width, height } = useWindowDimensions();

  const isMobile = width <= 480;
  const isTablet = width > 480 && width <= 768;
  const isDesktop = width > 768;

  return {
    screenWidth: width,
    screenHeight: height,
    isMobile,
    isTablet,
    isDesktop,
    // Container horizontal padding: SM on mobile, MD on tablet, LG on desktop
    horizontalPadding: isMobile ? Layout.sm : isTablet ? Layout.md : Layout.lg,
    // Gap between cards/sections: XS on mobile, SM on tablet+
    containerGap: isMobile ? Layout.xs : Layout.sm,
    // Internal card padding: XS on mobile, SM on tablet+
    cardPadding: isMobile ? Layout.xs : Layout.sm,
  };
}
