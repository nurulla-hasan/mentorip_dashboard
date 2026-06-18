import { AddGalleryModal } from "@/components/gallery/AddGalleryModal";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { DashboardHeader } from "@/components/ui/custom/dashboard-header";
import { getAllGalleryImages } from "@/services/gallery";
import { GalleryImage } from "@/types/gallery.types";

export default async function GalleryPage() {
  const { data: images } = await getAllGalleryImages();

  return (
    <div className="space-y-6 p-1">
      <DashboardHeader
        title="Gallery Management"
        description="Manage and organize gallery images for the website."
        length={images?.length || 0}
      >
        <AddGalleryModal />
      </DashboardHeader>

      <GalleryGrid images={images as GalleryImage[]} />
    </div>
  );
}
