-- Add address and is_jualan columns to users_v2
ALTER TABLE public.users_v2 ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE public.users_v2 ADD COLUMN IF NOT EXISTS is_jualan BOOLEAN DEFAULT true;
