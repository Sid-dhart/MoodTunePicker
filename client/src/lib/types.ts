import { SpotifyTrack } from "@shared/schema";

export interface AudioPlayerState {
  currentTrack: SpotifyTrack | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
}

export type Mood = "happy" | "sad" | "energetic" | "calm";

export type TimeOfDay = "morning" | "day" | "evening" | "night";

export interface MoodInfo {
  id: Mood;
  label: string;
  icon: string;
  color: string;
  textColor: string;
}

export interface TimeInfo {
  id: TimeOfDay;
  label: string;
  icon: string;
  color: string;
  textColor: string;
}

export const moodOptions: MoodInfo[] = [
  { 
    id: "happy", 
    label: "Happy", 
    icon: "smile", 
    color: "bg-[#FFD166]", 
    textColor: "text-[#121212]" 
  },
  { 
    id: "sad", 
    label: "Sad", 
    icon: "frown", 
    color: "bg-[#118AB2]", 
    textColor: "text-white" 
  },
  { 
    id: "energetic", 
    label: "Energetic", 
    icon: "zap", 
    color: "bg-[#EF476F]", 
    textColor: "text-white" 
  },
  { 
    id: "calm", 
    label: "Calm", 
    icon: "leaf", 
    color: "bg-[#06D6A0]", 
    textColor: "text-[#121212]" 
  },
];

export const timeOptions: TimeInfo[] = [
  { 
    id: "morning", 
    label: "Morning", 
    icon: "coffee", 
    color: "bg-[#F9DB6D]", 
    textColor: "text-[#121212]" 
  },
  { 
    id: "day", 
    label: "Day", 
    icon: "sun", 
    color: "bg-[#48CAE4]", 
    textColor: "text-[#121212]" 
  },
  { 
    id: "evening", 
    label: "Evening", 
    icon: "sunset", 
    color: "bg-[#9D4EDD]", 
    textColor: "text-white" 
  },
  { 
    id: "night", 
    label: "Night", 
    icon: "moon", 
    color: "bg-[#0D1B2A]", 
    textColor: "text-white" 
  },
];

export const genres = [
  { id: "pop", label: "Pop" },
  { id: "rock", label: "Rock" },
  { id: "hiphop", label: "Hip Hop" },
  { id: "rnb", label: "R&B" },
  { id: "electronic", label: "Electronic" },
  { id: "classical", label: "Classical" },
  { id: "jazz", label: "Jazz" },
  { id: "indie", label: "Indie" },
  { id: "country", label: "Country" },
  { id: "metal", label: "Metal" },
  { id: "blues", label: "Blues" },
  { id: "reggae", label: "Reggae" },
];

export const languages = [
  { value: "english", label: "English" },
  { value: "spanish", label: "Spanish" },
  { value: "hindi", label: "Hindi" },
  { value: "french", label: "French" },
  { value: "korean", label: "Korean" },
  { value: "japanese", label: "Japanese" },
  { value: "german", label: "German" },
  { value: "portuguese", label: "Portuguese" },
  { value: "italian", label: "Italian" },
  { value: "mandarin", label: "Mandarin" },
];
