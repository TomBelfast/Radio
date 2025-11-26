"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrafficForm } from "@/components/TrafficForm";
import { WeatherForm } from "@/components/WeatherForm";
import { SettingsCard } from "@/components/SettingsCard";
import { useUser } from "@stackframe/stack";

export default function Home() {
  const user = useUser();

  if (!user) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-white mb-4">Welcome to Radio Traffic Generator</h2>
        <p className="text-zinc-400 mb-8">Please sign in to continue.</p>
        <a href="/handler/sign-in" className="px-6 py-3 bg-white text-black rounded-md font-medium hover:bg-zinc-200 transition inline-block">
          Sign In
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
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
    </div>
  );
}
