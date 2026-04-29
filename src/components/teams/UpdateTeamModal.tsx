"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Upload, X } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ModalWrapper } from "@/components/ui/custom/modal-wrapper";
import { ScrollArea } from "@/components/ui/scroll-area";
import { updateOurTeam } from "@/services/team";
import { ErrorToast, SuccessToast } from "@/lib/utils";
import { Team } from "@/types/team.types";

const teamSchema = z.object({
  name: z.string().min(1, "Name is required"),
  designation: z.string().min(1, "Designation is required"),
  expertises: z.string().min(1, "At least one expertise is required"), // comma separated string for input
  image: z.any().optional(),
});

type TeamValues = z.infer<typeof teamSchema>;

interface UpdateTeamModalProps {
  initialData: Team;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
}

export function UpdateTeamModal({
  initialData,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  trigger,
}: UpdateTeamModalProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = controlledOnOpenChange ?? setUncontrolledOpen;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preview, setPreview] = useState<string | null>(initialData.image || null);

  const form = useForm<TeamValues>({
    resolver: zodResolver(teamSchema),
    defaultValues: {
      name: initialData.name,
      designation: initialData.designation,
      expertises: initialData.expertises?.join(", ") || "",
      image: undefined,
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("image", file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (values: TeamValues) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();

      // Convert comma-separated string to array
      const expertiseArray = values.expertises
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      // Construct the 'data' object as per Postman payload requirement
      const dataPayload = {
        name: values.name,
        designation: values.designation,
        expertises: expertiseArray,
      };

      // Append 'data' as stringified JSON
      formData.append("data", JSON.stringify(dataPayload));

      // Append 'team' (image file) if exists
      if (values.image instanceof File) {
        formData.append("team", values.image);
      }

      const res = await updateOurTeam(initialData._id, formData);

      if (res.success) {
        SuccessToast("Team member updated successfully!");
        setOpen(false);
      } else {
        ErrorToast(res.message || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      ErrorToast("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModalWrapper
      open={open}
      onOpenChange={setOpen}
      title="Edit Team Member"
      description="Update team member details."
      actionTrigger={trigger}
    >
      <ScrollArea className="max-h-[75vh]">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6 px-6 py-6"
          >
            {/* Image Upload */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative h-32 w-32 overflow-hidden rounded-full border-2 border-dashed hover:bg-white/10">
                {preview ? (
                  <Image
                    src={preview}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center">
                    <Upload className="h-8 w-8" />
                    <span className="text-xs">Upload Photo</span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 cursor-pointer opacity-0"
                  onChange={handleImageChange}
                />
              </div>
              {preview && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-700"
                  onClick={() => {
                    setPreview(null);
                    form.setValue("image", undefined);
                  }}
                >
                  <X className="mr-2 h-4 w-4" /> Remove Photo
                </Button>
              )}
            </div>

            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Designation */}
            <FormField
              control={form.control}
              name="designation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Designation</FormLabel>
                  <FormControl>
                    <Input placeholder="Senior Legal Advisor" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Expertises */}
            <FormField
              control={form.control}
              name="expertises"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expertises (comma separated)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Corporate Law, Intellectual Property, Litigation"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" loading={isSubmitting} loadingText="Updating...">
                Update Member
              </Button>
            </div>
          </form>
        </Form>
      </ScrollArea>
    </ModalWrapper>
  );
}
