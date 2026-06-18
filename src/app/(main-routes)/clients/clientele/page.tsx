import { DashboardHeader } from "@/components/ui/custom/dashboard-header";
import { ClienteleModal } from "@/components/clients/CLienteleModal";
import { getClientele } from "@/services/client";
import type { ClienteleApiData, ClienteleValues } from "@/types/clients.types";
import { ShieldCheck } from "lucide-react";

function mapClienteleApiToForm(
  data: ClienteleApiData | null | undefined,
): ClienteleValues {
  if (!data) {
    return {} as ClienteleValues;
  }

  return {
    title: data.title ?? "",
    subtitle: data.subtitle ?? "",
    stats: [
      {
        value: data.stat1Value ?? "",
        label: data.stat1Title ?? "",
      },
      {
        value: data.stat2Value ?? "",
        label: data.stat2Title ?? "",
      },
      {
        value: data.stat3Value ?? "",
        label: data.stat3Title ?? "",
      },
      {
        value: data.stat4Value ?? "",
        label: data.stat4Title ?? "",
      },
    ],
  };
}

export default async function ClienteleEditorPage() {
  const res = await getClientele();
  const initialValues = mapClienteleApiToForm(
    (res && res.success ? (res.data as ClienteleApiData) : null) ?? null,
  );

  return (
    <div className="space-y-16">
      <DashboardHeader
          title="Our Clients - Clientele"
          description="Edit the clientele intro section, stats, and global names list."
        >
        <ClienteleModal initialValues={initialValues} />
      </DashboardHeader>

      <section className="p-6 md:p-10 space-y-10 max-w-6xl mx-auto w-full">
        {/* Header Section */}
        <div className="space-y-6">
          <div className="inline-flex items-center rounded-full border border-primary/40 px-4 py-1.5 text-[10px] md:text-xs font-bold tracking-[0.2em] text-primary uppercase">
            OUR CLIENTELE • EDITORIAL
          </div>
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold leading-tight text-foreground">
            {initialValues.title}
          </h2>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-border" />

        {/* Subtitle & Quote Section */}
        <div className="grid md:grid-cols-[1fr_1fr] gap-8 lg:gap-16">
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            {initialValues.subtitle}
          </p>

          <div className="border-l border-border/60 pl-6 lg:pl-8 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-foreground">
              <ShieldCheck className="w-4 h-4 text-primary" />
              BOUTIQUE LEGAL PRECISION
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              &quot;In the world of Intellectual Property, your assets are as valuable as the protection they receive. Our firm ensures that every trademark, patent, and copyright is handled with the highest level of administrative scrutiny and global legal standards.&quot;
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 pt-4">
          {([0, 1, 2, 3] as const).map((index) => {
            const stat = initialValues.stats?.[index];
            if (!stat) {
              return null;
            }

            return (
              <div
                key={index}
                className="flex flex-col items-center justify-center rounded-3xl border border-border/30 bg-card py-10 px-6 text-center shadow-sm"
              >
                <div className="text-3xl md:text-4xl font-bold text-primary mb-3">
                  {stat.value}
                </div>
                <div className="text-[10px] md:text-[11px] font-bold tracking-[0.2em] uppercase text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  ); 
}
