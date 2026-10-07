import { useEffect, useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { OnlyDMMark } from '@/components/OnlyDMMark';
import { CloseIcon, TickIcon } from '@/components/Icons';
import { Loader } from '@/components/Loader';
import { Screen } from '@/components/Screen';
import { socialProof } from '@/config/socialProof';
import type { LegalDocId } from '@/legal/content';
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
  periodWord,
  pricePerMonth,
  STORE,
  trialEndDate,
  yearlySavingsAmount,
  yearlySavingsPercent,
  type Plan,
} from '@/purchases';
import { progressFor } from '@/state/onboardingSteps';
import { markOnboardingComplete, saveStep } from '@/state/progress';
import { colors, fonts, radius, sizes, spacing } from '@/theme/tokens';
import { useLayout } from '@/theme/useLayout';

/** Underlined text link, at least 44pt tall. */
function FooterLink({ label, onPress, role = 'link', disabled }: { label: string; onPress: () => void; role?: 'link' | 'button'; disabled?: boolean }) {
  return (
    <Pressable accessibilityRole={role} accessibilityState={{ disabled: !!disabled }} onPress={onPress} disabled={disabled} hitSlop={4} style={{ minHeight: sizes.touch, justifyContent: 'center' }}>
      <AppText variant="caption" muted style={{ textDecorationLine: 'underline' }}>{label}</AppText>
    </Pressable>
  );
}

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
        <AppText variant="bodyMedium" style={{ fontFamily: fonts.bodyBold, fontVariant: ['tabular-nums'] }}>{day}</AppText> - {text}
      </AppText>
    </View>
  );
}

function PlanCard({
  p,
  on,
  stacked,
  savePercent,
  saveAmount,
  onPress,
}: {
  p: Plan;
  on: boolean;
  stacked: boolean;
  savePercent: number | null;
  saveAmount: string | null;
  onPress: () => void;
}) {
  const yearly = p.kind === 'yearly';
  const name = yearly ? 'Yearly' : 'Monthly';
  const perMonth = formatPrice(pricePerMonth(p), p.currencyCode);
  const label =
    `${name} plan, ${p.priceString} per ${periodWord(p.kind)}` +
    (yearly ? `, ${perMonth} a month` : '') +
    (p.trialDays ? `, ${p.trialDays} days free` : '') +
    (savePercent && saveAmount ? `, save ${savePercent}%, ${saveAmount} a year` : '');
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected: on }}
      accessibilityLabel={label}
      onPress={onPress}
      style={{
        flex: stacked ? undefined : 1,
        minHeight: stacked ? 96 : 150,
        borderRadius: radius.card,
        borderWidth: 2,
        borderColor: on ? colors.primary : colors.hairline,
        backgroundColor: colors.surface,
        padding: spacing.md,
        paddingTop: p.trialDays ? spacing.lg : spacing.md,
        gap: spacing.xs,
        justifyContent: 'center',
      }}
    >
      {p.trialDays ? (
        <View style={{ position: 'absolute', top: -12, alignSelf: 'center', backgroundColor: colors.primary, borderRadius: radius.pill, paddingHorizontal: spacing.md, paddingVertical: 3 }}>
          <AppText variant="label" tone="onPrimary">{p.trialDays} days free</AppText>
        </View>
      ) : null}
      <AppText variant="bodyMedium">{name}</AppText>
      <AppText variant="heading" style={{ fontVariant: ['tabular-nums'] }}>
        {yearly ? perMonth : p.priceString}
        <AppText variant="small" muted> / month</AppText>
      </AppText>
      {yearly ? <AppText variant="caption" muted>{p.priceString} billed yearly</AppText> : <AppText variant="caption" muted>Billed monthly</AppText>}
      {savePercent ? (
        <AppText variant="label" tone="primaryOnDark" style={{ marginTop: 2 }}>
          Save {savePercent}%
        </AppText>
      ) : null}
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
  // Savings are only shown when computed from the store's real prices.
  const savePercent = yearly && monthly ? yearlySavingsPercent(monthly, yearly) : null;
  const saveRaw = yearly && monthly ? yearlySavingsAmount(monthly, yearly) : null;
  const saveAmount = saveRaw && yearly ? formatPrice(saveRaw, yearly.currencyCode) : null;
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
  const openDoc = (doc: LegalDocId) => router.push({ pathname: '/legal/[doc]', params: { doc } });

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
      headerLeft={<OnlyDMMark size={28} label="OnlyDM" />}
      headerRight={closeButton}
      footer={
        <>
          {trialDays ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm }}>
              <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' }}>
                <TickIcon size={11} color={colors.onPrimary} />
              </View>
              <AppText variant="bodyMedium">No payment due now</AppText>
            </View>
          ) : null}
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
          <View style={{ flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center' }}>
            <AppText variant="caption" muted>Cancel anytime · </AppText>
            <FooterLink label="How to cancel" onPress={() => openDoc('cancel')} />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', columnGap: spacing.lg }}>
            <FooterLink label="Terms of Use" onPress={() => openDoc('terms')} />
            <FooterLink label="Privacy Policy" onPress={() => openDoc('privacy')} />
            <FooterLink label="Restore" role="button" onPress={doRestore} disabled={busy} />
          </View>
        </>
      }
      pane={
        <View style={{ gap: spacing.lg }}>
          {mode === 'dev' && (
            <AppText variant="caption" muted>
              Dev mode: no store keys are set, so purchases are simulated and everything is unlocked. Prices shown are the US launch prices.
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
              <PlanCard
                key={p.id}
                p={p}
                on={p.id === selected}
                stacked={stackPlans}
                savePercent={p.kind === 'yearly' ? savePercent : null}
                saveAmount={p.kind === 'yearly' ? saveAmount : null}
                onPress={() => setSelected(p.id)}
              />
            ))}
          </View>

          {saveAmount && savePercent ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm }}>
              <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' }}>
                <TickIcon size={11} color={colors.onPrimary} />
              </View>
              <AppText variant="bodyMedium">
                Yearly saves you {saveAmount} a year
              </AppText>
            </View>
          ) : null}

          {error && (
            <AppText variant="small" tone="removedOnDark" accessibilityLiveRegion="polite">
              {error}
            </AppText>
          )}

          {/* The store's renewal terms scroll with the content; the links below stay pinned. */}
          {plan ? (
            <AppText variant="caption" muted center>
              {cancellationNote(plan, now, STORE)}
            </AppText>
          ) : null}

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
