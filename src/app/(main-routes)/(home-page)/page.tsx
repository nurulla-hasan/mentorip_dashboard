import CardsGrid from "@/components/dashboard/CardsGrid";
import InquiryGrowthChart from "@/components/dashboard/InquiryGrowthChart";
import ArticleViewsChart from "@/components/dashboard/ArticleViewsChart";
import RecentArticlesTable from "@/components/dashboard/RecentArticlesTable";
import { getAllPosts } from "@/services/posts";
import { getAdminMetaData } from "@/services/user";

export default async function Home() {
  const [{ data: posts }, { data: dashboardData }] = await Promise.all([
    getAllPosts({ limit: "5" }),
    getAdminMetaData(),
  ]);

  return (
    <div className="space-y-6">
      <CardsGrid stats={dashboardData.stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <InquiryGrowthChart data={dashboardData.userGrowthSeries} />
        <ArticleViewsChart data={dashboardData.viewGrowthSeries} />
      </div>

      <RecentArticlesTable posts={posts || []} />
    </div>
  );
}
 