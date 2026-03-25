'use client'

import React from 'react'
import {
    TrendingUp,
    Star,
    Package,
    Sparkles
} from 'lucide-react'

export default function MakerDashboard({ userData, user }) {
    return (
        <div className="p-8 max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Halo, {userData?.name || 'Maker'}!</h1>
                <p className="text-gray-400 mt-1">Berikut adalah ringkasan harian Anda.</p>
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
                        Produk Terlaris
                    </div>
                    <div className="text-3xl font-bold text-gray-900 leading-none">Keripik Pisang</div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-orange-50 shadow-sm">
                    <div className="flex items-center gap-2 text-orange-600 font-bold mb-2 uppercase text-xs tracking-wider">
                        <Package className="w-4 h-4" />
                        Stok Tersisa
                    </div>
                    <div className="text-3xl font-bold text-gray-900 leading-none">45 Items</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Weekly Sales Chart Placeholder */}
                <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-bold text-gray-900">Grafik Penjualan Mingguan</h3>
                        <div className="bg-gray-50 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-600">Minggu Ini</div>
                    </div>

                    <div className="flex items-end justify-between h-48 gap-4 px-2">
                        {[
                            { day: 'Sen', value: 40 },
                            { day: 'Sel', value: 20 },
                            { day: 'Rab', value: 30 },
                            { day: 'Kam', value: 25 },
                            { day: 'Jum', value: 50 },
                            { day: 'Sab', value: 90 },
                            { day: 'Min', value: 75 }
                        ].map((item) => (
                            <div key={item.day} className="flex-1 flex flex-col items-center gap-4">
                                <div
                                    className="w-full bg-orange-500 rounded-t-2xl transition-all duration-500 ease-out hover:bg-orange-600"
                                    style={{ height: `${item.value}%` }}
                                />
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-tighter">{item.day}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-bold text-gray-900">Pesanan Baru</h3>
                        <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">3 Baru</span>
                    </div>

                    <div className="space-y-4">
                        <div className="p-5 bg-orange-50/50 rounded-2xl border-l-[3px] border-orange-500 relative">
                            <div className="absolute top-5 right-5 w-2.5 h-2.5 bg-orange-500 rounded-full" />
                            <h4 className="font-bold text-gray-900 text-sm">Pesanan dari Bu Siti</h4>
                            <p className="text-xs text-gray-400 mt-1">2 Jam Lalu</p>
                            <div className="flex gap-2 mt-4">
                                <button className="flex-1 bg-orange-600 text-white py-1.5 rounded-lg text-xs font-bold hover:bg-orange-700 transition-colors">Terima</button>
                                <button className="flex-1 bg-white border border-gray-200 text-gray-500 py-1.5 rounded-lg text-xs font-bold hover:bg-gray-50 transition-colors">Tolak</button>
                            </div>
                        </div>

                        <div className="p-5 bg-white border border-gray-50 rounded-2xl">
                            <h4 className="font-bold text-gray-900 text-sm">Pesanan dari Pak Budi</h4>
                            <p className="text-xs text-gray-400 mt-1">4 Jam Lalu</p>
                        </div>

                        <div className="p-5 bg-white border border-gray-50 rounded-2xl">
                            <h4 className="font-bold text-gray-900 text-sm">Pesanan dari Toko Jaya</h4>
                            <p className="text-xs text-gray-400 mt-1">Kemarin</p>
                        </div>
                    </div>

                    <button className="w-full text-center text-orange-600 font-bold text-xs mt-8 hover:underline">
                        Lihat Semua Pesanan
                    </button>
                </div>
            </div>

            {/* Ringkasan Pintar */}
            <div className="bg-[#FFF1E0] p-8 rounded-3xl border border-orange-100/50">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white">
                        <Sparkles className="w-5 h-5 fill-current" />
                    </div>
                    <h3 className="font-bold text-orange-900">Ringkasan Pintar Jajanote</h3>
                </div>
                <p className="text-orange-900/80 leading-relaxed text-sm">
                    Berdasarkan catatan jualan Anda, keripik pisang sangat laku di hari Minggu. Pastikan stok untuk besok ditambah minimal 20 bungkus ya, {userData?.name || 'Bu'}! Ada juga 3 pesanan baru yang menunggu konfirmasi Anda. Semangat jualan!
                </p>
            </div>
        </div>
    )
}
