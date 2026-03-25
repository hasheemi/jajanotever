'use client'

import React from 'react'
import {
    TrendingUp,
    TrendingDown,
    Package,
    ShoppingCart,
    Calendar,
    ChevronLeft,
    ChevronRight,
    Search,
    Bell,
    Settings
} from 'lucide-react'
import Link from 'next/link'

export default function MakerHistoryContent() {
    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 bg-[#FDFDFD] min-h-screen">
            {/* Top Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Analisis Penjualan</h1>
                    <p className="text-gray-400 mt-1 font-medium">Ringkasan hasil dagangan hari ini</p>
                </div>
                <div className="flex gap-3">
                    <button className="p-2.5 bg-white border border-gray-100 rounded-xl shadow-sm hover:bg-gray-50 transition-all">
                        <Bell className="w-5 h-5 text-gray-500" />
                    </button>
                    <button className="p-2.5 bg-white border border-gray-100 rounded-xl shadow-sm hover:bg-gray-50 transition-all">
                        <Settings className="w-5 h-5 text-gray-500" />
                    </button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Average Profit - Orange Highlight */}
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-8 rounded-[32px] text-white shadow-lg shadow-orange-100 relative overflow-hidden group">
                    <div className="relative z-10">
                        <p className="text-orange-100 text-sm font-semibold mb-3">Rata-rata Keuntungan</p>
                        <h2 className="text-4xl font-bold mb-4">Rp 1.250k</h2>
                        <div className="inline-flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm">
                            <TrendingUp className="w-3.5 h-3.5" />
                            +12% dari kemarin
                        </div>
                    </div>
                </div>

                {/* Total Orders */}
                <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
                    <p className="text-gray-400 text-sm font-semibold mb-3">Total Pesanan</p>
                    <div className="flex items-baseline gap-2">
                        <h2 className="text-4xl font-bold text-gray-900">450</h2>
                        <span className="text-gray-400 font-bold">Pcs</span>
                    </div>
                    <p className="text-orange-600 text-xs font-bold mt-4">Target: 500 Pcs</p>
                </div>

                {/* Total Products */}
                <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
                    <p className="text-gray-400 text-sm font-semibold mb-3">Total Produk</p>
                    <div className="flex items-baseline gap-2">
                        <h2 className="text-4xl font-bold text-gray-900">120</h2>
                        <span className="text-gray-400 font-bold">Jenis</span>
                    </div>
                    <p className="text-teal-600 text-xs font-bold mt-4">15 Produk Baru</p>
                </div>
            </div>

            {/* Sales Chart Section */}
            <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-10">
                    <h3 className="text-xl font-bold text-gray-900">Grafik Penjualan</h3>
                    <div className="flex p-1 bg-gray-50 rounded-xl border border-gray-100">
                        <button className="px-5 py-2 bg-white rounded-lg shadow-sm text-sm font-bold text-gray-900">Mingguan</button>
                        <button className="px-5 py-2 text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors">Bulanan</button>
                    </div>
                </div>

                {/* Chart Placeholder (Empty labels/bars) */}
                <div className="flex items-end justify-between h-[280px] gap-4 px-4 border-b border-gray-50 pb-8">
                    {[
                        { label: 'Sen', active: false },
                        { label: 'Sel', active: false },
                        { label: 'Rab', active: false },
                        { label: 'Kam', active: false },
                        { label: 'Jum', active: false },
                        { label: 'Sab', active: false },
                        { label: 'Min', active: false }
                    ].map((day, idx) => (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-6 group">
                            <div className="w-full bg-orange-100/50 rounded-t-2xl transition-all duration-300 hover:bg-orange-200 cursor-pointer h-0"></div>
                            <span className="text-sm font-bold text-gray-400 group-hover:text-gray-600 transition-colors uppercase tracking-tight">{day.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Filter Section */}
            <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex flex-wrap items-end gap-6">
                <div className="flex-1 min-w-[200px]">
                    <label className="block text-sm font-bold text-gray-900 mb-3">Tipe Pesanan</label>
                    <div className="relative">
                        <select className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3.5 appearance-none text-gray-600 font-medium focus:ring-2 focus:ring-orange-500/20 outline-none transition-all">
                            <option>Semua Tipe</option>
                            <option>Titipan</option>
                            <option>Pre-Order</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                            <ChevronRight className="w-4 h-4 text-gray-400 rotate-90" />
                        </div>
                    </div>
                </div>

                <div className="flex-1 min-w-[200px]">
                    <label className="block text-sm font-bold text-gray-900 mb-3">Rentang Tanggal</label>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="01 Jan - 07 Jan 2024"
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3.5 pr-12 text-gray-600 font-medium focus:ring-2 focus:ring-orange-500/20 outline-none transition-all placeholder:text-gray-400"
                        />
                        <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                </div>

                <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3.5 rounded-2xl transition-all shadow-lg shadow-orange-100 active:scale-[0.98]">
                    Terapkan Filter
                </button>
            </div>

            {/* Sales Table */}
            <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-gray-50">
                    <h3 className="text-xl font-bold text-gray-900">Daftar Penjual</h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-8 py-5 text-sm font-bold text-gray-400 uppercase tracking-wider">Nama Penjual</th>
                                <th className="px-8 py-5 text-sm font-bold text-gray-400 uppercase tracking-wider text-center">Titipan</th>
                                <th className="px-8 py-5 text-sm font-bold text-gray-400 uppercase tracking-wider text-center">Sisa</th>
                                <th className="px-8 py-5 text-sm font-bold text-gray-400 uppercase tracking-wider">Total Penjualan</th>
                                <th className="px-8 py-5 text-sm font-bold text-gray-400 uppercase tracking-wider text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {[
                                { name: 'Bu Siti', letter: 'S', color: 'bg-orange-100 text-orange-600', deposit: '50 Pcs', remaining: '5 Pcs', total: 'Rp 450.000', id: '1' },
                                { name: 'Pak Wahyu', letter: 'W', color: 'bg-orange-100 text-orange-600', deposit: '30 Pcs', remaining: '0 Pcs', total: 'Rp 300.000', id: '2' },
                                { name: 'Mbak Maya', letter: 'M', color: 'bg-orange-100 text-orange-600', deposit: '100 Pcs', remaining: '12 Pcs', total: 'Rp 880.000', id: '3' }
                            ].map((row, idx) => (
                                <tr key={idx} className="hover:bg-gray-50/30 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 ${row.color} rounded-full flex items-center justify-center font-bold text-sm`}>
                                                {row.letter}
                                            </div>
                                            <span className="font-bold text-gray-900">{row.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-center font-bold text-gray-500">{row.deposit}</td>
                                    <td className="px-8 py-6 text-center font-bold text-orange-600">{row.remaining}</td>
                                    <td className="px-8 py-6 font-bold text-gray-900">{row.total}</td>
                                    <td className="px-8 py-6">
                                        <div className="flex justify-center">
                                            <Link
                                                href={`/dashboard/history/${row.id}/detail`}
                                                className="text-orange-600 font-bold hover:text-orange-700 hover:underline transition-all"
                                            >
                                                Lihat Detail
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-8 border-t border-gray-50 flex items-center justify-between">
                    <p className="text-sm font-bold text-gray-400">Menampilkan 3 dari 45 Penjual</p>
                    <div className="flex gap-3">
                        <button className="flex items-center gap-2 px-5 py-2.5 border border-gray-100 rounded-xl text-sm font-bold text-gray-400 hover:bg-gray-50 transition-all cursor-not-allowed">
                            <ChevronLeft className="w-4 h-4" />
                            Sebelumnya
                        </button>
                        <button className="flex items-center gap-2 px-5 py-2.5 border border-gray-100 rounded-xl text-sm font-bold text-gray-900 hover:bg-gray-50 transition-all">
                            Selanjutnya
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
