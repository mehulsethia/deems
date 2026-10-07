import { earlyAccessHref, site } from '@/lib/site';
import { Apple } from './Icons';

/**
 * One primary action. With an App Store link it downloads; before launch it asks for early access by email.
 * Android sits next to it as a quiet text link.
 */
export function StoreButtons({ align = 'start' }: { align?: 'start' | 'center' }) {
  const ios = site.appStoreUrl;
  const android = site.playStoreUrl;
  return (
    <div className="cta-row" style={{ justifyContent: align === 'center' ? 'center' : undefined }}>
      {ios ? (
        <a className="btn btn-primary" href={ios}>
          <Apple /> Get DeeMs for iPhone
        </a>
      ) : (
        <a className="btn btn-primary" href={earlyAccessHref('iPhone')}>
          Get early access
        </a>
      )}
      {android ? (
        <a className="text-link" href={android}>
          Also on Android ↗
        </a>
      ) : (
        <a className="text-link" href={earlyAccessHref('Android')}>
          On Android? Get on the list ↗
        </a>
      )}
    </div>
  );
}

/** The line under every call to action: the risk reversal, in one breath. */
export function TrialNote() {
  return (
    <p className="fine">
      {site.trialDays} days free on yearly. We remind you before it ends. Cancel any time.
    </p>
  );
}
