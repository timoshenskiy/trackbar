"use client";

import {
  signInAction,
  signUpAction,
  forgotPasswordAction,
} from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { SmtpMessage } from "../smtp-message";

type AuthMode = "signin" | "signup" | "forgot";

export default function AuthPage({ searchParams }: { searchParams: Message }) {
  const [mode, setMode] = useState<AuthMode>("signin");

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  if ("message" in searchParams) {
    return (
      <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
        <FormMessage message={searchParams} />
      </div>
    );
  }

  return (
    <div>
      <div className="flex-1 flex items-center justify-center p-4">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={mode}
            custom={mode === "signin" ? 1 : -1}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
          >
            {mode === "signin" && (
              <form className="flex-1 flex flex-col min-w-64">
                <h1 className="text-2xl font-medium">Sign in</h1>
                <p className="text-sm text-foreground">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("signup")}
                    className="text-primary font-medium underline"
                  >
                    Sign up
                  </button>
                </p>
                <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
                  <Label htmlFor="email">Email</Label>
                  <Input name="email" placeholder="you@example.com" required />
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password">Password</Label>
                    <button
                      type="button"
                      onClick={() => setMode("forgot")}
                      className="text-xs text-foreground underline"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <Input
                    type="password"
                    name="password"
                    placeholder="Your password"
                    required
                  />
                  <SubmitButton
                    pendingText="Signing In..."
                    formAction={signInAction}
                  >
                    Sign in
                  </SubmitButton>
                  <FormMessage message={searchParams} />
                </div>
              </form>
            )}

            {mode === "signup" && (
              <form className="flex flex-col min-w-64">
                <h1 className="text-2xl font-medium">Sign up</h1>
                <p className="text-sm text-foreground">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("signin")}
                    className="text-primary font-medium underline"
                  >
                    Sign in
                  </button>
                </p>
                <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
                  <Label htmlFor="email">Email</Label>
                  <Input name="email" placeholder="you@example.com" required />
                  <Label htmlFor="password">Password</Label>
                  <Input
                    type="password"
                    name="password"
                    placeholder="Your password"
                    minLength={6}
                    required
                  />
                  <SubmitButton
                    formAction={signUpAction}
                    pendingText="Signing up..."
                  >
                    Sign up
                  </SubmitButton>
                  <FormMessage message={searchParams} />
                </div>
              </form>
            )}

            {mode === "forgot" && (
              <form className="flex-1 flex flex-col w-full gap-2 text-foreground [&>input]:mb-6 min-w-64">
                <div>
                  <h1 className="text-2xl font-medium">Reset Password</h1>
                  <p className="text-sm text-secondary-foreground">
                    Remember your password?{" "}
                    <button
                      type="button"
                      onClick={() => setMode("signin")}
                      className="text-primary underline"
                    >
                      Sign in
                    </button>
                  </p>
                </div>
                <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
                  <Label htmlFor="email">Email</Label>
                  <Input name="email" placeholder="you@example.com" required />
                  <SubmitButton formAction={forgotPasswordAction}>
                    Reset Password
                  </SubmitButton>
                  <FormMessage message={searchParams} />
                </div>
              </form>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      <SmtpMessage />
    </div>
  );
}
