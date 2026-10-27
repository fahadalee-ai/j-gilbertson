import { createFileRoute } from "@tanstack/react-router";
import { LoginScreen } from "@/screens/AuthScreens";

export const Route = createFileRoute("/login")({
  component: LoginScreen,
});
