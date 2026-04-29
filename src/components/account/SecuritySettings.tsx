"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { ShieldCheck, Key, Lock } from "lucide-react";
import { changePassword } from "@/services/auth";
import { ErrorToast, SuccessToast } from "@/lib/utils";

const securityFormSchema = z.object({
  oldPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SecurityFormValues = z.infer<typeof securityFormSchema>;

export function SecuritySettings() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SecurityFormValues>({
    resolver: zodResolver(securityFormSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: SecurityFormValues) {
    setIsLoading(true);
    try {
      const res = await changePassword({
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      });

      if (res.success) {
        SuccessToast("Password updated successfully!");
        form.reset();
      } else {
        ErrorToast(res.message || "Failed to update password");
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
            <Lock className="h-5 w-5 text-primary" /> Security Settings
        </h3>
        <p className="text-sm text-muted-foreground mt-1"> 
          Secure your account by updating your password.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="oldPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold flex items-center gap-2 text-xs uppercase tracking-wider opacity-70">
                    <ShieldCheck className="h-3 w-3" /> Current Password
                </FormLabel>
                <FormControl>
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage className="text-[10px] uppercase font-bold" />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold flex items-center gap-2 text-xs uppercase tracking-wider opacity-70">
                      <Key className="h-3 w-3" /> New Password
                  </FormLabel>
                  <FormControl>
                    <Input 
                        type="password" 
                        placeholder="••••••••" 
                        {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-[10px] uppercase font-bold" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold flex items-center gap-2 text-xs uppercase tracking-wider opacity-70">
                      <Key className="h-3 w-3" /> Confirm Password
                  </FormLabel>
                  <FormControl>
                    <Input 
                        type="password" 
                        placeholder="••••••••" 
                        {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-[10px] uppercase font-bold" />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end pt-4 border-t border-border/50">
            <Button 
                type="submit" 
                loading={isLoading}
                loadingText="Updating Password..."
            >
              Update Password
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
