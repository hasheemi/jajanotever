import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AddProductForm from '../../_components/maker/AddProductForm'

export default async function NewProductPage() {
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

    return <AddProductForm makerId={user.id} />
}
