import React, { useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, Download } from 'lucide-react';

interface AudioPlayerProps {
    audioUrl?: string; // URL or Blob URL
    audioBlob?: Blob;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl, audioBlob }) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = React.useState(false);
    const [src, setSrc] = React.useState<string | undefined>(audioUrl);

    useEffect(() => {
        if (audioBlob) {
            const url = URL.createObjectURL(audioBlob);
            setSrc(url);
            return () => URL.revokeObjectURL(url);
        } else {
            setSrc(audioUrl);
        }
    }, [audioUrl, audioBlob]);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleEnded = () => setIsPlaying(false);

    if (!src) return null;

    return (
        <div className="flex items-center gap-2 p-2 border rounded-md bg-secondary/20">
            <audio ref={audioRef} src={src} onEnded={handleEnded} className="hidden" />
            <Button variant="ghost" size="icon" onClick={togglePlay}>
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <div className="flex-1 text-xs text-muted-foreground truncate">
                Generated Audio
            </div>
            <a href={src} download="generated_audio.mp3">
                <Button variant="ghost" size="icon">
                    <Download className="h-4 w-4" />
                </Button>
            </a>
        </div>
    );
};
