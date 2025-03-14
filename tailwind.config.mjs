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
        // "primary":"black",
        // "primary":"#CF240A",
        "primary":"#FEC208",
        "secondary":"white",
        "primary-hover":"#48484a",
        // "primary-hover":"#E5AE07",
        "nav-content":"#1A1A2E",
        // "nav-content":"#787777",
        // "nav-content":"#FEC200",
        "table-heading":"white"
      },
      boxShadow:{
        "default-shadow":"0px 0px 15px 10px rgba(0, 0, 0, 0.1)"
    
      },
      fontSize:{
        "login-heading":"2.2rem",        
        "nav-heading":"1.4rem",
        "section-heading":"2rem",
        "sub-heading":"1.5rem",
        "content":"0.9rem",
        "form-error":"0.8rem"
      },
      fontWeight:{
        "heading":900,
        "table-heading":600,
        "button-text":600,
        "sub-heading":600
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
