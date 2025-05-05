import { useState } from "react";
import { Headphones, Music, Sparkles, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SpotifyTrack } from "@shared/schema";
import { moodOptions, timeOptions } from "@/lib/types";

interface RecommendationsResultsProps {
  recommendations: SpotifyTrack[];
  onNewSearch: () => void;
  onPlayTrack: (track: SpotifyTrack) => void;
}

export default function RecommendationsResults({ 
  recommendations, 
  onNewSearch,
  onPlayTrack
}: RecommendationsResultsProps) {
  
  const getMoodIcon = (index: number) => {
    // Since we don't have actual mood data for each song, we're alternating icons
    const moodIndex = index % moodOptions.length;
    return moodOptions[moodIndex];
  };
  
  const getTimeIcon = (index: number) => {
    // Since we don't have actual time data for each song, we're alternating icons
    const timeIndex = index % timeOptions.length;
    return timeOptions[timeIndex];
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-semibold text-2xl flex items-center text-white">
          <Headphones className="text-[#1DB954] mr-2" />
          Your Recommendations
        </h2>
        <Button
          variant="outline"
          onClick={onNewSearch}
          className="text-[#1DB954] hover:text-white border border-[#1DB954] hover:bg-[#1DB954]"
        >
          <RefreshCw className="mr-1 h-4 w-4" /> New Search
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((track, index) => (
          <Card 
            key={track.id}
            className="bg-[#282828] rounded-xl overflow-hidden shadow-lg transition-all hover:translate-y-[-5px] hover:shadow-xl"
          >
            <div className="relative">
              <img 
                src={track.album.images[0]?.url || "https://via.placeholder.com/300"} 
                alt={`${track.album.name} cover`} 
                className="w-full h-48 object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent py-6 px-4">
                <h3 className="font-semibold text-lg text-white">{track.name}</h3>
                <p className="text-white">{track.artists.map(a => a.name).join(", ")}</p>
              </div>
              <button 
                className="absolute bottom-4 right-4 bg-[#1DB954] rounded-full w-12 h-12 flex items-center justify-center shadow-lg hover:scale-105 transition-all"
                onClick={() => onPlayTrack(track)}
                disabled={!track.preview_url}
                title={track.preview_url ? "Play preview" : "No preview available"}
              >
                <Music className={!track.preview_url ? "text-gray-300" : ""} />
              </button>
            </div>
            <div className="p-4">
              <div className="flex items-center mb-3">
                <div className={`${getTimeIcon(index).color} ${getTimeIcon(index).textColor} w-8 h-8 rounded-full flex items-center justify-center mr-2`}>
                  <Sparkles className="h-4 w-4" />
                </div>
                <div className={`${getMoodIcon(index).color} ${getMoodIcon(index).textColor} w-8 h-8 rounded-full flex items-center justify-center mr-2`}>
                  <Sparkles className="h-4 w-4" />
                </div>
                <span className="text-sm text-white ml-1">
                  <Music className="inline mr-1 h-3 w-3" /> 
                  {/* This would ideally come from Spotify genres, but using album name as a fallback */}
                  {track.album.name.split(" ").slice(0, 2).join(" ")}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-sm text-white">
                  <Music className="inline mr-1 h-3 w-3" /> {track.album.name}
                </div>
                <a
                  href={track.external_urls.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#1DB954] hover:underline text-sm flex items-center"
                >
                  <svg className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                  </svg>
                  Open in Spotify
                </a>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
