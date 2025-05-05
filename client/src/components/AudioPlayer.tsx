import { useState, useEffect, useRef } from "react";
import { Play, Pause, X, SkipForward, SkipBack } from "lucide-react";
import { SpotifyTrack } from "@shared/schema";
import { Progress } from "@/components/ui/progress";

interface AudioPlayerProps {
  track: SpotifyTrack;
  isVisible: boolean;
  onClose: () => void;
}

export default function AudioPlayer({ track, isVisible, onClose }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(30); // Most Spotify previews are 30 seconds
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(track.preview_url || '');
      
      audioRef.current.addEventListener('loadedmetadata', () => {
        if (audioRef.current) {
          setDuration(audioRef.current.duration);
        }
      });
      
      audioRef.current.addEventListener('timeupdate', () => {
        if (audioRef.current) {
          setCurrentTime(audioRef.current.currentTime);
        }
      });
      
      audioRef.current.addEventListener('ended', () => {
        setIsPlaying(false);
      });
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);
  
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = track.preview_url || '';
      
      if (isPlaying) {
        audioRef.current.play().catch(error => {
          console.error("Error playing audio:", error);
          setIsPlaying(false);
        });
      }
    }
  }, [track]);
  
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(error => {
          console.error("Error playing audio:", error);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  
  return (
    <div 
      className={`fixed bottom-0 left-0 right-0 bg-[#121212] p-4 shadow-lg z-50 transform transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="container mx-auto max-w-5xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img 
              src={track.album.images[0]?.url || "https://via.placeholder.com/300"} 
              alt={`${track.album.name} cover`} 
              className="w-12 h-12 rounded mr-4 object-cover"
            />
            <div>
              <h4 className="font-medium">{track.name}</h4>
              <p className="text-[#b3b3b3] text-sm">{track.artists.map(a => a.name).join(", ")}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button 
              className="text-[#b3b3b3] hover:text-white transition-all"
              disabled
            >
              <SkipBack />
            </button>
            <button 
              className="bg-[#1DB954] rounded-full w-10 h-10 flex items-center justify-center hover:scale-105 transition-all"
              onClick={togglePlay}
              disabled={!track.preview_url}
            >
              {isPlaying ? <Pause /> : <Play />}
            </button>
            <button 
              className="text-[#b3b3b3] hover:text-white transition-all"
              disabled
            >
              <SkipForward />
            </button>
          </div>
          
          <div className="hidden md:block w-1/3">
            <div className="flex items-center">
              <span className="text-xs text-[#b3b3b3] mr-2">{formatTime(currentTime)}</span>
              <Progress 
                value={(currentTime / duration) * 100} 
                className="flex-1 h-1 bg-gray-700"
              />
              <span className="text-xs text-[#b3b3b3] ml-2">{formatTime(duration)}</span>
            </div>
          </div>
          
          <button 
            className="text-[#b3b3b3] hover:text-white transition-all"
            onClick={onClose}
          >
            <X />
          </button>
        </div>
      </div>
    </div>
  );
}
