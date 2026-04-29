/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Edit, Plus, Trash2 } from "lucide-react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import { upsertOfficeCards } from "@/services/contact";
import { ErrorToast, SuccessToast } from "@/lib/utils";

// --- Schemas & Types ---
const officeCardSchema = z.object({
  badge: z.string().min(1, "Required").max(30),
  officeName: z.string().min(1, "Required").max(60),
  keyPerson: z.string().min(1, "Required").max(80),
  address: z.string().min(1, "Required").max(220),
  phone: z.string().min(1, "Required").max(30),
  email: z.string().email("Invalid email").max(80),
  iconName: z.string().min(1, "Required").max(40),
});

const contactLocationsSchema = z.object({
  title: z.string().min(1, "Required").max(60),
  locations: z.array(officeCardSchema).min(1).max(12),
});

type FormValues = z.infer<typeof contactLocationsSchema>;

export function ContactLocationsModal({
  initialValues,
}: {
  initialValues: FormValues;
}) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(contactLocationsSchema),
    defaultValues: initialValues,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "locations",
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      const payload = {
        title: values.title,
        cards: values.locations.map((loc) => ({ ...loc, icon: loc.iconName })),
      };
      const res = await upsertOfficeCards(payload as any);
      if (res.success) {
        SuccessToast("Offices updated!");
        setOpen(false);
      } else {
        ErrorToast(res.message || "Update failed");
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      ErrorToast("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Edit className="h-4 w-4" /> Edit Offices
        </Button>
      </DialogTrigger>

      <DialogContent className="p-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle className="text-2xl font-black italic uppercase tracking-tight text-primary">
            Edit Office Cards
          </DialogTitle>
          <DialogDescription>
            Manage your global office locations and contact details.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6 py-4 max-h-[75vh] whitespace-nowrap">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-8 flex-1 overflow-hidden"
            >
              {/* ScrollArea implementation */}
              <div className="space-y-8 pr-3">
                {/* Global Title Section */}
                <div className="bg-muted/40 p-5 rounded-xl border border-dashed border-primary/30">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-extrabold text-xs uppercase tracking-widest text-muted-foreground">
                          Main Section Title
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="bg-background h-12 text-lg font-medium focus-visible:ring-primary/50"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Office Cards Mapping */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-black italic text-xl uppercase tracking-tighter">
                      Location Details
                    </h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="border-primary/50 hover:bg-primary/10 font-bold"
                      onClick={() =>
                        append({
                          badge: "",
                          officeName: "",
                          keyPerson: "",
                          address: "",
                          phone: "",
                          email: "",
                          iconName: "MapPin",
                        })
                      }
                      disabled={fields.length >= 12}
                    >
                      <Plus className="mr-2 h-4 w-4" /> Add Office
                    </Button>
                  </div>

                  {fields.map((field, index) => (
                    <Card
                      key={field.id}
                      className="relative overflow-hidden border-2 transition-all hover:border-primary/40 focus-within:border-primary"
                    >
                      <CardHeader className="flex flex-row items-center justify-between bg-muted/50 py-3 border-b">
                        <Badge className="font-black italic uppercase rounded-sm px-3 py-1">
                          Office #{index + 1}
                        </Badge>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:bg-destructive/10"
                              disabled={fields.length <= 1}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will remove the office location card. You
                                need to save changes to persist this action.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => remove(index)}
                                className="bg-destructive text-white hover:bg-destructive/90"
                              >
                                Remove
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </CardHeader>

                      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5 pt-6">
                        <CustomFormField
                          form={form}
                          name={`locations.${index}.badge`}
                          label="Badge"
                          placeholder="e.g. Head Office"
                        />
                        <CustomFormField
                          form={form}
                          name={`locations.${index}.iconName`}
                          label="Icon Name"
                          placeholder="MapPin"
                        />
                        <CustomFormField
                          form={form}
                          name={`locations.${index}.officeName`}
                          label="Office Name"
                          placeholder="Dhaka Liason Office"
                        />
                        <CustomFormField
                          form={form}
                          name={`locations.${index}.keyPerson`}
                          label="Key Person"
                          placeholder="Name of person"
                        />

                        <div className="md:col-span-2">
                          <FormField
                            control={form.control}
                            name={`locations.${index}.address`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-[11px] font-black uppercase text-muted-foreground tracking-widest">
                                  Complete Address
                                </FormLabel>
                                <FormControl>
                                  <Textarea
                                    {...field}
                                    className="min-h-24 resize-none bg-muted/20 focus:bg-background transition-all"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <CustomFormField
                          form={form}
                          name={`locations.${index}.phone`}
                          label="Phone"
                          placeholder="+880..."
                        />
                        <CustomFormField
                          form={form}
                          name={`locations.${index}.email`}
                          label="Email"
                          placeholder="office@mail.com"
                        />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
              <Separator />
              <div className="p-4 pt-0 flex justify-end items-center gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setOpen(false)}
                  className="font-bold"
                >
                  Cancel
                </Button>
                <Separator orientation="vertical" className="h-6" />
                <Button
                  type="submit"
                  loading={isSubmitting}
                  loadingText="Saving..."
                  className="min-w-45 font-black italic uppercase tracking-wider"
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

function CustomFormField({ form, name, label, placeholder }: any) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-[11px] font-black uppercase text-muted-foreground tracking-widest">
            {label}
          </FormLabel>
          <FormControl>
            <Input
              placeholder={placeholder}
              {...field}
              className="bg-muted/20 h-10 focus:bg-background transition-all"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
