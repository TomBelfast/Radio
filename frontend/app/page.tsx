"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrafficForm } from "@/components/TrafficForm";
import { WeatherForm } from "@/components/WeatherForm";
import { SettingsCard } from "@/components/SettingsCard";
import { SignedIn, SignedOut } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto">
      <SignedOut>
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-white mb-4">Welcome to Radio Traffic Generator</h2>
          <p className="text-zinc-400">Please sign in to continue.</p>
        </div>
      </SignedOut>
      <SignedIn>
        <Tabs defaultValue="traffic" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="traffic">Traffic</TabsTrigger>
            <TabsTrigger value="weather">Weather</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="traffic">
            <TrafficForm />
          </TabsContent>
          <TabsContent value="weather">
            <WeatherForm />
          </TabsContent>
          <TabsContent value="settings">
            <SettingsCard />
          </TabsContent>
        </Tabs>
      </SignedIn>
    </div>
  );
}
