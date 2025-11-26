import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useUser } from '@stackframe/stack';
import { Loader2 } from 'lucide-react';

export const SettingsCard = () => {
    const user = useUser();
    const { settings, fetchSettings, saveSettings, isLoading } = useSettingsStore();
    const [localSettings, setLocalSettings] = useState({
        default_city: '',
        default_voice_id: '',
        default_language: 'pl'
    });

    useEffect(() => {
        if (user) {
            fetchSettings(user.id);
        }
    }, [user, fetchSettings]);

    useEffect(() => {
        if (settings) {
            setLocalSettings({
                default_city: settings.default_city || '',
                default_voice_id: settings.default_voice_id || '',
                default_language: settings.default_language || 'pl'
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [settings]);

    const handleSave = async () => {
        if (!user) return;
        await saveSettings(user.id, {
            user_id: user.id,
            ...localSettings
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Settings</CardTitle>
                <CardDescription>Manage your default preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="default_city">Default City</Label>
                    <Input
                        id="default_city"
                        value={localSettings.default_city}
                        onChange={(e) => setLocalSettings({ ...localSettings, default_city: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="default_voice_id">ElevenLabs Voice ID</Label>
                    <Input
                        id="default_voice_id"
                        value={localSettings.default_voice_id}
                        onChange={(e) => setLocalSettings({ ...localSettings, default_voice_id: e.target.value })}
                    />
                </div>
            </CardContent>
            <CardFooter>
                <Button onClick={handleSave} disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Settings
                </Button>
            </CardFooter>
        </Card>
    );
};
