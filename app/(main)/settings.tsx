import { useCallback, useState } from 'react';
import { Alert, Linking, Pressable, View } from 'react-native';
import CookieManager from '@react-native-cookies/cookies';
import Constants from 'expo-constants';
import * as WebBrowser from 'expo-web-browser';
import { useFocusEffect, useRouter } from 'expo-router';
import { AppText } from '@/components/AppText';
import { Card } from '@/components/Card';
import { Screen } from '@/components/Screen';
import { FEATURE_LOCK_INSTAGRAM_APP } from '@/lock/flag';
import { formatDate, LEGAL, MANAGE_SUBSCRIPTIONS_URL } from '@/purchases';
import { usePayments } from '@/purchases/PaymentsProvider';
import { getActivePack, getPack, PLATFORM_IDS } from '@/rules/store';
import { connectedPlatforms } from '@/state/platforms';
import { clearProgress } from '@/state/progress';
import { emitWebEvent } from '@/state/webEvents';
import { spacing } from '@/theme/tokens';

function Row({ label, detail, onPress, disabled }: { label: string; detail?: string; onPress?: () => void; disabled?: boolean }) {
  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : 'text'}
      accessibilityState={{ disabled: !!disabled }}
      accessibilityLabel={detail ? `${label}. ${detail}` : label}
      disabled={disabled || !onPress}
      onPress={onPress}
      style={{ minHeight: 48, justifyContent: 'center', opacity: disabled ? 0.5 : 1, paddingVertical: spacing.sm }}
    >
      <AppText variant="bodyMedium" accent={!!onPress && !disabled}>{label}</AppText>
      {detail ? <AppText variant="small" muted>{detail}</AppText> : null}
    </Pressable>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ gap: spacing.sm }}>
      <AppText variant="heading">{title}</AppText>
      <Card style={{ paddingVertical: spacing.sm }}>{children}</Card>
    </View>
  );
}

export default function Settings() {
  const router = useRouter();
  const { mode, customer, restore, busy } = usePayments();
  const pack = getActivePack();
  const [note, setNote] = useState<string | null>(null);
  const [connected, setConnected] = useState(connectedPlatforms);
  useFocusEffect(useCallback(() => setConnected(connectedPlatforms()), []));

  const status = (() => {
    if (mode === 'dev') return 'Dev mode: everything unlocked';
    if (!customer.isPro) return 'Not subscribed';
    const when = customer.expiresAt ? formatDate(new Date(customer.expiresAt)) : null;
    if (customer.inTrial) return when ? `Free trial, ends ${when}` : 'Free trial';
    if (when) return customer.willRenew ? `Active, renews ${when}` : `Active, ends ${when}`;
    return 'Active';
  })();

  const doRestore = async () => setNote((await restore()) ? 'Subscription restored.' : 'No active subscription found.');

  const signOut = () =>
    Alert.alert(
      'Sign out and clear data?',
      'This signs you out of everything inside Hearth and clears everything Hearth stored on this device. Your subscription is not affected.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign out',
          style: 'destructive',
          onPress: async () => {
            try {
              await CookieManager.clearAll(true);
            } catch {}
            emitWebEvent('clear');
            clearProgress();
            router.dismissAll();
            router.replace('/');
          },
        },
      ],
    );

  const open = (url: string) => WebBrowser.openBrowserAsync(url).catch(() => Linking.openURL(url));

  return (
    <Screen scroll>
      <View style={{ gap: spacing.lg, paddingBottom: spacing.xl }}>
        <AppText variant="title">Settings</AppText>

        <Section title="Subscription">
          <Row label="Status" detail={status} />
          <Row label="Restore purchases" onPress={doRestore} disabled={busy || mode === 'dev'} />
          <Row label="Manage subscription" onPress={() => open(MANAGE_SUBSCRIPTIONS_URL)} disabled={mode === 'dev'} />
          {note && <AppText variant="small" muted accessibilityLiveRegion="polite">{note}</AppText>}
        </Section>

        <Section title="Accounts">
          {PLATFORM_IDS.map((id) => {
            const name = getPack(id).displayName;
            const on = id === 'instagram' || connected.includes(id);
            const beta = id !== 'instagram';
            return (
              <Row
                key={id}
                label={on ? name : `Connect ${name}`}
                detail={on ? `Connected${beta ? ' (beta)' : ''}` : 'Sign in on its own page (beta)'}
                onPress={on ? undefined : () => router.push({ pathname: '/(onboarding)/login', params: { platform: id } })}
              />
            );
          })}
        </Section>

        <Section title="Show">
          <Row label="Reload current page" onPress={() => { emitWebEvent('reload'); router.back(); }} />
          <Row label="Sign out and clear data" onPress={signOut} />
        </Section>

        <Section title="Coming later">
          <Row label="Lock the Instagram app" detail="Use Screen Time to block the Instagram app, with two 5-minute passes a day." disabled={!FEATURE_LOCK_INSTAGRAM_APP} />
        </Section>

        <Section title="Privacy">
          <AppText variant="small" style={{ paddingVertical: spacing.sm }}>
            Hearth shows Instagram's own website. You sign in on Instagram's page, and Hearth never reads, stores or sends your password, cookies or
            messages. It has no analytics. The only things stored on this device are your onboarding answers and whether you're signed in.
          </AppText>
          <Row label="Privacy policy" onPress={LEGAL.privacy ? () => open(LEGAL.privacy) : undefined} />
          <Row label="Terms of use" onPress={() => open(LEGAL.terms)} />
        </Section>

        <Section title="About">
          <Row label="Version" detail={Constants.expoConfig?.version ?? '1.0.0'} />
          <Row label="Rules pack" detail={`${pack.displayName} v${pack.version}`} />
          <AppText variant="small" muted style={{ paddingVertical: spacing.sm }}>
            Hearth is not affiliated with Instagram or Meta.
          </AppText>
        </Section>
      </View>
    </Screen>
  );
}
