import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { generateTraffic, synthesizeAudio } from '@/lib/api';
import { AudioPlayer } from './AudioPlayer';
import { Loader2 } from 'lucide-react';
import { useSettingsStore } from '@/store/useSettingsStore';

export const TrafficForm = () => {
    const { settings } = useSettingsStore();
    const [city, setCity] = useState(settings?.default_city || '');
    const [style, setStyle] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [resultText, setResultText] = useState('');
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

    const handleGenerate = async () => {
        setIsLoading(true);
        setResultText('');
        setAudioBlob(null);
        try {
            const data = await generateTraffic(city, style);
            setResultText(data.text);

            // Auto-synthesize if voice is set
            if (settings?.default_voice_id) {
                const audio = await synthesizeAudio(data.text, settings.default_voice_id);
                setAudioBlob(new Blob([audio], { type: 'audio/mpeg' }));
            }
        } catch (error) {
            console.error(error);
            setResultText('Error generating report.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Traffic Report</CardTitle>
                <CardDescription>Generate a traffic update for a specific city.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" placeholder="e.g. Belfast" value={city} onChange={(e) => setCity(e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="style">Style (Optional)</Label>
                    <Input id="style" placeholder="e.g. Energetic, Serious" value={style} onChange={(e) => setStyle(e.target.value)} />
                </div>
                {resultText && (
                    <div className="mt-4 p-4 bg-muted rounded-md text-sm whitespace-pre-wrap">
                        {resultText}
                    </div>
                )}
                {audioBlob && <AudioPlayer audioBlob={audioBlob} />}
            </CardContent>
            <CardFooter>
                <Button onClick={handleGenerate} disabled={isLoading || !city}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Generate
                </Button>
            </CardFooter>
        </Card>
    );
};
