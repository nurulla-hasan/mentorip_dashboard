"use client";

import { useState } from "react";
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
import { Lock, User, Phone } from "lucide-react";

import { updateUserData } from "@/services/auth";
import { ErrorToast, SuccessToast } from "@/lib/utils";
import { CurrentUser } from "@/types/currentUser.type";

const profileFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  phone: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface ProfileFormProps {
  user: CurrentUser;
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
    },
  });

  async function onSubmit(data: ProfileFormValues) {
    setIsLoading(true);
    try {
        const res = await updateUserData(data);
        if (res.success) {
            SuccessToast("Profile updated successfully!");
        } else {
            ErrorToast(res.message || "Failed to update profile");
        }
    } catch (error) {
        console.error(error);
        ErrorToast("An unexpected error occurred");
    } finally {
        setIsLoading(false);
    }
  }

  return (
    <div className="p-6 bg-card rounded-lg border shadow-sm space-y-8">
      <div>
        <h3 className="text-xl font-bold flex items-center gap-2">
            <User className="h-5 w-5 text-primary" /> Personal Information
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Update your public profile information.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold flex items-center gap-2 text-xs uppercase tracking-wider opacity-70">
                      Full Name
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Your name" {...field} />
                  </FormControl>
                  <FormMessage className="text-[10px] uppercase font-bold" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              disabled
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold flex items-center gap-2 text-xs uppercase tracking-wider opacity-70">
                      Email Address
                  </FormLabel>
                  <FormControl>
                    <div className="relative group">
                      <Input placeholder="Email address" {...field} />
                      <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground opacity-50" />
                    </div>
                  </FormControl>
                  {/* <p className="text-[10px] text-muted-foreground italic font-medium">Email cannot be changed for security reasons.</p> */}
                  <FormMessage className="text-[10px] uppercase font-bold" />
                </FormItem>
              )}
            />

          </div>
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold flex items-center gap-2 text-xs uppercase tracking-wider opacity-70">
                      <Phone className="h-3 w-3" /> Phone Number
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Your phone number" {...field} />
                  </FormControl>
                  <FormMessage className="text-[10px] uppercase font-bold" />
                </FormItem>
              )}
            />

          <div className="flex justify-end pt-4 border-t border-border/50">
            <Button 
                type="submit" 
                loading={isLoading}
                loadingText="Saving..."
            >
              Save Changes
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
