"use client";

import React, { useState } from "react";
import SellerProductCard from "./SellerProductCard";
import { X } from "lucide-react";

export default function SellerProductContent() {
    const [catatProduct, setCatatProduct] = useState(null);
    const dummyProducts = [
        { id: 1, name: "Gethuk Lindri", price: 15000, stock: 40, imageSrc: "/dummy/gethuk.jpeg" },
        { id: 2, name: "Bubur Sumsum", price: 10000, stock: 25, imageSrc: "/dummy/sumsum.jpeg" },
        { id: 3, name: "Martabak Terbul", price: 25000, stock: 10, imageSrc: "/dummy/terbul.jpeg" },
        { id: 4, name: "Keripik Pisang", price: 15000, stock: 50, imageSrc: null },
    ];

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Kelola Produk</h1>
                    <p className="text-gray-400 mt-1">
                        Konfirmasi dan kelola stok produk jualan Anda.
                    </p>
                </div>
                <button
                    onClick={() => window.location.href = '/dashboard/product/pesan'}
                    className="flex items-center justify-center gap-2 px-6 py-3.5 bg-orange-600 text-white rounded-2xl font-bold hover:bg-orange-700 transition-all shadow-lg shadow-orange-200"
                >
                    Pesan Jajan Baru
                </button>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {dummyProducts.map((product) => (
                    <SellerProductCard
                        key={product.id}
                        name={product.name}
                        price={product.price}
                        stock={product.stock}
                        imageSrc={product.imageSrc}
                        onCatat={() => setCatatProduct(product)}
                    />
                ))}
            </div>

            {/* Catat Modal */}
            {catatProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden relative animate-in fade-in zoom-in duration-200">
                        <button
                            onClick={() => setCatatProduct(null)}
                            className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
                        >
                            <X className="w-6 h-6 text-gray-400" />
                        </button>

                        <div className="p-8 space-y-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">Catat Produk</h2>
                                <p className="text-gray-400 text-sm mt-1">Selesaikan pencatatan untuk <span className="font-bold text-gray-900">{catatProduct.name}</span></p>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-400 uppercase ml-1">Sisa Stok (Pcs)</label>
                                    <input
                                        type="number"
                                        className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium"
                                        placeholder="0"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-400 uppercase ml-1">Catatan Tambahan</label>
                                    <textarea
                                        className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium min-h-[100px]"
                                        placeholder="Contoh: Laku keras hari ini!"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={() => setCatatProduct(null)}
                                    className="flex-1 px-6 py-3.5 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={() => setCatatProduct(null)}
                                    className="flex-1 px-6 py-3.5 bg-orange-600 text-white rounded-2xl font-bold hover:bg-orange-700 transition-all shadow-lg shadow-orange-200"
                                >
                                    Simpan
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
