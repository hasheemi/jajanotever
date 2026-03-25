'use client'

import React from 'react'
import Image from 'next/image'
import { Send, Edit2, Trash2, Image as ImageIcon } from 'lucide-react'

export default function ProductCard({ name, price, imageSrc, onSend, onEdit, onDelete }) {
    return (
        <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
            {/* Product Image */}
            <div className="relative h-48 w-full bg-gray-50 flex items-center justify-center text-gray-400 font-bold uppercase overflow-hidden">
                {imageSrc ? (
                    <Image
                        src={imageSrc}
                        alt={name}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-300 text-3xl">
                        {name.charAt(0)}
                    </div>
                )}
            </div>

            {/* Product Info */}
            <div className="p-5 space-y-4">
                <div>
                    <h3 className="text-lg font-bold text-gray-900 leading-tight">
                        {name}
                    </h3>
                    <p className="text-sm font-medium text-gray-500 mt-0.5">
                        Rp {price.toLocaleString('id-ID')}
                    </p>
                </div>

                {/* Actions */}
                <div className="space-y-2">
                    <button
                        onClick={onSend}
                        className="w-full bg-orange-600 text-white py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-orange-700 transition-colors"
                    >
                        <Send className="w-4 h-4" />
                        Titipkan
                    </button>

                    <div className="flex gap-2">
                        <button
                            onClick={onEdit}
                            className="flex-1 bg-gray-50 text-gray-600 py-2 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors text-sm"
                        >
                            <Edit2 className="w-3.5 h-3.5" />
                            Ubah
                        </button>
                        <button
                            onClick={onDelete}
                            className="flex-1 bg-gray-50 text-gray-600 py-2 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors text-sm"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                            Hapus
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
