"use client";

import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const { toast } = useToast();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Preferences Saved",
      description: "Your settings have been updated successfully.",
    });
  };

  return (
    <AppShell>
      <div className="flex-1 space-y-4 p-4 sm:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h1 className="text-3xl font-bold tracking-tight font-headline">Settings</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Your Preferences</CardTitle>
            <CardDescription>
              Customize your RoamFree experience.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-lg font-medium font-headline">Notifications</h3>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <Label htmlFor="welcome-notifications">Welcome Notifications</Label>
                  <Switch id="welcome-notifications" defaultChecked />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <Label htmlFor="farewell-notifications">Farewell Notifications</Label>
                  <Switch id="farewell-notifications" defaultChecked />
                </div>
                 <div className="flex items-center justify-between p-4 border rounded-lg">
                  <Label htmlFor="suggestion-notifications">Proactive Suggestions</Label>                  
                  <Switch id="suggestion-notifications" />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium font-headline">Travel Style</h3>
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="interests">Interests</Label>
                        <Input id="interests" defaultValue="Art, History, Food, Parks, Shopping" />
                        <p className="text-xs text-muted-foreground">Separate interests with a comma.</p>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="budget">Budget Preference</Label>
                        <Input id="budget" defaultValue="Mid-range" />
                    </div>
                </div>
              </div>

              <Button type="submit">Save Preferences</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
