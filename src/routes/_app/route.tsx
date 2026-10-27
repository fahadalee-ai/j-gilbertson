import { createFileRoute, Outlet } from "@tanstack/react-router";
import { TabBar } from "@/components/TabBar";

export const Route = createFileRoute("/_app")({
  component: function AppLayout() {
    return (
      <div className="flex h-full min-h-0 flex-col">
        <div className="min-h-0 flex-1 overflow-hidden">
          <Outlet />
        </div>
        <TabBar />
      </div>
    );
  },
});
