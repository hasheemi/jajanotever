'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ChevronRight, Plus, Minus, FileText } from 'lucide-react'

export default function SendProductContent({ product }) {
    const [sellers, setSellers] = useState([
        { id: 1, name: "Warung Bu Siti", address: "Jl. Merdeka No. 10", quantity: 20, avatar: "/dummy/seller1.jpeg" },
        { id: 2, name: "Kantin Sekolah", address: "SMA Negeri 12", quantity: 0, avatar: "/dummy/seller2.jpeg" },
        { id: 3, name: "Pak Joyo", address: "Perumahan Asri Blok C", quantity: 15, avatar: "/dummy/seller3.jpeg" }
    ])

    const updateQuantity = (id, delta) => {
        setSellers(prev => prev.map(s =>
            s.id === id ? { ...s, quantity: Math.max(0, s.quantity + delta) } : s
        ))
    }

    if (!product) return <div>Produk tidak ditemukan.</div>

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-start gap-4">
                <Link href="/dashboard/catalog" className="mt-1 p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft className="w-6 h-6 text-gray-900" />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 leading-tight">Titipkan Produk Anda</h1>
                    <p className="text-gray-400 mt-1">Pilih tujuan penitipan untuk produk anda.</p>
                </div>
            </div>

            {/* Selected Product Section */}
            <div className="space-y-4">
                <h2 className="text-lg font-bold text-gray-900">Produk Terpilih</h2>
                <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-6">
                    <div className="relative w-32 h-32 rounded-2xl overflow-hidden bg-gray-50 flex-shrink-0">
                        {product.imageSrc ? (
                            <Image
                                src={product.imageSrc}
                                alt={product.name}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-50 uppercase font-bold text-2xl">
                                {product.name.charAt(0)}
                            </div>
                        )}
                    </div>
                    <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900">{product.name}</h3>
                        <p className="text-orange-600 font-bold mt-1">
                            Rp {product.price.toLocaleString('id-ID')} / bungkus
                        </p>
                    </div>
                    <Link
                        href="/dashboard/catalog"
                        className="px-4 py-2 border border-gray-200 rounded-full text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                        Ubah Produk
                    </Link>
                </div>
            </div>

            {/* Seller Selection Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-gray-900">Pilih Penjual & Tentukan Jumlah</h2>
                    <button className="text-orange-600 text-xs font-bold hover:underline flex items-center gap-1">
                        <Plus className="w-3 h-3" />
                        Tambah Penjual
                    </button>
                </div>

                <div className="space-y-3">
                    {sellers.map((seller) => (
                        <div key={seller.id} className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 relative">
                                <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-200 uppercase font-bold text-sm">
                                    {seller.name.charAt(0)}
                                </div>
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-gray-900">{seller.name}</h4>
                                <p className="text-xs text-gray-400 flex items-center gap-1">
                                    <span className="w-1 h-1 bg-gray-300 rounded-full" />
                                    {seller.address}
                                </p>
                            </div>

                            <div className="flex items-center gap-3 bg-gray-50/50 p-1.5 rounded-2xl border border-gray-50">
                                <button
                                    onClick={() => updateQuantity(seller.id, -1)}
                                    className="w-8 h-8 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-600 hover:text-orange-600 hover:border-orange-100 transition-all shadow-sm"
                                >
                                    <Minus className="w-4 h-4" />
                                </button>
                                <span className="w-8 text-center font-bold text-gray-900">{seller.quantity}</span>
                                <button
                                    onClick={() => updateQuantity(seller.id, 1)}
                                    className="w-8 h-8 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-600 hover:text-orange-600 hover:border-orange-100 transition-all shadow-sm"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Action Button */}
            <div className="flex justify-center pt-8">
                <button className="bg-orange-600 text-white px-12 py-5 rounded-[2.5rem] font-bold text-2xl flex items-center justify-center gap-3 hover:bg-orange-700 transition-all shadow-xl shadow-orange-200 hover:scale-105 active:scale-95">
                    <FileText className="w-8 h-8" />
                    Konfirmasi
                </button>
            </div>
        </div>
    )
}
