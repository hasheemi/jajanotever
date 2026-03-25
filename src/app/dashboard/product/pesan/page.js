"use client";

import React, { useState } from "react";
import { ArrowLeft, Send, Search, User, Package, MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PesanJajanPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        jajanName: "",
        makerName: "",
        quantity: "",
        notes: ""
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle submission logic here
        router.push('/dashboard/product');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
                <div className="max-w-2xl mx-auto px-6 py-6 flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="p-2.5 rounded-2xl hover:bg-gray-50 transition-colors text-gray-400"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div>
                        <h1 className="text-xl font-black text-gray-900">Pesan Jajan Baru</h1>
                        <p className="text-sm text-gray-400">Pesan jajan yang belum terhubung dengan Maker</p>
                    </div>
                </div>
            </div>

            {/* Form Content */}
            <div className="max-w-2xl mx-auto px-6 py-10">
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 space-y-8">
                        {/* Jajan Name */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase flex items-center gap-2 ml-1">
                                <Package className="w-3.5 h-3.5" />
                                Nama Jajan
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.jajanName}
                                onChange={(e) => setFormData({ ...formData, jajanName: e.target.value })}
                                className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium text-gray-900"
                                placeholder="Contoh: Nagasari Keju"
                            />
                        </div>

                        {/* Maker Name */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase flex items-center gap-2 ml-1">
                                <User className="w-3.5 h-3.5" />
                                Nama Pembuat (Maker)
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.makerName}
                                onChange={(e) => setFormData({ ...formData, makerName: e.target.value })}
                                className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium text-gray-900"
                                placeholder="Contoh: Bu Sisca"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Quantity */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase flex items-center gap-2 ml-1">
                                    <Search className="w-3.5 h-3.5" />
                                    Jumlah Pesanan
                                </label>
                                <input
                                    type="number"
                                    required
                                    value={formData.quantity}
                                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium text-gray-900"
                                    placeholder="0"
                                />
                            </div>
                        </div>

                        {/* Additional Notes */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase flex items-center gap-2 ml-1">
                                <MessageSquare className="w-3.5 h-3.5" />
                                Catatan Tambahan
                            </label>
                            <textarea
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium text-gray-900 min-h-[120px]"
                                placeholder="Tuliskan permintaan khusus (contoh: minta plastik lebih)"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full py-5 bg-orange-600 text-white rounded-[2rem] font-black text-lg hover:bg-orange-700 transition-all shadow-xl shadow-orange-100 flex items-center justify-center gap-3 active:scale-[0.98]"
                    >
                        <Send className="w-6 h-6" />
                        Kirim Pesanan
                    </button>
                </form>
            </div>
        </div>
    );
}
