import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import SellerProductContent from '../_components/seller/SellerProductContent'

export default async function SellerProductPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { data: userData } = await supabase
        .from('users_v2')
        .select('*')
        .eq('id', user.id)
        .single()

    if (!userData || userData.role !== 'seller') {
        redirect('/dashboard')
    }

    const today = new Date().toISOString().split('T')[0]

    // Fetch daily titipan for this seller
    const { data: titipan } = await supabase
        .from('titip_v2')
        .select(`
            *,
            maker:maker_id(name, img)
        `)
        .eq('seller_id', user.id)
        .eq('is_active', true)
        .gte('created_at', `${today}T00:00:00Z`)
        .lte('created_at', `${today}T23:59:59Z`)
        .order('created_at', { ascending: false })

    return <SellerProductContent titipan={titipan || []} userData={userData} />
}
