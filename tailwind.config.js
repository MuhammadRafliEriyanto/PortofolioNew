/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				background: "#0b0f19",
				primary: "#00ff88",
				accent: "#1e3a8a",
				secondary: "#0f172a",
				text: "#ffffff",
				muted: "#94a3b8",
			},
			boxShadow: {
				"soft-glow": "0 0 28px rgba(0,255,136,0.25), 0 0 70px rgba(30,58,138,0.18)",
				"card-glass": "0 18px 45px rgba(15,23,42,0.7), 0 0 0 1px rgba(148,163,184,0.08)",
			},
			spacing: {
				page: "5%",
				"page-lg": "10%",
			},
			backdropBlur: {
				sm: '4px',
			  },
			
			
		  },
		},
	plugins: [],
}
