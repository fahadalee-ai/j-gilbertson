import { createFileRoute } from "@tanstack/react-router";
import { VerifyScreen } from "@/screens/AuthScreens";

export const Route = createFileRoute("/verify")({
  component: VerifyScreen,
});
