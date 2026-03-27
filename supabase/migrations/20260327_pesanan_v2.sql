-- Create pesanan_v2 table
CREATE TABLE IF NOT EXISTS public.pesanan_v2 (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    seller_id UUID NOT NULL REFERENCES public.users_v2(id) ON DELETE CASCADE,
    maker_id UUID NOT NULL REFERENCES public.users_v2(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products_v2(id) ON DELETE CASCADE,
    price INTEGER NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    total_price INTEGER NOT NULL,
    date DATE DEFAULT CURRENT_DATE,
    description TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'shipped', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_pesanan_v2_modtime ON public.pesanan_v2;
CREATE TRIGGER update_pesanan_v2_modtime
    BEFORE UPDATE ON public.pesanan_v2
    FOR EACH ROW
    EXECUTE PROCEDURE update_modified_column();

-- Enable RLS
ALTER TABLE public.pesanan_v2 ENABLE ROW LEVEL SECURITY;

-- Policies for pesanan_v2
CREATE POLICY "Sellers can view their own orders"
    ON public.pesanan_v2 FOR SELECT
    USING (auth.uid() = seller_id);

CREATE POLICY "Makers can view orders sent to them"
    ON public.pesanan_v2 FOR SELECT
    USING (auth.uid() = maker_id);

CREATE POLICY "Sellers can insert orders"
    ON public.pesanan_v2 FOR INSERT
    WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Makers can update order status"
    ON public.pesanan_v2 FOR UPDATE
    USING (auth.uid() = maker_id OR auth.uid() = seller_id); -- Seller can cancel

-- Indexes
CREATE INDEX IF NOT EXISTS pesanan_v2_seller_id_idx ON public.pesanan_v2 (seller_id);
CREATE INDEX IF NOT EXISTS pesanan_v2_maker_id_idx ON public.pesanan_v2 (maker_id);
CREATE INDEX IF NOT EXISTS pesanan_v2_product_id_idx ON public.pesanan_v2 (product_id);
