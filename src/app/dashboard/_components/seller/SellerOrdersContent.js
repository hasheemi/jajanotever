'use client'

import React, { useState } from 'react'
import {
    ArrowLeft,
    Search,
    CheckCircle2,
    XCircle,
    ChevronRight,
    Calendar,
    User
} from 'lucide-react'
import Link from 'next/link'

export default function SellerOrdersContent({ userData, user }) {
    const [activeTab, setActiveTab] = useState('Baru')
    const [searchQuery, setSearchQuery] = useState('')

    const tabs = [
        { name: 'Baru', count: 3 },
        { name: 'Proses', count: 0 },
        { name: 'Selesai', count: 0 }
    ]

    const dummyOrders = [
        {
            id: 1,
            customerName: 'Ibu Siti Aminah',
            time: 'Hari ini, 10:30 WIB',
            status: 'PESANAN BARU',
            items: [
                { name: '2x Keripik Pisang Manis', price: 30000 },
                { name: '1x Emping Melinjo Pedas', price: 25000 }
            ],
            total: 55000,
            color: 'orange'
        },
        {
            id: 2,
            customerName: 'Bapak Bambang',
            time: 'Kemarin, 16:45 WIB',
            status: 'SEDANG DIPROSES',
            items: [
                { name: '5x Keripik Singkong Gadung', price: 75000 }
            ],
            total: 75000,
            color: 'blue'
        },
        {
            id: 3,
            customerName: 'Teh Ratna',
            time: '2 Jan 2024, 09:15 WIB',
            status: 'SELESAI',
            items: [
                { name: '3x Makaroni Pedas Desa', price: 45000 }
            ],
            total: 45000,
            color: 'green'
        }
    ]

    const filteredOrders = dummyOrders.filter(order => {
        if (activeTab === 'Baru') return order.status === 'PESANAN BARU'
        if (activeTab === 'Proses') return order.status === 'SEDANG DIPROSES'
        if (activeTab === 'Selesai') return order.status === 'SELESAI'
        return true
    }).filter(order =>
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <ArrowLeft className="w-6 h-6 text-gray-900" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Cek Pesanan</h1>
                        <p className="text-gray-400 mt-1">Kelola pesanan masuk dari pelanggan Anda</p>
                    </div>
                </div>

                <Link
                    href="/dashboard/calendar"
                    className="flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-2xl font-bold hover:bg-orange-600 transition-all shadow-sm"
                >
                    <Calendar className="w-5 h-5" />
                    Cek kalender
                </Link>
            </div>

            {/* Tabs and Search */}
            <div className="space-y-4">
                <div className="flex items-center justify-end">
                    <div className="flex bg-gray-100 p-1 rounded-xl">
                        {tabs.map((tab) => (
                            <button
                                key={tab.name}
                                onClick={() => setActiveTab(tab.name)}
                                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === tab.name
                                    ? 'bg-orange-500 text-white shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                {tab.name} {tab.count > 0 && `(${tab.count})`}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Cari nama pelanggan..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all shadow-sm"
                    />
                </div>
            </div>

            {/* Orders List */}
            <div className="space-y-6">
                {filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => (
                        <div key={order.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="p-6 space-y-6">
                                {/* Order Header */}
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${order.color === 'orange' ? 'bg-orange-100 text-orange-600' :
                                            order.color === 'blue' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                                            }`}>
                                            <User className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 text-xl">{order.customerName}</h3>
                                            <p className="text-sm text-gray-400 flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {order.time}
                                            </p>
                                        </div>
                                    </div>
                                    <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase ${order.color === 'orange' ? 'bg-orange-500 text-white' :
                                        order.color === 'blue' ? 'bg-blue-600 text-white' : 'bg-green-500 text-white'
                                        }`}>
                                        {order.status}
                                    </span>
                                </div>

                                {/* Order Items */}
                                <div className="bg-gray-50/50 rounded-2xl p-6 space-y-4">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Daftar Belanja:</p>
                                    <div className="space-y-2">
                                        {order.items.map((item, idx) => (
                                            <div key={idx} className="flex justify-between items-center text-gray-700">
                                                <span className="font-medium">{item.name}</span>
                                                <span className="font-bold">Rp {item.price.toLocaleString('id-ID')}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="pt-4 border-t border-gray-200/50 flex justify-between items-center">
                                        <span className="text-sm font-bold text-gray-900">Total Bayar:</span>
                                        <span className={`text-xl font-bold ${order.color === 'orange' ? 'text-orange-600' : 'text-gray-900'
                                            }`}>
                                            Rp {order.total.toLocaleString('id-ID')}
                                        </span>
                                    </div>
                                </div>

                                {/* Actions */}
                                {order.status === 'PESANAN BARU' && (
                                    <div className="flex gap-4">
                                        <button className="flex-1 flex items-center justify-center gap-2 bg-orange-500 text-white py-4 rounded-2xl font-bold hover:bg-orange-600 transition-all shadow-md active:scale-[0.98]">
                                            <CheckCircle2 className="w-5 h-5" />
                                            Terima Pesanan
                                        </button>
                                        <button className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-100 text-gray-500 py-4 rounded-2xl font-bold hover:bg-gray-50 transition-all active:scale-[0.98]">
                                            <XCircle className="w-5 h-5" />
                                            Tolak
                                        </button>
                                    </div>
                                )}

                                {order.status === 'SEDANG DIPROSES' && (
                                    <button className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-md active:scale-[0.98]">
                                        <CheckCircle2 className="w-5 h-5" />
                                        Selesaikan & Kirim
                                    </button>
                                )}

                                {order.status === 'SELESAI' && (
                                    <div className="flex justify-end">
                                        <button className="text-orange-600 font-bold text-sm flex items-center gap-1 hover:underline">
                                            Lihat Rincian
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                        <p className="text-gray-400 font-medium">Tidak ada pesanan di kategori ini.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
