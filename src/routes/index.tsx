import { createFileRoute } from "@tanstack/react-router";
import { SplashScreen } from "@/screens/SplashScreen";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "KJ Gilbertson CPA" },
      { name: "description", content: "Book tax and accounting appointments with KJ Gilbertson CPA LLC in Las Vegas." },
    ],
  }),
  component: SplashScreen,
});
