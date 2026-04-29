import { AddClientModal } from "@/components/clients/AddClientModal";
import { clientLogosColumns } from "@/components/clients/columns";
import { DataTable } from "@/components/ui/custom/data-table";
import PageHeader from "@/components/ui/custom/page-header";
import { getAllClients } from "@/services/client";


export default async function ClientsPage () {

  const { data: clients } = await getAllClients(); 

  return (
    <div className="space-y-6 p-1">
      <div className="flex gap-4 flex-col md:flex-row md:items-center justify-between">
        <PageHeader
          title="Our Clients Management"
          description="Manage client logos and testimonials displayed on the website."
          length={clients.length}
        />
        <AddClientModal /> 
      </div>

      <DataTable
        columns={clientLogosColumns}
        data={clients}
        pageSize={clients.length}
      />
    </div>
  );
}
