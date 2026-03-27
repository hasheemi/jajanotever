'use client'

import React from 'react'
import { Package, Check, X, ClipboardList, Send, User, Star } from 'lucide-react'
import Image from 'next/image'

export default function SellerProductCard({
    name,
    price,
    quantity,
    image_url,
    status,
    maker,
    onCatat,
    onAccept,
    onReject,
    onPesan
}) {
    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price)
    }

    const getStatusInfo = (status) => {
        switch (status) {
            case 'accept': return { label: 'DITERIMA', color: 'bg-green-500', icon: Check }
            case 'pending': return { label: 'BARU', color: 'bg-orange-500', icon: Package }
            case 'reject': return { label: 'DITOLAK', color: 'bg-red-500', icon: X }
            case 'noted': return { label: 'DICATAT', color: 'bg-blue-600', icon: ClipboardList }
            default: return { label: status.toUpperCase(), color: 'bg-gray-500', icon: Package }
        }
    }

    const statusInfo = getStatusInfo(status)

    return (
        <div className="bg-white rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-100/50 overflow-hidden group hover:scale-[1.02] transition-all duration-500">
            {/* Image Container */}
            <div className="relative aspect-square overflow-hidden bg-gray-50">
                {image_url ? (
                    <Image
                        src={image_url}
                        alt={name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-200">
                        <Package className="w-20 h-20 stroke-[1]" />
                    </div>
                )}

                {/* Status Pill */}
                <div className="absolute top-6 right-6">
                    <div className={`${statusInfo.color} text-white px-4 py-1.5 rounded-full shadow-lg backdrop-blur-sm flex items-center gap-2 border border-white/20`}>
                        <statusInfo.icon className="w-3 h-3" />
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] italic">
                            {statusInfo.label}
                        </p>
                    </div>
                </div>

                {/* Maker Info Pill */}
                <div className="absolute top-6 left-6">
                    <div className="bg-white/80 backdrop-blur-md pl-1.5 pr-4 py-1.5 rounded-full shadow-xl shadow-black/5 flex items-center gap-3 border border-white/50">
                        <div className="w-7 h-7 rounded-full bg-orange-100 overflow-hidden relative border border-orange-200">
                            {maker?.img ? (
                                <Image src={maker.img} alt={maker.name} fill className="object-cover" />
                            ) : (
                                <User className="w-4 h-4 text-orange-600 m-auto absolute inset-0" />
                            )}
                        </div>
                        <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest italic">
                            {maker?.name || 'Maker'}
                        </p>
                    </div>
                </div>

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            {/* Content */}
            <div className="p-8 space-y-6">
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="font-black text-2xl text-gray-900 truncate flex-1 italic tracking-tighter">
                            {name}
                        </h3>
                        <div className="flex items-center gap-1 bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
                            <Star className="w-3 h-3 text-orange-600 fill-current" />
                            <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest">
                                {quantity} Pcs
                            </span>
                        </div>
                    </div>
                    <p className="text-3xl font-black text-gray-900 italic tracking-tighter">
                        {formatPrice(price)}
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 gap-3">
                    {status === 'pending' ? (
                        <div className="flex gap-3 mt-2">
                            <button
                                onClick={onAccept}
                                className="flex-1 flex items-center justify-center gap-3 py-4 bg-orange-600 text-white rounded-2xl font-black text-xs hover:bg-orange-700 transition-all shadow-xl shadow-orange-100 active:scale-95 uppercase tracking-widest italic"
                            >
                                <Check className="w-4 h-4" />
                                Terima
                            </button>
                            <button
                                onClick={onReject}
                                className="w-16 flex items-center justify-center bg-gray-50 text-gray-400 rounded-2xl font-black text-xs hover:bg-red-50 hover:text-red-600 transition-all border border-gray-100 active:scale-95 uppercase"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    ) : status === 'accept' ? (
                        <div className="flex gap-3 mt-2">
                            <button
                                onClick={onCatat}
                                className="flex-1 flex items-center justify-center gap-3 py-4 bg-orange-600 text-white rounded-2xl font-black text-xs hover:bg-orange-700 transition-all shadow-xl shadow-orange-100 active:scale-95 uppercase tracking-widest italic"
                            >
                                <ClipboardList className="w-4 h-4" />
                                Catat Stok
                            </button>
                            <button
                                onClick={onPesan}
                                className="w-16 flex items-center justify-center bg-white border border-gray-100 text-gray-400 rounded-2xl font-black text-xs hover:bg-orange-50 hover:text-orange-600 hover:border-orange-100 transition-all active:scale-95"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    ) : (
                        <div className="w-full text-center py-4 bg-gray-50 text-gray-400 rounded-2xl font-black text-[10px] border border-gray-100 uppercase tracking-[0.2em] italic mt-2">
                            {status === 'reject' ? 'Permintaan Ditolak' : 'Selesai Dicatat'}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
