import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
import ThemeProvider from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { FloatingThemeButton } from "@/components/floating-theme-button";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins", // optional but recommended
});

export const metadata: Metadata = {
  title: "Loom",
  description: "A web based code IDE for everyone.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.className} antialiased`}>
        <SessionProvider session={session}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Toaster />
            <FloatingThemeButton />
            {children}
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
