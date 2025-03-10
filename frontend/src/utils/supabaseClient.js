import { createClient } from "@supabase/supabase-js";
// require("dotenv").config();
import { configDotenv } from "dotenv";

// const SUPABASE_URL = "https://vakmfwtcbdeaigysjgch.supabase.co";
// const SUPABASE_ANON_KEY =
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZha21md3RjYmRlYWlneXNqZ2NoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc3MTU5MDQsImV4cCI6MjA1MzI5MTkwNH0.K0l8-rDbSauwnTrjZj3n82W3-vKwUcxx5dYyIFMGLpc";
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_KEY;
// console.log("Supabase URL:", SUPABASE_URL);
// console.log("Supabase Key:", SUPABASE_ANON_KEY);
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error("supabaseUrl or supabaseAnonKey is not defined");
}
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
