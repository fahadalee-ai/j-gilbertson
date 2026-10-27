import { createFileRoute } from "@tanstack/react-router";
import { LegalScreen } from "@/screens/ProfileScreens";

export const Route = createFileRoute("/_app/profile/privacy")({
  component: function PrivacyRoute() {
    return <LegalScreen kind="privacy" />;
  },
});
