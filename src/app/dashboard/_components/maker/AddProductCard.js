'use client'

import React from 'react'
import { Plus } from 'lucide-react'

import Link from 'next/link'

export default function AddProductCard() {
    return (
        <Link href="/dashboard/catalog/new" className="block">
            <button className="w-full bg-white rounded-3xl border-2 border-dashed border-gray-200 p-8 flex flex-col items-center justify-center gap-4 hover:border-orange-200 hover:bg-orange-50/30 transition-all group min-h-[350px]">
                <div className="w-12 h-12 rounded-full border-2 border-gray-200 flex items-center justify-center group-hover:border-orange-300 group-hover:scale-110 transition-all">
                    <Plus className="w-6 h-6 text-gray-300 group-hover:text-orange-500" />
                </div>
                <p className="text-gray-400 font-bold max-w-[120px] group-hover:text-orange-900 transition-colors leading-tight">
                    Tambah Produk Baru
                </p>
            </button>
        </Link>
    )
}
