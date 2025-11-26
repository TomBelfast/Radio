import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider, SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Radio Traffic & Weather Generator",
  description: "AI-powered traffic and weather reports for radio stations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <body className={inter.className}>
          <div className="min-h-screen bg-zinc-950">
            <header className="border-b border-zinc-800 bg-zinc-900">
              <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <h1 className="text-xl font-bold text-white">Radio Traffic Generator</h1>
                <SignedIn>
                  <UserButton afterSignOutUrl="/" />
                </SignedIn>
                <SignedOut>
                  <SignInButton mode="modal">
                    <button className="px-4 py-2 bg-white text-black rounded-md text-sm font-medium hover:bg-zinc-200 transition">
                      Sign In
                    </button>
                  </SignInButton>
                </SignedOut>
              </div>
            </header>
            <main className="container mx-auto px-4 py-8">
              {children}
            </main>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
