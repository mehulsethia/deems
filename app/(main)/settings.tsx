import { useCallback, useState } from 'react';
import { Alert, Linking, Pressable, View } from 'react-native';
import CookieManager from '@react-native-cookies/cookies';
import Constants from 'expo-constants';
import * as WebBrowser from 'expo-web-browser';
import { useFocusEffect, useRouter } from 'expo-router';
import { AppText } from '@/components/AppText';
import { ChevronIcon } from '@/components/Icons';
import { OnlyDMMark } from '@/components/OnlyDMMark';
import { Wordmark } from '@/components/Wordmark';
import { Screen } from '@/components/Screen';
import { CONTACT_EMAIL, CONTACT_URL } from '@/config/links';
import type { LegalDocId } from '@/legal/content';
import { FEATURE_LOCK_INSTAGRAM_APP } from '@/lock/flag';
import { cancelTrialReminder } from '@/notifications/trialReminder';
import { formatDate, MANAGE_SUBSCRIPTIONS_URL } from '@/purchases';
import { usePayments } from '@/purchases/PaymentsProvider';
import { getActivePack, PLATFORM_IDS } from '@/rules/store';
import { platformLabel } from '@/state/platformMeta';
import { connectedPlatforms } from '@/state/platforms';
import { clearProgress } from '@/state/progress';
import { emitWebEvent } from '@/state/webEvents';
import { colors, radius, sizes, spacing, type ColorName } from '@/theme/tokens';

function Row({ label, detail, onPress, disabled, tone, last }: { label: string; detail?: string; onPress?: () => void; disabled?: boolean; tone?: ColorName; last?: boolean }) {
  const actionable = !!onPress && !disabled;
  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : 'text'}
      accessibilityState={{ disabled: !!disabled }}
      accessibilityLabel={detail ? `${label}. ${detail}` : label}
      disabled={disabled || !onPress}
      onPress={onPress}
      style={({ pressed }) => ({
        minHeight: 52,
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        opacity: disabled ? 0.4 : pressed ? 0.7 : 1,
        borderBottomWidth: last ? 0 : 1,
        borderBottomColor: colors.hairline,
      })}
    >
      <View style={{ flex: 1, gap: 2 }}>
        <AppText variant="bodyMedium" tone={tone}>{label}</AppText>
        {detail ? <AppText variant="small" muted>{detail}</AppText> : null}
      </View>
      {actionable && <ChevronIcon color={colors.textMuted} />}
    </Pressable>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ gap: spacing.sm }}>
      <AppText variant="label" muted accessibilityRole="header">{title}</AppText>
      <View style={{ backgroundColor: colors.surface, borderRadius: radius.card, borderWidth: 1, borderColor: colors.hairline, overflow: 'hidden' }}>{children}</View>
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
      'This signs you out of everything inside OnlyDM and clears everything OnlyDM stored on this device. Your subscription is not affected.',
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
            cancelTrialReminder();
            router.dismissAll();
            router.replace('/');
          },
        },
      ],
    );

  const open = (url: string) => WebBrowser.openBrowserAsync(url).catch(() => Linking.openURL(url));
  const openDoc = (doc: LegalDocId) => router.push({ pathname: '/legal/[doc]', params: { doc } });

  return (
    <Screen>
      <View style={{ gap: spacing.xl, paddingBottom: spacing.xl }}>
        <AppText variant="title">Settings</AppText>

        <Section title="Subscription">
          <Row label="Status" detail={status} />
          {!customer.isPro || mode === 'dev' ? <Row label="Plans and pricing" detail="Monthly or yearly, 7 days free on yearly" onPress={() => router.push('/paywall')} /> : null}
          <Row label="Restore purchases" onPress={doRestore} disabled={busy || mode === 'dev'} />
          <Row label="Manage subscription" onPress={() => open(MANAGE_SUBSCRIPTIONS_URL)} disabled={mode === 'dev'} />
          <Row label="Cancel anytime · How to cancel" onPress={() => openDoc('cancel')} last={!note} />
          {note && (
            <AppText variant="small" muted accessibilityLiveRegion="polite" style={{ padding: spacing.md }}>
              {note}
            </AppText>
          )}
        </Section>

        <Section title="Accounts">
          {PLATFORM_IDS.map((id, i) => {
            const name = platformLabel(id);
            const on = connected.includes(id);
            return (
              <Row
                key={id}
                label={on ? name : `Connect ${name}`}
                detail={on ? 'Connected' : 'Sign in on its own page'}
                onPress={on ? undefined : () => router.push({ pathname: '/(onboarding)/login', params: { platform: id } })}
                last={i === PLATFORM_IDS.length - 1}
              />
            );
          })}
        </Section>

        <Section title="Show">
          <Row label="Reload current page" onPress={() => { emitWebEvent('reload'); router.back(); }} />
          <Row label="Sign out and clear data" tone="removedOnDark" onPress={signOut} last />
        </Section>

        <Section title="Coming later">
          <Row label="Lock the Instagram app" detail="Use Screen Time to block the Instagram app, with two 5-minute passes a day." disabled={!FEATURE_LOCK_INSTAGRAM_APP} last />
        </Section>

        <Section title="Privacy, terms and contact">
          <AppText variant="small" style={{ padding: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.hairline }}>
            OnlyDM shows each app's own website. You sign in on their page, and OnlyDM never reads, stores or sends your password, cookies or
            messages. It has no analytics. The only things stored on this device are your onboarding answers and which accounts you're signed in to.
          </AppText>
          <Row label="Privacy Policy" onPress={() => openDoc('privacy')} />
          <Row label="Terms of Use" onPress={() => openDoc('terms')} />
          <Row label="Contact" detail={CONTACT_EMAIL} onPress={() => Linking.openURL(CONTACT_URL).catch(() => {})} last />
        </Section>

        <Section title="About">
          <View accessible style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.hairline }}>
            <OnlyDMMark size={sizes.touch} />
            <View style={{ gap: 2 }}>
              <Wordmark variant="heading" />
              <AppText variant="small" muted>Reply and leave.</AppText>
            </View>
          </View>
          <Row label="Version" detail={Constants.expoConfig?.version ?? '1.0.0'} />
          <Row label="Rules pack" detail={`v${pack.version}`} />
          <AppText variant="small" muted style={{ padding: spacing.md }}>
            Not affiliated with Meta.
          </AppText>
        </Section>
      </View>
    </Screen>
  );
}
