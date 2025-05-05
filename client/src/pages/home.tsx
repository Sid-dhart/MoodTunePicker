import { useState } from "react";
import Header from "@/components/Header";
import PreferencesForm from "@/components/PreferencesForm";
import LoadingState from "@/components/LoadingState";
import RecommendationsResults from "@/components/RecommendationsResults";
import NoResults from "@/components/NoResults";
import ErrorState from "@/components/ErrorState";
import AudioPlayer from "@/components/AudioPlayer";
import Footer from "@/components/Footer";
import { SpotifyTrack, MusicPreferences } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

type DisplayState = "form" | "loading" | "results" | "no-results" | "error";

export default function Home() {
  const [displayState, setDisplayState] = useState<DisplayState>("form");
  const [recommendations, setRecommendations] = useState<SpotifyTrack[]>([]);
  const [currentTrack, setCurrentTrack] = useState<SpotifyTrack | null>(null);
  const [isAudioPlayerVisible, setIsAudioPlayerVisible] = useState(false);

  const recommendationsMutation = useMutation({
    mutationFn: async (preferences: MusicPreferences) => {
      const res = await apiRequest("POST", "/api/recommendations", preferences);
      return await res.json();
    },
    onMutate: () => {
      setDisplayState("loading");
    },
    onSuccess: (data) => {
      if (data.tracks && data.tracks.length > 0) {
        setRecommendations(data.tracks);
        setDisplayState("results");
      } else {
        setDisplayState("no-results");
      }
    },
    onError: (error) => {
      console.error("Error fetching recommendations:", error);
      setDisplayState("error");
    },
  });

  const handleFormSubmit = (preferences: MusicPreferences) => {
    recommendationsMutation.mutate(preferences);
  };

  const handleNewSearch = () => {
    setDisplayState("form");
  };

  const handlePlayTrack = (track: SpotifyTrack) => {
    setCurrentTrack(track);
    setIsAudioPlayerVisible(true);
  };

  const closeAudioPlayer = () => {
    setIsAudioPlayerVisible(false);
  };

  // Get background style based on time of day
  const getBackgroundStyle = () => {
    // Default background
    return {
      backgroundColor: "#121212",
      backgroundImage: `
        radial-gradient(circle at 10% 20%, rgba(29, 185, 84, 0.05) 0%, transparent 20%),
        radial-gradient(circle at 90% 80%, rgba(29, 185, 84, 0.05) 0%, transparent 20%),
        radial-gradient(circle at 50% 50%, rgba(29, 185, 84, 0.05) 0%, transparent 60%)
      `,
    };
  };

  return (
    <div className="min-h-screen text-white" style={getBackgroundStyle()}>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <Header />

        <main className="text-white">
          {displayState === "form" && (
            <PreferencesForm onSubmit={handleFormSubmit} />
          )}
          
          {displayState === "loading" && (
            <LoadingState />
          )}
          
          {displayState === "results" && (
            <RecommendationsResults 
              recommendations={recommendations}
              onNewSearch={handleNewSearch}
              onPlayTrack={handlePlayTrack}
            />
          )}
          
          {displayState === "no-results" && (
            <NoResults onTryAgain={handleNewSearch} />
          )}
          
          {displayState === "error" && (
            <ErrorState onTryAgain={handleNewSearch} />
          )}
        </main>

        <Footer />
      </div>

      {currentTrack && (
        <AudioPlayer 
          track={currentTrack}
          isVisible={isAudioPlayerVisible}
          onClose={closeAudioPlayer}
        />
      )}
    </div>
  );
}
