import { createFileRoute } from "@tanstack/react-router";
import { ForgotScreen } from "@/screens/AuthScreens";

export const Route = createFileRoute("/forgot")({
  component: ForgotScreen,
});
