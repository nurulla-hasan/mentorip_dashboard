"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { verifyOtpForForgotPassword, sendForgotPasswordOtpAgain } from "@/services/auth"
import { SuccessToast, ErrorToast } from "@/lib/utils"

export default function CodeVerificationForm() {
  const router = useRouter()
  const [code, setCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleResend = async () => {
    setIsLoading(true)
    try {
      const result = await sendForgotPasswordOtpAgain()
      
      if (result?.success) {
        SuccessToast("Code resent! A new verification code has been sent to your email.")
        setError("")
        setCode("")
      } else {
        ErrorToast(result?.message || "Failed to resend code. Please try again.")
      }
    } catch (error) {
      console.error("Resend failed:", error)
      ErrorToast("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (code.length !== 6) {
      setError("Please enter all 6 digits")
      return
    }

    setIsLoading(true)
    try {
      const result = await verifyOtpForForgotPassword(code)
      
      if (result?.success) {
        SuccessToast("Code verified! Redirecting to reset password...")
        
        // Redirect to reset password page
        setTimeout(() => {
          router.push("/auth/reset-password")
        }, 1000)
      } else {
        setError("Invalid verification code. Please try again.")
        ErrorToast(result?.message || "Invalid code. Please try again.")
        setCode("")
      }
    } catch (error) {
      console.error("Verification failed:", error)
      setError("Invalid verification code. Please try again.")
      ErrorToast("An unexpected error occurred. Please try again.")
      setCode("")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Verify Your Email</CardTitle>
        <CardDescription className="text-center">
          We&apos;ve sent a 6-digit verification code to your email
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              value={code}
              onChange={(value) => {
                setCode(value)
                setError("")
              }}
              disabled={isLoading}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
          
          {error && (
            <p className="text-sm text-destructive text-center">{error}</p>
          )}

          <Button 
            onClick={handleSubmit} 
            className="w-full" 
            loading={isLoading}
            loadingText="Verifying..."
            disabled={isLoading || code.length !== 6}
          >
            Verify Code
          </Button>

          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Didn&apos;t receive the code?
            </p>
            <Button
              variant="link"
              onClick={handleResend}
              disabled={isLoading}
              className="p-0 h-auto font-normal"
            >
              Resend Code
            </Button>
          </div>

          <Link href="/auth/forgot-password">
            <Button variant="ghost" className="w-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
