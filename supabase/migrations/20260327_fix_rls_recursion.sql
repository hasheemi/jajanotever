-- Fix RLS recursion in users_v2 by using a security definer function
CREATE OR REPLACE FUNCTION get_my_paguyuban()
RETURNS TEXT AS $$
  SELECT paguyuban FROM public.users_v2 WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Drop the problematic policy
DROP POLICY IF EXISTS "Users can view profiles in their paguyuban" ON public.users_v2;

-- Re-create the policy using the function
CREATE POLICY "Users can view profiles in their paguyuban" 
ON public.users_v2 FOR SELECT 
USING (
    id = auth.uid() OR 
    (paguyuban IS NOT NULL AND paguyuban = get_my_paguyuban())
);

-- Ensure authenticated users can always see their own row even if recursion occurs elsewhere
CREATE POLICY "Users can always view their own profile" 
ON public.users_v2 FOR SELECT 
USING (auth.uid() = id);
