import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ExternalLink, ArrowRight, LayoutTemplate, Code2 } from "lucide-react";
import { toSlug } from "../utils/slug";

const CardProject = ({ Img, Title, Description, Link: ProjectLink, id }) => {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);

  const handleLiveDemo = (e) => {
    if (!ProjectLink) {
      e.preventDefault();
      alert("Live demo link is not available");
    }
  };

  const handleCardClick = () => {
    if (id) {
      navigate(`/project/${toSlug(Title)}`);
    }
  };

  return (
    <div 
      onClick={handleCardClick}
      className="group/card relative w-full h-full flex flex-col cursor-pointer select-none pt-3 pb-3"
    >
      {/* Background & Border with interactive hover */}
      <div className="relative w-full h-full overflow-hidden rounded-2xl bg-[#0F1629] border border-white/10 group-hover/card:border-[#00ff88]/60 shadow-lg transition-all duration-300 ease-out flex flex-col group-hover/card:-translate-y-2 group-hover/card:shadow-[0_12px_35px_rgba(0,255,136,0.2)]">
        
        {/* Image Section */}
        <div className="relative w-full aspect-[16/9] overflow-hidden bg-[#0A0F1C] flex items-center justify-center">
          {Img && !imgError ? (
            <img
              src={Img}
              alt={Title}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover transform group-hover/card:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="relative w-full h-full flex flex-col items-center justify-center p-3 bg-gradient-to-br from-[#0e172e] via-[#0A0F1C] to-[#0d2024]">
              <div className="absolute inset-0 bg-[radial-gradient(#00ff88_1px,transparent_1px)] [background-size:12px_12px] opacity-10" />
              <div className="relative p-2.5 rounded-xl bg-white/[0.04] border border-white/10 group-hover/card:border-[#00ff88]/50 group-hover/card:scale-110 transition-all duration-300 mb-1.5 shadow-sm">
                <Code2 className="w-5 h-5 text-[#00ff88]" />
              </div>
              <span className="relative text-[10px] font-mono tracking-wider text-slate-400 uppercase font-semibold group-hover/card:text-white transition-colors">
                Project Showcase
              </span>
            </div>
          )}
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F1629] via-transparent to-transparent opacity-80 pointer-events-none"></div>
        </div>

        {/* Content Section */}
        <div className="relative p-4 flex flex-col flex-grow z-10">
          <h3 className="text-base font-bold text-white group-hover/card:text-[#00ff88] transition-colors duration-300 line-clamp-1 mb-1.5">
            {Title}
          </h3>
          
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed line-clamp-2 flex-grow mb-3">
            {Description}
          </p>

          {/* Action Buttons */}
          <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/5">
            {ProjectLink ? (
              <a
                href={ProjectLink.startsWith("http") ? ProjectLink : `https://${ProjectLink}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering card click
                }}
                className="flex items-center space-x-1.5 text-xs font-semibold text-[#00ff88] hover:text-white hover:underline transition-colors duration-200"
                title={`Kunjungi ${ProjectLink}`}
              >
                <span className="truncate max-w-[130px]">
                  {ProjectLink.replace(/^https?:\/\//i, "").replace(/\/$/, "") || "Live Demo"}
                </span>
                <ExternalLink className="w-3.5 h-3.5 shrink-0" />
              </a>
            ) : (
              <span className="text-slate-500 text-xs font-medium flex items-center space-x-1">
                <span>No Demo</span>
              </span>
            )}

            {id ? (
              <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-white/5 group-hover/card:bg-[#00ff88]/15 text-white transition-colors duration-300">
                <span className="text-xs font-medium">Details</span>
                <ArrowRight className="w-3.5 h-3.5 transform group-hover/card:translate-x-1 transition-transform duration-300" />
              </div>
            ) : (
              <span className="text-slate-600 text-xs">
                N/A
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardProject;
