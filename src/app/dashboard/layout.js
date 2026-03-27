import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Sidebar from './_components/Sidebar'

export default async function DashboardLayout({ children }) {
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

    const { role } = userData

    const menuItems = role === 'maker' ? [
        { label: 'Beranda', href: '/dashboard', icon: 'Home' },
        { label: 'Katalog', href: '/dashboard/catalog', icon: 'Box' },
        { label: 'Kotak Pesanan', href: '/dashboard/order', icon: 'MessageSquare' },
        { label: 'Riwayat', href: '/dashboard/history', icon: 'Clock' },
        { label: 'Profil', href: '/dashboard/profile', icon: 'User' },
    ] : [
        { label: 'Beranda', href: '/dashboard', icon: 'Home' },
        { label: 'Produk', href: '/dashboard/product', icon: 'Box' },
        { label: 'Kotak Pesanan', href: '/dashboard/order', icon: 'MessageSquare' },
        { label: 'Riwayat', href: '/dashboard/history', icon: 'Clock' },
        { label: 'Profil', href: '/dashboard/profile', icon: 'User' },
    ]

    return (
        <div className="flex min-h-screen bg-[#FDFDFD]">
            <Sidebar menuItems={menuItems} userData={userData} user={user} />
            <main className="flex-1 w-full overflow-auto">
                {children}
            </main>
        </div>
    )
}
