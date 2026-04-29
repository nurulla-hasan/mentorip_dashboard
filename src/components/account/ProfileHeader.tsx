"use client";

import { useRef, useState, useCallback } from "react";
import Cropper, { Point, Area } from "react-easy-crop";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Camera, Mail, Phone, ShieldCheck, Loader2, X, Check } from "lucide-react";
import { getInitials, SuccessToast, ErrorToast } from "@/lib/utils";
import { updateProfilePhoto } from "@/services/auth";
import { getCroppedImg } from "@/lib/cropImage";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { CurrentUser } from "@/types/currentUser.type";

interface ProfileHeaderProps {
  user: CurrentUser;
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onCropComplete = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      setImageSrc(reader.result as string);
      setIsCropping(true);
    });
    reader.readAsDataURL(file);
  };

  const handleCancel = () => {
    setIsCropping(false);
    setImageSrc(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleUpdateAccount = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    try {
      setIsUploading(true);
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      
      if (!croppedImage) {
        ErrorToast("Failed to process image");
        return;
      }

      const formData = new FormData();
      formData.append("user", croppedImage);

      const res = await updateProfilePhoto(formData);
      if (res.success) {
        SuccessToast("Profile photo updated successfully!");
        setIsCropping(false);
        setImageSrc(null);
        window.location.reload();
      } else {
        ErrorToast(res.message || "Failed to update photo");
      }
    } catch (error) {
      console.error(error);
      ErrorToast("An unexpected error occurred");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center gap-6 p-8 bg-card rounded-lg border shadow-sm">
      <div className="flex flex-col items-center gap-4">
        <div className="relative group">
          <Avatar className="h-28 w-28 border-4 border-background shadow-xl">
            <AvatarImage src={user?.image || ""} alt={user?.name} className="object-cover" />
            <AvatarFallback className="text-3xl bg-primary/5 text-primary font-bold">
              {getInitials(user?.name)}
            </AvatarFallback>
          </Avatar>
          
          {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full z-10">
              <Loader2 className="h-8 w-8 text-white animate-spin" />
            </div>
          )}

          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
          
          <Button
            size="icon"
            variant="secondary"
            className="absolute bottom-1 right-1 rounded-full h-9 w-9 shadow-lg hover:scale-110 active:scale-95 transition-all bg-background border-2 border-primary/20"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            <Camera className="h-4 w-4 text-primary" />
          </Button>
        </div>
      </div>

      <Dialog open={isCropping} onOpenChange={setIsCropping}>
        <DialogContent className="sm:max-w-125 p-0 overflow-hidden rounded-3xl border-none">
          <DialogHeader className="p-6 bg-primary/5 border-b border-primary/10">
            <DialogTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5 text-primary" /> Crop Profile Photo
            </DialogTitle>
          </DialogHeader>

          <div className="relative h-100 w-full bg-slate-900">
            {imageSrc && (
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            )}
          </div>

          <div className="p-6 space-y-4">
             <div className="space-y-2">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Zoom Level</p>
                <input
                    type="range"
                    value={zoom}
                    min={1}
                    max={3}
                    step={0.1}
                    aria-labelledby="Zoom"
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                />
             </div>

             <DialogFooter className="flex items-center justify-end gap-3 pt-2">
                <Button 
                    variant="outline" 
                    onClick={handleCancel}
                    className="rounded-xl font-bold gap-2"
                >
                    <X className="h-4 w-4" /> Cancel
                </Button>
                <Button 
                    onClick={handleUpdateAccount}
                    disabled={isUploading}
                    className="rounded-xl font-bold gap-2 px-8 shadow-lg shadow-primary/20"
                >
                    {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                    {isUploading ? "Uploading..." : "Save Image"}
                </Button>
             </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
      
      <div className="flex-1 text-center md:text-left space-y-4">
        <div>
          <div className="flex flex-col md:flex-row items-center gap-3">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">{user?.name}</h2>
            <Badge variant="outline" className="uppercase font-bold tracking-wider px-3 py-1 bg-primary/10 text-primary border-none text-[10px] flex items-center gap-1.5 shadow-sm">
              <ShieldCheck className="h-3 w-3" />
              {user?.role}
            </Badge>
          </div>
          
          <div className="mt-3 flex flex-wrap items-center justify-center md:justify-start gap-y-2 gap-x-6 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <div className="p-1.5 bg-muted rounded-lg">
                <Mail className="h-3.5 w-3.5" />
              </div>
              <span className="font-medium">{user?.email}</span>
            </div>

            <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <div className="p-1.5 bg-muted rounded-lg">
                <Phone className="h-3.5 w-3.5" />
              </div>
              <span className="font-medium text-[13px]">{user?.phone || "N/A"}</span>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-border/50 max-w-fit">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary/60">Administrator Dashboard Access</p>
        </div>
      </div>
    </div>
  );
}
