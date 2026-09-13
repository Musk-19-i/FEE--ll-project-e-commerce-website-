/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F7F4EC",
        ink: "#17171B",
        subink: "#55554F",
        line: "#E4DECF",
        marigold: {
          DEFAULT: "#D98A00",
          dark: "#B36F00",
          light: "#FCEBC7",
        },
        teal: {
          DEFAULT: "#146B5C",
          light: "#E1EFEA",
        },
        sale: "#C23B22",
      },
      fontFamily: {
        display: ["\"Fraunces\"", "serif"],
        sans: ["\"Public Sans\"", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(23,23,27,0.06), 0 1px 0 rgba(23,23,27,0.04)",
      },
    },
  },
  plugins: [],
}

