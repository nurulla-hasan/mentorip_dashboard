import PageHeader from "@/components/ui/custom/page-header";
import { ClienteleModal } from "@/components/clients/CLienteleModal";
import { getClientele } from "@/services/client";
import type { ClienteleApiData, ClienteleValues } from "@/types/clients.types";

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
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <PageHeader
          title="Our Clients - Clientele"
          description="Edit the clientele intro section, stats, and global names list."
        />
        <ClienteleModal initialValues={initialValues} />
      </div>

      <section className="rounded-3xl bg-card p-6 md:p-10 space-y-8 max-w-4xl mx-auto">
        <div className="space-y-3">
          <p className="text-xs font-semibold tracking-[0.35em] text-red-700 uppercase">
            OUR CLIENTELE
          </p>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight text-foreground max-w-3xl">
            {initialValues.title}
          </h2>
          <p className="max-w-3xl text-sm md:text-base text-muted-foreground">
            {initialValues.subtitle}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {([0, 1, 2, 3] as const).map((index) => {
            const stat = initialValues.stats?.[index];
            if (!stat) {
              return null;
            }

            return (
              <div
                key={index}
                className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-card px-8 py-6 shadow-sm"
              >
                <div className="text-3xl font-extrabold tracking-tight text-foreground">
                  {stat.value}
                </div>
                <div className="mt-3 text-[11px] font-semibold tracking-[0.2em] uppercase text-muted-foreground">
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
