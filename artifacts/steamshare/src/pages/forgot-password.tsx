import { Layout } from "@/components/layout";
import { Link } from "wouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { KeyRound, CheckCircle2, ArrowLeft, ShieldCheck } from "lucide-react";
import { useState } from "react";

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

const resetSchema = z.object({
  code: z.string().min(6, "Enter the 6-digit code from your email").max(6),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6),
}).refine((d) => d.newPassword === d.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type Step = "email" | "code" | "done";

export default function ForgotPassword() {
  const [step, setStep] = useState<Step>("email");
  const [emailError, setEmailError] = useState("");
  const [resetError, setResetError] = useState("");
  const [emailPending, setEmailPending] = useState(false);
  const [resetPending, setResetPending] = useState(false);

  const emailForm = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });

  const resetForm = useForm<z.infer<typeof resetSchema>>({
    resolver: zodResolver(resetSchema),
    defaultValues: { code: "", newPassword: "", confirmPassword: "" },
  });

  async function onEmailSubmit(values: z.infer<typeof emailSchema>) {
    setEmailError("");
    setEmailPending(true);
    try {
      await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: values.email }),
      });
      // Always advance to code step regardless of whether email exists (security)
      setStep("code");
    } catch {
      setEmailError("Something went wrong. Please try again.");
    } finally {
      setEmailPending(false);
    }
  }

  async function onResetSubmit(values: z.infer<typeof resetSchema>) {
    setResetError("");
    setResetPending(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: values.code, newPassword: values.newPassword }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as any).error || "Invalid or expired code.");
      }
      setStep("done");
    } catch (e: any) {
      setResetError(e.message || "Invalid or expired code. Please try again.");
    } finally {
      setResetPending(false);
    }
  }

  return (
    <Layout>
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md mb-4">
          <button onClick={() => window.history.back()} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
        </div>
        <div className="w-full max-w-md bg-card border border-border rounded-xl shadow-xl overflow-hidden">
          <div className="bg-muted/30 p-8 text-center border-b border-border">
            {step === "done" ? (
              <CheckCircle2 className="h-10 w-10 text-green-400 mx-auto mb-4" />
            ) : step === "code" ? (
              <ShieldCheck className="h-10 w-10 text-primary mx-auto mb-4" />
            ) : (
              <KeyRound className="h-10 w-10 text-primary mx-auto mb-4" />
            )}
            <h1 className="text-2xl font-black">
              {step === "done" ? "Password Reset!" : step === "code" ? "Enter Reset Code" : "Forgot Password"}
            </h1>
            <p className="text-muted-foreground text-sm mt-2">
              {step === "done"
                ? "Your password has been changed successfully."
                : step === "code"
                  ? "Check your email for the 6-digit code we sent you."
                  : "Enter your email and we'll send you a reset code."}
            </p>
          </div>

          <div className="p-8">
            {step === "email" && (
              <Form {...emailForm}>
                <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-6">
                  {emailError && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-sm text-red-400">
                      {emailError}
                    </div>
                  )}
                  <FormField
                    control={emailForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="you@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full font-bold h-12" disabled={emailPending}>
                    {emailPending ? "Sending..." : "Send Reset Code"}
                  </Button>
                </form>
              </Form>
            )}

            {step === "code" && (
              <Form {...resetForm}>
                <form onSubmit={resetForm.handleSubmit(onResetSubmit)} className="space-y-5">
                  {resetError && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-sm text-red-400">
                      {resetError}
                    </div>
                  )}
                  <FormField
                    control={resetForm.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>6-Digit Reset Code</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="123456"
                            maxLength={6}
                            className="font-mono text-2xl tracking-widest text-center h-14"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={resetForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={resetForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm New Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full font-bold h-12" disabled={resetPending}>
                    {resetPending ? "Resetting..." : "Reset Password"}
                  </Button>
                  <button
                    type="button"
                    onClick={() => setStep("email")}
                    className="w-full text-center text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Didn't receive the code? Go back and try again
                  </button>
                </form>
              </Form>
            )}

            {step === "done" && (
              <div className="space-y-4 text-center">
                <p className="text-muted-foreground text-sm">You can now log in with your new password.</p>
                <Link href="/login">
                  <Button className="w-full font-bold h-12">Go to Login</Button>
                </Link>
              </div>
            )}

            {step !== "done" && (
              <div className="mt-6 text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                <Link href="/login" className="text-primary hover:underline">Back to Login</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
