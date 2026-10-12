import React from "react";
import { Github, ExternalLink, Sparkles } from "lucide-react";

const Footer = () => {
  // Array of items for continuous marquee
  const tickerItems = [
    "Muhammad Rafli Eriyanto",
    "✦",
    "Muhammad Rafli Eriyanto",
    "✦",
    "Muhammad Rafli Eriyanto",
    "✦",
    "Muhammad Rafli Eriyanto",
    "✦",
  ];

  return (
    <footer className="relative w-full overflow-hidden bg-background pt-10 pb-8 select-none">
      {/* Decorative top border gradient line */}
      <div className="relative w-full flex items-center justify-center mb-6">
        <div className="w-full max-w-6xl h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        <div className="absolute top-1/2 -translate-y-1/2 px-3 bg-background">
          <Sparkles className="w-4 h-4 text-primary animate-pulse" />
        </div>
      </div>

      {/* Interactive Running Text (Marquee) — Teks Jalan Muncul Dari Layar */}
      <div className="relative w-full py-4 overflow-hidden group">
        {/* Soft edge gradient overlay to make text emerge and vanish seamlessly at screen boundaries */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 sm:w-44 bg-gradient-to-r from-background via-background/80 to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 sm:w-44 bg-gradient-to-l from-background via-background/80 to-transparent z-10" />

        <a
          href="https://github.com/MuhammadRafliEriyanto"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full cursor-pointer focus:outline-none"
          title="Visit GitHub: Muhammad Rafli Eriyanto"
        >
          <div className="marquee-mask flex overflow-hidden">
            <div className="animate-marquee flex items-center gap-8 whitespace-nowrap group-hover:[animation-play-state:paused] transition-all duration-300">
              {/* Render repeated sets for smooth infinite 60fps loop */}
              {[...Array(3)].map((_, loopIdx) => (
                <div key={loopIdx} className="flex items-center gap-8">
                  {tickerItems.map((item, idx) => (
                    <span
                      key={`${loopIdx}-${idx}`}
                      className={`text-lg sm:text-2xl md:text-3xl font-bold tracking-wider transition-all duration-300 ${
                        item === "✦"
                          ? "text-primary/60 scale-110"
                          : "text-slate-400 group-hover:text-slate-200 hover:!text-primary hover:drop-shadow-[0_0_16px_rgba(0,255,136,0.9)] hover:scale-105"
                      }`}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </a>
      </div>

      {/* Interactive Bottom Signature Link */}
      <div className="max-w-6xl mx-auto px-4 mt-6 flex items-center justify-center text-xs sm:text-sm text-slate-400">
        <a
          href="https://github.com/MuhammadRafliEriyanto"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-secondary/70 border border-slate-800/80 hover:border-primary/60 hover:text-primary hover:shadow-[0_0_20px_rgba(0,255,136,0.2)] transition-all duration-300 group"
        >
          <Github className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors" />
          <span className="font-semibold text-slate-300 group-hover:text-primary transition-colors">
            Muhammad Rafli Eriyanto
          </span>
          <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
        </a>
      </div>
    </footer>
  );
};

export default Footer;

