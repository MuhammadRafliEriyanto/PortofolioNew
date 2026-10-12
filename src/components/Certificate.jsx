// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { Modal, IconButton, Box, Backdrop } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FullscreenIcon from "@mui/icons-material/Fullscreen";

// eslint-disable-next-line react/prop-types
const Certificate = ({ ImgSertif }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getCleanTitle = (path) => {
    if (!path) return "Certificate";
    const filename = decodeURIComponent(path.split("/").pop().replace(/\.[^/.]+$/, ""));
    return filename
      .replace(/^Sertifikat_MUHAMMAD RAFLI ERIYANTO_/i, "")
      .replace(/^sertifikat\s+/i, "");
  };

  const title = getCleanTitle(ImgSertif);

  return (
    <div className="w-full">
      {/* Card Container identical to TechStack style & animation */}
      <div
        onClick={handleOpen}
        className="group relative p-2.5 sm:p-3 rounded-2xl bg-slate-800/50 hover:bg-slate-700/50 border border-white/10 hover:border-primary/40 transition-all duration-300 ease-in-out flex flex-col items-center justify-center hover:scale-105 cursor-pointer shadow-lg hover:shadow-2xl hover:shadow-primary/10 overflow-hidden w-full"
      >
        {/* Glow ambient gradient behind card on hover (identical to TechStack) */}
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/60 to-accent/50 rounded-2xl opacity-0 group-hover:opacity-40 blur transition duration-300 pointer-events-none" />

        {/* Thumbnail Image Wrapper */}
        <div className="relative w-full aspect-[16/11.5] rounded-xl overflow-hidden bg-slate-900/60 z-10">
          <img
            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105 group-hover:contrast-[1.05]"
            src={ImgSertif}
            alt={title}
            loading="lazy"
          />

          {/* Hover Overlay with View Certificate prompt */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-1.5 backdrop-blur-[2px]">
            <div className="p-2.5 rounded-full bg-primary/20 border border-primary/50 text-primary transform -translate-y-2 group-hover:translate-y-0 transition-transform duration-300 shadow-[0_0_15px_rgba(0,255,136,0.4)]">
              <FullscreenIcon sx={{ fontSize: 26 }} />
            </div>
            <span className="text-[11px] sm:text-xs font-semibold text-white tracking-wider uppercase">
              View Certificate
            </span>
          </div>
        </div>
      </div>

      {/* Fullscreen Preview Modal */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="certificate-modal-title"
        aria-describedby="certificate-modal-description"
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 300,
          sx: {
            backgroundColor: "rgba(0, 0, 0, 0.9)",
            backdropFilter: "blur(8px)",
          },
        }}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: 0,
          padding: 2,
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: "auto",
            maxWidth: "92vw",
            maxHeight: "92vh",
            m: 0,
            p: 0,
            outline: "none",
            borderRadius: 3,
            overflow: "hidden",
            boxShadow: "0 0 50px rgba(0, 255, 136, 0.2)",
            border: "1px solid rgba(0, 255, 136, 0.25)",
            bgcolor: "#0b0f19",
          }}
        >
          {/* Close Button */}
          <IconButton
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: 12,
              top: 12,
              color: "white",
              bgcolor: "rgba(0,0,0,0.7)",
              zIndex: 10,
              padding: 1,
              border: "1px solid rgba(255,255,255,0.2)",
              "&:hover": {
                bgcolor: "#00ff88",
                color: "#000",
                transform: "scale(1.1)",
              },
              transition: "all 0.2s ease",
            }}
            size="large"
          >
            <CloseIcon sx={{ fontSize: 22 }} />
          </IconButton>

          {/* Modal Image */}
          <img
            src={ImgSertif}
            alt={title}
            style={{
              display: "block",
              maxWidth: "100%",
              maxHeight: "90vh",
              margin: "0 auto",
              objectFit: "contain",
            }}
          />
        </Box>
      </Modal>
    </div>
  );
};

export default Certificate;

