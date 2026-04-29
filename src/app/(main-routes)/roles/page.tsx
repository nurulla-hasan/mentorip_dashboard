import { DataTable } from "@/components/ui/custom/data-table";
import { rolesColumns } from "@/components/roles/columns";
import PageHeader from "@/components/ui/custom/page-header";
import { getAllAdmins } from "@/services/admin";
import { AddAdminModal } from "@/components/roles/AddAdminModal";

export default async function RolesPage() {

  const { data: admins } = await getAllAdmins();

  return (
    <div className="space-y-6 p-1">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Admin & Role Management"
          description="Configure admin access levels and role-based permissions."
          length={admins.length}
        />
        <AddAdminModal />
      </div>
      <DataTable columns={rolesColumns} data={admins} pageSize={admins.length} />
    </div>
  );
}
