
import { DataTable } from "@/components/ui/custom/data-table";
import { teamsColumns } from "@/components/teams/columns";
import PageHeader from "@/components/ui/custom/page-header";
import { getOurTeam } from "@/services/team";
import { AddTeamModal } from "@/components/teams/AddTeamModal";

export default async function TeamPage() {

  const { data: ourTeam } = await getOurTeam();

  return (
    <div className="space-y-6 p-1">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Team & Lawyers Management"
          description="Manage authorized lawyers, partners, and staff members."
          length={ourTeam.length}
        />
        <AddTeamModal />
      </div>
      <DataTable columns={teamsColumns} data={ourTeam} pageSize={ourTeam.length} />
    </div>
  );
}

