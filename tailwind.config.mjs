/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors:{
        "button-bg":"#202842",
        "button-hover-bg":"#2d385d",
        "home-bg":"#f1f3f9",
        // "heading":"#2d385d",
        "heading":"#202842",
      },
      fontSize:{
        "login-heading":"2.2rem",        
        "nav-heading":"1.4rem",
        "section-heading":"2rem",
        "content":"1rem",
        "form-error":"0.8rem"
      },fontWeight:{
        "heading":"bold",
        "button-text":"bold"
      },
      keyframes: {
        "side-ani": {
          "0%": {
            opacity: 0,
            transform: "translateX(-10%)",
          },
       
          "100%": {
            opacity:1,
            transform: "translateX(0%)",
          },
        },
      },
      animation: {
        "sidebar": "side-ani 0.4s ease-in-out",
      },
    },
  },
  plugins: [],
};
