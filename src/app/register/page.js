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
    const { data: userData, error: userError } = await supabase
        .from('users_v2')
        .select('*')
        .eq('id', user.id)
        .single()

    if (userError && userError.code !== 'PGRST116') {
        console.error('Error fetching user profile in register:', userError)
    }

    if (userData) {
        console.log('User already registered, redirecting to dashboard')
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
        <div className="min-h-screen bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center p-4 relative" style={{ backgroundImage: "url('/bg/register.png')" }}>
            {/* Overlay for better readability */}
            <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px]"></div>

            <div className="w-full max-w-md space-y-8 relative z-10 bg-white/80 p-10 rounded-[3rem] shadow-2xl border border-white/50 backdrop-blur-md">
                <div className="flex flex-col items-center space-y-2 text-center">
                    <Link href="/" className="flex items-center justify-center group">
                        <ShoppingBag className="h-10 w-10 text-orange-600 group-hover:scale-110 transition-transform" />
                        <span className="ml-3 text-4xl font-black tracking-tight text-black italic">Jajanote</span>
                    </Link>
                    <h1 className="text-2xl font-black text-gray-900 mt-8 uppercase italic tracking-tighter">Lengkapi Pendaftaran</h1>
                    <p className="text-gray-500 text-sm font-medium">Selamat datang! Silakan isi detail Anda untuk memulai.</p>
                </div>

                <form action={registerUser} className="mt-8 space-y-6 bg-orange-50/50 p-6 rounded-[2rem] border border-orange-100 shadow-inner">
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-xs font-black text-gray-400 uppercase mb-2 ml-1 tracking-widest">
                                Nama Lengkap
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                className="w-full px-4 py-3 rounded-2xl border border-white/50 bg-white/80 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all font-medium"
                                placeholder="Cth: Budi Santoso"
                                defaultValue={user.user_metadata?.full_name || ''}
                            />
                        </div>

                        <div>
                            <label htmlFor="role" className="block text-xs font-black text-gray-400 uppercase mb-2 ml-1 tracking-widest">
                                Peran (Role)
                            </label>
                            <select
                                id="role"
                                name="role"
                                required
                                className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all bg-white"
                            >
                                <option value="" disabled>Pilih peran Anda</option>
                                <option value="maker">Maker (Pembuat Jajan)</option>
                                <option value="seller">Seller (Penjual/Warung)</option>
                            </select>
                        </div>

                        <div>
                            <label
                                htmlFor="paguyuban"
                                className="block text-xs font-black text-gray-400 uppercase mb-2 ml-1 tracking-widest"
                            >
                                Paguyuban (Komunitas)
                            </label>

                            <select
                                id="paguyuban"
                                name="paguyuban"
                                required
                                className="w-full px-4 py-3 rounded-2xl border border-white/50 bg-white/80 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all font-medium"
                                defaultValue=""
                            >
                                <option value="" disabled>
                                    Pilih paguyuban
                                </option>
                                <option value="sejahtera">Sejahtera</option>
                                <option value="aman">Aman</option>
                                <option value="damai">Damai</option>
                                <option value="makmur">Makmur</option>
                                <option value="wijaya">Wijaya</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 mt-8">
                        <button
                            type="submit"
                            className="w-full flex items-center justify-center bg-orange-600 py-3 px-4 rounded-2xl font-black text-white hover:bg-orange-700 shadow-xl shadow-orange-200 transition-all hover:scale-105 active:scale-95 uppercase tracking-widest"
                        >
                            Selesaikan Pendaftaran
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
