import { DashboardHeader } from "@/components/ui/custom/dashboard-header";
import { ContactLocationsModal } from "@/components/contact/ContactLocationsModal";
import { DigitalPresenceModal } from "@/components/contact/DigitalPresenceModal";
import { getOfficeCards, getHotlineAndSocials } from "@/services/contact";
import * as LucideIcons from "lucide-react";
import Link from "next/link";

interface OfficeCardsApiData {
  _id?: string;
  title?: string;
  cards?: {
    badge?: string;
    icon?: string;
    officeName?: string;
    keyPerson?: string;
    address?: string;
    phone?: string;
    email?: string;
  }[];
  createdAt?: string;
  updatedAt?: string;
}

interface HotlineAndSocialsApiData {
  _id?: string;
  title?: string;
  hotlines?: {
    label: string;
    value: string;
  }[];
  socialLinks?: {
    label: string;
    icon: string;
    url: string;
  }[];
  createdAt?: string;
  updatedAt?: string;
}

function mapOfficeCardsApiToForm(
  data: OfficeCardsApiData | null | undefined,
) {
  if (!data || !data.cards || data.cards.length === 0) {
    return {
      title: "",
      locations: [],
    };
  }

  return {
    title: data.title || "",
    locations: data.cards.map((card) => {
      return {
        badge: card.badge ?? "",
        officeName: card.officeName ?? "",
        keyPerson: card.keyPerson ?? "",
        address: card.address ?? "",
        phone: card.phone ?? "",
        email: card.email ?? "",
        iconName: card.icon ?? "MapPin",
      };
    }),
  };
}

function mapHotlineAndSocialsApiToForm(
  data: HotlineAndSocialsApiData | null | undefined
) {
  return {
    title: data?.title || "Digital Presence",
    hotlines: data?.hotlines?.map(h => ({
      label: h.label || "",
      value: h.value || ""
    })) || [],
    socialLinks: data?.socialLinks?.map(s => ({
      label: s.label || "",
      icon: s.icon || "",
      url: s.url || ""
    })) || []
  };
}

export default async function ContactLocationsEditorPage() {
  const [officeRes, hotlineRes] = await Promise.all([
    getOfficeCards(),
    getHotlineAndSocials(),
  ]);

  const apiData = (officeRes?.success ? (officeRes.data as OfficeCardsApiData) : null);
  const initialValues = mapOfficeCardsApiToForm(apiData);
  const locations = initialValues.locations || [];

  const hotlineData = (hotlineRes?.success ? (hotlineRes.data as HotlineAndSocialsApiData) : null);
  const digitalPresenceValues = mapHotlineAndSocialsApiToForm(hotlineData);

  return (
    <div className="space-y-10">
      {/* Header Section */}
      <DashboardHeader
          title="Contact Us - Locations"
          description="Edit Global Liaison Offices cards shown on the Contact page."
        >
        <ContactLocationsModal initialValues={initialValues} />
      </DashboardHeader>

      {/* Main Content Section - Locations */}
      <section className="max-w-5xl mx-auto w-full">
        {/* Grid Layout */}
        <div className="grid gap-6 md:grid-cols-2">
          {locations.map((location, index) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const IconComponent = (LucideIcons as any)[location.iconName] || LucideIcons.MapPin;
            
            return (
              <div
                key={`${location.officeName}-${index}`}
                className="flex flex-col rounded-3xl border border-border/30 bg-card p-6 md:p-8 transition-shadow hover:shadow-md"
              >
                {/* Badge & Icon */}
                <div className="flex items-start justify-between mb-6">
                  <span className="rounded-full border border-primary/40 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary">
                    {location.badge}
                  </span>
                  <div className="text-muted-foreground">
                    <IconComponent className="h-5 w-5" />
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-1.5 mb-5">
                  <h3 className="text-xl md:text-2xl font-bold text-foreground">
                    {location.officeName}
                  </h3>
                  <p className="text-xs md:text-sm font-bold text-muted-foreground">
                    Key Person: <span className="text-foreground/90">{location.keyPerson}</span>
                  </p>
                </div>
                
                <p className="text-sm leading-relaxed text-muted-foreground mb-8">
                  {location.address}
                </p>

                {/* Footer Info */}
                <div className="mt-auto space-y-3">
                  <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
                    <LucideIcons.Phone className="h-4 w-4" />
                    {location.phone}
                  </div>
                  <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
                    <LucideIcons.Mail className="h-4 w-4" />
                    {location.email}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Hotlines & Socials Section */}
      <section className="max-w-5xl mx-auto w-full pt-8">
        <div className="flex justify-end mb-4">
          <DigitalPresenceModal initialValues={digitalPresenceValues} />
        </div>

        <div className="rounded-3xl border border-border/30 bg-card p-6 md:p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <LucideIcons.MessageCircle className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-foreground">
                Hotline & Socials
              </h3>
              <p className="text-[10px] md:text-xs font-bold tracking-[0.2em] text-muted-foreground uppercase mt-1">
                Stay connected 24/7
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {digitalPresenceValues.hotlines.map((hotline, idx) => (
              <div
                key={`hotline-${idx}`}
                className="flex items-center justify-between rounded-2xl border border-border/5 bg-background/50 dark:bg-black/20 p-5 transition-colors hover:bg-background/80 dark:hover:bg-black/40"
              >
                <span className="text-xs md:text-sm font-bold uppercase tracking-wider text-foreground/90">
                  {hotline.label}
                </span>
                <span className="text-sm font-bold text-primary">
                  {hotline.value}
                </span>
              </div>
            ))}

            {digitalPresenceValues.socialLinks.map((social, idx) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const SocialIcon = (LucideIcons as any)[social.icon.charAt(0).toUpperCase() + social.icon.slice(1)];
              
              return (
                <Link
                  key={`social-${idx}`}
                  href={social.url}
                  target="_blank"
                  className="flex items-center justify-between rounded-2xl border border-border/5 bg-background/50 dark:bg-black/20 p-5 transition-colors hover:bg-background/80 dark:hover:bg-black/40 group"
                >
                  <div className="flex items-center gap-3">
                    {SocialIcon && <SocialIcon className="h-4 w-4 text-primary" />}
                    <span className="text-xs md:text-sm font-bold uppercase tracking-wider text-foreground/90">
                      {social.label}
                    </span>
                  </div>
                  <LucideIcons.ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  ); 
}
