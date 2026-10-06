import { useRef, useState } from 'react';
import { ScrollView, View, type NativeScrollEvent, type NativeSyntheticEvent } from 'react-native';
import { useRouter } from 'expo-router';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { MockGone, MockInbox, MockStories } from '@/components/mocks/MockScreens';
import { Screen } from '@/components/Screen';
import { radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/ThemeProvider';
import { useLayout } from '@/theme/useLayout';

const pages = [
  { title: 'Messages and group chats stay', body: 'Every conversation, voice note and shared photo, just as you left it.', Mock: MockInbox },
  { title: 'Friends\' stories stay', body: 'See what the people you actually know are up to.', Mock: MockStories },
  { title: 'Feed, reels and explore are gone', body: 'Hidden completely, so there is nothing to scroll.', Mock: MockGone },
];

export default function WhatStays() {
  const router = useRouter();
  const { colors } = useTheme();
  const { contentWidth } = useLayout();
  const pageWidth = contentWidth - spacing.lg * 2;
  const scroller = useRef<ScrollView>(null);
  const [index, setIndex] = useState(0);
  const last = index === pages.length - 1;

  const onEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) =>
    setIndex(Math.round(e.nativeEvent.contentOffset.x / pageWidth));

  const next = () => {
    if (last) router.push('/(onboarding)/connect');
    else {
      scroller.current?.scrollTo({ x: (index + 1) * pageWidth, animated: true });
      setIndex(index + 1);
    }
  };

  return (
    <Screen footer={<Button label={last ? 'Continue' : 'Next'} onPress={next} />}>
      <ScrollView
        ref={scroller}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onEnd}
        style={{ flexGrow: 0 }}
        accessibilityLabel={`Page ${index + 1} of ${pages.length}`}
      >
        {pages.map(({ title, body, Mock }) => (
          <View key={title} style={{ width: pageWidth, gap: spacing.lg, justifyContent: 'center' }}>
            <AppText variant="title">{title}</AppText>
            <AppText muted>{body}</AppText>
            <Mock />
          </View>
        ))}
      </ScrollView>
      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: spacing.sm, paddingTop: spacing.lg }} accessible={false}>
        {pages.map((p, i) => (
          <View key={p.title} style={{ width: i === index ? 22 : 8, height: 8, borderRadius: radius.pill, backgroundColor: i === index ? colors.accent : colors.border }} />
        ))}
      </View>
    </Screen>
  );
}
