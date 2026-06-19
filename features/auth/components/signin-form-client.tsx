"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Github, Chrome } from "lucide-react";
import {
  handleGoogleSignIn,
  handleGithubSignIn,
} from "@/features/auth/actions/signin";

const SignInFormClient = () => {
  const [isLoading, setIsLoading] = React.useState<string | null>(null);

  return (
    <Card className="w-full border-0 shadow-2xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl">
      <CardHeader className="space-y-2 text-center pb-6">
        <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
        <CardDescription className="text-sm">
          Sign in to your account to continue
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Google Sign In */}
        <form
          action={async () => {
            setIsLoading("google");
            await handleGoogleSignIn();
          }}
        >
          <Button
            type="submit"
            variant={"outline"}
            className="w-full cursor-pointer h-11 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 group"
            disabled={isLoading !== null}
          >
            <Chrome className="mr-2 h-5 w-5 text-blue-500 group-hover:scale-110 transition-transform" />
            <span className="font-medium">Continue with Google</span>
          </Button>
        </form>

        {/* Divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200 dark:border-gray-700" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white dark:bg-zinc-900 px-2 text-gray-500">
              or
            </span>
          </div>
        </div>

        {/* GitHub Sign In */}
        <form
          action={async () => {
            setIsLoading("github");
            await handleGithubSignIn();
          }}
        >
          <Button
            type="submit"
            variant={"outline"}
            className="w-full cursor-pointer h-11 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 group"
            disabled={isLoading !== null}
          >
            <Github className="mr-2 h-5 w-5 text-gray-800 dark:text-gray-200 group-hover:scale-110 transition-transform" />
            <span className="font-medium">Continue with GitHub</span>
          </Button>
        </form>
      </CardContent>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800">
        <p className="text-xs text-center text-gray-500 dark:text-gray-400 leading-relaxed">
          By signing in, you agree to our{" "}
          <a
            href="#"
            className="text-violet-600 dark:text-violet-400 hover:underline font-medium"
          >
            Terms of Service
          </a>{" "}
          and{" "}
          <a
            href="#"
            className="text-violet-600 dark:text-violet-400 hover:underline font-medium"
          >
            Privacy Policy
          </a>
        </p>
      </div>
    </Card>
  );
};

export default SignInFormClient;
