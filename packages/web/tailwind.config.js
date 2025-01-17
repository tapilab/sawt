module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#16054D", // Dark blue
        secondary: "#61B0E0", // Sky blue
        blue: "#D6FFFD", // Light blue
        purple: "#726CDA",
      },
      fontFamily: {
        body: ["Roboto", "sans-serif"],
      },
      fontSize: {
        body: "16px",
        heading: "32px",
      },
      lineHeight: {
        body: "24px",
        heading: "40px",
      },
      fontWeight: {
        body: 400,
        heading: 700,
      },
      screens: {
        xxl: "1600px",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "broken-camera": "url('/photos/camera-wide.jpg')",
      },
      width: {
        // added custom width
        42: "10 rem",
      },
      height: {
        // added custom height
        42: "10 rem",
      },
    },
  },
  darkMode: "class", // or 'media'
  plugins: [
    require("@tailwindcss/forms"),
    // Other plugins can be added here
  ],
};
