import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import MakerHistoryContent from '../_components/maker/MakerHistoryContent'
import SellerHistoryContent from '../_components/seller/SellerHistoryContent'

export default async function HistoryPage() {
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

    if (!userData) {
        redirect('/register')
    }

    if (userData.role === 'maker') {
        return <MakerHistoryContent />
    }

    if (userData.role === 'seller') {
        return <SellerHistoryContent />
    }

    return redirect('/dashboard')
}
