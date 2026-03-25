"use client";

import React, { useState } from "react";
import { Package, Check, X, ClipboardList, Send } from "lucide-react";
import Image from "next/image";

export default function SellerProductCard({ name, price, stock, imageSrc, onCatat, onPesan }) {
    const [phase, setPhase] = useState(1); // 1: Konfirmasi/Tolak, 2: Catat/Pesan

    const formatPrice = (price) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(price);
    };

    return (
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden group hover:shadow-xl hover:shadow-orange-100 transition-all duration-300">
            {/* Image Container */}
            <div className="relative aspect-square overflow-hidden bg-gray-50">
                {imageSrc ? (
                    <Image
                        src={imageSrc}
                        alt={name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-200">
                        <Package className="w-16 h-16 stroke-[1]" />
                    </div>
                )}

                {/* Stock Pill on Image */}
                <div className="absolute top-4 left-4">
                    <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
                        <p className="text-[10px] font-bold text-orange-600 uppercase tracking-wider">
                            Stock: {stock} Pcs
                        </p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                <h3 className="font-bold text-gray-900 border-b border-gray-50 pb-2 mb-2 truncate">
                    {name}
                </h3>
                <p className="text-xl font-black text-orange-600 mb-6">
                    {formatPrice(price)}
                </p>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2">
                    {phase === 1 ? (
                        <>
                            <button
                                onClick={() => setPhase(2)}
                                className="flex items-center justify-center gap-2 py-3 bg-orange-600 text-white rounded-2xl font-bold text-xs hover:bg-orange-700 transition-all shadow-lg shadow-orange-100"
                            >
                                <Check className="w-4 h-4" />
                                Konfirmasi
                            </button>
                            <button
                                className="flex items-center justify-center gap-2 py-3 bg-gray-50 text-gray-400 rounded-2xl font-bold text-xs hover:bg-red-50 hover:text-red-500 transition-all border border-gray-100"
                            >
                                <X className="w-4 h-4" />
                                Tolak
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={onCatat}
                                className="flex items-center justify-center gap-2 py-3 bg-orange-600 text-white rounded-2xl font-bold text-xs hover:bg-orange-700 transition-all shadow-lg shadow-orange-100"
                            >
                                <ClipboardList className="w-4 h-4" />
                                Catat
                            </button>
                            <button
                                onClick={() => window.location.href = '/dashboard/product/pesan'}
                                className="flex items-center justify-center gap-2 py-3 bg-white border border-gray-200 text-gray-500 rounded-2xl font-bold text-xs hover:bg-gray-50 transition-all"
                            >
                                <Send className="w-4 h-4" />
                                Pesan
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
