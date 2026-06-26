import {
  Tabs,
  TabList,
  TabTrigger,
  TabSlot,
  TabTriggerSlotProps,
  TabListProps,
} from 'expo-router/ui';
import { SymbolView } from 'expo-symbols';
import { Pressable, useColorScheme, View, StyleSheet } from 'react-native';

import { ExternalLink } from './external-link';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

import { Colors, MaxContentWidth, Spacing } from '@/constants/theme';
import { useResponsive } from '@/hooks/use-responsive';

export default function AppTabs() {
  return (
    <Tabs>
      <TabSlot style={{ height: '100%' }} />
      <TabList asChild>
        <CustomTabList>
          <TabTrigger name="index" href="/" asChild>
            <TabButton>Inicio</TabButton>
          </TabTrigger>
          <TabTrigger name="entrenar" href="/entrenar" asChild>
            <TabButton>Entrenar</TabButton>
          </TabTrigger>
          <TabTrigger name="historial" href="/historial" asChild>
            <TabButton>Historial</TabButton>
          </TabTrigger>
          <TabTrigger name="descanso" href="/descanso" asChild>
            <TabButton>Descanso</TabButton>
          </TabTrigger>
          <TabTrigger name="ejercicios" href="/ejercicios" asChild>
            <TabButton>Ejercicios</TabButton>
          </TabTrigger>
        </CustomTabList>
      </TabList>
    </Tabs>
  );
}

export function TabButton({ children, isFocused, ...props }: TabTriggerSlotProps) {
  const { isMobile } = useResponsive();

  return (
    <Pressable {...props} style={({ pressed }) => pressed && styles.pressed}>
      <ThemedView
        type={isFocused ? 'backgroundSelected' : 'backgroundElement'}
        style={[
          styles.tabButtonView,
          isMobile && styles.tabButtonViewMobile,
        ]}>
        <ThemedText
          type="small"
          themeColor={isFocused ? 'text' : 'textSecondary'}
          style={isMobile ? { fontSize: 11 } : undefined}>
          {children}
        </ThemedText>
      </ThemedView>
    </Pressable>
  );
}

export function CustomTabList(props: TabListProps) {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' ? 'light' : scheme];
  const { isMobile, isTablet } = useResponsive();

  return (
    <View {...props} style={[styles.tabListContainer, isMobile && styles.tabListContainerMobile]}>
      <ThemedView
        type="backgroundElement"
        style={[
          styles.innerContainer,
          isMobile && styles.innerContainerMobile,
          isTablet && styles.innerContainerTablet,
        ]}>
        {/* Hide brand text on mobile to save space */}
        {!isMobile && (
          <ThemedText type="smallBold" style={styles.brandText}>
            ApexFit
          </ThemedText>
        )}

        {props.children}

        {/* Hide docs link on mobile/tablet */}
        {!isMobile && !isTablet && (
          <ExternalLink href="https://docs.expo.dev" asChild>
            <Pressable style={styles.externalPressable}>
              <ThemedText type="link">Docs</ThemedText>
              <SymbolView
                tintColor={colors.text}
                name={{ ios: 'arrow.up.right.square', web: 'link' }}
                size={12}
              />
            </Pressable>
          </ExternalLink>
        )}
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  tabListContainer: {
    position: 'absolute',
    width: '100%',
    padding: Spacing.three,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  tabListContainerMobile: {
    padding: Spacing.two,
    bottom: 0,
  },
  innerContainer: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.five,
    borderRadius: Spacing.five,
    flexDirection: 'row',
    alignItems: 'center',
    flexGrow: 1,
    gap: Spacing.two,
    maxWidth: MaxContentWidth,
  },
  innerContainerMobile: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    gap: Spacing.one,
    justifyContent: 'space-around',
  },
  innerContainerTablet: {
    paddingHorizontal: Spacing.three,
    gap: Spacing.one,
  },
  brandText: {
    marginRight: 'auto',
  },
  pressed: {
    opacity: 0.7,
  },
  tabButtonView: {
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.three,
  },
  tabButtonViewMobile: {
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.two,
    borderRadius: Spacing.two,
  },
  externalPressable: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.one,
    marginLeft: Spacing.three,
  },
});
