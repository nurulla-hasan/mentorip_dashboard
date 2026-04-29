
import { CommonSearch } from "@/components/common/commom-search";
import { insightsPostsColumns } from "@/components/insights/columns";
import { DataTable } from "@/components/ui/custom/data-table";
import PageHeader from "@/components/ui/custom/page-header";
import { getAllPosts } from "@/services/posts";
import { SearchParams } from "@/types/global.types";


export default async function InsightsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;

  const { data: posts, meta } = await getAllPosts(params);

  return (
    <div className="space-y-6 p-1">
      <div className="flex justify-between">
        <PageHeader
          title="Legal Insights Management"
          description="Manage blog posts, articles, and legal updates."
          length={meta?.total || 0}
        />

        <CommonSearch />
      </div>
      <DataTable
        columns={insightsPostsColumns}
        data={posts}
        meta={meta}
      />
    </div>
  );
}

