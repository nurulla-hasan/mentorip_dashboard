import { AddGalleryModal } from "@/components/gallery/AddGalleryModal";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import PageHeader from "@/components/ui/custom/page-header";
import { getAllGalleryImages } from "@/services/gallery";
import { GalleryImage } from "@/types/gallery.types";

export default async function GalleryPage() {
  const { data: images } = await getAllGalleryImages();

  return (
    <div className="space-y-6 p-1">
      <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between">
        <PageHeader
          title="Gallery Management"
          description="Manage and organize gallery images for the website."
          length={images?.length || 0}
        />
        <AddGalleryModal />
      </div>

      <GalleryGrid images={images as GalleryImage[]} />
    </div>
  );
}
