import { SpotifyTrack, MusicPreferences } from "@shared/schema";

// Spotify API configuration
const SPOTIFY_API_URL = 'https://api.spotify.com/v1';
let accessToken: string = '';
let tokenExpiresAt: number = 0;

// Get Spotify client credentials from environment variables
const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID || '28dc481118614c21bbb6a07d8d8f7541';
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET || '027a21d9987842a2b46414629027f410';

console.log('Spotify credentials:', { 
  clientId: SPOTIFY_CLIENT_ID, 
  clientSecret: SPOTIFY_CLIENT_SECRET ? 'Secret exists' : 'No secret'
});

if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
  console.warn('SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET not set. Spotify API integration will not work.');
}

/**
 * Gets an access token from Spotify using client credentials flow
 */
export async function getAccessToken(): Promise<string> {
  // Check if we already have a valid token
  if (accessToken && Date.now() < tokenExpiresAt - 60000) {
    return accessToken;
  }

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64')}`
      },
      body: 'grant_type=client_credentials'
    });

    if (!response.ok) {
      throw new Error(`Failed to get Spotify token: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    accessToken = data.access_token;
    tokenExpiresAt = Date.now() + data.expires_in * 1000;
    return accessToken || '';
  } catch (error) {
    console.error('Error getting Spotify access token:', error);
    throw error;
  }
}

/**
 * Makes a request to the Spotify API
 */
async function spotifyApiRequest(endpoint: string, method: string = 'GET', params?: Record<string, string>): Promise<any> {
  try {
    const token = await getAccessToken();
    
    const url = new URL(`${SPOTIFY_API_URL}${endpoint}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    const response = await fetch(url.toString(), {
      method,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(`Spotify API error (${response.status}): ${JSON.stringify(errorData)}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error in Spotify API request to ${endpoint}:`, error);
    throw error;
  }
}

/**
 * Maps user preferences to Spotify API parameters
 */
function mapPreferencesToApiParams(preferences: MusicPreferences): Record<string, string> {
  const params: Record<string, string> = {
    limit: '10'
  };

  // Map genres to seed genres
  if (preferences.genres && preferences.genres.length > 0) {
    // Spotify API allows up to 5 seed values in total
    params.seed_genres = preferences.genres.slice(0, 5).join(',');
  }

  // Map mood to audio features
  switch (preferences.mood) {
    case 'happy':
      params.target_valence = '0.8';
      params.min_valence = '0.6';
      params.target_energy = '0.7';
      break;
    case 'sad':
      params.target_valence = '0.2';
      params.max_valence = '0.4';
      params.target_energy = '0.3';
      break;
    case 'energetic':
      params.target_energy = '0.9';
      params.min_energy = '0.7';
      params.target_tempo = '140';
      break;
    case 'calm':
      params.target_energy = '0.3';
      params.max_energy = '0.5';
      params.target_acousticness = '0.7';
      break;
  }

  // Map time of day to audio features
  switch (preferences.timeOfDay) {
    case 'morning':
      params.target_energy = '0.6';
      params.target_valence = '0.6';
      break;
    case 'day':
      params.target_energy = '0.7';
      params.target_valence = '0.7';
      break;
    case 'evening':
      params.target_energy = '0.5';
      params.target_valence = '0.5';
      break;
    case 'night':
      params.target_energy = '0.4';
      params.target_valence = '0.4';
      params.target_acousticness = '0.6';
      break;
  }

  // Handle language by using market parameter if applicable
  if (preferences.language) {
    const marketMap: Record<string, string> = {
      english: 'US',
      spanish: 'ES',
      hindi: 'IN',
      french: 'FR',
      korean: 'KR',
      japanese: 'JP',
      german: 'DE',
      portuguese: 'PT',
      italian: 'IT',
      mandarin: 'CN'
    };
    
    if (marketMap[preferences.language]) {
      params.market = marketMap[preferences.language];
    }
  }

  return params;
}

/**
 * Get song recommendations based on user preferences
 */
export async function getRecommendations(preferences: MusicPreferences): Promise<SpotifyTrack[]> {
  // Check if Spotify credentials are missing
  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
    console.log('Using mock data since Spotify credentials are not configured');
    return getMockRecommendations(preferences);
  }
  
  try {
    const params = mapPreferencesToApiParams(preferences);
    const data = await spotifyApiRequest('/recommendations', 'GET', params);
    return data.tracks;
  } catch (error) {
    console.error('Error getting recommendations:', error);
    // If API fails, return mock data as fallback
    return getMockRecommendations(preferences);
  }
}

/**
 * Generate mock data for demonstration purposes when Spotify API is not available
 */
function getMockRecommendations(preferences: MusicPreferences): SpotifyTrack[] {
  // Create some sample tracks that match the SpotifyTrack interface
  const mockTracks: SpotifyTrack[] = [
    {
      id: "1",
      name: "Happy Vibes",
      preview_url: "https://p.scdn.co/mp3-preview/cb1ae1f9e2f97d9f441e201a6c7153533d710e57",
      external_urls: {
        spotify: "https://open.spotify.com/track/4iV5W9uYEdYUVa79Axb7Rh"
      },
      album: {
        id: "1",
        name: "Mood Album",
        images: [
          {
            url: "https://cdn.pixabay.com/photo/2015/05/07/11/02/guitar-756326_960_720.jpg",
            height: 640,
            width: 640
          }
        ]
      },
      artists: [
        {
          id: "1",
          name: "Artist One"
        }
      ]
    },
    {
      id: "2",
      name: "Chill Moments",
      preview_url: "https://p.scdn.co/mp3-preview/cb1ae1f9e2f97d9f441e201a6c7153533d710e59",
      external_urls: {
        spotify: "https://open.spotify.com/track/4iV5W9uYEdYUVa79Axb7Rh"
      },
      album: {
        id: "2",
        name: "Evening Tracks",
        images: [
          {
            url: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_960_720.jpg",
            height: 640,
            width: 640
          }
        ]
      },
      artists: [
        {
          id: "2",
          name: "Artist Two"
        }
      ]
    },
    {
      id: "3",
      name: `${preferences.mood} Rhythm`,
      preview_url: "https://p.scdn.co/mp3-preview/cb1ae1f9e2f97d9f441e201a6c7153533d710e60",
      external_urls: {
        spotify: "https://open.spotify.com/track/4iV5W9uYEdYUVa79Axb7Rh"
      },
      album: {
        id: "3",
        name: `${preferences.timeOfDay} Collection`,
        images: [
          {
            url: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_960_720.jpg",
            height: 640,
            width: 640
          }
        ]
      },
      artists: [
        {
          id: "3",
          name: `${preferences.language} Artist`
        }
      ]
    },
    {
      id: "4",
      name: `${preferences.timeOfDay} Melody`,
      preview_url: "https://p.scdn.co/mp3-preview/cb1ae1f9e2f97d9f441e201a6c7153533d710e61",
      external_urls: {
        spotify: "https://open.spotify.com/track/4iV5W9uYEdYUVa79Axb7Rh"
      },
      album: {
        id: "4",
        name: "Favorite Mix",
        images: [
          {
            url: "https://cdn.pixabay.com/photo/2018/01/14/23/12/nature-3082832_960_720.jpg",
            height: 640,
            width: 640
          }
        ]
      },
      artists: [
        {
          id: "4",
          name: "Popular Band"
        },
        {
          id: "5",
          name: "Featured Artist"
        }
      ]
    },
    {
      id: "5",
      name: "Sunset Tunes",
      preview_url: "https://p.scdn.co/mp3-preview/cb1ae1f9e2f97d9f441e201a6c7153533d710e62",
      external_urls: {
        spotify: "https://open.spotify.com/track/4iV5W9uYEdYUVa79Axb7Rh"
      },
      album: {
        id: "5",
        name: "Summer Collection",
        images: [
          {
            url: "https://cdn.pixabay.com/photo/2016/11/29/05/45/astronomy-1867616_960_720.jpg",
            height: 640,
            width: 640
          }
        ]
      },
      artists: [
        {
          id: "6",
          name: "Indie Group"
        }
      ]
    },
    {
      id: "6",
      name: "Urban Dreams",
      preview_url: "https://p.scdn.co/mp3-preview/cb1ae1f9e2f97d9f441e201a6c7153533d710e63",
      external_urls: {
        spotify: "https://open.spotify.com/track/4iV5W9uYEdYUVa79Axb7Rh"
      },
      album: {
        id: "6",
        name: "City Vibes",
        images: [
          {
            url: "https://cdn.pixabay.com/photo/2016/11/18/16/19/flowers-1835619_960_720.jpg",
            height: 640,
            width: 640
          }
        ]
      },
      artists: [
        {
          id: "7",
          name: "Urban Artist"
        }
      ]
    }
  ];
  
  return mockTracks;
}
