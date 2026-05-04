import { DataTable } from "@/components/ui/custom/data-table";
import { supportColumns } from "@/components/support/columns";
import PageHeader from "@/components/ui/custom/page-header";
import { getAllContacts } from "@/services/contact";
import { SearchParams } from "@/types/global.types";
import { CommonSearch } from "@/components/common/commom-search";

export default async function SupportPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const { data: contacts, meta } = await getAllContacts(params);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <PageHeader
          title="Support Management"
          description="Handle customer support tickets and inquiries."
          length={meta?.total || 0}
        />
        <CommonSearch />
      </div>

      <DataTable columns={supportColumns} data={contacts} meta={meta} />
    </div>
  );
}
