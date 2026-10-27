import { createFileRoute } from "@tanstack/react-router";
import { AppointmentDetailScreen } from "@/screens/AppointmentsScreen";

export const Route = createFileRoute("/_app/appointments/$appointmentId")({
  validateSearch: (search: Record<string, unknown>) => ({
    reschedule: search.reschedule === "1" ? "1" : "",
  }),
  component: function AppointmentRoute() {
    const { appointmentId } = Route.useParams();
    const { reschedule } = Route.useSearch();
    return <AppointmentDetailScreen appointmentId={appointmentId} startReschedule={reschedule === "1"} />;
  },
});
