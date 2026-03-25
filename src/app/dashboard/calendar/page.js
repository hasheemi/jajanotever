import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import CalendarContent from '../_components/maker/CalendarContent'

export default async function CalendarPage() {
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

    return <CalendarContent userData={userData} user={user} />
}
