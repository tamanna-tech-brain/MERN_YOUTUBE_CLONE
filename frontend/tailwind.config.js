export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        yt: {
          black: "#0f0f0f",
          dark: "#181818",
          card: "#212121",
          hover: "#272727",
          border: "#303030",
          borderLight: "#3f3f3f",
          red: "#ff0000",
          redHover: "#cc0000",
          blue: "#3ea6ff",
          text: "#f1f1f1",
          gray: "#aaaaaa",
          muted: "#717171",
        }
      },
      fontFamily: {
        sans: ["Roboto", "Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
      }
    },
  },
  plugins: [],
};