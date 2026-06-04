/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core NexFuel Brand Palette
        brand: {
          primary: "#a30012",
          "primary-container": "#d0021b",
          dark: "#1a1a1a",
          light: "#fbf9f8",
        },
        // Surface Tonal Layering
        surface: {
          lowest: "#ffffff",
          low: "#f5f3f3",
          DEFAULT: "#efeded",
          high: "#e9e8e7",
          highest: "#e4e2e2",
        },
        text: {
          primary: "#1b1c1c",
          secondary: "#5d3f3c",
          muted: "#5f5e5e",
        },
        borders: {
          outline: "#926e6b",
          variant: "#e7bdb8",
        },
        // Semantic states
        emergency: "#EF4444",
        success: "#10B981",
        warning: "#F59E0B",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      borderRadius: {
        card: "20px",
        input: "16px",
        btn: "14px",
        modal: "24px",
      },
      spacing: {
        unit: "8px",
        gutter: "24px",
      },
      boxShadow: {
        industrial: "0px 10px 30px rgba(0, 0, 0, 0.08)",
        floating: "0px 20px 60px rgba(0, 0, 0, 0.12)",
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': {
            transform: 'scale(1)',
            boxShadow: '0 0 0 0 rgba(239, 68, 68, 0.7)',
          },
          '50%': {
            transform: 'scale(1.05)',
            boxShadow: '0 0 0 10px rgba(239, 68, 68, 0)',
          },
        },
      },
    },
  },
  plugins: [],
}
