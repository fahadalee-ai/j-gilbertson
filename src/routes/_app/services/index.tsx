import { createFileRoute } from "@tanstack/react-router";
import { ServicesScreen } from "@/screens/ServicesScreen";

export const Route = createFileRoute("/_app/services/")({
  validateSearch: (search: Record<string, unknown>) => ({
    q: typeof search.q === "string" ? search.q : "",
  }),
  component: function ServicesRoute() {
    const { q } = Route.useSearch();
    return <ServicesScreen initialQuery={q} />;
  },
});
