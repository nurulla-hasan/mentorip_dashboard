import PageHeader from "@/components/ui/custom/page-header";
import { getPageByType } from "@/services/pages";
import { PageContentForm } from "@/components/common/PageContentForm";

export default async function AboutUs() {
  const res = await getPageByType("ABOUT_US");
  const initialContent = res?.data?.content || "";
  const initialTitle = res?.data?.title || "About Us";

  return (
    <div className="p-2">
      <PageHeader
        title="About Us"
        description="Edit the content of your About Us page."
      />

      <PageContentForm
        initialContent={initialContent}
        initialTitle={initialTitle}
        type="ABOUT_US"
      />
    </div>
  );
}