import { Linking, Pressable, View } from 'react-native';
import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { ChevronIcon, CloseIcon } from '@/components/Icons';
import { Screen } from '@/components/Screen';
import { isLegalDocId, LEGAL_DOCS, type LegalLink } from '@/legal/content';
import { MANAGE_SUBSCRIPTIONS_URL } from '@/purchases';
import { colors, radius, sizes, spacing } from '@/theme/tokens';

const open = (url: string) =>
  url.startsWith('mailto:') ? Linking.openURL(url).catch(() => {}) : WebBrowser.openBrowserAsync(url).catch(() => Linking.openURL(url));

function LinkRow({ link, last }: { link: LegalLink; last: boolean }) {
  return (
    <Pressable
      accessibilityRole="link"
      accessibilityLabel={link.label}
      onPress={() => open(link.url)}
      style={({ pressed }) => ({
        minHeight: sizes.touch + 4,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.md,
        opacity: pressed ? 0.7 : 1,
        borderBottomWidth: last ? 0 : 1,
        borderBottomColor: colors.hairline,
      })}
    >
      <AppText tone="primaryOnDark" style={{ flex: 1 }}>{link.label}</AppText>
      <ChevronIcon color={colors.textMuted} />
    </Pressable>
  );
}

function Bullet({ text }: { text: string }) {
  return (
    <View style={{ flexDirection: 'row', gap: spacing.sm }}>
      <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.primaryOnDark, marginTop: 9 }} />
      <AppText muted style={{ flex: 1 }}>{text}</AppText>
    </View>
  );
}

/** Terms of Use, Privacy Policy and How to cancel, inside the app (work offline, no website needed). */
export default function LegalScreen() {
  const router = useRouter();
  const { doc } = useLocalSearchParams<{ doc?: string }>();
  if (!isLegalDocId(doc)) return <Redirect href="/" />;
  const d = LEGAL_DOCS[doc];

  const close = (
    <Pressable accessibilityRole="button" accessibilityLabel="Close" onPress={() => router.back()} hitSlop={6} style={{ width: sizes.touch, height: sizes.touch, alignItems: 'center', justifyContent: 'center' }}>
      <CloseIcon color={colors.text} />
    </Pressable>
  );

  return (
    <Screen back={false} headerRight={close} footer={doc === 'cancel' ? <Button label="Manage subscription" onPress={() => open(MANAGE_SUBSCRIPTIONS_URL)} /> : undefined}>
      <View style={{ gap: spacing.lg }}>
        <View style={{ gap: spacing.sm }}>
          {d.effective ? <AppText variant="label" muted>Effective {d.effective}</AppText> : null}
          <AppText variant="title">{d.title}</AppText>
        </View>

        {d.summary ? (
          <View style={{ gap: spacing.sm, padding: spacing.md, borderRadius: radius.card, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.hairline }}>
            {d.summary.map((s) => (
              <Bullet key={s} text={s} />
            ))}
          </View>
        ) : null}

        {d.sections.map((s, i) => (
          <View key={s.heading ?? i} style={{ gap: spacing.sm }}>
            {s.heading ? <AppText variant="heading" style={{ marginTop: spacing.sm }}>{s.heading}</AppText> : null}
            {s.paragraphs?.map((p) => (
              <AppText key={p} muted>{p}</AppText>
            ))}
            {s.bullets?.map((b) => (
              <Bullet key={b} text={b} />
            ))}
            {s.links?.length ? (
              <View style={{ marginTop: spacing.xs, borderRadius: radius.card, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.hairline, overflow: 'hidden' }}>
                {s.links.map((l, j) => (
                  <LinkRow key={l.url} link={l} last={j === s.links!.length - 1} />
                ))}
              </View>
            ) : null}
          </View>
        ))}
      </View>
    </Screen>
  );
}
