import { AppShell } from "@/components/layout/AppShell";
import { OnboardingScreen } from "@/components/connection/OnboardingScreen";
import { UserMenu } from "@/components/layout/UserMenu";

export default function OnboardingPage() {
  return (
    <AppShell
      headerEnd={<UserMenu />}
      mainClassName="flex flex-col items-center px-spacing-xlarge py-spacing-xxxlarge"
    >
      <div className="w-full max-w-160">
        <OnboardingScreen />
      </div>
    </AppShell>
  );
}
