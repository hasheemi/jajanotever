import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import CatalogContent from '../_components/maker/CatalogContent'

export default async function CatalogPage() {
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

    if (!userData || userData.role !== 'maker') {
        redirect('/dashboard')
    }

    const { data: products } = await supabase
        .from('products_v2')
        .select('*')
        .eq('maker_id', user.id)
        .order('created_at', { ascending: false })

    return <CatalogContent userData={userData} user={user} products={products || []} />
}
