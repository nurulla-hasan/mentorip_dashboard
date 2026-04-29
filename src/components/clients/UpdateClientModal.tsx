"use client";

import { useState } from "react";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Upload, X, Edit } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { updateClient } from "@/services/client";
import { SuccessToast, ErrorToast } from "@/lib/utils";
import { Client } from "@/types/clients.types";

const formSchema = z.object({
  name: z.string().min(1, "Client name is required"),
  websiteUrl: z.string().url("Invalid website URL"),
  client: z.any().optional(), // Optional for updates
});

interface UpdateClientModalProps {
  client: Client;
}

export function UpdateClientModal({ client }: UpdateClientModalProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filePreview, setFilePreview] = useState<string | null>(client.logoUrl || null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: client.name || "",
      websiteUrl: client.websiteUrl || "",
      client: undefined,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      
      const clientData = {
        name: values.name,
        websiteUrl: values.websiteUrl,
      };

      formData.append("data", JSON.stringify(clientData));
      
      if (values.client instanceof File) {
        formData.append("client", values.client);
      }

      const res = await updateClient(client._id, formData);

      if (res.success) {
        SuccessToast("Client updated successfully!");
        setOpen(false);
      } else {
        ErrorToast(res.message || "Failed to update client");
      }
    } catch (error) {
      console.error(error);
      ErrorToast("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onChange: (...event: any[]) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => {
      setOpen(v);
      if (!v) {
        form.reset({
          name: client.name,
          websiteUrl: client.websiteUrl,
          client: undefined
        });
        setFilePreview(client.logoUrl);
      }
    }}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          title="Edit"
          className="h-8 w-8 text-muted-foreground hover:text-primary"
        >
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>Update Client</DialogTitle>
          <DialogDescription>
            Modify the client details and upload a new logo if needed.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Apple Inc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="websiteUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://www.apple.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="client"
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              render={({ field: { onChange, value: _value, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>Client Logo</FormLabel>
                  <FormControl>
                    <div className="flex flex-col gap-3">
                      {filePreview ? (
                        <div className="relative aspect-3/1 w-full overflow-hidden rounded-lg border-2 border-primary/20 bg-muted">
                          <Image
                            src={filePreview}
                            alt="Logo preview"
                            fill
                            className="object-contain p-4"
                            unoptimized
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute right-2 top-2 h-7 w-7 rounded-full shadow-lg"
                            onClick={() => {
                              setFilePreview(null);
                              form.setValue("client", undefined);
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <label className="flex aspect-3/1 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-accent/5 transition-all hover:bg-accent/10 hover:border-primary/50 group">
                          <div className="flex flex-col items-center justify-center p-4">
                            <Upload className="h-5 w-5 text-muted-foreground mb-2 group-hover:text-primary transition-colors" />
                            <p className="text-sm font-medium">Click to upload logo</p>
                            <p className="text-xs text-muted-foreground mt-1">Recommended size: 300x100px</p>
                          </div>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => handleFileChange(e, onChange)}
                            {...fieldProps}
                          />
                        </label>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4 gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button loadingText="Updating..." type="submit" loading={isSubmitting}>
                Update Client
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
