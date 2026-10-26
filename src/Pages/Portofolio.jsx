/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useCallback, useRef } from "react";

import { supabase } from "../supabase";

import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views";
import { useTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CardProject from "../components/CardProject";
import TechStackIcon from "../components/TechStackIcon";
import AOS from "aos";
import "aos/dist/aos.css";
import Certificate from "../components/Certificate";
import { Code, Award, Boxes, ChevronLeft, ChevronRight, Briefcase, Calendar, Building2, MapPin } from "lucide-react";
import { motion } from "framer-motion";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import { EffectCoverflow, Autoplay } from "swiper/modules";

const ToggleButton = ({ onClick, isShowingMore }) => (
  <button
    onClick={onClick}
    className="
      px-5 py-2.5
      text-slate-300 
      hover:text-white 
      text-sm 
      font-medium 
      transition-all 
      duration-300 
      ease-in-out
      flex 
      items-center 
      gap-2.5
      bg-white/5 
      hover:bg-primary/10
      rounded-xl
      border 
      border-white/10
      hover:border-primary/40
      hover:shadow-[0_0_20px_rgba(0,255,136,0.2)]
      backdrop-blur-md
      group
      relative
      overflow-hidden
    "
  >
    <span className="relative z-10 flex items-center gap-2">
      {isShowingMore ? "See Less" : "See More"}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`
          text-primary transition-transform 
          duration-300 
          ${isShowingMore ? "group-hover:-translate-y-0.5" : "group-hover:translate-y-0.5"}
        `}
      >
        <polyline
          points={isShowingMore ? "18 15 12 9 6 15" : "6 9 12 15 18 9"}
        ></polyline>
      </svg>
    </span>
    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
  </button>
);

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: { xs: 1, sm: 3 } }}>
          <Typography component="div">{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

// techStacks tetap sama
const techStacks = [
  { icon: "html.svg", language: "HTML" },
  { icon: "css.svg", language: "CSS" },
  { icon: "javascript.svg", language: "JavaScript" },
  { icon: "tailwind.svg", language: "Tailwind CSS" },
  { icon: "reactjs.svg", language: "ReactJS" },
  { icon: "vite.svg", language: "Vite" },
  { icon: "nodejs.svg", language: "Node JS" },
  { icon: "bootstrap.svg", language: "Bootstrap" },
  { icon: "firebase.svg", language: "Firebase" },
  { icon: "MUI.svg", language: "Material UI" },
  { icon: "vercel.svg", language: "Vercel" },
  { icon: "SweetAlert.svg", language: "SweetAlert2" },
  { icon: "flutter.svg", language: "Flutter" },

  // 🔥 Backend & Tools
  { icon: "mysql.svg", language: "MySQL" },
  { icon: "python.svg", language: "Python" },
  { icon: "node.svg", language: "Node JS" },
  { icon: "postman.svg", language: "Postman" },
  { icon: "go.svg", language: "Golang" },
  { icon: "laravel.svg", language: "Laravel" },
  { icon: "php.svg", language: "PHP" },
  { icon: "github.svg", language: "GitHub" },
  { icon: "docker.svg", language: "Docker" },
  { icon: "django.svg", language: "Django" },
  { icon: "vue.svg", language: "Vue" },
];

export default function FullWidthTabs() {
  const theme = useTheme();
  const [value, setValue] = useState(0);
  const swiperRef = useRef(null);
  const [projects, setProjects] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [showAllCertificates, setShowAllCertificates] = useState(false);
  const isMobile = window.innerWidth < 768;
  const initialItems = isMobile ? 4 : 6;

  useEffect(() => {
    AOS.init({
      once: false,
    });
  }, []);

  const getProjectFallbackImg = (title) => {
    const t = (title || "").toLowerCase();
    if (t.includes("eyehealth")) return "/eyehealth_banner.jpg?v=2";
    if (t.includes("hiitify")) return "/hiitify_banner.jpg?v=2";
    if (t.includes("chipset")) return "/spk_chipset_banner.jpg?v=2";
    if (t.includes("bimbel")) return "/smart_bimbel_banner.jpg?v=2";
    return "";
  };

  const fetchData = useCallback(async () => {
    try {
      const [projectsResponse, certificatesResponse] = await Promise.all([
        supabase.from("projects").select("*").order("id", { ascending: false }),
        supabase
          .from("certificates")
          .select("*")
          .order("id", { ascending: false }),
      ]);

      if (projectsResponse.error) throw projectsResponse.error;
      if (certificatesResponse.error) throw certificatesResponse.error;

      const projectData = (projectsResponse.data || []).map((item) => {
        const title = item.Title || item.title || "";
        const fallback = getProjectFallbackImg(title);
        let link = item.Link || item.link;
        if (!link && title.toLowerCase().includes("bimbel")) {
          link = "https://binacendikia.web.id";
        }
        return {
          id: item.id,
          Title: title,
          Description: item.Description || item.description,
          Img: (item.Img && item.Img.startsWith("http")) ? item.Img : (fallback || item.Img || item.img),
          Link: link,
          Github: item.Github || item.github,
          Features: item.Features || item.features || [],
          TechStack: item.TechStack || item.tech_stack || [],
        };
      });

      // 🔥 FIX DI SINI
      const certificateData = (certificatesResponse.data || []).map((item) => ({
        id: item.id,
        Img: item.Img || item.img,
      }));

      setProjects(projectData);
      setCertificates(certificateData);

      localStorage.setItem("projects", JSON.stringify(projectData));
      localStorage.setItem("certificates", JSON.stringify(certificateData));
    } catch (error) {
      console.error("Error fetching data from Supabase:", error.message);
    }
  }, []);

  useEffect(() => {
    // Coba ambil dari localStorage dulu untuk load lebih cepat
    const cachedProjects = localStorage.getItem("projects");
    const cachedCertificates = localStorage.getItem("certificates");

    if (cachedProjects && cachedCertificates) {
      try {
        const parsed = JSON.parse(cachedProjects).map((item) => {
          const fallback = getProjectFallbackImg(item.Title);
          let link = item.Link || item.link;
          if (!link && (item.Title || "").toLowerCase().includes("bimbel")) {
            link = "https://binacendikia.web.id";
          }
          return {
            ...item,
            Link: link,
            Img: (item.Img && item.Img.startsWith("http")) ? item.Img : (fallback || item.Img),
          };
        });
        setProjects(parsed);
        setCertificates(JSON.parse(cachedCertificates));
      } catch (e) {
        console.error("Error parsing cache:", e);
      }
    }

    fetchData(); // Tetap panggil fetchData untuk sinkronisasi data terbaru
  }, [fetchData]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const toggleShowMore = useCallback((type) => {
    if (type === "projects") {
      setShowAllProjects((prev) => !prev);
    } else {
      setShowAllCertificates((prev) => !prev);
    }
  }, []);

  const displayedProjects = showAllProjects
    ? projects
    : projects.slice(0, initialItems);
  const displayedCertificates = showAllCertificates
    ? certificates
    : certificates.slice(0, initialItems);

  // Sisa dari komponen (return statement) tidak ada perubahan
  return (
    <div
      className="md:px-[10%] px-[5%] w-full sm:mt-0 mt-[3rem] bg-[#0b0f19] overflow-hidden"
      id="Portofolio"
    >
      {/* Header section - unchanged */}
      <div
        className="text-center pb-10"
        data-aos="fade-up"
        data-aos-duration="1000"
      >
        <h2 className="inline-block text-3xl md:text-5xl font-bold text-center mx-auto text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
          <span
            style={{
              color: "#00ff88",
              backgroundImage:
                "linear-gradient(45deg, #00ff88 10%, #1e3a8a 93%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Portfolio Showcase
          </span>
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base mt-2">
          Explore my journey through projects, certifications, and technical
          expertise. Each section represents a milestone in my continuous
          learning path.
        </p>
      </div>

      <Box sx={{ width: "100%" }}>
        {/* AppBar and Tabs section - Styled with Neon Green and Deep Blue theme */}
        <AppBar
          position="static"
          elevation={0}
          sx={{
            bgcolor: "transparent",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "20px",
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                "linear-gradient(180deg, rgba(0, 255, 136, 0.03) 0%, rgba(30, 58, 138, 0.05) 100%)",
              backdropFilter: "blur(10px)",
              zIndex: 0,
            },
          }}
          className="md:px-4"
        >
          <Tabs
            value={value}
            onChange={handleChange}
            textColor="inherit"
            indicatorColor="primary"
            variant="fullWidth"
            sx={{
              minHeight: "70px",
              "& .MuiTab-root": {
                fontSize: { xs: "0.9rem", md: "1rem" },
                fontWeight: "600",
                color: "#94a3b8",
                textTransform: "none",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                padding: "20px 0",
                zIndex: 1,
                margin: "8px",
                borderRadius: "14px",
                border: "1px solid transparent",
                "&:hover": {
                  color: "#ffffff",
                  backgroundColor: "rgba(0, 255, 136, 0.06)",
                  borderColor: "rgba(0, 255, 136, 0.15)",
                  transform: "translateY(-2px)",
                  "& .lucide": {
                    color: "#00ff88",
                    transform: "scale(1.1) rotate(5deg)",
                  },
                },
                "&.Mui-selected": {
                  color: "#ffffff",
                  background:
                    "linear-gradient(135deg, rgba(0, 255, 136, 0.16) 0%, rgba(30, 58, 138, 0.3) 100%)",
                  borderColor: "rgba(0, 255, 136, 0.35)",
                  boxShadow: "0 4px 20px -2px rgba(0, 255, 136, 0.25), inset 0 1px 1px rgba(255, 255, 255, 0.1)",
                  "& .lucide": {
                    color: "#00ff88",
                    filter: "drop-shadow(0 0 6px rgba(0, 255, 136, 0.6))",
                  },
                },
              },
              "& .MuiTabs-indicator": {
                height: 0,
              },
              "& .MuiTabs-flexContainer": {
                gap: "8px",
              },
            }}
          >
            <Tab
              icon={
                <Code className="mb-2 w-5 h-5 transition-all duration-300" />
              }
              label="Projects"
              {...a11yProps(0)}
            />
            <Tab
              icon={
                <Briefcase className="mb-2 w-5 h-5 transition-all duration-300" />
              }
              label="Experience"
              {...a11yProps(1)}
            />
            <Tab
              icon={
                <Award className="mb-2 w-5 h-5 transition-all duration-300" />
              }
              label="Certificates"
              {...a11yProps(2)}
            />
            <Tab
              icon={
                <Boxes className="mb-2 w-5 h-5 transition-all duration-300" />
              }
              label="Tech Stack"
              {...a11yProps(3)}
            />
          </Tabs>
        </AppBar>

        <SwipeableViews
          axis={theme.direction === "rtl" ? "x-reverse" : "x"}
          index={value}
          onChangeIndex={setValue}
          slideStyle={{ overflowY: "visible" }}
        >
          <TabPanel value={value} index={0} dir={theme.direction}>
            <motion.div 
              key={`projects-panel-${value}`}
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="container mx-auto flex flex-col justify-center pb-6"
            >
              {/* Slider Wrapper with hover-triggered side navigation arrows in the gutter */}
              <div className="relative group/slider w-full px-2 sm:px-6 md:px-10">
                {/* Left Floating Arrow Button - Positioned in the outer gutter */}
                <button
                  onClick={() => swiperRef.current?.slidePrev()}
                  aria-label="Previous Project"
                  className="absolute left-0 sm:left-1 md:left-2 top-1/2 -translate-y-1/2 z-30 w-11 h-11 md:w-12 md:h-12 rounded-full bg-[#0b0f19]/90 backdrop-blur-md border border-white/20 hover:border-[#00ff88] hover:bg-[#00ff88]/20 text-white flex items-center justify-center shadow-[0_4px_25px_rgba(0,0,0,0.8)] opacity-0 group-hover/slider:opacity-100 scale-90 group-hover/slider:scale-100 hover:!scale-110 transition-all duration-300 pointer-events-none group-hover/slider:pointer-events-auto cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-slate-300 group-hover/slider:text-[#00ff88]" />
                </button>

                {/* Right Floating Arrow Button - Positioned in the outer gutter */}
                <button
                  onClick={() => swiperRef.current?.slideNext()}
                  aria-label="Next Project"
                  className="absolute right-0 sm:right-1 md:right-2 top-1/2 -translate-y-1/2 z-30 w-11 h-11 md:w-12 md:h-12 rounded-full bg-[#0b0f19]/90 backdrop-blur-md border border-white/20 hover:border-[#00ff88] hover:bg-[#00ff88]/20 text-white flex items-center justify-center shadow-[0_4px_25px_rgba(0,0,0,0.8)] opacity-0 group-hover/slider:opacity-100 scale-90 group-hover/slider:scale-100 hover:!scale-110 transition-all duration-300 pointer-events-none group-hover/slider:pointer-events-auto cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-slate-300 group-hover/slider:text-[#00ff88]" />
                </button>

                <Swiper
                  onBeforeInit={(swiper) => {
                    swiperRef.current = swiper;
                  }}
                  grabCursor={true}
                  centeredSlides={false}
                  slidesPerView={"auto"}
                  spaceBetween={24}
                  autoplay={{
                    delay: 3500,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                  }}
                  modules={[Autoplay]}
                  className="w-full !overflow-y-visible pt-6 pb-8"
                >
                  {projects.map((project, index) => (
                    <SwiperSlide 
                      key={project.id || index} 
                      className="!w-[240px] sm:!w-[280px] md:!w-[310px] lg:!w-[330px] transition-transform duration-300 pt-3 pb-3 !overflow-visible"
                    >
                      <motion.div
                        initial={{ opacity: 0, x: -60, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        transition={{ 
                          duration: 0.5, 
                          delay: 0.08 + (index % 6) * 0.08, 
                          ease: [0.22, 1, 0.36, 1] 
                        }}
                        className="h-full"
                      >
                        <CardProject
                          Img={project.Img}
                          Title={project.Title}
                          Description={project.Description}
                          Link={project.Link}
                          id={project.id}
                        />
                      </motion.div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </motion.div>
          </TabPanel>

          {/* Tab 1: Experience */}
          <TabPanel value={value} index={1} dir={theme.direction}>
            <motion.div
              key={`experience-panel-${value}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="container mx-auto max-w-4xl px-2 sm:px-6 py-4 pb-8"
            >
              <div className="relative">
                {/* Glowing Spine Timeline Line */}
                <div className="absolute left-4 sm:left-8 top-8 bottom-8 w-0.5 bg-gradient-to-b from-blue-500 via-primary to-accent hidden sm:block opacity-60" />

                <div className="space-y-8">
                  {/* Experience 1: Waiters & Kasir (2024 - 2025) */}
                  <div className="relative flex flex-col sm:flex-row items-start gap-4 sm:gap-8 group">
                    {/* Node on Timeline */}
                    <div className="hidden sm:flex w-16 h-16 rounded-2xl bg-[#0b0f19] border border-white/10 group-hover:border-blue-500/50 items-center justify-center relative z-10 transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.6)] group-hover:shadow-[0_0_25px_rgba(59,130,246,0.25)] flex-shrink-0">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform duration-300">
                        <Briefcase className="w-5 h-5" />
                      </div>
                    </div>

                    {/* Card */}
                    <div className="w-full bg-black/30 backdrop-blur-lg rounded-2xl p-6 sm:p-7 border border-white/10 group-hover:border-blue-500/40 transition-all duration-300 hover:shadow-[0_0_35px_rgba(59,130,246,0.15)] relative overflow-hidden">
                      <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/5 via-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                      <div className="relative z-10">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                          <span className="text-xs px-3 py-1 rounded-full font-medium border bg-blue-500/10 text-blue-400 border-blue-500/20">
                            Work Experience
                          </span>
                          <span className="text-xs sm:text-sm text-slate-400 flex items-center gap-1.5 font-medium">
                            <Calendar className="w-3.5 h-3.5 text-blue-400" />
                            September 2024 – Juni 2025
                          </span>
                        </div>

                        <div className="mb-3">
                          <h4 className="text-lg sm:text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                            Waiters & Kasir
                          </h4>
                          <div className="flex items-center gap-1.5 text-slate-300 text-sm mt-1">
                            <Building2 className="w-4 h-4 text-blue-400/80" />
                            <span className="font-medium text-slate-200">Njajajan Co</span>
                            <span className="text-slate-500">•</span>
                            <span className="text-slate-400 flex items-center gap-1 text-xs">
                              <MapPin className="w-3 h-3 text-slate-500" />
                              Tegal
                            </span>
                          </div>
                        </div>

                        <ul className="space-y-2 mb-5 text-slate-300/80 text-xs sm:text-sm leading-relaxed">
                          <li className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 flex-shrink-0" />
                            <span>Melayani 30–75 transaksi per shift (tunai & non-tunai) menggunakan sistem kasir secara akurat.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 flex-shrink-0" />
                            <span>Menjaga standar kualitas penyajian, kebersihan area operasional, serta pencatatan stok bahan.</span>
                          </li>
                        </ul>

                        <div className="flex flex-wrap gap-1.5 pt-3 border-t border-white/5">
                          {["Customer Service", "POS Cashier", "Cash Handling", "Inventory Control"].map((skill) => (
                            <span
                              key={skill}
                              className="text-[0.7rem] sm:text-xs px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5 transition-colors"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Experience 2: Backend Developer Intern (2025) */}
                  <div className="relative flex flex-col sm:flex-row items-start gap-4 sm:gap-8 group">
                    {/* Node on Timeline */}
                    <div className="hidden sm:flex w-16 h-16 rounded-2xl bg-[#0b0f19] border border-white/10 group-hover:border-primary/50 items-center justify-center relative z-10 transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.6)] group-hover:shadow-[0_0_25px_rgba(0,255,136,0.25)] flex-shrink-0">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
                        <Code className="w-5 h-5" />
                      </div>
                    </div>

                    {/* Card */}
                    <div className="w-full bg-black/30 backdrop-blur-lg rounded-2xl p-6 sm:p-7 border border-white/10 group-hover:border-primary/40 transition-all duration-300 hover:shadow-[0_0_35px_rgba(0,255,136,0.15)] relative overflow-hidden">
                      <div className="absolute -inset-1 bg-gradient-to-r from-primary/5 via-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                      <div className="relative z-10">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                          <span className="text-xs px-3 py-1 rounded-full font-medium border bg-primary/10 text-primary border-primary/20">
                            Internship
                          </span>
                          <span className="text-xs sm:text-sm text-slate-400 flex items-center gap-1.5 font-medium">
                            <Calendar className="w-3.5 h-3.5 text-primary" />
                            Juni – November 2025
                          </span>
                        </div>

                        <div className="mb-3">
                          <h4 className="text-lg sm:text-xl font-bold text-white group-hover:text-primary transition-colors">
                            Backend Developer Intern
                          </h4>
                          <div className="flex items-center gap-1.5 text-slate-300 text-sm mt-1">
                            <Building2 className="w-4 h-4 text-accent" />
                            <span className="font-medium text-slate-200">PT GIT Solution</span>
                            <span className="text-slate-500">•</span>
                            <span className="text-slate-400 flex items-center gap-1 text-xs">
                              <MapPin className="w-3 h-3 text-slate-500" />
                              Yogyakarta
                            </span>
                          </div>
                        </div>

                        <ul className="space-y-2 mb-5 text-slate-300/80 text-xs sm:text-sm leading-relaxed">
                          <li className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                            <span>Mengembangkan REST API, mengelola database (CRUD), dan integrasi backend-frontend.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                            <span>Berkolaborasi aktif dengan tim developer dalam pengembangan dan penyelesaian fitur aplikasi.</span>
                          </li>
                        </ul>

                        <div className="flex flex-wrap gap-1.5 pt-3 border-t border-white/5">
                          {["REST API", "Database CRUD", "Backend Integration", "Team Collaboration"].map((skill) => (
                            <span
                              key={skill}
                              className="text-[0.7rem] sm:text-xs px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5 transition-colors"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </TabPanel>

          <TabPanel value={value} index={2} dir={theme.direction}>
            <div className="container mx-auto flex justify-center items-center overflow-hidden">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:gap-8 gap-5 w-full">
                {displayedCertificates.map((certificate, index) => (
                  <div
                    key={certificate.id || index}
                    data-aos={
                      index % 3 === 0
                        ? "fade-up-right"
                        : index % 3 === 1
                          ? "fade-up"
                          : "fade-up-left"
                    }
                    data-aos-duration={
                      index % 3 === 0
                        ? "1000"
                        : index % 3 === 1
                          ? "1200"
                          : "1000"
                    }
                  >
                    <Certificate ImgSertif={certificate.Img} />
                  </div>
                ))}
              </div>
            </div>
            {certificates.length > initialItems && (
              <div className="mt-8 w-full flex justify-center items-center">
                <ToggleButton
                  onClick={() => toggleShowMore("certificates")}
                  isShowingMore={showAllCertificates}
                />
              </div>
            )}
          </TabPanel>

          <TabPanel value={value} index={3} dir={theme.direction}>
            <div className="container mx-auto flex justify-center items-center overflow-hidden pb-[5%]">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 lg:gap-8 gap-5">
                {techStacks.map((stack, index) => (
                  <div
                    key={index}
                    data-aos={
                      index % 3 === 0
                        ? "fade-up-right"
                        : index % 3 === 1
                          ? "fade-up"
                          : "fade-up-left"
                    }
                    data-aos-duration={
                      index % 3 === 0
                        ? "1000"
                        : index % 3 === 1
                          ? "1200"
                          : "1000"
                    }
                  >
                    <TechStackIcon
                      TechStackIcon={stack.icon}
                      Language={stack.language}
                    />
                  </div>
                ))}
              </div>
            </div>
          </TabPanel>
        </SwipeableViews>
      </Box>
    </div>
  );
}
