import { createFileRoute } from "@tanstack/react-router";
import { NotificationsScreen } from "@/screens/ProfileScreens";

export const Route = createFileRoute("/_app/notifications")({
  component: NotificationsScreen,
});
