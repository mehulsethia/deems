import { useCallback, useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { ExitIcon, NoServerIcon, PageIcon } from '@/components/Icons';
import { Screen } from '@/components/Screen';
import type { PlatformId } from '@/rules/types';
import { progressFor } from '@/state/onboardingSteps';
import { PLATFORM_META, PICK_ORDER } from '@/state/platformMeta';
import { isSignedInTo } from '@/state/platforms';
import { readProgress } from '@/state/progress';
import { colors, spacing } from '@/theme/tokens';

const ROWS = [
  { Icon: PageIcon, text: 'Their sign-in page, not ours' },
  { Icon: NoServerIcon, text: 'Nothing is stored on our servers' },
  { Icon: ExitIcon, text: 'Sign out any time in Settings' },
];

function status() {
  const picked = readProgress().picked;
  const order = picked.length ? picked : [PICK_ORDER[0]];
  return {
    pending: order.filter((id) => !isSignedInTo(id)),
    connected: order.filter(isSignedInTo),
    last: order[order.length - 1],
  };
}

/** Sign in to each picked app in order. After the first, offer the next one with "Later"; never force all. */
export default function Trust() {
  const router = useRouter();
  const { signedIn } = useLocalSearchParams<{ signedIn?: PlatformId }>();
  const [s, setS] = useState(status);
  const advanced = useRef<string | undefined>(undefined);

  useFocusEffect(useCallback(() => setS(status()), []));

  // Just finished the last pending sign-in: go straight on to the reveal.
  useEffect(() => {
    if (signedIn && advanced.current !== signedIn && s.pending.length === 0) {
      advanced.current = signedIn;
      router.push('/(onboarding)/reveal');
    }
  }, [signedIn, s.pending.length, router]);

  const next = s.pending[0];
  const shown = next ?? s.last;
  const { label, domain } = PLATFORM_META[shown];
  const adding = s.connected.length > 0;

  const signIn = () => next && router.push({ pathname: '/(onboarding)/login', params: { platform: next } });
  const later = () => router.push('/(onboarding)/reveal');

  return (
    <Screen
      scroll
      progress={progressFor('trust')}
      footer={
        !next ? (
          <Button label="Next" onPress={later} />
        ) : adding ? (
          <>
            <Button label={`Add ${label}`} onPress={signIn} />
            <Button label="Later" variant="ghost" onPress={later} />
          </>
        ) : (
          <Button label={`Sign in on ${domain}`} onPress={signIn} />
        )
      }
    >
      <View style={{ gap: spacing.lg, paddingBottom: spacing.lg }}>
        <AppText variant="title">You sign in on {label}'s own page.</AppText>
        <AppText muted>Deems never sees your password or your messages.</AppText>
        <View style={{ gap: spacing.md, paddingTop: spacing.md }}>
          {ROWS.map(({ Icon, text }) => (
            <View key={text} accessible accessibilityLabel={text} style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, minHeight: 44 }}>
              <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.hairline, alignItems: 'center', justifyContent: 'center' }}>
                <Icon color={colors.keep} />
              </View>
              <AppText style={{ flex: 1 }}>{text}</AppText>
            </View>
          ))}
        </View>
      </View>
    </Screen>
  );
}
