import { createFileRoute } from "@tanstack/react-router";
import { AboutScreen } from "@/screens/ProfileScreens";

export const Route = createFileRoute("/_app/profile/about")({
  component: AboutScreen,
});
