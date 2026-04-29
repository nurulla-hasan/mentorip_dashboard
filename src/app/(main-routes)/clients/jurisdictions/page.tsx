import PageHeader from "@/components/ui/custom/page-header";
import { getJurisdictions } from "@/services/client";
import type { JurisdictionsValues } from "@/types/clients.types";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Globe } from "lucide-react";
import { JurisdictionsModal } from "@/components/clients/JurisdictionsModal";

interface JurisdictionsApiData {
  _id?: string;
  title?: string;
  subtitle?: string;
  countries?: string[];
  createdAt?: string;
  updatedAt?: string;
}

function mapJurisdictionsApiToForm(
  data: JurisdictionsApiData | null | undefined,
): { initialValues: JurisdictionsValues } {
  return {
    initialValues: {
      title: data?.title ?? "Strategic Global Reach",
      subtitle:
        data?.subtitle ??
        "Providing high-standard legal solutions across key growth markets in Asia and Europe.",
      countries: data?.countries ?? [
        "Bangladesh",
        "India",
        "Pakistan",
        "Afghanistan",
        "Nepal",
        "China",
        "Thailand",
        "Malaysia",
        "Singapore",
        "UAE",
        "UK",
        "EU",
      ],
    },
  };
}

export default async function JurisdictionsEditorPage() {
  const res = await getJurisdictions();
  const apiData =
    (res && res.success ? (res.data as JurisdictionsApiData) : null) ?? null;

  const { initialValues } = mapJurisdictionsApiToForm(apiData);

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Our Clients - Jurisdictions"
          description="Edit global reach section and service country lists."
        />
        <JurisdictionsModal initialValues={initialValues} />
      </div>

      {/* Preview Section - Fully Shadcn Themed */}
      <div className="p-8 border rounded-xl bg-card text-card-foreground space-y-12 max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="space-y-6">
          <Badge
            variant="outline"
            className="text-primary border-primary px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest"
          >
            Jurisdictions
          </Badge>

          <div className="space-y-4">
            <h1 className="text-5xl font-black tracking-tight leading-tight">
              {initialValues.title}
            </h1>
            <p className="text-xl text-muted-foreground font-medium italic max-w-3xl">
              {initialValues.subtitle}
            </p>
          </div>
        </div>

        {/* Services Cards */}
        <div className="space-y-6">
          {/* Trademark Services */}
          <Card className="p-8 border bg-card/50 shadow-sm rounded-4xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-muted rounded-xl">
                <Globe className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-black uppercase tracking-wider">
                Trademark Services
              </h3>
            </div>

            <div className="flex flex-wrap gap-3">
              {initialValues.countries.map((country, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="px-6 py-2 rounded-full text-sm font-semibold bg-muted text-muted-foreground hover:bg-accent"
                >
                  {country}
                </Badge>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
