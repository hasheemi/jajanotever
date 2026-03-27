'use client'

import React, { useState } from 'react'
import SellerProductCard from './SellerProductCard'
import { X, Loader2, Package, Plus, ClipboardList } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { createNotification } from '@/lib/utils/notif'

export default function SellerProductContent({ titipan: initialTitipan, userData }) {
    const supabase = createClient()
    const router = useRouter()
    const [titipan, setTitipan] = useState(initialTitipan)
    const [catatProduct, setCatatProduct] = useState(null)
    const [updating, setUpdating] = useState(null) // ID of titipan being updated
    const [catatData, setCatatData] = useState({ sisa: '', deskripsi: '' })

    const updateStatus = async (id, newStatus) => {
        setUpdating(id)
        try {
            const { error } = await supabase
                .from('titip_v2')
                .update({ status: newStatus })
                .eq('id', id)

            if (error) throw error

            // Send Notification to Maker
            const item = titipan.find(t => t.id === id)
            if (item) {
                const actionLabel = newStatus === 'accept' ? 'menerima' : 'menolak'
                await createNotification(
                    item.maker_id,
                    `Titipan Di${newStatus === 'accept' ? 'terima' : 'tolak'}`,
                    `Seller ${userData?.name || 'seseorang'} telah ${actionLabel} titipan ${item.product_name} Anda.`,
                    id
                )
            }

            setTitipan(prev => prev.map(t =>
                t.id === id ? { ...t, status: newStatus } : t
            ))
        } catch (error) {
            console.error('Error updating status:', error)
            alert('Gagal memperbarui status.')
        } finally {
            setUpdating(null)
        }
    }

    const handleSaveCatat = async () => {
        if (!catatProduct || catatData.sisa === '') {
            alert('Silakan isi sisa stok.')
            return
        }

        const sisa = parseInt(catatData.sisa)
        if (isNaN(sisa) || sisa < 0) {
            alert('Sisa stok harus berupa angka positif.')
            return
        }

        if (sisa > catatProduct.quantity) {
            alert('Sisa stok tidak boleh melebihi jumlah awal.')
            return
        }

        setUpdating(catatProduct.id)
        try {
            const totalUang = (catatProduct.quantity - sisa) * catatProduct.product_price

            // 1. Insert into titip_transaksi_v2
            const { error: transError } = await supabase
                .from('titip_transaksi_v2')
                .insert({
                    titip_id: catatProduct.id,
                    maker_id: catatProduct.maker_id,
                    seller_id: catatProduct.seller_id,
                    product_id: catatProduct.product_id,
                    product_name: catatProduct.product_name,
                    product_price: catatProduct.product_price,
                    jumlah_awal: catatProduct.quantity,
                    jumlah_sisa: sisa,
                    total_uang: totalUang,
                    deskripsi: catatData.deskripsi
                })

            if (transError) throw transError

            // 2. Update titip_v2 status to 'noted'
            await updateStatus(catatProduct.id, 'noted')

            // Send Notification to Maker for Stock Recording
            await createNotification(
                catatProduct.maker_id,
                'Stok Dicatat',
                `Seller ${userData?.name || 'seseorang'} telah mencatat sisa stok untuk ${catatProduct.product_name}: ${sisa} pcs tersisa.`,
                catatProduct.id
            )

            setCatatProduct(null)
            setCatatData({ sisa: '', deskripsi: '' })
        } catch (error) {
            console.error('Error saving record:', error)
            alert('Gagal menyimpan catatan.')
        } finally {
            setUpdating(null)
        }
    }

    const handlePesan = (item) => {
        const params = new URLSearchParams({
            product_id: item.product_id,
            name: item.product_name,
            price: item.product_price,
            maker_id: item.maker_id,
            maker_name: item.maker?.name || ''
        })
        router.push(`/dashboard/product/pesan?${params.toString()}`)
    }

    return (
        <div className="p-4 md:p-8 lg:p-12 max-w-7xl mx-auto space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic leading-none">Kelola Produk</h1>
                    <p className="text-gray-400 font-medium mt-2">
                        Konfirmasi dan kelola stok produk jualan Anda.
                    </p>
                </div>
                <button
                    onClick={() => router.push('/dashboard/product/pesan')}
                    className="flex items-center justify-center gap-3 bg-orange-600 text-white px-8 py-5 rounded-[2rem] font-black text-lg hover:bg-orange-700 transition-all shadow-2xl shadow-orange-100 active:scale-95 uppercase tracking-widest italic"
                >
                    <Plus className="w-6 h-6" />
                    Pesan Jajan Baru
                </button>
            </div>

            {/* Product Grid */}
            {titipan.length === 0 ? (
                <div className="bg-white rounded-[4rem] border-4 border-dashed border-gray-50 flex flex-col items-center justify-center p-20 gap-6">
                    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center">
                        <Package className="w-12 h-12 text-gray-200" />
                    </div>
                    <p className="text-gray-400 font-black uppercase tracking-widest italic">Tidak ada titipan masuk untuk hari ini.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {titipan.map((item) => (
                        <div key={item.id} className="relative">
                            {updating === item.id && (
                                <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-[2px] rounded-[3rem] flex items-center justify-center">
                                    <Loader2 className="w-12 h-12 text-orange-600 animate-spin" />
                                </div>
                            )}
                            <SellerProductCard
                                name={item.product_name}
                                price={item.product_price}
                                quantity={item.quantity}
                                image_url={item.product_image}
                                status={item.status}
                                maker={item.maker}
                                onCatat={() => setCatatProduct(item)}
                                onAccept={() => updateStatus(item.id, 'accept')}
                                onReject={() => updateStatus(item.id, 'reject')}
                                onPesan={() => handlePesan(item)}
                            />
                        </div>
                    ))}
                </div>
            )}

            {/* Catat Modal */}
            {catatProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md">
                    <div className="bg-white w-full max-w-xl rounded-[3.5rem] shadow-2xl overflow-hidden relative animate-in fade-in zoom-in duration-300 border border-white/20">
                        <button
                            onClick={() => setCatatProduct(null)}
                            className="absolute top-8 right-8 p-3 rounded-full hover:bg-gray-100 transition-colors z-10"
                        >
                            <X className="w-6 h-6 text-gray-400" />
                        </button>

                        <div className="p-10 md:p-14 space-y-10">
                            <div className="flex items-center gap-5">
                                <div className="p-4 bg-orange-100 rounded-[1.5rem] text-orange-600">
                                    <ClipboardList className="w-10 h-10" />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black text-gray-900 uppercase italic tracking-tighter">Catat Produk</h2>
                                    <p className="text-gray-400 font-medium">Selesaikan pencatatan untuk <span className="font-bold text-orange-600">{catatProduct.product_name}</span></p>
                                </div>
                            </div>

                            <div className="space-y-8">
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-gray-400 uppercase ml-1 tracking-widest">Sisa Stok (Pcs)</label>
                                    <input
                                        type="number"
                                        value={catatData.sisa}
                                        onChange={(e) => setCatatData(prev => ({ ...prev, sisa: e.target.value }))}
                                        className="w-full px-8 py-5 bg-gray-50 border border-transparent rounded-[2rem] focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:bg-white focus:border-orange-500 transition-all font-black text-2xl text-gray-900"
                                        placeholder="0"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-gray-400 uppercase ml-1 tracking-widest">Catatan Tambahan</label>
                                    <textarea
                                        value={catatData.deskripsi}
                                        onChange={(e) => setCatatData(prev => ({ ...prev, deskripsi: e.target.value }))}
                                        className="w-full px-8 py-5 bg-gray-50 border border-transparent rounded-[2rem] focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:bg-white focus:border-orange-500 transition-all font-bold text-gray-900 min-h-[140px]"
                                        placeholder="Contoh: Laku keras hari ini!"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row gap-4 pt-4">
                                <button
                                    onClick={handleSaveCatat}
                                    className="w-full md:flex-1 py-5 bg-orange-600 text-white rounded-[2rem] font-black text-lg hover:bg-orange-700 transition-all shadow-2xl shadow-orange-100 flex items-center justify-center gap-3 active:scale-95 uppercase tracking-widest italic"
                                >
                                    <ClipboardList className="w-6 h-6" />
                                    Simpan Catatan
                                </button>
                                <button
                                    onClick={() => setCatatProduct(null)}
                                    className="w-full md:w-auto px-10 py-5 bg-gray-100 text-gray-500 rounded-[2rem] font-black text-lg hover:bg-gray-200 transition-all flex items-center justify-center gap-3 active:scale-95 uppercase tracking-widest"
                                >
                                    <X className="w-6 h-6" />
                                    Batalkan
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
