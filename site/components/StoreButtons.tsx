import { earlyAccessHref, site } from '@/lib/site';

/**
 * Call-to-action destinations, unchanged: the App Store / Google Play listing once set,
 * the early-access email until then.
 */
export const primaryCta = {
  href: site.appStoreUrl || earlyAccessHref('iPhone'),
  label: site.appStoreUrl ? 'Get DeeMs for iPhone' : 'Get early access',
};

export const androidCta = {
  href: site.playStoreUrl || earlyAccessHref('Android'),
  label: site.playStoreUrl ? 'Also on Android' : 'On Android? Join the list',
};

export function PrimaryButton({ small }: { small?: boolean }) {
  return (
    <a className={`btn btn-primary${small ? ' btn-small' : ''}`} href={primaryCta.href}>
      {primaryCta.label}
    </a>
  );
}

export function AndroidButton() {
  return (
    <a className="btn btn-secondary" href={androidCta.href}>
      {androidCta.label}
    </a>
  );
}

/** The line under a call to action: the risk reversal, in one breath. */
export function TrialNote() {
  return <p className="fine">Free for {site.trialDays} days on yearly. We remind you before it ends.</p>;
}
