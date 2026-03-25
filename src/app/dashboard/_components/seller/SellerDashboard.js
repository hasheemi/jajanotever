'use client'

import React from 'react'
import {
    TrendingUp,
    Star,
    Package,
    Sun,
    MoreVertical,
    User,
    Check,
    X
} from 'lucide-react'

const TITIPAN_DATA = [
    {
        id: 1,
        name: "Maker A: Sari's Kitchen",
        specialty: "Specialty: Cassava Chips",
        units: 15,
        avatarColor: "bg-orange-100"
    },
    {
        id: 2,
        name: "Maker B: Budi Jajan",
        specialty: "Specialty: Kue Putu",
        units: 82,
        avatarColor: "bg-orange-50"
    },
    {
        id: 3,
        name: "Maker C: Auntie Wang",
        specialty: "Specialty: Risoles",
        units: 45,
        avatarColor: "bg-orange-200"
    }
]

export default function SellerDashboard({ userData, user }) {
    return (
        <div className="p-8 max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Halo, {userData?.name || 'Seller'}!</h1>
                <p className="text-gray-400 mt-1">Berikut adalah ringkasan harian Toko Anda.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-orange-50 shadow-sm">
                    <div className="flex items-center gap-2 text-orange-600 font-bold mb-2 uppercase text-xs tracking-wider">
                        <TrendingUp className="w-4 h-4" />
                        Total Pendapatan
                    </div>
                    <div className="text-3xl font-bold text-gray-900 leading-none">Rp 1,250,000</div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-orange-50 shadow-sm">
                    <div className="flex items-center gap-2 text-orange-600 font-bold mb-2 uppercase text-xs tracking-wider">
                        <Star className="w-4 h-4" />
                        Titipan Terlaris
                    </div>
                    <div className="text-3xl font-bold text-gray-900 leading-none">Keripik Pisang</div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-orange-50 shadow-sm">
                    <div className="flex items-center gap-2 text-orange-600 font-bold mb-2 uppercase text-xs tracking-wider">
                        <Package className="w-4 h-4" />
                        Total Titipan
                    </div>
                    <div className="text-3xl font-bold text-gray-900 leading-none">12 Makers</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Weather & Titipan List */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Weather Widget */}
                    <div className="bg-orange-500 p-8 rounded-3xl text-white shadow-lg relative overflow-hidden flex items-center justify-between">
                        <div className="relative z-10">
                            <h3 className="text-5xl font-bold mb-2">Pasar Beringharjo</h3>
                            <p className="text-xl font-medium opacity-90">Cerah Berawan</p>
                        </div>
                        <div className="relative z-10">
                            <Sun className="w-24 h-24 stroke-[1.5]" />
                        </div>
                        {/* Decorative circles */}
                        <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-xl" />
                    </div>

                    {/* Titipan Maker List */}
                    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-bold text-gray-900">Daftar Titipan Maker</h3>
                            <button className="text-orange-600 font-bold text-sm hover:underline">Lihat Semua</button>
                        </div>

                        <div className="space-y-6">
                            {TITIPAN_DATA.map((item) => (
                                <div key={item.id} className="flex items-center justify-between group">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-16 h-16 ${item.avatarColor} rounded-2xl flex items-center justify-center`}>
                                            <User className="w-8 h-8 text-orange-400" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">{item.name}</h4>
                                            <p className="text-sm text-gray-400">{item.specialty}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="text-right">
                                            <div className="text-lg font-bold text-gray-900">{item.units} titipan</div>
                                        </div>
                                        <button className="p-2 hover:bg-orange-50 rounded-xl transition-colors">
                                            <MoreVertical className="w-5 h-5 text-gray-400" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Recent Notifications (Titipan Baru) */}
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-bold text-gray-900">Titipan Baru</h3>
                        <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">3 Baru</span>
                    </div>

                    <div className="space-y-4 flex-1">
                        <div className="p-5 bg-orange-50/50 rounded-2xl border-l-[3px] border-orange-500 relative">
                            <div className="absolute top-5 right-5 w-2.5 h-2.5 bg-orange-500 rounded-full" />
                            <h4 className="font-bold text-gray-900 text-sm">Titipan dari Maker A</h4>
                            <p className="text-xs text-gray-400 mt-1">2 Jam Lalu</p>
                            <div className="flex gap-2 mt-4">
                                <button className="flex-1 bg-orange-600 text-white py-1.5 rounded-lg text-xs font-bold hover:bg-orange-700 transition-colors flex items-center justify-center gap-1">
                                    <Check className="w-3 h-3" /> Terima
                                </button>
                                <button className="flex-1 bg-white border border-gray-200 text-gray-500 py-1.5 rounded-lg text-xs font-bold hover:bg-gray-50 transition-colors flex items-center justify-center gap-1">
                                    <X className="w-3 h-3" /> Tolak
                                </button>
                            </div>
                        </div>

                        <div className="p-5 bg-white border border-gray-50 rounded-2xl">
                            <h4 className="font-bold text-gray-900 text-sm">Titipan dari Maker B</h4>
                            <p className="text-xs text-gray-400 mt-1">4 Jam Lalu</p>
                        </div>

                        <div className="p-5 bg-white border border-gray-50 rounded-2xl">
                            <h4 className="font-bold text-gray-900 text-sm">Titipan dari Maker C</h4>
                            <p className="text-xs text-gray-400 mt-1">Kemarin</p>
                        </div>
                    </div>

                    <button className="w-full text-center text-orange-600 font-bold text-xs mt-8 hover:underline">
                        Lihat Semua Titipan
                    </button>
                </div>
            </div>
        </div>
    )
}
