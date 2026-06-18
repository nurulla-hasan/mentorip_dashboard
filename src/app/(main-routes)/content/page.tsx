import { DashboardHeader } from "@/components/ui/custom/dashboard-header";

export default async function ContentPage() {
  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Content Management"
        description="Manage homepage banners, footer links, and other static content."
      />
      <div className="p-4 rounded-lg border border-border bg-card text-card-foreground shadow-sm">
        <p>Manage homepage banners, footer links, and other static content.</p>
      </div>
    </div>
  );
}
