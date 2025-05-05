import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Music Preferences Schema
export const musicPreferencesSchema = z.object({
  language: z.string().min(1, "Language is required"),
  mood: z.string().min(1, "Mood is required"),
  timeOfDay: z.string().min(1, "Time of day is required"),
  genres: z.array(z.string()).min(1, "At least one genre is required"),
});

export type MusicPreferences = z.infer<typeof musicPreferencesSchema>;

// Spotify Track Schema
export const spotifyTrackSchema = z.object({
  id: z.string(),
  name: z.string(),
  artists: z.array(z.object({
    id: z.string(),
    name: z.string(),
  })),
  album: z.object({
    id: z.string(),
    name: z.string(),
    images: z.array(z.object({
      url: z.string(),
      height: z.number(),
      width: z.number(),
    })),
  }),
  preview_url: z.string().nullable(),
  external_urls: z.object({
    spotify: z.string(),
  }),
});

export type SpotifyTrack = z.infer<typeof spotifyTrackSchema>;

// Recommendations Response Schema
export const recommendationsResponseSchema = z.object({
  tracks: z.array(spotifyTrackSchema),
});

export type RecommendationsResponse = z.infer<typeof recommendationsResponseSchema>;
