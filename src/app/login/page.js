'use client'

import { createClient } from '@/lib/supabase/client'
import { ShoppingBag } from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
    const supabase = createClient()

    const handleGoogleLogin = async () => {
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        })
    }

    return (
        <div className="min-h-screen bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center p-4 relative" style={{ backgroundImage: "url('/bg/login.png')" }}>
            {/* Overlay for better readability */}
            <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px]"></div>

            <div className="w-full max-w-md space-y-8 text-center relative z-10 bg-white/80 p-10 rounded-[3rem] shadow-2xl border border-white/50 backdrop-blur-md">
                <div className="flex flex-col items-center space-y-2">
                    <Link href="/" className="flex items-center justify-center group">
                        <ShoppingBag className="h-10 w-10 text-orange-600 group-hover:scale-110 transition-transform" />
                        <span className="ml-3 text-4xl font-black tracking-tight text-black italic">Jajanote</span>
                    </Link>
                    <h1 className="text-2xl font-black text-gray-900 mt-8 uppercase italic tracking-tighter">Masuk ke Jajanote</h1>
                    <p className="text-gray-500 font-medium">Pantau jajan hanya dengan satu klik</p>
                </div>

                <div className="mt-8 bg-orange-50/50 p-2 rounded-[2rem] border border-orange-100 shadow-inner">
                    <button
                        onClick={handleGoogleLogin}
                        className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 py-4 px-6 rounded-2xl font-semibold text-gray-700 hover:bg-gray-50 hover:shadow-md transition-all active:scale-95"
                    >
                        <svg className="w-6 h-6" viewBox="0 0 24 24">
                            <path
                                fill="#4285F4"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="#34A853"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="#FBBC05"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                            />
                            <path
                                fill="#EA4335"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                        </svg>
                        Lanjut dengan Google
                    </button>
                </div>

                <p className="text-xs text-gray-400 mt-10 font-medium leading-relaxed">
                    Dengan mendaftar, Anda menyetujui Ketentuan Layanan <br /> dan Kebijakan Privasi kami.
                </p>
            </div>
        </div>
    )
}
