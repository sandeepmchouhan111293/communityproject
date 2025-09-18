import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://mpolcdduwkzxoiesxnsc.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1wb2xjZGR1d2t6eG9pZXN4bnNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwMjcwMjYsImV4cCI6MjA3MzYwMzAyNn0.xoRqgtPM_3zxNz8vAJ7iPE3xh8FREO1F8ToJ3hUZYb8";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
