
import { DataTable } from "@/components/ui/custom/data-table";
import { teamsColumns } from "@/components/teams/columns";
import { DashboardHeader } from "@/components/ui/custom/dashboard-header";
import { getOurTeam } from "@/services/team";
import { AddTeamModal } from "@/components/teams/AddTeamModal";

export default async function TeamPage() {

  const { data: ourTeam } = await getOurTeam();

  return (
    <div className="space-y-6 p-1">
      <DashboardHeader
        title="Team & Lawyers Management"
        description="Manage authorized lawyers, partners, and staff members."
        length={ourTeam.length}
      >
        <AddTeamModal />
      </DashboardHeader>
      <DataTable columns={teamsColumns} data={ourTeam} pageSize={ourTeam.length} />
    </div>
  );
}

