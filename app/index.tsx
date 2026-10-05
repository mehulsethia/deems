import { Redirect } from 'expo-router';

/** Entry gate. Milestone 3 routes returning signed-in users to the inbox and resumes onboarding. */
export default function Index() {
  return <Redirect href="/(onboarding)/welcome" />;
}
