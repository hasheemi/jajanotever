-- Add is_active column to titip_v2
ALTER TABLE public.titip_v2 ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Create titip_transaksi_v2 table
CREATE TABLE IF NOT EXISTS public.titip_transaksi_v2 (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    titip_id UUID NOT NULL REFERENCES public.titip_v2(id) ON DELETE CASCADE,
    
    maker_id UUID NOT NULL REFERENCES public.users_v2(id) ON DELETE CASCADE,
    seller_id UUID NOT NULL REFERENCES public.users_v2(id) ON DELETE CASCADE,
    
    product_id UUID NOT NULL REFERENCES public.products_v2(id) ON DELETE CASCADE,
    product_name TEXT NOT NULL,
    product_price INTEGER NOT NULL,
    
    jumlah_awal INTEGER NOT NULL,
    jumlah_sisa INTEGER NOT NULL,
    
    total_uang INTEGER NOT NULL,
    
    deskripsi TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for titip_transaksi_v2
ALTER TABLE public.titip_transaksi_v2 ENABLE ROW LEVEL SECURITY;

-- Policies for titip_transaksi_v2
DROP POLICY IF EXISTS "Makers can view their own transactions" ON public.titip_transaksi_v2;
CREATE POLICY "Makers can view their own transactions"
    ON public.titip_transaksi_v2 FOR SELECT
    USING (auth.uid() = maker_id);

DROP POLICY IF EXISTS "Sellers can view their own transactions" ON public.titip_transaksi_v2;
CREATE POLICY "Sellers can view their own transactions"
    ON public.titip_transaksi_v2 FOR SELECT
    USING (auth.uid() = seller_id);

DROP POLICY IF EXISTS "Sellers can insert transactions" ON public.titip_transaksi_v2;
CREATE POLICY "Sellers can insert transactions"
    ON public.titip_transaksi_v2 FOR INSERT
    WITH CHECK (auth.uid() = seller_id);

-- Indexes for titip_transaksi_v2
CREATE INDEX IF NOT EXISTS titip_transaksi_v2_titip_id_idx ON public.titip_transaksi_v2 (titip_id);
CREATE INDEX IF NOT EXISTS titip_transaksi_v2_maker_id_idx ON public.titip_transaksi_v2 (maker_id);
CREATE INDEX IF NOT EXISTS titip_transaksi_v2_seller_id_idx ON public.titip_transaksi_v2 (seller_id);

-- Extra policies for titip_v2 to allow status updates and versioning
DROP POLICY IF EXISTS "Sellers can update titipan status" ON public.titip_v2;
CREATE POLICY "Sellers can update titipan status"
    ON public.titip_v2 FOR UPDATE
    USING (auth.uid() = seller_id)
    WITH CHECK (auth.uid() = seller_id);

DROP POLICY IF EXISTS "Makers can update (deactivate) their own titipan" ON public.titip_v2;
CREATE POLICY "Makers can update (deactivate) their own titipan"
    ON public.titip_v2 FOR UPDATE
    USING (auth.uid() = maker_id)
    WITH CHECK (auth.uid() = maker_id);
