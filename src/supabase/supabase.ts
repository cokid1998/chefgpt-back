import { createClient } from "@supabase/supabase-js";

// Todo: env파일 못불러오는 문제
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

export const BUCKET_NAME = "uploads";
export const supabase = createClient(
  "https://tqgpealdunegqnxqemvz.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxZ3BlYWxkdW5lZ3FueHFlbXZ6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODgyMTAyOSwiZXhwIjoyMDg0Mzk3MDI5fQ.iFVq4x-gk5mjQIUx8x76C4wQQ3p6nj9ea3DJ-9bsmIo",
);
