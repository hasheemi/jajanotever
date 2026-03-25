-- Create products_v2 table
CREATE TABLE IF NOT EXISTS public.products_v2 (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    maker_id UUID NOT NULL REFERENCES public.users_v2(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC NOT NULL,
    image_url TEXT,
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

CREATE TRIGGER update_products_v2_modtime
    BEFORE UPDATE ON public.products_v2
    FOR EACH ROW
    EXECUTE PROCEDURE update_modified_column();

-- Enable RLS
ALTER TABLE public.products_v2 ENABLE ROW LEVEL SECURITY;

-- Policies for products_v2
CREATE POLICY "Anyone can view products"
    ON public.products_v2 FOR SELECT
    USING (true);

CREATE POLICY "Makers can insert their own products"
    ON public.products_v2 FOR INSERT
    WITH CHECK (auth.uid() = maker_id);

CREATE POLICY "Makers can update their own products"
    ON public.products_v2 FOR UPDATE
    USING (auth.uid() = maker_id);

CREATE POLICY "Makers can delete their own products"
    ON public.products_v2 FOR DELETE
    USING (auth.uid() = maker_id);

-- Storage bucket 'buck' setup
INSERT INTO storage.buckets (id, name, public) 
VALUES ('buck', 'buck', true) 
ON CONFLICT (id) DO NOTHING;

-- Policies for storage.objects
CREATE POLICY "Public Access to buck"
    ON storage.objects FOR SELECT
    USING ( bucket_id = 'buck' );

CREATE POLICY "Authenticated users can upload objects to buck"
    ON storage.objects FOR INSERT
    WITH CHECK ( bucket_id = 'buck' AND auth.role() = 'authenticated' );

CREATE POLICY "Users can update their own objects in buck"
    ON storage.objects FOR UPDATE
    USING ( bucket_id = 'buck' AND auth.uid() = owner )
    WITH CHECK ( bucket_id = 'buck' AND auth.uid() = owner );

CREATE POLICY "Users can delete their own objects in buck"
    ON storage.objects FOR DELETE
    USING ( bucket_id = 'buck' AND auth.uid() = owner );
