import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Linking, Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { ComparisonTable } from '@/components/ComparisonTable';
import { Screen } from '@/components/Screen';
import { usePayments } from '@/purchases/PaymentsProvider';
import { billingSummary, cancellationNote, LEGAL, periodWord, STORE, yearlySavingsPercent, formatPrice } from '@/purchases';
import { markOnboardingComplete, saveStep } from '@/state/progress';
import { radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/ThemeProvider';

const open = (url: string) => (url ? WebBrowser.openBrowserAsync(url).catch(() => Linking.openURL(url)) : undefined);

export default function Paywall() {
  const router = useRouter();
  const { colors } = useTheme();
  const { mode, plans, plansError, loadPlans, purchase, restore, busy, error, isPro } = usePayments();
  const [selected, setSelected] = useState<string | null>(null);
  const now = useMemo(() => new Date(), []);

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
  const savings = yearly && monthly ? yearlySavingsPercent(monthly, yearly) : null;
  const hasTrial = !!plan?.trialDays;

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
    if ((await purchase(plan.id)) === 'purchased') finish();
  };
  const doRestore = async () => {
    if (await restore()) finish();
  };

  return (
    <Screen
      back={false}
      scroll
      footer={
        <>
          {plan && (
            <AppText variant="small" center accessibilityLiveRegion="polite">
              {billingSummary(plan, now)}
            </AppText>
          )}
          {mode === 'dev' ? (
            <Button label="Continue (dev mode)" onPress={finish} />
          ) : (
            <Button label={hasTrial ? `Start ${plan?.trialDays}-day free trial` : 'Subscribe'} onPress={buy} disabled={!plan || busy} />
          )}
          {plan && (
            <AppText variant="caption" muted center>
              {cancellationNote(plan, now, STORE)}
            </AppText>
          )}
        </>
      }
    >
      {/* Clear, always-visible close button. */}
      <View style={{ position: 'absolute', top: -44, right: 0, zIndex: 2 }}>
        <Pressable accessibilityRole="button" accessibilityLabel="Close" onPress={close} hitSlop={12} style={{ minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' }}>
          <AppText variant="bodyMedium">Close</AppText>
        </Pressable>
      </View>

      <View style={{ gap: spacing.lg, paddingBottom: spacing.lg }}>
        <AppText variant="title">{hasTrial ? `Try Hearth free for ${plan?.trialDays} days` : 'Keep Hearth'}</AppText>
        <AppText muted>Just your messages and friends' stories. Cancel any time.</AppText>

        {mode === 'dev' && (
          <Card>
            <AppText variant="small">Dev mode: no store keys are set, so everything is unlocked. These prices are placeholders.</AppText>
          </Card>
        )}

        {plans.length === 0 && !plansError && <ActivityIndicator color={colors.primary} />}
        {plansError && (
          <Card style={{ gap: spacing.sm }}>
            <AppText>We couldn't load the plans.</AppText>
            <Button label="Try again" variant="ghost" onPress={loadPlans} />
          </Card>
        )}

        <View style={{ gap: spacing.md }} accessibilityRole="radiogroup">
          {plans.map((p) => {
            const on = p.id === selected;
            return (
              <Pressable
                key={p.id}
                accessibilityRole="radio"
                accessibilityState={{ selected: on }}
                accessibilityLabel={`${p.kind === 'yearly' ? 'Yearly' : 'Monthly'} plan, ${p.priceString} per ${periodWord(p.kind)}`}
                onPress={() => setSelected(p.id)}
                style={{ borderRadius: radius.card, borderWidth: 2, borderColor: on ? colors.primary : colors.border, backgroundColor: colors.card, padding: spacing.md, gap: 2 }}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <AppText variant="heading">{p.kind === 'yearly' ? 'Yearly' : 'Monthly'}</AppText>
                  {p.kind === 'yearly' && savings ? (
                    <AppText variant="small" accent>Save {savings}%</AppText>
                  ) : null}
                </View>
                <AppText>{p.priceString} per {periodWord(p.kind)}</AppText>
                {p.kind === 'yearly' && (
                  <AppText variant="small" muted>{formatPrice(p.price / 12, p.currencyCode)} a month, billed yearly</AppText>
                )}
              </Pressable>
            );
          })}
        </View>

        {error && <AppText variant="small" accent accessibilityLiveRegion="polite">{error}</AppText>}

        <ComparisonTable />

        <View style={{ flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', gap: spacing.lg }}>
          <Pressable accessibilityRole="button" onPress={doRestore} disabled={busy} style={{ minHeight: 44, justifyContent: 'center' }}>
            <AppText variant="small" accent>Restore purchases</AppText>
          </Pressable>
          <Pressable accessibilityRole="link" onPress={() => open(LEGAL.terms)} style={{ minHeight: 44, justifyContent: 'center' }}>
            <AppText variant="small" accent>Terms</AppText>
          </Pressable>
          <Pressable accessibilityRole="link" onPress={() => open(LEGAL.privacy)} disabled={!LEGAL.privacy} style={{ minHeight: 44, justifyContent: 'center', opacity: LEGAL.privacy ? 1 : 0.4 }}>
            <AppText variant="small" accent>Privacy</AppText>
          </Pressable>
        </View>
      </View>
    </Screen>
  );
}
