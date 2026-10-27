import { createFileRoute } from "@tanstack/react-router";
import { ProfileScreen } from "@/screens/ProfileScreens";

export const Route = createFileRoute("/_app/profile/")({
  component: ProfileScreen,
});
