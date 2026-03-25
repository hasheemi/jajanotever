import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import OrdersContent from '../_components/maker/OrdersContent'
import SellerOrdersContent from '../_components/seller/SellerOrdersContent'

export default async function OrdersPage() {
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
        return <OrdersContent userData={userData} user={user} />
    }

    if (userData.role === 'seller') {
        return <SellerOrdersContent userData={userData} user={user} />
    }

    return redirect('/dashboard')
}
