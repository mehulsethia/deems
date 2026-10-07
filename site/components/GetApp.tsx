import QRCode from 'qrcode';
import { site } from '@/lib/site';
import { Reveal } from './Reveal';
import { androidCta, primaryCta, PrimaryButton } from './StoreButtons';

/** The trial, then a QR code to the download (or early-access) link. No prices: those live in the app. */
export async function GetApp() {
  const qr = await QRCode.toString(primaryCta.href, {
    type: 'svg',
    margin: 0,
    errorCorrectionLevel: 'M',
    color: { dark: '#0A0A0A', light: '#FFFFFF' },
  });
  const launched = Boolean(site.appStoreUrl);
  const reminderDay = site.trialDays - site.reminderDaysBefore;
  return (
    <section className="section s-white" id="get">
      <div className="wrap getapp">
        <Reveal className="getapp-copy">
          <span className="label">Get the app</span>
          <h2 className="title">
            Try it for <em>{site.trialDays} days.</em>
          </h2>
          <ol className="timeline">
            <li>
              <b>Today</b>
              <span>Your messages, nothing else</span>
            </li>
            <li>
              <b>Day {reminderDay}</b>
              <span>We remind you</span>
            </li>
            <li>
              <b>Day {site.trialDays}</b>
              <span>Billing starts unless you cancel</span>
            </li>
          </ol>
          <div className="cta-row">
            <PrimaryButton />
            <a className="text-link" href={androidCta.href}>
              {androidCta.label}
            </a>
          </div>
          <p className="fine">Free for {site.trialDays} days on yearly. Prices are shown in the app, in your currency.</p>
        </Reveal>
        <Reveal delay={0.08}>
          <a className="qr-card" href={primaryCta.href}>
            <span className="qr" dangerouslySetInnerHTML={{ __html: qr }} />
            <span className="qr-caption">
              {launched ? 'Scan to get OnlyDM' : 'Scan for early access'}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M12 5v14M6 13l6 6 6-6" />
              </svg>
            </span>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
