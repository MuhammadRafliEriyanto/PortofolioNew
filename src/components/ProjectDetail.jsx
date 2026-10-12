/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ExternalLink,
  Github,
  Code2,
  Star,
  ChevronRight,
  Layers,
  Layout,
  Globe,
  Package,
  Cpu,
  Code,
  Sparkles,
  Server,
  Database,
  Lock,
  Terminal,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import { toSlug } from "../utils/slug";
import { supabase } from "../supabase";

const TECH_ICONS = {
  React: Globe,
  Tailwind: Layout,
  "Tailwind CSS": Layout,
  Express: Cpu,
  "Express.js": Cpu,
  Python: Code,
  Javascript: Code,
  HTML: Layout,
  CSS: Layout,
  Node: Server,
  "Node.js": Server,
  MongoDB: Database,
  MySQL: Database,
  PHP: Code,
  Laravel: Layers,
  Bootstrap: Layout,
  default: Package,
};

const parseList = (val) => {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  if (typeof val === "string") {
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      return val
        .split(/\r?\n|,/)
        .map((s) => s.trim())
        .filter(Boolean);
    }
  }
  return [];
};

const TechBadge = ({ tech }) => {
  const Icon = TECH_ICONS[tech] || TECH_ICONS["default"];
  return (
    <div className="group relative flex items-center gap-2 px-3 py-1.5 md:px-3.5 md:py-2 rounded-xl bg-white/[0.03] border border-white/10 hover:border-[#00ff88]/40 hover:bg-[#00ff88]/5 transition-all duration-300">
      <div className="p-1 rounded-md bg-white/5 text-[#00ff88] group-hover:scale-110 transition-transform">
        <Icon className="w-3.5 h-3.5" />
      </div>
      <span className="text-xs md:text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
        {tech}
      </span>
    </div>
  );
};

const handleGithubClick = (githubLink) => {
  if (githubLink === "Private" || !githubLink) {
    Swal.fire({
      icon: "info",
      title: "Source Code Private",
      text: "Maaf, repository source code untuk proyek ini bersifat privat.",
      confirmButtonText: "Mengerti",
      confirmButtonColor: "#00ff88",
      background: "#0b0f19",
      color: "#ffffff",
      customClass: {
        popup: "border border-white/10 rounded-2xl backdrop-blur-xl",
      },
    });
    return false;
  }
  return true;
};

const ProjectDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [imgError, setImgError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);

    const getProjectFallbackImg = (title) => {
      const t = (title || "").toLowerCase();
      if (t.includes("eyehealth")) return "/eyehealth_banner.jpg?v=2";
      if (t.includes("hiitify")) return "/hiitify_banner.jpg?v=2";
      if (t.includes("chipset")) return "/spk_chipset_banner.jpg?v=2";
      if (t.includes("bimbel")) return "/smart_bimbel_banner.jpg?v=2";
      return "";
    };

    const getProjectFallbackLink = (title) => {
      const t = (title || "").toLowerCase();
      if (t.includes("bimbel")) return "https://binacendikia.web.id";
      return "";
    };

    const loadProject = async () => {
      // 1. Coba cari di localStorage lebih dulu
      const storedProjects = JSON.parse(localStorage.getItem("projects")) || [];
      const found = storedProjects.find((p) => toSlug(p.Title || p.title) === slug);

      if (found) {
        const title = found.Title || found.title;
        const fallback = getProjectFallbackImg(title);
        setProject({
          ...found,
          Title: title,
          Description: found.Description || found.description,
          Img: (found.Img && found.Img.startsWith("http")) ? found.Img : (fallback || found.Img || found.img),
          Link: found.Link || found.link || getProjectFallbackLink(title),
          Github: found.Github || found.github || "https://github.com/MuhammadRafliEriyanto",
          Features: parseList(found.Features || found.features),
          TechStack: parseList(found.TechStack || found.techstack || found.tech_stack),
        });
        setLoading(false);
        return;
      }

      // 2. Fallback fetch langsung dari Supabase jika belum ada di localStorage
      try {
        const { data, error } = await supabase.from("projects").select("*");
        if (data && !error) {
          const match = data.find((p) => toSlug(p.Title || p.title) === slug);
          if (match) {
            const title = match.Title || match.title;
            setProject({
              ...match,
              Title: title,
              Description: match.Description || match.description,
              Img: match.Img || match.img || getProjectFallbackImg(title),
              Link: match.Link || match.link || getProjectFallbackLink(title),
              Github: match.Github || match.github || "https://github.com/MuhammadRafliEriyanto",
              Features: parseList(match.Features || match.features),
              TechStack: parseList(match.TechStack || match.techstack || match.tech_stack),
            });
          }
        }
      } catch (err) {
        console.error("Error fetching project fallback:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-3 border-[#00ff88]/20 border-t-[#00ff88] rounded-full animate-spin" />
          <p className="text-sm font-medium text-slate-400">Loading project details...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[#0b0f19] flex flex-col items-center justify-center px-4 text-center">
        <div className="p-4 rounded-full bg-white/5 border border-white/10 mb-4 text-[#00ff88]">
          <Terminal className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Project Tidak Ditemukan</h2>
        <p className="text-sm text-slate-400 max-w-md mb-6">
          Proyek yang Anda cari mungkin telah diperbarui atau alamat tautan tidak valid.
        </p>
        <button
          onClick={() => navigate("/#Portofolio")}
          className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-[#00ff88]/10 border border-white/10 hover:border-[#00ff88]/40 text-white text-sm font-medium transition-all"
        >
          Kembali ke Portfolio
        </button>
      </div>
    );
  }

  const projectUrl = `https://your-domain.com/project/${toSlug(project.Title)}`;
  const features = project.Features || [];
  const techStack = project.TechStack || [];

  return (
    <>
      <Helmet>
        <title>{project.Title} — Muhammad Rafli Eriyanto</title>
        <meta
          name="description"
          content={
            project.Description
              ? project.Description.slice(0, 155)
              : `Project ${project.Title} oleh Muhammad Rafli Eriyanto.`
          }
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={projectUrl} />
        <meta property="og:title" content={`${project.Title} — Muhammad Rafli Eriyanto`} />
        <meta property="og:description" content={project.Description?.slice(0, 155)} />
        <meta property="og:url" content={projectUrl} />
        <meta property="og:type" content="website" />
        {project.Img && <meta property="og:image" content={project.Img} />}
      </Helmet>

      <div className="min-h-screen bg-[#0b0f19] text-white relative overflow-hidden">
        {/* Subtle Ambient Background Gradients */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-10 left-1/4 w-[500px] h-[500px] bg-[#00ff88]/5 rounded-full blur-[140px]" />
          <div className="absolute top-1/3 right-10 w-[450px] h-[450px] bg-[#1e3a8a]/10 rounded-full blur-[140px]" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          {/* Top Bar Navigation */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-wrap items-center justify-between gap-4 pb-6 md:pb-8 border-b border-white/5"
          >
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate(-1)}
                className="group flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-[#00ff88]/10 border border-white/10 hover:border-[#00ff88]/40 text-slate-300 hover:text-white transition-all text-xs md:text-sm font-medium"
              >
                <ArrowLeft className="w-3.5 h-3.5 md:w-4 md:h-4 group-hover:-translate-x-1 transition-transform" />
                <span>Back</span>
              </button>

              <div className="flex items-center space-x-2 text-xs md:text-sm text-slate-400">
                <span className="hover:text-slate-200 cursor-pointer" onClick={() => navigate("/#Portofolio")}>
                  Projects
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                <span className="text-white font-medium truncate max-w-[200px] sm:max-w-none">
                  {project.Title}
                </span>
              </div>
            </div>

            {/* Quick Action Buttons (Top Right) */}
            <div className="flex items-center space-x-2.5">
              {project.Link && (
                <a
                  href={project.Link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#00ff88]/10 hover:bg-[#00ff88]/20 border border-[#00ff88]/30 hover:border-[#00ff88]/60 text-[#00ff88] text-xs md:text-sm font-medium transition-all"
                >
                  <span>Live Demo</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}

              {project.Github && (
                <a
                  href={project.Github}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => !handleGithubClick(project.Github) && e.preventDefault()}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-slate-300 hover:text-white text-xs md:text-sm font-medium transition-all"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>GitHub</span>
                </a>
              )}
            </div>
          </motion.div>

          {/* Hero Header: Title, Description & Metadata */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="pt-8 pb-10"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00ff88]/10 border border-[#00ff88]/20 text-[#00ff88] text-xs font-semibold mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Project Overview</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-[#00ff88] bg-clip-text text-transparent leading-tight">
              {project.Title}
            </h1>

            <p className="text-slate-300 text-sm sm:text-base md:text-lg leading-relaxed max-w-3xl mt-4 font-normal">
              {project.Description}
            </p>

            {/* Compact Metadata Badges */}
            <div className="flex flex-wrap items-center gap-3 mt-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/10 text-xs text-slate-300">
                <Code2 className="w-3.5 h-3.5 text-[#00ff88]" />
                <span>
                  <strong className="text-white">{techStack.length}</strong> Total Teknologi
                </span>
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/10 text-xs text-slate-300">
                <Layers className="w-3.5 h-3.5 text-blue-400" />
                <span>
                  <strong className="text-white">{features.length}</strong> Fitur Utama
                </span>
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/10 text-xs text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verified Architecture</span>
              </div>
            </div>
          </motion.div>

          {/* Main Bento Grid: 2 Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Visual Preview & Tech Stack (lg:col-span-6) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-6 space-y-6"
            >
              {/* Preview Window (Browser Mockup Frame) */}
              <div className="rounded-2xl overflow-hidden bg-[#0F1629] border border-white/10 shadow-xl transition-all duration-300 hover:border-[#00ff88]/30">
                {/* Browser Title Bar */}
                <div className="flex items-center justify-between px-4 py-2.5 bg-black/40 border-b border-white/5">
                  <div className="flex items-center space-x-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                  </div>
                  <div className="flex items-center space-x-1.5 px-3 py-0.5 rounded-md bg-white/5 text-[11px] text-slate-400 font-mono">
                    <Lock className="w-2.5 h-2.5 text-[#00ff88]" />
                    <span>{project.Link ? project.Link.replace(/^https?:\/\//i, "").replace(/\/$/, "") : `${toSlug(project.Title)}.preview`}</span>
                  </div>
                  <div className="w-8" />
                </div>

                {/* Window Body: Image or Fallback Mockup */}
                <div className="relative aspect-[16/10] bg-[#0A0F1C] flex items-center justify-center overflow-hidden">
                  {project.Img && !imgError ? (
                    <img
                      src={project.Img}
                      alt={project.Title}
                      onError={() => setImgError(true)}
                      className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="relative w-full h-full p-6 flex flex-col justify-between items-center text-center bg-gradient-to-b from-[#0F1629]/80 to-[#0A0F1C]">
                      <div className="absolute inset-0 bg-[radial-gradient(#00ff88_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />
                      
                      <div className="w-full flex justify-between items-center text-xs text-slate-500 font-mono">
                        <span>SYS.READY</span>
                        <span className="flex items-center gap-1.5 text-[#00ff88]">
                          <span className="w-2 h-2 rounded-full bg-[#00ff88] animate-ping" />
                          ONLINE
                        </span>
                      </div>

                      <div className="flex flex-col items-center my-auto space-y-3 z-10">
                        <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 shadow-[0_0_30px_rgba(0,255,136,0.1)]">
                          <Terminal className="w-8 h-8 text-[#00ff88]" />
                        </div>
                        <div>
                          <h4 className="text-base font-semibold text-white tracking-wide">
                            {project.Title}
                          </h4>
                          <p className="text-xs text-slate-400 mt-1">
                            Interactive System Architecture
                          </p>
                        </div>
                      </div>

                      <div className="w-full flex justify-center z-10">
                        <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] text-slate-400 font-medium">
                          Workspace Preview Mode
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Technologies Used Section */}
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm md:text-base font-semibold text-white flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-[#00ff88]" />
                    <span>Technologies & Frameworks</span>
                  </h3>
                  <span className="text-xs text-slate-500 font-mono">
                    {techStack.length} tools
                  </span>
                </div>

                {techStack.length > 0 ? (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {techStack.map((tech, index) => (
                      <TechBadge key={index} tech={tech} />
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">Tidak ada data teknologi.</p>
                )}
              </div>
            </motion.div>

            {/* Right Column: Key Features (lg:col-span-6) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="lg:col-span-6 space-y-4"
            >
              <div className="p-5 md:p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-5">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <div className="flex items-center space-x-2.5">
                    <div className="p-1.5 rounded-lg bg-amber-400/10 text-amber-400">
                      <Star className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">
                        Key Features & Capabilities
                      </h3>
                      <p className="text-xs text-slate-400">
                        Fitur utama dan peran teknis dalam sistem
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-white/5 text-[11px] font-mono text-[#00ff88]">
                    {features.length} Total
                  </span>
                </div>

                {features.length > 0 ? (
                  <div className="space-y-3">
                    {features.map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.35, delay: 0.1 + index * 0.05 }}
                        className="group relative p-3.5 md:p-4 rounded-xl bg-[#0F1629]/50 border border-white/5 hover:border-[#00ff88]/30 hover:bg-[#0F1629] transition-all duration-300 flex items-start gap-3.5 hover:-translate-y-0.5 shadow-sm"
                      >
                        {/* Number Badge */}
                        <div className="flex-shrink-0 w-6 h-6 rounded-md bg-[#00ff88]/10 border border-[#00ff88]/20 flex items-center justify-center text-[#00ff88] text-[11px] font-mono font-bold group-hover:scale-105 group-hover:bg-[#00ff88]/20 transition-all mt-0.5">
                          {String(index + 1).padStart(2, "0")}
                        </div>

                        {/* Feature Content */}
                        <div className="flex-grow">
                          <p className="text-xs sm:text-sm text-slate-300 group-hover:text-white leading-relaxed transition-colors">
                            {feature}
                          </p>
                        </div>

                        {/* Hover indicator icon */}
                        <CheckCircle2 className="w-4 h-4 text-[#00ff88] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-0.5" />
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 py-4 text-center">
                    Tidak ada fitur yang ditambahkan.
                  </p>
                )}
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectDetails;
