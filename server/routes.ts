import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { getRecommendations } from "./spotify";
import { musicPreferencesSchema, recommendationsResponseSchema } from "@shared/schema";
import { ZodError } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get music recommendations
  app.post("/api/recommendations", async (req: Request, res: Response) => {
    try {
      // Validate request body against schema
      const preferences = musicPreferencesSchema.parse(req.body);
      
      // Get recommendations from Spotify API (or fallback data)
      const tracks = await getRecommendations(preferences);
      
      // Return recommendations
      res.json({ tracks });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: "Invalid request data",
          errors: error.errors
        });
      }
      
      console.error("Error getting recommendations:", error);
      
      try {
        // Try to get fallback data even if there was an error
        const preferences = musicPreferencesSchema.parse(req.body);
        const tracks = await getRecommendations(preferences);
        res.json({ tracks, notice: "Using placeholder data. For actual Spotify recommendations, please configure API keys." });
      } catch (fallbackError) {
        // If even the fallback fails, then return an error
        res.status(500).json({ 
          message: "Failed to get music recommendations",
          error: error instanceof Error ? error.message : String(error)
        });
      }
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
