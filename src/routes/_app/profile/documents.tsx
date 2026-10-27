import { createFileRoute } from "@tanstack/react-router";
import { DocumentsScreen } from "@/screens/ProfileScreens";

export const Route = createFileRoute("/_app/profile/documents")({
  component: DocumentsScreen,
});
