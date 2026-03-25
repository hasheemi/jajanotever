import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import MakerDashboard from './_components/maker/MakerDashboard'
import SellerDashboard from './_components/seller/SellerDashboard'

export default async function DashboardPage() {
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

    if (role === 'maker') {
        return <MakerDashboard userData={userData} user={user} />
    }

    if (role === 'seller') {
        return <SellerDashboard userData={userData} user={user} />
    }

    return (
        <div className="flex items-center justify-center h-full">
            <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-gray-100 max-w-md">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Unauthorized Role</h1>
                <p className="text-gray-500 mb-6">
                    It seems your account doesn't have a valid role assigned. Please contact support.
                </p>
                <form action="/auth/logout" method="post">
                    <button
                        type="submit"
                        className="w-full bg-orange-600 text-white py-2 rounded-xl font-bold hover:bg-orange-700 transition-colors"
                    >
                        Logout
                    </button>
                </form>
            </div>
        </div>
    )
}
