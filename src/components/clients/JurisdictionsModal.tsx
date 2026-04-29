"use client";

import { useState } from "react";
import { Edit } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

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
import { ScrollArea } from "@/components/ui/scroll-area";
import { ModalWrapper } from "@/components/ui/custom/modal-wrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { updateJurisdictions } from "@/services/client";
import { ErrorToast, SuccessToast } from "@/lib/utils";
import { JurisdictionsValues } from "@/types/clients.types";

const jurisdictionsSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(80, "Title must be at most 80 characters"),
  subtitle: z
    .string()
    .min(1, "Subtitle is required")
    .max(220, "Subtitle must be at most 220 characters"),
  countries: z.array(z.string().min(1).max(30)).min(1).max(30),
});

interface JurisdictionsModalProps {
  initialValues: JurisdictionsValues;
}

export function JurisdictionsModal({ initialValues }: JurisdictionsModalProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<JurisdictionsValues>({
    resolver: zodResolver(jurisdictionsSchema),
    defaultValues: initialValues,
    mode: "onChange",
  });

  const onSubmit = async (values: JurisdictionsValues) => {
    setIsSubmitting(true);
    try {
      const payload = {
        title: values.title,
        subtitle: values.subtitle,
        countries: values.countries,
      };

      const res = await updateJurisdictions(payload);
      if (res.success) {
        SuccessToast("Jurisdictions updated successfully!");
        setOpen(false);
      } else {
        ErrorToast(res.message || "Failed to update jurisdictions");
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
      title="Edit Jurisdictions"
      description="Update global reach and service countries."
      actionTrigger={
        <Button variant="outline" size="sm" className="gap-2">
          <Edit className="h-4 w-4" /> Edit Content
        </Button>
      }
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col flex-1 overflow-hidden"
        >
          <ScrollArea className="max-h-[70vh] whitespace-nowrap">
            <div className="px-6 py-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Header Content</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Main Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Strategic Global Reach"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="subtitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subtitle</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Providing high-standard legal solutions..."
                            className="min-h-24 resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Trademark Services (Countries)</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="countries"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Countries (comma separated)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Bangladesh, India, Pakistan..."
                            className="min-h-32"
                            value={(field.value ?? []).join(", ")}
                            onChange={(e) => {
                              const next = e.target.value
                                .split(",")
                                .map((v) => v.trim())
                                .filter(Boolean);
                              field.onChange(next);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
          <div className="p-6 border-t bg-muted/20 flex justify-end gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="min-w-32">
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Form>
    </ModalWrapper>
  );
}
