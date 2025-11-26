import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { StackProvider } from "@stackframe/stack";

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
    <StackProvider
      app={{
        projectId: process.env.NEXT_PUBLIC_STACK_PROJECT_ID!,
        publishableClientKey: process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY!,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any}
    >
      <html lang="en" className="dark">
        <body className={inter.className}>
          <div className="min-h-screen bg-zinc-950">
            <header className="border-b border-zinc-800 bg-zinc-900">
              <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <h1 className="text-xl font-bold text-white">Radio Traffic Generator</h1>
                <div className="text-white text-sm">Stack Auth</div>
              </div>
            </header>
            <main className="container mx-auto px-4 py-8">
              {children}
            </main>
          </div>
        </body>
      </html>
    </StackProvider>
  );
}
