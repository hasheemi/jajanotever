'use client'

import React from 'react'
import {
    ChevronLeft,
    Box,
    ShoppingCart,
    Clock,
    User,
    ArrowLeft
} from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function TransactionDetailPage() {
    const params = useParams()
    const id = params.id

    // Mock data based on image2
    const items = [
        { name: 'Lapis Pelangi', deposit: 5, remaining: 0, price: 'Rp 4.500', image: '/dummy/product-1.jpg' },
        { name: 'Bakwan Sayur', deposit: 10, remaining: 1, price: 'Rp 6.000', image: '/dummy/product-2.jpg' },
        { name: 'Onde - onde', deposit: 12, remaining: 3, price: 'Rp 9.700', image: '/dummy/product-3.jpg' },
        { name: 'Putu Ayu', deposit: 20, remaining: 7, price: 'Rp 8.000', image: '/dummy/product-4.jpg' },
    ]

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-8 bg-[#FDFDFD] min-h-screen">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link
                    href="/dashboard/history"
                    className="p-2.5 bg-white border border-gray-100 rounded-xl shadow-sm hover:bg-gray-50 transition-all text-gray-500 hover:text-orange-600"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">Detail Titipan</h1>
            </div>

            {/* Content Container */}
            <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden p-8">
                {/* Transaction Info (Extra for Web Design) */}
                <div className="flex flex-wrap justify-between items-center mb-10 pb-8 border-b border-gray-50 gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600">
                            <User className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Penjual</p>
                            <h3 className="text-lg font-bold text-gray-900">Bu Siti</h3>
                        </div>
                    </div>
                    <div className="flex gap-10">
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tanggal</p>
                            <p className="font-bold text-gray-900">19 Maret 2026</p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Status</p>
                            <span className="inline-flex bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-bold">Selesai</span>
                        </div>
                    </div>
                </div>

                {/* Items List */}
                <div className="space-y-6">
                    {items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between group">
                            <div className="flex items-center gap-5">
                                <div className="w-20 h-20 bg-gray-100 rounded-[20px] overflow-hidden relative border border-gray-50">
                                    {/* Placeholder for images */}
                                    <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                                        <Box className="w-8 h-8" />
                                    </div>
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-full h-full object-cover relative z-10"
                                        onError={(e) => e.target.style.opacity = 0}
                                    />
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-gray-900 mb-1">{item.name}</h4>
                                    <p className="text-sm font-bold text-orange-600">
                                        Titipan: {item.deposit}, Sisa: {item.remaining}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xl font-black text-gray-900">{item.price}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Total Section */}
                <div className="mt-12 pt-8 border-t border-gray-50 space-y-4">
                    <h3 className="text-xl font-black text-gray-900 mb-6 uppercase tracking-tight italic">Total</h3>

                    <div className="flex justify-between items-center">
                        <span className="text-gray-400 font-bold text-lg">Subtotal</span>
                        <span className="text-gray-900 font-black text-xl tracking-tight">Rp. 47.500</span>
                    </div>

                    <div className="flex justify-between items-center text-orange-600">
                        <span className="font-bold text-lg">Sisa</span>
                        <span className="font-black text-xl tracking-tight">Rp 9.000</span>
                    </div>

                    {/* Action Button */}
                    <button className="w-full mt-8 bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-orange-100 active:scale-[0.98]">
                        Cetak Struk
                    </button>
                </div>
            </div>
        </div>
    )
}
