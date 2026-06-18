import { DataTable } from "@/components/ui/custom/data-table";
import { rolesColumns } from "@/components/roles/columns";
import { DashboardHeader } from "@/components/ui/custom/dashboard-header";
import { getAllAdmins } from "@/services/admin";
import { AddAdminModal } from "@/components/roles/AddAdminModal";

export default async function RolesPage() {

  const { data: admins } = await getAllAdmins();

  return (
    <div className="space-y-6 p-1">
      <DashboardHeader
        title="Admin & Role Management"
        description="Configure admin access levels and role-based permissions."
        length={admins.length}
      >
        <AddAdminModal />
      </DashboardHeader>
      <DataTable columns={rolesColumns} data={admins} pageSize={admins.length} />
    </div>
  );
}
