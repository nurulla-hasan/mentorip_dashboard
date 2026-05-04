import PageHeader from "@/components/ui/custom/page-header";
import { ContactLocationsModal } from "@/components/contact/ContactLocationsModal";
import { DigitalPresenceModal } from "@/components/contact/DigitalPresenceModal";
import { getOfficeCards, getHotlineAndSocials } from "@/services/contact";
import * as LucideIcons from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <PageHeader
          title="Contact Us - Locations"
          description="Edit Global Liaison Offices cards shown on the Contact page."
        />
        <ContactLocationsModal initialValues={initialValues} />
      </div>

      {/* Main Content Section - Locations */}
      <section className="space-y-8 max-w-5xl mx-auto bg-card p-6 rounded-3xl">
        {/* Grid Layout */}
        <div className="grid gap-6 md:grid-cols-2">
          {locations.map((location, index) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const IconComponent = (LucideIcons as any)[location.iconName] || LucideIcons.MapPin;
            
            return (
              <div
                key={`${location.officeName}-${index}`}
                className="group relative flex flex-col justify-between rounded-[2.5rem] border bg-card p-8 transition-all hover:shadow-lg"
              >
                {/* Badge & Icon */}
                <div className="flex items-start justify-between">
                  <span className="rounded-full bg-red-50 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-red-600 dark:bg-red-500/10">
                    {location.badge}
                  </span>
                  <div className="flex items-center justify-center rounded-2xl bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    <IconComponent className="h-5 w-5" />
                  </div>
                </div>

                {/* Content */}
                <div className="mt-6 space-y-3">
                  <h3 className="text-2xl font-bold tracking-tight uppercase">
                    {location.officeName}
                  </h3>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    Key Person: <span className="text-foreground">{location.keyPerson}</span>
                  </p>
                  <p className="text-sm leading-relaxed text-muted-foreground line-clamp-2">
                    {location.address}
                  </p>
                </div>

                {/* Footer Info */}
                <div className="mt-8 space-y-3 border-t pt-6">
                  <div className="flex items-center gap-3 text-sm font-bold">
                    <LucideIcons.Phone className="h-4 w-4 text-muted-foreground" />
                    {location.phone}
                  </div>
                  <div className="flex items-center gap-3 text-sm font-bold">
                    <LucideIcons.Mail className="h-4 w-4 text-muted-foreground" />
                    {location.email}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Hotlines & Socials Section */}
      <section className="space-y-8 max-w-5xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-border" />
            <h2 className="text-lg font-bold uppercase tracking-widest text-muted-foreground">
              {digitalPresenceValues.title}
            </h2>
            <div className="h-px flex-1 bg-border" />
            <DigitalPresenceModal initialValues={digitalPresenceValues} />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Hotlines Card */}
            <Card className="rounded-4xl shadow-none bg-linear-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl font-bold uppercase tracking-tight text-emerald-700 dark:text-emerald-400">
                  <LucideIcons.PhoneCall className="h-6 w-6" />
                  Hotlines
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {digitalPresenceValues.hotlines.length > 0 ? (
                  digitalPresenceValues.hotlines.map((hotline, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-white/60 dark:bg-black/20 rounded-2xl backdrop-blur-sm">
                      <span className="font-bold text-sm text-emerald-800 dark:text-emerald-200">{hotline.label}</span>
                      <span className="font-mono text-sm text-emerald-600 dark:text-emerald-400">{hotline.value}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground italic">No hotlines configured.</p>
                )}
              </CardContent>
            </Card>

            {/* Social Links Card */}
            <Card className="rounded-4xl shadow-none bg-linear-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl font-bold uppercase tracking-tight text-blue-700 dark:text-blue-400">
                  <LucideIcons.Share2 className="h-6 w-6" />
                  Social Media
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-4">
                {digitalPresenceValues.socialLinks.length > 0 ? (
                  digitalPresenceValues.socialLinks.map((social, idx) => {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const SocialIcon = (LucideIcons as any)[social.icon.charAt(0).toUpperCase() + social.icon.slice(1)] || LucideIcons.Link;
                    
                    return (
                      <Link 
                        key={idx} 
                        href={social.url}
                        target="_blank"
                        className="flex items-center gap-4 p-4 bg-white/60 dark:bg-black/20 rounded-2xl backdrop-blur-sm hover:bg-white/80 dark:hover:bg-black/30 transition-all group"
                      >
                        <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                          <SocialIcon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-sm text-blue-900 dark:text-blue-100">{social.label}</p>
                          <p className="text-xs text-blue-600/80 dark:text-blue-300/80 truncate">{social.url}</p>
                        </div>
                        <LucideIcons.ExternalLink className="h-4 w-4 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    );
                  })
                ) : (
                   <p className="text-sm text-muted-foreground">No social links configured.</p>
                )}
              </CardContent>
            </Card>
          </div>
      </section>
    </div>
  ); 
}
