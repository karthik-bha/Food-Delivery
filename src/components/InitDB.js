"use client";  

import { useEffect } from "react";

const InitDB = () => {
  useEffect(() => {
    if (typeof window === "undefined") return; // Prevents running on the server

    fetch("/api/init-db", { method: "POST" })
      .then((res) => res.json())
      .then((data) => console.log("Init DB response:", data))
      .catch((err) => console.error("Init DB error:", err));
  }, []);

  return null; 
};

export default InitDB;
