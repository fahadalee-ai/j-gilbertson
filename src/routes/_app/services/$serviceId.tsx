import { createFileRoute } from "@tanstack/react-router";
import { ServiceDetailScreen } from "@/screens/ServicesScreen";

export const Route = createFileRoute("/_app/services/$serviceId")({
  component: function ServiceRoute() {
    const { serviceId } = Route.useParams();
    return <ServiceDetailScreen serviceId={serviceId} />;
  },
});
