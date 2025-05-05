import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { musicPreferencesSchema, MusicPreferences } from "@shared/schema";
import { Sliders, Music } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { moodOptions, timeOptions, genres, languages } from "@/lib/types";

interface PreferencesFormProps {
  onSubmit: (preferences: MusicPreferences) => void;
}

export default function PreferencesForm({ onSubmit }: PreferencesFormProps) {
  const form = useForm<MusicPreferences>({
    resolver: zodResolver(musicPreferencesSchema),
    defaultValues: {
      language: "",
      mood: "",
      timeOfDay: "",
      genres: [],
    }
  });

  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  const handleGenreToggle = (genreId: string) => {
    const updatedGenres = selectedGenres.includes(genreId)
      ? selectedGenres.filter(id => id !== genreId)
      : [...selectedGenres, genreId];
    
    setSelectedGenres(updatedGenres);
    form.setValue("genres", updatedGenres, { shouldValidate: true });
  };

  const handleSubmit = (data: MusicPreferences) => {
    onSubmit(data);
  };

  return (
    <Card className="bg-[#282828] rounded-xl shadow-lg mb-10 transition-all hover:translate-y-[-5px] hover:shadow-xl">
      <CardContent className="p-6 md:p-8">
        <div className="flex items-center mb-6">
          <Sliders className="mr-3 text-[#1DB954]" />
          <h2 className="font-semibold text-2xl text-white">Tell us your preferences</h2>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
            {/* Language Preference */}
            <FormField
              control={form.control}
              name="language"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-medium mb-3 text-white">What's your preferred language?</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full bg-[#121212] border-gray-700 rounded-lg p-4 text-white">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-[#121212] border-gray-700 text-white">
                      {languages.map((language) => (
                        <SelectItem key={language.value} value={language.value}>
                          {language.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-white" />
                </FormItem>
              )}
            />

            {/* Mood Selection */}
            <FormField
              control={form.control}
              name="mood"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-medium mb-3 text-white">How are you feeling today?</FormLabel>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {moodOptions.map((mood) => (
                      <div key={mood.id} className="mood-option">
                        <input
                          type="radio"
                          id={`mood-${mood.id}`}
                          value={mood.id}
                          className="hidden"
                          checked={field.value === mood.id}
                          onChange={() => form.setValue("mood", mood.id, { shouldValidate: true })}
                        />
                        <label
                          htmlFor={`mood-${mood.id}`}
                          className={`block p-4 bg-[#121212] hover:bg-opacity-80 rounded-lg text-center transition-all cursor-pointer ${
                            field.value === mood.id ? "ring-2 ring-white ring-offset-2 ring-offset-[#121212] scale-105" : ""
                          }`}
                          style={{ "--selected-color": mood.color.replace("bg-", "") } as any}
                        >
                          <div className={`${mood.color} ${mood.textColor} w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-2`}>
                            <Music className="h-6 w-6" />
                          </div>
                          <span className="font-medium text-white">{mood.label}</span>
                        </label>
                      </div>
                    ))}
                  </div>
                  <FormMessage className="text-white" />
                </FormItem>
              )}
            />

            {/* Time of Day */}
            <FormField
              control={form.control}
              name="timeOfDay"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-medium mb-3 text-white">What time of day is it for you?</FormLabel>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {timeOptions.map((time) => (
                      <div key={time.id} className="time-option">
                        <input
                          type="radio"
                          id={`time-${time.id}`}
                          value={time.id}
                          className="hidden"
                          checked={field.value === time.id}
                          onChange={() => form.setValue("timeOfDay", time.id, { shouldValidate: true })}
                        />
                        <label
                          htmlFor={`time-${time.id}`}
                          className={`block p-4 bg-[#121212] hover:bg-opacity-80 rounded-lg text-center transition-all cursor-pointer ${
                            field.value === time.id ? "ring-2 ring-white ring-offset-2 ring-offset-[#121212] scale-105" : ""
                          }`}
                          style={{ "--selected-color": time.color.replace("bg-", "") } as any}
                        >
                          <div className={`${time.color} ${time.textColor} w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-2`}>
                            <Music className="h-6 w-6" />
                          </div>
                          <span className="font-medium text-white">{time.label}</span>
                        </label>
                      </div>
                    ))}
                  </div>
                  <FormMessage className="text-white" />
                </FormItem>
              )}
            />

            {/* Genre Preference */}
            <FormField
              control={form.control}
              name="genres"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-medium mb-3 text-white">What kind of music do you prefer?</FormLabel>
                  <div className="flex flex-wrap gap-3">
                    {genres.map((genre) => (
                      <div key={genre.id} className="genre-chip">
                        <input
                          type="checkbox"
                          id={`genre-${genre.id}`}
                          value={genre.id}
                          className="hidden"
                          checked={selectedGenres.includes(genre.id)}
                          onChange={() => handleGenreToggle(genre.id)}
                        />
                        <label
                          htmlFor={`genre-${genre.id}`}
                          className={`inline-block px-4 py-2 rounded-full cursor-pointer transition-all ${
                            selectedGenres.includes(genre.id)
                              ? "bg-[#1DB954] text-white border-[#1DB954]"
                              : "bg-[#121212] text-white border border-gray-700 hover:bg-gray-800"
                          }`}
                        >
                          {genre.label}
                        </label>
                      </div>
                    ))}
                  </div>
                  <FormMessage className="text-white" />
                </FormItem>
              )}
            />

            {/* Form Submission */}
            <div className="pt-2">
              <Button
                type="submit"
                className="w-full bg-[#1DB954] hover:bg-opacity-90 text-white font-medium py-4 px-6 rounded-lg transition-all"
              >
                <Music className="mr-2" /> Find My Perfect Songs
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
