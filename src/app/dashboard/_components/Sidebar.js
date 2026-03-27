'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import * as Icons from 'lucide-react'
import { usePathname } from 'next/navigation'

export default function Sidebar({ menuItems, userData, user }) {
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(false)

    const toggleSidebar = () => setIsOpen(!isOpen)

    return (
        <>
            {/* Mobile Toggle Button */}
            <button
                onClick={toggleSidebar}
                className="lg:hidden fixed top-4 right-4 z-50 p-3 bg-white border border-gray-100 rounded-2xl shadow-lg text-orange-600 hover:scale-105 active:scale-95 transition-all"
            >
                {isOpen ? <Icons.X className="w-6 h-6" /> : <Icons.Menu className="w-6 h-6" />}
            </button>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity"
                    onClick={toggleSidebar}
                />
            )}

            <aside className={`
                w-72 border-r border-gray-50 bg-white p-8 flex flex-col gap-10 h-screen z-40
                fixed lg:sticky top-0 transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                {/* Logo */}
                <div className="flex items-center gap-2 px-2">
                    <Link href="/" className="flex items-center gap-3 group">
                        <Icons.ShoppingBag className="w-8 h-8 text-orange-600 group-hover:scale-110 transition-transform" />
                        <span className="text-3xl font-black text-black italic tracking-tighter">Jajanote</span>
                    </Link>
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
                                onClick={() => setIsOpen(false)}
                                className={`flex items-center gap-4 px-5 py-4 rounded-2xl font-bold transition-all ${isActive
                                    ? 'bg-orange-50 text-orange-600 shadow-sm shadow-orange-100'
                                    : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
                                    }`}
                            >
                                {Icon && <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />}
                                <span className="text-sm uppercase tracking-widest">{item.label}</span>
                            </Link>
                        )
                    })}
                </nav>

                {/* Footer / Logout */}
                <div className="pt-8 border-t border-gray-50">
                    <div className="flex items-center gap-4 px-2 mb-8 p-3 bg-orange-50/50 rounded-[2rem] border border-orange-100/30">
                        <div className="w-10 h-10 rounded-2xl bg-white border border-orange-100 flex items-center justify-center text-orange-600 font-black text-sm uppercase shadow-sm">
                            {(userData?.name || user?.email || '?').charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-black text-gray-900 truncate uppercase tracking-tight">{userData?.name || 'User'}</p>
                            <p className="text-[10px] text-gray-400 truncate font-medium">{user?.email}</p>
                        </div>
                    </div>

                    <form action="/auth/logout" method="post">
                        <button
                            type="submit"
                            className="w-full flex items-center gap-4 px-6 py-4 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all font-bold group"
                        >
                            <Icons.LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                            <span className="text-sm uppercase tracking-widest">Keluar</span>
                        </button>
                    </form>
                </div>
            </aside>
        </>
    )
}
