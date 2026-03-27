-- Create titip_v2 table
CREATE TABLE IF NOT EXISTS public.titip_v2 (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    maker_id UUID NOT NULL REFERENCES public.users_v2(id) ON DELETE CASCADE,
    seller_id UUID NOT NULL REFERENCES public.users_v2(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products_v2(id) ON DELETE CASCADE,
    product_name TEXT NOT NULL,
    product_price INTEGER NOT NULL,
    product_image TEXT,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reject', 'accept', 'noted')),
    group_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create notif_v2 table
CREATE TABLE IF NOT EXISTS public.notif_v2 (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users_v2(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    related_id UUID REFERENCES public.titip_v2(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.titip_v2 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notif_v2 ENABLE ROW LEVEL SECURITY;

-- Policies for titip_v2
CREATE POLICY "Makers can view their own titipan"
    ON public.titip_v2 FOR SELECT
    USING (auth.uid() = maker_id);

CREATE POLICY "Sellers can view titipan sent to them"
    ON public.titip_v2 FOR SELECT
    USING (auth.uid() = seller_id);

CREATE POLICY "Makers can insert titipan"
    ON public.titip_v2 FOR INSERT
    WITH CHECK (auth.uid() = maker_id);

-- Policies for notif_v2
CREATE POLICY "Users can view their own notifications"
    ON public.notif_v2 FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Makers can insert notifications for sellers"
    ON public.notif_v2 FOR INSERT
    WITH CHECK (true); -- Simplified, ideally check if maker is sending to seller

-- Update users_v2 policy to allow viewing others in the same paguyuban
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users_v2;
CREATE POLICY "Users can view profiles in their paguyuban" 
ON public.users_v2 FOR SELECT 
USING (
    auth.uid() = id OR 
    (SELECT paguyuban FROM public.users_v2 WHERE id = auth.uid()) = paguyuban
);

-- Indexes
CREATE INDEX IF NOT EXISTS titip_v2_maker_id_idx ON public.titip_v2 (maker_id);
CREATE INDEX IF NOT EXISTS titip_v2_seller_id_idx ON public.titip_v2 (seller_id);
CREATE INDEX IF NOT EXISTS titip_v2_group_id_idx ON public.titip_v2 (group_id);
CREATE INDEX IF NOT EXISTS notif_v2_user_id_idx ON public.notif_v2 (user_id);
