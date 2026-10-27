import { createFileRoute } from "@tanstack/react-router";
import { RemindersScreen } from "@/screens/ProfileScreens";

export const Route = createFileRoute("/_app/profile/reminders")({
  component: RemindersScreen,
});
