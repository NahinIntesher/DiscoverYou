/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/Login.jsx","./src/**/Registration.jsx"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
      backgroundImage: {
        "custom-gradient":
          "linear-gradient(to right,  #ffa952, #ef5a5a)",
        "custom-gradient2":
          "linear-gradient(to right,  #f8f9d9, #f8f9d9)",
      },
    },
  },
  plugins: [],
};
