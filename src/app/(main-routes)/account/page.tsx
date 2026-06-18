import { DashboardHeader } from "@/components/ui/custom/dashboard-header";
import { ProfileHeader } from "@/components/account/ProfileHeader";
import { ProfileForm } from "@/components/account/ProfileForm";
import { SecuritySettings } from "@/components/account/SecuritySettings";
import { getCurrentUser } from "@/services/auth";
import { CurrentUser } from "@/types/currentUser.type";

export default async function AccountPage() {
  const user: CurrentUser = await getCurrentUser();

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="My Account"
        description="Manage your profile information and security settings."
      />
       
      <ProfileHeader user={user} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProfileForm user={user} />
        <SecuritySettings />
      </div>
    </div>
  );
}
