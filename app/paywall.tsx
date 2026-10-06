import { useEffect, useMemo, useState } from 'react';
import { Linking, Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { DeemsMark } from '@/components/DeemsMark';
import { CloseIcon } from '@/components/Icons';
import { Loader } from '@/components/Loader';
import { Screen } from '@/components/Screen';
import { HOW_TO_CANCEL_URL } from '@/config/links';
import { socialProof } from '@/config/socialProof';
import { scheduleTrialReminder } from '@/notifications/trialReminder';
import { trialTimeline } from '@/notifications/timeline';
import { formatDaysCaps } from '@/onboarding/maths';
import { useBreakdown } from '@/onboarding/useAnswers';
import { usePayments } from '@/purchases/PaymentsProvider';
import {
  billingSummary,
  cancellationNote,
  formatDate,
  formatPrice,
  LEGAL,
  periodWord,
  STORE,
  trialEndDate,
  yearlySavingsPercent,
  type Plan,
} from '@/purchases';
import { progressFor } from '@/state/onboardingSteps';
import { markOnboardingComplete, saveStep } from '@/state/progress';
import { colors, fonts, radius, sizes, spacing } from '@/theme/tokens';
import { useLayout } from '@/theme/useLayout';

const open = (url: string) => (url ? WebBrowser.openBrowserAsync(url).catch(() => Linking.openURL(url)) : undefined);

function MiniReceipt({ days }: { days: string }) {
  return (
    <View
      accessible
      accessibilityLabel={`Time refunded per year: ${days.toLowerCase()}.`}
      style={{ alignSelf: 'flex-start', backgroundColor: colors.paper, borderRadius: 4, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, flexDirection: 'row', flexWrap: 'wrap', columnGap: spacing.lg, transform: [{ rotate: '-1.5deg' }] }}
    >
      <AppText variant="receipt" tone="onPaper">TIME REFUNDED PER YEAR</AppText>
      <AppText variant="receipt" tone="onPaper" style={{ fontFamily: fonts.monoBold }}>{days}</AppText>
    </View>
  );
}

/** "Today - your messages, nothing else", with the day in mono. Copy kept exact. */
function Step({ day, text, last }: { day: string; text: string; last?: boolean }) {
  return (
    <View style={{ flexDirection: 'row', gap: spacing.md }}>
      <View style={{ alignItems: 'center', width: 12 }}>
        <View style={{ width: 12, height: 12, borderRadius: 6, marginTop: 6, backgroundColor: last ? colors.text : colors.primary }} />
        {!last && <View style={{ flex: 1, width: 2, backgroundColor: colors.hairline, marginTop: 2 }} />}
      </View>
      <AppText style={{ flex: 1, paddingBottom: last ? 0 : spacing.md }}>
        <AppText variant="mono" style={{ fontFamily: fonts.monoMedium, fontSize: 17 }}>{day}</AppText> - {text}
      </AppText>
    </View>
  );
}

function PlanCard({ p, on, stacked, savings, onPress }: { p: Plan; on: boolean; stacked: boolean; savings: number | null; onPress: () => void }) {
  const name = p.kind === 'yearly' ? 'Yearly' : 'Monthly';
  const perMonth = p.kind === 'yearly' ? formatPrice(p.price / 12, p.currencyCode) : null;
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected: on }}
      accessibilityLabel={`${name} plan, ${p.priceString} per ${periodWord(p.kind)}${perMonth ? `, ${perMonth} a month` : ''}${savings ? `, save ${savings}%` : ''}`}
      onPress={onPress}
      style={{ flex: stacked ? undefined : 1, minHeight: stacked ? 88 : 112, borderRadius: radius.card, borderWidth: 2, borderColor: on ? colors.primary : colors.hairline, backgroundColor: colors.surface, padding: spacing.md, gap: spacing.xs }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing.sm }}>
        <AppText variant="bodyMedium">{name}</AppText>
        {savings ? (
          <View style={{ backgroundColor: colors.primary, borderRadius: radius.pill, paddingHorizontal: spacing.sm }}>
            <AppText variant="label" tone="onPrimary">Save {savings}%</AppText>
          </View>
        ) : null}
      </View>
      <AppText variant="mono" style={{ fontSize: 20, lineHeight: 26 }}>{p.priceString}</AppText>
      <AppText variant="caption" muted>
        per {periodWord(p.kind)}
        {perMonth ? ` · ${perMonth} a month` : ''}
      </AppText>
    </Pressable>
  );
}

