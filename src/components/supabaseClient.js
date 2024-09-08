import { createClient } from '@supabase/supabase-js';


const SUPABASE_URL = 'https://ltyvdnoecixlnqejzcgk.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0eXZkbm9lY2l4bG5xZWp6Y2drIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU3NTA2NDMsImV4cCI6MjA0MTMyNjY0M30.2i2Z4MqOFMg6L9_tBvQ32Mrng1990eq9tApxK1WBM78';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
