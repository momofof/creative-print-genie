// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://zzcgtdjsmjpfppglcgsm.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6Y2d0ZGpzbWpwZnBwZ2xjZ3NtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA0NTY0MzEsImV4cCI6MjA1NjAzMjQzMX0.gUckXdiGPPUsSYqAketB8pdo1AcBMn8o4yrEA9cQiss";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);