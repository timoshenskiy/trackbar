"use client";

import {
  signInAction,
  signUpAction,
  forgotPasswordAction,
} from "@/app/actions";
import { FormMessage, type Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/ui/logo";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { SmtpMessage } from "../smtp-message";

type AuthMode = "signin" | "signup" | "forgot";

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

export function AuthForm({ searchParams }: { searchParams: Message }) {
  const [mode, setMode] = useState<AuthMode>("signin");

  if ("message" in searchParams) {
    return (
      <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
        <FormMessage message={searchParams} />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-[100vw] flex items-center justify-center bg-quokka-light dark:bg-quokka-dark">
      <div className="flex-1 flex flex-col max-w-[500px] items-center justify-center p-4 gap-4">
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
            className="w-full max-w-4xl bg-background/80 backdrop-blur-xl p-8 rounded-xl shadow-lg border border-quokka-purple/20"
          >
            <Link href="/" className="mb-4">
              <Logo size={100} />
            </Link>
            {mode === "signin" && (
              <form className="flex-1 flex flex-col w-full">
                <h1 className="text-3xl font-bold text-quokka-purple mb-2">Sign in</h1>
                <p className="text-sm text-foreground/80 mb-8">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("signup")}
                    className="text-quokka-purple font-medium hover:text-quokka-cyan transition-colors"
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
                    className="border-quokka-purple/20 focus:border-quokka-purple"
                  />
                  <SubmitButton
                    pendingText="Signing In..."
                    formAction={signInAction}
                    className="bg-quokka-purple hover:bg-quokka-purple/90 text-white transition-colors"
                  >
                    Sign in
                  </SubmitButton>
                  <FormMessage message={searchParams} />
                </div>
              </form>
            )}

            {mode === "signup" && (
              <form className="flex-1 flex flex-col w-full">
                <h1 className="text-3xl font-bold text-quokka-purple mb-2">Sign up</h1>
                <p className="text-sm text-foreground/80 mb-8">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("signin")}
                    className="text-quokka-purple font-medium hover:text-quokka-cyan transition-colors"
                  >
                    Sign in
                  </button>
                </p>
                <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
                  <Label htmlFor="email">Email</Label>
                  <Input name="email" placeholder="you@example.com" required />
                  <Label htmlFor="username">Username</Label>
                  <Input
                    name="username"
                    placeholder="Choose a username"
                    required
                    pattern="^[a-zA-Z0-9_]{3,15}$"
                    title="Username must be 3-15 characters long and can only contain letters, numbers, and underscores"
                  />
                  <Label htmlFor="password">Password</Label>
                  <Input
                    type="password"
                    name="password"
                    placeholder="Your password"
                    minLength={8}
                    required
                    pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%\^&*])[A-Za-z0-9!@#$%\^&*]{8,}$"
                    title="Must contain at least 8 characters, including: uppercase letter, lowercase letter, number, and special character (!@#$%^&*)"
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
        <SmtpMessage />
      </div>
    </div>
  );
}
