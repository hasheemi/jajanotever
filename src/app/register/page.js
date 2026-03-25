import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ShoppingBag } from 'lucide-react'
import Link from 'next/link'

export default async function RegisterPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Check if already registered
    const { data: userData } = await supabase
        .from('users_v2')
        .select('*')
        .eq('id', user.id)
        .single()

    if (userData) {
        redirect('/dashboard')
    }

    async function registerUser(formData) {
        'use server'

        const name = formData.get('name')
        const role = formData.get('role')
        const paguyuban = formData.get('paguyuban')

        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) return

        const { error } = await supabase
            .from('users_v2')
            .insert([
                {
                    id: user.id,
                    email: user.email,
                    img: user.user_metadata?.avatar_url || user.user_metadata?.picture || '',
                    name,
                    role,
                    paguyuban,
                    created_at: new Date().toISOString()
                }
            ])

        if (error) {
            console.error('Registration error:', error)
            return
        }

        redirect('/dashboard')
    }

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8">
                <div className="flex flex-col items-center space-y-2 text-center">
                    <Link href="/" className="flex items-center justify-center">
                        <ShoppingBag className="h-10 w-10 text-orange-600" />
                        <span className="ml-3 text-3xl font-extrabold tracking-tight text-orange-600">Jaja<span>Note</span></span>
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900 mt-6">Complete Registration</h1>
                    <p className="text-gray-500 text-sm">Welcome! Please fill in your details to get started.</p>
                </div>

                <form action={registerUser} className="mt-8 space-y-6 bg-orange-50/30 p-8 rounded-3xl border border-orange-100 shadow-sm">
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2 ml-1">
                                Full Name
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                                placeholder="Ex: Budi Santoso"
                                defaultValue={user.user_metadata?.full_name || ''}
                            />
                        </div>

                        <div>
                            <label htmlFor="role" className="block text-sm font-semibold text-gray-700 mb-2 ml-1">
                                Role
                            </label>
                            <select
                                id="role"
                                name="role"
                                required
                                className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all bg-white"
                            >
                                <option value="" disabled>Select your role</option>
                                <option value="maker">Maker (Small Production)</option>
                                <option value="seller">Seller (Outlet/Warung)</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="paguyuban" className="block text-sm font-semibold text-gray-700 mb-2 ml-1">
                                Paguyuban (Community)
                            </label>
                            <input
                                id="paguyuban"
                                name="paguyuban"
                                type="text"
                                required
                                className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                                placeholder="Ex: Paguyuban Jajan Pasar"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full flex items-center justify-center bg-orange-600 py-4 px-6 rounded-2xl font-bold text-white hover:bg-orange-700 shadow-lg shadow-orange-200 transition-all hover:scale-[1.02] active:scale-95 mt-8"
                    >
                        Complete Setup
                    </button>
                </form>
            </div>
        </div>
    )
}
