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

    return <SellerProductContent />
}
