import { createFileRoute } from "@tanstack/react-router";
import { BookScreen } from "@/screens/BookScreen";

export const Route = createFileRoute("/_app/book")({
  component: BookScreen,
});
