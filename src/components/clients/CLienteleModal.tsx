"use client";

import { useState } from "react";
import { Edit } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { ModalWrapper } from "@/components/ui/custom/modal-wrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { updateClientele } from "@/services/client";
import { ErrorToast, SuccessToast } from "@/lib/utils";
import type { ClientelePayload, ClienteleValues } from "@/types/clients.types";
import { ScrollArea } from "../ui/scroll-area";

const clienteleStatSchema = z.object({
  value: z
    .string()
    .min(1, "Value is required")
    .max(12, "Value must be at most 12 characters"),
  label: z
    .string()
    .min(1, "Label is required")
    .max(40, "Label must be at most 40 characters"),
});

const clienteleSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(80, "Title must be at most 80 characters"),
  subtitle: z
    .string()
    .min(1, "Subtitle is required")
    .max(220, "Subtitle must be at most 220 characters"),
  stats: z.tuple([
    clienteleStatSchema,
    clienteleStatSchema,
    clienteleStatSchema,
    clienteleStatSchema,
  ]),
});

interface ClienteleModalProps {
  initialValues: ClienteleValues;
}

function mapClienteleValuesToPayload(
  values: ClienteleValues,
): ClientelePayload {
  const [stat1, stat2, stat3, stat4] = values.stats;

  return {
    title: values.title,
    subtitle: values.subtitle,
    stat1Title: stat1.label,
    stat1Value: stat1.value,
    stat2Title: stat2.label,
    stat2Value: stat2.value,
    stat3Title: stat3.label,
    stat3Value: stat3.value,
    stat4Title: stat4.label,
    stat4Value: stat4.value,
  };
}

export function ClienteleModal({ initialValues }: ClienteleModalProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ClienteleValues>({
    resolver: zodResolver(clienteleSchema),
    defaultValues: initialValues,
    mode: "onChange",
  });

  const onSubmit = async (values: ClienteleValues) => {
    setIsSubmitting(true);

    try {
      const payload = mapClienteleValuesToPayload(values);
      const res = await updateClientele(payload);

      if (res.success) {
        SuccessToast("Clientele section updated successfully!");
        setOpen(false);
      } else {
        ErrorToast(res.message || "Failed to update clientele section");
      }
    } catch (error) {
      console.error(error);
      ErrorToast("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModalWrapper
      open={open}
      onOpenChange={setOpen}
      title="Edit Clientele"
      description="Make changes to clientele information here. Click save when you're done."
      actionTrigger={
        <Button variant="outline" size="sm" className="gap-2">
          <Edit className="h-4 w-4" />
          Edit Clientele
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
                  <CardTitle>Clientele Intro</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter title" {...field} />
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
                            placeholder="Enter subtitle"
                            className="min-h-24"
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
                  <CardTitle>Stats (fixed 4)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {([0, 1, 2, 3] as const).map((index) => (
                    <div
                      key={index}
                      className="grid grid-cols-1 gap-4 md:grid-cols-2 bg-background p-4 rounded-xl"
                    >
                      <FormField
                        control={form.control}
                        name={`stats.${index}.label`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{`Stat ${index + 1} Label`}</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g. Active clients"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`stats.${index}.value`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{`Stat ${index + 1} Value`}</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. 7,000+" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  ))}
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
            <Button
              type="submit"
              loading={isSubmitting}
              loadingText="Saving..."
            >
              Save Changes
            </Button>
          </div>
        </form>
      </Form>
    </ModalWrapper>
  );
}
