import { createFileRoute } from "@tanstack/react-router";
import { ContactScreen } from "@/screens/ProfileScreens";

export const Route = createFileRoute("/_app/profile/contact")({
  component: ContactScreen,
});
