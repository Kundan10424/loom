import SignInFormClient from "@/features/auth/components/signin-form-client";
import Image from "next/image";
import React from "react";

const SignInpage = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center py-12">
      <div className="space-y-8 w-full max-w-md">
        {/* Logo and Branding */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-linear-to-r from-violet-500 via-indigo-500 to-blue-500 rounded-xl blur-lg opacity-30" />
              <Image
                src={"/logo.svg"}
                alt="Loom logo"
                width={80}
                height={80}
                className="relative"
              />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-linear-to-r from-violet-500 via-indigo-500 to-blue-500">
            Loom
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Code with Intelligence
          </p>
        </div>

        {/* Sign In Form */}
        <SignInFormClient />
      </div>
    </div>
  );
};

export default SignInpage;
