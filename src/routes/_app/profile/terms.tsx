import { createFileRoute } from "@tanstack/react-router";
import { LegalScreen } from "@/screens/ProfileScreens";

export const Route = createFileRoute("/_app/profile/terms")({
  component: function TermsRoute() {
    return <LegalScreen kind="terms" />;
  },
});
