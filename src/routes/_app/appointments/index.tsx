import { createFileRoute } from "@tanstack/react-router";
import { AppointmentsScreen } from "@/screens/AppointmentsScreen";

export const Route = createFileRoute("/_app/appointments/")({
  component: AppointmentsScreen,
});
