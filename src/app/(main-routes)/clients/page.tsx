import { AddClientModal } from "@/components/clients/AddClientModal";
import { clientLogosColumns } from "@/components/clients/columns";
import { DataTable } from "@/components/ui/custom/data-table";
import { DashboardHeader } from "@/components/ui/custom/dashboard-header";
import { getAllClients } from "@/services/client";


export default async function ClientsPage () {

  const { data: clients } = await getAllClients(); 

  return (
    <div className="space-y-6 p-1">
      <DashboardHeader
        title="Our Clients Management"
        description="Manage client logos and testimonials displayed on the website."
        length={clients.length}
      >
        <AddClientModal />
      </DashboardHeader>

      <DataTable
        columns={clientLogosColumns}
        data={clients}
        pageSize={clients.length}
      />
    </div>
  );
}
