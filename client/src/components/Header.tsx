import { Music } from "lucide-react";

export default function Header() {
  return (
    <header className="text-center mb-10">
      <div className="flex items-center justify-center mb-2">
        <div className="w-12 h-12 bg-[#1DB954] rounded-full flex items-center justify-center mr-2">
          <Music className="text-white" size={24} />
        </div>
        <h1 className="font-sans font-bold text-3xl md:text-4xl lg:text-5xl text-white">
          Mood<span className="text-[#1DB954]">Tunes</span>
        </h1>
      </div>
      <p className="text-white text-lg mt-2">Find the perfect music for your mood and moment</p>
    </header>
  );
}
