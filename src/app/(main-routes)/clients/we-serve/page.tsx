/* eslint-disable @typescript-eslint/no-explicit-any */
import { WeServeModal } from "@/components/clients/WeServeModal";
import { DynamicIcon } from "@/components/ui/custom/dynamic-icon";
import PageHeader from "@/components/ui/custom/page-header";
import { getWeServe } from "@/services/client";
import { WeServeApiData, WeServeValues, WeServeCard } from "@/types/clients.types";

function mapWeServeApiToForm(data: WeServeApiData | null): WeServeValues {
  const defaultCard: WeServeCard = { title: "", description: "", iconName: "" };
  
  // Initialize with default cards
  const cards: WeServeCard[] = Array(8).fill(null).map(() => ({ ...defaultCard }));

  if (data) {
    // Map existing data to cards
    for (let i = 0; i < 8; i++) {
      const idx = i + 1;
      // Using type assertion for dynamic property access
      const title = (data as any)[`card${idx}Title`];
      const description = (data as any)[`card${idx}Description`];
      const iconName = (data as any)[`card${idx}IconName`];

      cards[i] = {
        title: title || "",
        description: description || "",
        iconName: iconName || "",
      };
    }
  }

  return {
    title: data?.title || "Industries We Serve",
    subtitle: data?.subtitle || "Cross-industry expertise tailored to the unique challenges of each sector.",
    cards: cards as WeServeValues["cards"],
  };
}

export default async function WeServePage() {
  const res = await getWeServe();
  const apiData = (res && res.success ? (res.data as WeServeApiData) : null);
  let initialValues = mapWeServeApiToForm(apiData);

  // Ensure initialValues is always a valid object with cards array
  if (!initialValues || !Array.isArray(initialValues.cards)) {
    initialValues = {
      title: "Industries We Serve",
      subtitle: "Cross-industry expertise tailored to the unique challenges of each sector.",
      cards: Array(8).fill(null).map(() => ({ title: "", description: "", iconName: "" })) as WeServeValues["cards"],
    };
  }

  const cardsToRender = (initialValues && Array.isArray(initialValues.cards)) ? initialValues.cards : [];

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <PageHeader
          title="Clients - Industries We Serve"
          description="Edit the industries we serve section (8 cards fixed)."
        />
        <WeServeModal initialValues={initialValues} />
      </div>

      <section className="rounded-3xl bg-card p-6 space-y-8 max-w-6xl mx-auto">
        <div className="space-y-3 text-center">
          <p className="text-xs font-semibold tracking-[0.35em] text-red-700 uppercase">
            SECTORS
          </p>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight text-foreground">
            {initialValues.title}
          </h2>
          <p className="max-w-3xl mx-auto text-sm md:text-base text-muted-foreground italic">
            {initialValues.subtitle}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {cardsToRender?.map((card, index) => (
            <div key={index} className="p-6 rounded-3xl border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
               <div className="mb-4 p-3 bg-muted/30 w-fit rounded-xl">
                 <DynamicIcon name={card.iconName || "Icon"} className="w-6 h-6 text-primary" />
               </div>
               <h3 className="font-bold text-lg mb-2 italic">{card.title || `Industry ${index + 1}`}</h3>
               <p className="text-sm text-muted-foreground">{card.description || "Description..."}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
