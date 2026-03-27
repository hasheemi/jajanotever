'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ChevronRight, Plus, Minus, FileText, Loader2, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function SendProductContent({ product, currentUser }) {
    const supabase = createClient()
    const router = useRouter()
    const [sellers, setSellers] = useState([])
    const [lacakData, setLacakData] = useState([])
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [success, setSuccess] = useState(false)

    useEffect(() => {
        async function fetchData() {
            if (!currentUser || !product) return

            setLoading(true)
            try {
                // 1. Fetch sellers in the same paguyuban
                const { data: sellersData, error: sellersError } = await supabase
                    .from('users_v2')
                    .select('*')
                    .eq('role', 'seller')
                    .eq('paguyuban', currentUser.paguyuban)

                if (sellersError) throw sellersError

                // 2. Fetch LATEST active titipan for this product by this maker
                const { data: activeTitipan, error: titipanError } = await supabase
                    .from('titip_v2')
                    .select('*')
                    .eq('maker_id', currentUser.id)
                    .eq('product_id', product.id)
                    .eq('is_active', true)

                if (titipanError) throw titipanError

                // 3. Fetch completed transactions for "Lacak" section
                const { data: completedTransactions, error: transError } = await supabase
                    .from('titip_transaksi_v2')
                    .select('*')
                    .eq('maker_id', currentUser.id)
                    .eq('product_id', product.id)
                    .order('created_at', { ascending: false })

                if (transError) throw transError
                setLacakData(completedTransactions || [])

                // Combine data for sellers list
                const initialSellers = sellersData.map(seller => {
                    const active = activeTitipan?.find(t => t.seller_id === seller.id)
                    return {
                        ...seller,
                        quantity: active ? active.quantity : 0,
                        status: active ? active.status : null,
                        active_id: active ? active.id : null
                    }
                })

                setSellers(initialSellers)
            } catch (error) {
                console.error('Error fetching data:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [product, currentUser, supabase])

    const updateQuantity = (id, delta) => {
        setSellers(prev => prev.map(s =>
            s.id === id ? { ...s, quantity: Math.max(0, s.quantity + delta) } : s
        ))
    }

    const handleConfirm = async () => {
        const selectedSellers = sellers.filter(s => s.quantity > 0)

        if (selectedSellers.length === 0) {
            alert('Silakan tentukan jumlah produk untuk setidaknya satu penjual.')
            return
        }

        // Check if any seller already accepted
        const acceptedSellers = selectedSellers.filter(s => s.status === 'accept')
        if (acceptedSellers.length > 0) {
            const confirmNew = confirm(
                `Beberapa penjual (${acceptedSellers.map(s => s.name).join(', ')}) sudah menerima titipan sebelumnya. Kirim titipan baru?`
            )
            if (!confirmNew) return
        }

        setSubmitting(true)
        try {
            const groupId = crypto.randomUUID()

            // 1. Deactivate old active records for these sellers
            const activeIds = selectedSellers.filter(s => s.active_id).map(s => s.active_id)
            if (activeIds.length > 0) {
                const { error: deactivateError } = await supabase
                    .from('titip_v2')
                    .update({ is_active: false })
                    .in('id', activeIds)

                if (deactivateError) throw deactivateError
            }

            // 2. Prepare new titip_v2 data
            const titipData = selectedSellers.map(s => ({
                maker_id: currentUser.id,
                seller_id: s.id,
                product_id: product.id,
                product_name: product.name,
                product_price: Math.round(product.price),
                product_image: product.image_url,
                quantity: s.quantity,
                status: 'pending',
                group_id: groupId,
                is_active: true
            }))

            // 3. Bulk insert into titip_v2
            const { data: insertedTitip, error: titipError } = await supabase
                .from('titip_v2')
                .insert(titipData)
                .select()

            if (titipError) throw titipError

            // 4. Prepare notifications
            const notifData = insertedTitip.map(t => ({
                user_id: t.seller_id,
                title: 'Titipan Baru',
                message: `${currentUser.name} menitipkan ${t.quantity} ${t.product_name}`,
                related_id: t.id
            }))

            // 5. Bulk insert into notif_v2
            const { error: notifError } = await supabase
                .from('notif_v2')
                .insert(notifData)

            if (notifError) throw notifError

            setSuccess(true)
            setTimeout(() => {
                router.push('/dashboard/catalog')
            }, 2000)
        } catch (error) {
            console.error('Error submitting titipan:', error)
            alert('Gagal mengirim titipan. Silakan coba lagi.')
        } finally {
            setSubmitting(false)
        }
    }

    if (!product) return <div className="p-8 text-center text-gray-500">Produk tidak ditemukan.</div>

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <CheckCircle2 className="w-20 h-20 text-green-500 animate-bounce" />
                <h1 className="text-3xl font-bold text-gray-900">Berhasil Dikirim!</h1>
                <p className="text-gray-500">Titipan anda telah berhasil dikirim ke penjual.</p>
            </div>
        )
    }

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-start gap-4">
                <Link href="/dashboard/catalog" className="mt-1 p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft className="w-6 h-6 text-gray-900" />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 leading-tight">Titipkan Produk Anda</h1>
                    <p className="text-xs text-gray-400 mt-1 mt-1 bg-orange-50 px-3 py-1 rounded-lg border border-orange-100 inline-block font-medium">
                        Anda dapat memperbarui jumlah titipan kapan saja. Hanya titipan terbaru yang akan diproses.
                    </p>
                </div>
            </div>

            {/* Selected Product Section */}
            <div className="space-y-4">
                <h2 className="text-lg font-bold text-gray-900">Produk Terpilih</h2>
                <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-6">
                    <div className="relative w-32 h-32 rounded-2xl overflow-hidden bg-gray-50 flex-shrink-0">
                        {product.image_url ? (
                            <Image
                                src={product.image_url}
                                alt={product.name}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-50 uppercase font-bold text-2xl">
                                {product.name?.charAt(0)}
                            </div>
                        )}
                    </div>
                    <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900">{product.name}</h3>
                        <p className="text-orange-600 font-bold mt-1">
                            Rp {Number(product.price).toLocaleString('id-ID')} / bungkus
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
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 text-orange-600 animate-spin" />
                    </div>
                ) : sellers.length === 0 ? (
                    <div className="bg-orange-50 p-8 rounded-3xl text-center">
                        <p className="text-orange-800 font-medium">Belum ada penjual di paguyuban anda.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {sellers.map((seller) => (
                            <div key={seller.id} className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 relative">
                                    {seller.img ? (
                                        <Image src={seller.img} alt={seller.name} fill className="object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-200 uppercase font-bold text-sm">
                                            {seller.name?.charAt(0)}
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-bold text-gray-900">{seller.name}</h4>
                                        {seller.status && (
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${seller.status === 'accept' ? 'bg-green-100 text-green-700' :
                                                seller.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                                                    seller.status === 'reject' ? 'bg-red-100 text-red-700' :
                                                        'bg-blue-100 text-blue-700'
                                                }`}>
                                                {seller.status === 'accept' ? '🟢 Accepted' :
                                                    seller.status === 'pending' ? '🟡 Waiting' :
                                                        seller.status === 'reject' ? '🔴 Rejected' :
                                                            seller.status}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-400 flex flex-col gap-0.5 mt-0.5">
                                        <span className="flex items-center gap-1">
                                            <span className="w-1 h-1 bg-gray-300 rounded-full" />
                                            {seller.paguyuban}
                                        </span>
                                        {seller.status === 'accept' && (
                                            <span className="text-[10px] text-green-600 font-medium italic">
                                                Penjual sudah menerima. Mengirim ulang akan membuat permintaan baru.
                                            </span>
                                        )}
                                        {seller.status === 'reject' && (
                                            <span className="text-[10px] text-red-500 font-medium italic">
                                                Permintaan ditolak. Anda dapat menyesuaikan jumlah dan kirim ulang.
                                            </span>
                                        )}
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
                )}
            </div>

            {/* Action Button */}
            <div className="flex justify-center pt-8">
                <button
                    onClick={handleConfirm}
                    disabled={submitting || loading || sellers.length === 0}
                    className="bg-orange-600 text-white px-12 py-5 rounded-[2.5rem] font-bold text-2xl flex items-center justify-center gap-3 hover:bg-orange-700 transition-all shadow-xl shadow-orange-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 disabled:shadow-none"
                >
                    {submitting ? <Loader2 className="w-8 h-8 animate-spin" /> : <FileText className="w-8 h-8" />}
                    {submitting ? 'Mengirim...' : 'Konfirmasi'}
                </button>
            </div>

            {/* Section 2: Lacak (Tracking) */}
            <div className="space-y-4 pt-12 border-t border-gray-100">
                <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                    <h2 className="text-2xl font-bold text-gray-900">Lacak (Tracking)</h2>
                </div>
                <p className="text-gray-400 text-sm">Data transaksi yang telah selesai dicatat oleh penjual.</p>

                {lacakData.length === 0 ? (
                    <div className="bg-gray-50 p-12 rounded-3xl text-center">
                        <p className="text-gray-400 font-medium">Belum ada transaksi selesai.</p>
                    </div>
                ) : (
                    <div className="overflow-hidden bg-white rounded-3xl border border-gray-100 shadow-sm">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50">
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Penjual</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Awal</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Sisa</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Total Uang</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Tanggal</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {lacakData.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 text-xs font-bold">
                                                    {item.seller_id.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="font-bold text-gray-900 text-sm">
                                                    Penjual #{item.seller_id.slice(0, 4)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-600">{item.jumlah_awal} pcs</td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-600">{item.jumlah_sisa} pcs</td>
                                        <td className="px-6 py-4 text-sm font-bold text-orange-600 text-right">
                                            Rp {item.total_uang.toLocaleString('id-ID')}
                                        </td>
                                        <td className="px-6 py-4 text-xs text-gray-400">
                                            {new Date(item.created_at).toLocaleDateString('id-ID', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}
