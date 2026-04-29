import { WhoWeAreModal } from "@/components/about-us/WhoWeAreModal";
import PageHeader from "@/components/ui/custom/page-header";
import { getWhoWeAre } from "@/services/about";
import type { WhoWeAreValues } from "@/types/who-we-are.types";

interface WhoWeAreApiData {
  _id?: string;
  title?: string;
  subtitle?: string;
  slot1Label?: string;
  slot1Value?: string;
  slot2Label?: string;
  slot2Value?: string;
  slot3Label?: string;
  slot3Value?: string;
  slot4Label?: string;
  slot4Value?: string;
  createdAt?: string;
  updatedAt?: string;
}

function mapWhoWeAreApiToForm(
  data: WhoWeAreApiData | null | undefined
): WhoWeAreValues {
  const defaultStats: WhoWeAreValues["stats"] = [
    { value: "2010", label: "Founded" },
    { value: "500+", label: "Clients" },
    { value: "1200+", label: "Projects" },
    { value: "3", label: "Offices" },
  ];

  if (!data) {
    return {
      title: "Who We Are",
      subtitle: "Subtitle",
      stats: defaultStats,
      imageFile: undefined,
      imageAlt: "",
    };
  }

  return {
    title: data.title ?? "Who We Are",
    subtitle: data.subtitle ?? "Subtitle",
    stats: [
      {
        value: data.slot1Value ?? defaultStats[0].value,
        label: data.slot1Label ?? defaultStats[0].label,
      },
      {
        value: data.slot2Value ?? defaultStats[1].value,
        label: data.slot2Label ?? defaultStats[1].label,
      },
      {
        value: data.slot3Value ?? defaultStats[2].value,
        label: data.slot3Label ?? defaultStats[2].label,
      },
      {
        value: data.slot4Value ?? defaultStats[3].value,
        label: data.slot4Label ?? defaultStats[3].label,
      },
    ],
    imageFile: undefined,
    imageAlt: "",
  };
}

export default async function WhoWeAreEditorPage() {
  const res = await getWhoWeAre();
  const apiData =
    (res && res.success ? (res.data as WhoWeAreApiData) : null) ?? null;

  const initialValues = mapWhoWeAreApiToForm(apiData);

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row justify-between gap-4">
          <PageHeader
            title="About - Who We Are"
            description="Edit title, subtitle, hero image and 4 fixed stats for the About page."
          />
          <WhoWeAreModal initialValues={initialValues} />
      </div>
      <section className="rounded-3xl bg-card p-6 space-y-8 max-w-4xl mx-auto">
        <div className="space-y-3">
          <p className="text-xs font-semibold tracking-[0.35em] text-red-700 uppercase">
            who we are
          </p>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight text-foreground max-w-3xl">
            {initialValues.title || "A Legacy of Excellence in Intellectual Property"}
          </h2>
          <p className="max-w-3xl text-sm md:text-base text-muted-foreground italic">
            {initialValues.subtitle ||
              "Our story began in 2000, built on integrity, trust, and deep legal expertise. Today, we stand as a cross-border IP powerhouse."}
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
