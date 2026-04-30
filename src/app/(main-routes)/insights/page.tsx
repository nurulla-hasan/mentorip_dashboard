
import Link from "next/link";
import { CommonSearch } from "@/components/common/commom-search";
import { insightsPostsColumns } from "@/components/insights/columns";
import { DataTable } from "@/components/ui/custom/data-table";
import PageHeader from "@/components/ui/custom/page-header";
import { getAllPosts } from "@/services/posts";
import { SearchParams } from "@/types/global.types";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";


export default async function InsightsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const isFeaturedFilter = params.isFeatured === "true";

  const { data: posts, meta } = await getAllPosts(params);

  return (
    <div className="space-y-6 p-1">
      <div className="flex justify-between items-end">
        <PageHeader
          title="Legal Insights Management"
          description="Manage blog posts, articles, and legal updates."
          length={meta?.total || 0}
        />

        <div className="flex items-center gap-2">
          <Button
            variant={isFeaturedFilter ? "default" : "outline"}
            size="sm"
            className={cn(isFeaturedFilter && "bg-yellow-500 hover:bg-yellow-600")}
            asChild
          >
            <Link href={isFeaturedFilter ? "/insights" : "/insights?isFeatured=true"}>
              <Star className="h-4 w-4 mr-2" />
              {isFeaturedFilter ? "Showing Featured" : "Filter Featured"}
            </Link>
          </Button>
          <CommonSearch />
        </div>
      </div>
      <DataTable
        columns={insightsPostsColumns}
        data={posts}
        meta={meta}
      />
    </div>
  );
}

