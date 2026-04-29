"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Lock, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { setNewPassword } from "@/services/auth"
import { SuccessToast, ErrorToast } from "@/lib/utils"

const resetPasswordSchema = z.object({
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>

export default function ResetPasswordForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  async function onSubmit(data: ResetPasswordFormValues) {
    setIsLoading(true)
    try {
      const result = await setNewPassword(data.password)
      
      if (result?.success) {
        SuccessToast("Password reset successful! Your password has been successfully reset.")
        
        setIsSuccess(true)
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          router.push("/auth/login")
        }, 2000)
      } else {
        ErrorToast(result?.message || "Password reset failed. Please try again.")
      }
    } catch (error) {
      console.error("Password reset failed:", error)
      ErrorToast("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-green-100 dark:bg-green-900 p-3">
              <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">Password Reset Successful!</CardTitle>
          <CardDescription className="text-center">
            Your password has been successfully reset
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-sm text-muted-foreground">
            Redirecting to login page...
          </p>
        </CardContent>
      </Card>
    )
  }

  const password = form.watch("password")
  const hasMinLength = password.length >= 8
  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumber = /[0-9]/.test(password)

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Reset Password</CardTitle>
        <CardDescription className="text-center">
          Enter your new password below
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Enter new password"
                        type={showPassword ? "text" : "password"}
                        className="pl-10 pr-10"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password strength indicator */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Password must contain:</p>
              <ul className="space-y-1 text-sm">
                <li className={`flex items-center gap-2 ${hasMinLength ? "text-green-600 dark:text-green-400" : "text-muted-foreground"}`}>
                  <div className={`h-1.5 w-1.5 rounded-full ${hasMinLength ? "bg-green-600 dark:bg-green-400" : "bg-muted-foreground"}`} />
                  At least 8 characters
                </li>
                <li className={`flex items-center gap-2 ${hasUpperCase ? "text-green-600 dark:text-green-400" : "text-muted-foreground"}`}>
                  <div className={`h-1.5 w-1.5 rounded-full ${hasUpperCase ? "bg-green-600 dark:bg-green-400" : "bg-muted-foreground"}`} />
                  One uppercase letter
                </li>
                <li className={`flex items-center gap-2 ${hasLowerCase ? "text-green-600 dark:text-green-400" : "text-muted-foreground"}`}>
                  <div className={`h-1.5 w-1.5 rounded-full ${hasLowerCase ? "bg-green-600 dark:bg-green-400" : "bg-muted-foreground"}`} />
                  One lowercase letter
                </li>
                <li className={`flex items-center gap-2 ${hasNumber ? "text-green-600 dark:text-green-400" : "text-muted-foreground"}`}>
                  <div className={`h-1.5 w-1.5 rounded-full ${hasNumber ? "bg-green-600 dark:bg-green-400" : "bg-muted-foreground"}`} />
                  One number
                </li>
              </ul>
            </div>

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Confirm new password"
                        type={showConfirmPassword ? "text" : "password"}
                        className="pl-10 pr-10"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" loading={isLoading} loadingText="Resetting Password...">
              Reset Password
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
