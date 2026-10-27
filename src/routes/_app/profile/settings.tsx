import { createFileRoute } from "@tanstack/react-router";
import { SettingsScreen } from "@/screens/ProfileScreens";

export const Route = createFileRoute("/_app/profile/settings")({
  component: SettingsScreen,
});
