'use client'

import React from 'react'
import Link from 'next/link'
import * as Icons from 'lucide-react'
import { usePathname } from 'next/navigation'

export default function Sidebar({ menuItems, userData, user }) {
    const pathname = usePathname()

    return (
        <aside className="w-64 border-r border-gray-100 bg-white p-6 flex flex-col gap-8 h-screen sticky top-0">
            {/* Logo */}
            <div className="flex items-center gap-2 px-2">
                <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white">
                    <Icons.Box className="w-6 h-6" />
                </div>
                <span className="text-2xl font-bold text-gray-900">Jajanote</span>
            </div>

            {/* Navigation */}
            <nav className="flex flex-col gap-2 flex-1">
                {menuItems.map((item, index) => {
                    const isActive = pathname === item.href
                    // Handle both component icons and icon names
                    const Icon = typeof item.icon === 'string' ? Icons[item.icon] : item.icon

                    return (
                        <Link
                            key={index}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${isActive
                                ? 'bg-orange-50 text-orange-600'
                                : 'text-gray-500 hover:bg-gray-50'
                                }`}
                        >
                            {Icon && <Icon className="w-5 h-5" />}
                            {item.label}
                        </Link>
                    )
                })}
            </nav>

            {/* Footer / Logout */}
            <div className="pt-6 border-t border-gray-50">
                <div className="flex items-center gap-3 px-2 mb-6">
                    <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-xs uppercase">
                        {(userData?.name || user?.email || '?').charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900 truncate">{userData?.name || 'User'}</p>
                        <p className="text-[10px] text-gray-400 truncate">{user?.email}</p>
                    </div>
                </div>

                <form action="/auth/logout" method="post">
                    <button
                        type="submit"
                        className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all font-medium group"
                    >
                        <Icons.LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                        Keluar
                    </button>
                </form>
            </div>
        </aside>
    )
}
