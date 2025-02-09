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
        "primary":"black",
        "secondary":"white",
        "primary-hover":"#48484a",
        "nav-content":"#787777",
      },
      fontSize:{
        "login-heading":"2.2rem",        
        "nav-heading":"1.4rem",
        "section-heading":"2rem",
        "sub-heading":"1.5rem",
        "content":"0.9rem",
        "form-error":"0.8rem"
      },fontWeight:{
        "heading":"bold",
        "button-text":"semibold",
        "sub-heading":"semibold"
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
