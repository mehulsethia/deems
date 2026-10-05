import { PlaceholderScreen } from '@/components/PlaceholderScreen';

export default function ScreenSetup() {
  return <PlaceholderScreen title="Setting up" note="Built in milestone 3." next={{ label: "Next", href: "/(onboarding)/reveal" }} />;
}
