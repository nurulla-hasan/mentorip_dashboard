import PageHeader from "@/components/ui/custom/page-header";
import { getPageByType } from "@/services/pages";
import { PageContentForm } from "@/components/common/PageContentForm";

export default async function PrivacyPolicy() {
  const res = await getPageByType("PRIVACY_POLICY");
  const initialContent = res?.data?.content || "";
  const initialTitle = res?.data?.title || "Privacy Policy";

  return (
    <div className="p-2">
      <PageHeader 
        title="Privacy Policy" 
        description="Manage your website's privacy policy and data protection terms."
      />
      
      <PageContentForm 
        initialContent={initialContent} 
        initialTitle={initialTitle}
        type="PRIVACY_POLICY" 
      />
    </div>
  );
}