export default function Paywall() {
  const router = useRouter();
  const b = useBreakdown();
  const { mode, plans, plansError, loadPlans, purchase, restore, busy, error, isPro } = usePayments();
  const [selected, setSelected] = useState<string | null>(null);
  const now = useMemo(() => new Date(), []);
  const proof = socialProof();
  const { narrow, fontScale } = useLayout();
  const stackPlans = narrow || fontScale > 1.15;

  useEffect(() => saveStep('paywall'), []);
  useEffect(() => {
    loadPlans();
  }, [loadPlans]);
  useEffect(() => {
    if (plans.length && !selected) setSelected(plans[0].id);
  }, [plans, selected]);

  const plan = plans.find((p) => p.id === selected) ?? null;
  const yearly = plans.find((p) => p.kind === 'yearly');
  const monthly = plans.find((p) => p.kind === 'monthly');
  // A saving is only shown when computed from the store's real prices.
  const savings = yearly && monthly ? yearlySavingsPercent(monthly, yearly) : null;
  const trialDays = plan?.trialDays ?? null;
  const billingDate = trialDays ? formatDate(trialEndDate(now, trialDays)) : null;
  const timeline = trialDays ? trialTimeline(trialDays) : null;
  const days = formatDaysCaps(b.days);

  const finish = () => {
    markOnboardingComplete();
    router.replace('/(main)/inbox');
  };
  // Already subscribed (for example after restoring on a new device): nothing to buy.
  useEffect(() => {
    if (isPro && mode === 'live') finish();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPro, mode]);

  const close = () => (isPro ? finish() : router.canGoBack() ? router.back() : router.replace('/(onboarding)/reveal'));

  const buy = async () => {
    if (!plan) return;
    if ((await purchase(plan.id)) === 'purchased') {
      if (plan.trialDays && billingDate) await scheduleTrialReminder(new Date(), plan.trialDays, billingDate);
      finish();
    }
  };
  const doRestore = async () => {
    if (await restore()) finish();
  };

  const firstCharge = plan
    ? trialDays && billingDate
      ? `${plan.priceString} per ${periodWord(plan.kind)}, first charged on ${billingDate}.`
      : billingSummary(plan, now)
    : null;

  const closeButton = (
    <Pressable accessibilityRole="button" accessibilityLabel="Close" onPress={close} hitSlop={6} style={{ width: sizes.touch, height: sizes.touch, alignItems: 'center', justifyContent: 'center' }}>
      <CloseIcon color={colors.text} />
    </Pressable>
  );

  return (
    <Screen
      back={false}
      paneFirst={false}
      progress={progressFor('paywall')}
      headerLeft={<DeemsMark size={28} label="Deems" />}
      headerRight={closeButton}
      footer={
        <>
          {mode === 'dev' ? (
            <Button label="Continue (dev mode)" onPress={finish} />
          ) : (
            <Button label={trialDays ? `Start ${trialDays} days free` : 'Subscribe'} onPress={buy} disabled={!plan || busy} />
          )}
          {firstCharge && (
            <AppText variant="small" center accessibilityLiveRegion="polite">
              {firstCharge}
            </AppText>
          )}
          <View style={{ flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', columnGap: spacing.md }}>
            <Pressable accessibilityRole="button" onPress={doRestore} disabled={busy} style={{ minHeight: sizes.touch, justifyContent: 'center' }}>
              <AppText variant="caption" muted>Restore</AppText>
            </Pressable>
            <Pressable accessibilityRole="link" onPress={() => open(LEGAL.terms)} style={{ minHeight: sizes.touch, justifyContent: 'center' }}>
              <AppText variant="caption" muted>Terms</AppText>
            </Pressable>
            <Pressable
              accessibilityRole="link"
              accessibilityState={{ disabled: !LEGAL.privacy }}
              onPress={() => open(LEGAL.privacy)}
              disabled={!LEGAL.privacy}
              style={{ minHeight: sizes.touch, justifyContent: 'center', opacity: LEGAL.privacy ? 1 : 0.4 }}
            >
              <AppText variant="caption" muted>Privacy</AppText>
            </Pressable>
            <Pressable accessibilityRole="link" onPress={() => open(HOW_TO_CANCEL_URL)} style={{ minHeight: sizes.touch, justifyContent: 'center' }}>
              <AppText variant="caption" muted>How to cancel</AppText>
            </Pressable>
          </View>
        </>
      }
      footerNote={
        plan ? (
          <AppText variant="caption" muted center>
            {cancellationNote(plan, now, STORE)}
          </AppText>
        ) : null
      }
      pane={
        <View style={{ gap: spacing.lg }}>
          {mode === 'dev' && (
            <AppText variant="caption" muted>
              Dev mode: no store keys are set, so everything is unlocked. These prices are placeholders.
            </AppText>
          )}

          {plans.length === 0 && !plansError && <Loader size={32} label="Loading plans" />}
          {plansError && (
            <View style={{ gap: spacing.sm }}>
              <AppText>Couldn't load the plans.</AppText>
              <Button label="Try again" variant="secondary" onPress={loadPlans} />
            </View>
          )}

          {/* Side by side when they fit; stacked on narrow phones and at large text sizes. */}
          <View style={{ flexDirection: stackPlans ? 'column' : 'row', gap: spacing.md }} accessibilityRole="radiogroup">
            {plans.map((p) => (
              <PlanCard key={p.id} p={p} on={p.id === selected} stacked={stackPlans} savings={p.kind === 'yearly' ? savings : null} onPress={() => setSelected(p.id)} />
            ))}
          </View>

          {error && (
            <AppText variant="small" tone="removedOnDark" accessibilityLiveRegion="polite">
              {error}
            </AppText>
          )}

          {/* Real social proof only; renders nothing while the hook is empty. */}
          {proof.map((t) => (
            <View key={t.attribution + t.quote} style={{ gap: spacing.xs }}>
              <AppText>“{t.quote}”</AppText>
              <AppText variant="caption" muted>{t.attribution}</AppText>
            </View>
          ))}
        </View>
      }
    >
      <View style={{ gap: spacing.lg }}>
        {days && <MiniReceipt days={days} />}

        <AppText variant="title">{trialDays ? `Try it for ${trialDays} days.` : 'Keep it this way.'}</AppText>

        {timeline && billingDate && (
          <View>
            <Step day="Today" text="your messages, nothing else" />
            {timeline.reminderDay !== null && <Step day={`Day ${timeline.reminderDay}`} text="we remind you" />}
            <Step day={`Day ${timeline.billingDay}`} text={`billing starts on ${billingDate} unless you cancel`} last />
          </View>
        )}
      </View>
    </Screen>
  );
}
