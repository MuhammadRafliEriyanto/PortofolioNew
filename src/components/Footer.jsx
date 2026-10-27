import React from "react";
import { Github, Linkedin, Instagram } from "lucide-react";

// TikTok SVG Icon (standard SimpleIcons path)
const TikTokIcon = ({ className = "w-5 h-5" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z" />
  </svg>
);

const socialLinks = [
  {
    name: "GitHub",
    icon: Github,
    url: "https://github.com/MuhammadRafliEriyanto",
    hoverStyle:
      "hover:text-[#00ff88] hover:border-[#00ff88]/50 hover:shadow-[0_0_20px_rgba(0,255,136,0.3)] hover:bg-[#00ff88]/10",
  },
  {
    name: "LinkedIn",
    icon: Linkedin,
    url: "https://www.linkedin.com/in/muhammad-rafli-107530236/",
    hoverStyle:
      "hover:text-[#38bdf8] hover:border-[#38bdf8]/50 hover:shadow-[0_0_20px_rgba(56,189,248,0.3)] hover:bg-[#38bdf8]/10",
  },
  {
    name: "Instagram",
    icon: Instagram,
    url: "https://www.instagram.com/_dolph1nss",
    hoverStyle:
      "hover:text-[#e1306c] hover:border-[#e1306c]/50 hover:shadow-[0_0_20px_rgba(225,48,108,0.3)] hover:bg-[#e1306c]/10",
  },
  {
    name: "TikTok",
    icon: TikTokIcon,
    url: "https://www.tiktok.com/@1010username11",
    hoverStyle:
      "hover:text-[#ff0050] hover:border-[#ff0050]/50 hover:shadow-[0_0_20px_rgba(255,0,80,0.3)] hover:bg-[#ff0050]/10",
  },
];

const Footer = () => {
  return (
    <footer className="relative w-full overflow-hidden bg-background py-8 select-none">
      {/* Main Split Footer Container */}
      <div className="max-w-6xl mx-auto px-6 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Left Section: Name & Status Subtitle */}
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-1">
          <a
            href="#Home"
            className="text-base sm:text-lg font-bold text-slate-100 hover:text-primary transition-colors tracking-tight"
            title="Kembali ke atas"
          >
            Muhammad Rafli Eriyanto
          </a>
          <p className="text-xs sm:text-sm text-slate-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_#00ff88]" />
            Backend Developer • Ready for new opportunities
          </p>
        </div>

        {/* Right Section: GitHub, LinkedIn, Instagram, TikTok Icons */}
        <div className="flex items-center gap-3">
          {socialLinks.map((social) => {
            const Icon = social.icon;
            return (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.name}
                title={social.name}
                className={`w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-slate-400 transition-all duration-300 hover:scale-110 active:scale-95 ${social.hoverStyle}`}
              >
                <Icon className="w-4 h-4 transition-transform group-hover:scale-110" />
              </a>
            );
          })}
        </div>
      </div>
    </footer>
  );
};

export default Footer;

