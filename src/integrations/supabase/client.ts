// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://jwrdquqenkjusgftlmrr.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3cmRxdXFlbmtqdXNnZnRsbXJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzNzk3MzQsImV4cCI6MjA1OTk1NTczNH0.GyVyOuf4icahKzWnYfAbjZqjNeCxGOJ-guKJnEulu9s";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);