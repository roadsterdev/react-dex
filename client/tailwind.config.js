/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        black: '#181818',
        red: "#fe8375",
        green: "#13b195",
        lightGreen: "#f4f5f6",
        gray: "#9396b9",
        lightGray: '#e0e3eb'
      },
    },
  },
  plugins: [],
};
