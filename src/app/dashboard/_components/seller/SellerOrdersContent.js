'use client'

import React, { useState, useEffect } from 'react'
import {
    ArrowLeft,
    Search,
    XCircle,
    ChevronRight,
    Calendar,
    User,
    Loader2,
    Plus
} from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function SellerOrdersContent({ userData, user }) {
    const supabase = createClient()
    const [activeTab, setActiveTab] = useState('Baru')
    const [searchQuery, setSearchQuery] = useState('')
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState(null)

    useEffect(() => {
        fetchOrders()
    }, [])

    const fetchOrders = async () => {
        setLoading(true)
        try {
            const { data, error } = await supabase
                .from('pesanan_v2')
                .select(`
                    *,
                    maker:users_v2!pesanan_v2_maker_id_fkey(name),
                    product:products_v2(name)
                `)
                .eq('seller_id', user.id)
                .order('created_at', { ascending: false })

            if (error) throw error
            setOrders(data || [])
        } catch (error) {
            console.error('Error fetching orders:', error)
        } finally {
            setLoading(false)
        }
    }

    const cancelOrder = async (orderId) => {
        if (!confirm('Apakah Anda yakin ingin membatalkan pesanan ini?')) return

        setUpdating(orderId)
        try {
            const { error } = await supabase
                .from('pesanan_v2')
                .update({ status: 'cancelled' })
                .eq('id', orderId)

            if (error) throw error

            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'cancelled' } : o))
        } catch (error) {
            console.error('Error cancelling order:', error)
            alert('Gagal membatalkan pesanan: ' + error.message)
        } finally {
            setUpdating(null)
        }
    }

    const getTabCount = (tabName) => {
        return orders.filter(order => {
            if (tabName === 'Baru') return order.status === 'pending'
            if (tabName === 'Proses') return ['accepted', 'shipped'].includes(order.status)
            if (tabName === 'Selesai') return ['completed', 'rejected', 'cancelled'].includes(order.status)
            return false
        }).length
    }

    const tabs = [
        { name: 'Baru', count: getTabCount('Baru') },
        { name: 'Proses', count: getTabCount('Proses') },
        { name: 'Selesai', count: getTabCount('Selesai') }
    ]

    const filteredOrders = orders.filter(order => {
        if (activeTab === 'Baru') return order.status === 'pending'
        if (activeTab === 'Proses') return ['accepted', 'shipped'].includes(order.status)
        if (activeTab === 'Selesai') return ['completed', 'rejected', 'cancelled'].includes(order.status)
        return true
    }).filter(order =>
        order.maker?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.product?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'orange'
            case 'accepted':
            case 'shipped': return 'blue'
            case 'completed': return 'green'
            case 'rejected':
            case 'cancelled': return 'red'
            default: return 'gray'
        }
    }

    const getStatusLabel = (status) => {
        switch (status) {
            case 'pending': return 'MENUNGGU KONFIRMASI'
            case 'accepted': return 'DITERIMA'
            case 'shipped': return 'DIKIRIM'
            case 'completed': return 'SELESAI'
            case 'rejected': return 'DITOLAK'
            case 'cancelled': return 'DIBATALKAN'
            default: return status.toUpperCase()
        }
    }

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <ArrowLeft className="w-6 h-6 text-gray-900" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Riwayat Pesanan</h1>
                        <p className="text-gray-400 mt-1">Pantau status pesanan yang Anda buat</p>
                    </div>
                </div>

                <Link
                    href="/dashboard/product/pesan"
                    className="flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-2xl font-bold hover:bg-orange-600 transition-all shadow-sm"
                >
                    <Plus className="w-5 h-5" />
                    Buat Pesanan
                </Link>
            </div>

            {/* Tabs and Search */}
            <div className="space-y-4">
                <div className="flex items-center justify-end">
                    <div className="flex bg-gray-100 p-1 rounded-xl">
                        {tabs.map((tab) => (
                            <button
                                key={tab.name}
                                onClick={() => setActiveTab(tab.name)}
                                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === tab.name
                                    ? 'bg-orange-500 text-white shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                {tab.name} {tab.count > 0 && `(${tab.count})`}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Cari nama maker atau produk..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all shadow-sm"
                    />
                </div>
            </div>

            {/* Orders List */}
            <div className="space-y-6">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 space-y-4">
                        <Loader2 className="w-10 h-10 text-orange-600 animate-spin" />
                        <p className="text-gray-400 font-medium">Memuat pesanan...</p>
                    </div>
                ) : filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => {
                        const color = getStatusColor(order.status)
                        return (
                            <div key={order.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden relative">
                                {updating === order.id && (
                                    <div className="absolute inset-0 z-10 bg-white/50 backdrop-blur-[1px] flex items-center justify-center">
                                        <Loader2 className="w-8 h-8 text-orange-600 animate-spin" />
                                    </div>
                                )}
                                <div className="p-6 space-y-6">
                                    {/* Order Header */}
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color === 'orange' ? 'bg-orange-100 text-orange-600' :
                                                    color === 'blue' ? 'bg-blue-100 text-blue-600' :
                                                        color === 'green' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                                                }`}>
                                                <User className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900 text-xl">{order.maker?.name}</h3>
                                                <p className="text-sm text-gray-400 flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {new Date(order.created_at).toLocaleString('id-ID', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })} WIB
                                                </p>
                                            </div>
                                        </div>
                                        <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase ${color === 'orange' ? 'bg-orange-500 text-white' :
                                                color === 'blue' ? 'bg-blue-600 text-white' :
                                                    color === 'green' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                                            }`}>
                                            {getStatusLabel(order.status)}
                                        </span>
                                    </div>

                                    {/* Order Items */}
                                    <div className="bg-gray-50/50 rounded-2xl p-6 space-y-4">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Detail Pesanan:</p>
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center text-gray-700">
                                                <span className="font-medium">{order.quantity}x {order.product?.name}</span>
                                                <span className="font-bold">Rp {order.total_price.toLocaleString('id-ID')}</span>
                                            </div>
                                            {order.description && (
                                                <div className="pt-2 text-sm text-gray-500 italic">
                                                    "{order.description}"
                                                </div>
                                            )}
                                        </div>
                                        <div className="pt-4 border-t border-gray-200/50 flex justify-between items-center">
                                            <span className="text-sm font-bold text-gray-900">Total Bayar:</span>
                                            <span className={`text-xl font-bold ${color === 'orange' ? 'text-orange-600' : 'text-gray-900'}`}>
                                                Rp {order.total_price.toLocaleString('id-ID')}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    {order.status === 'pending' && (
                                        <div className="flex gap-4">
                                            <button
                                                onClick={() => cancelOrder(order.id)}
                                                className="flex-1 flex items-center justify-center gap-2 bg-white border border-red-100 text-red-500 py-4 rounded-2xl font-bold hover:bg-red-50 transition-all active:scale-[0.98]"
                                            >
                                                <XCircle className="w-5 h-5" />
                                                Batalkan Pesanan
                                            </button>
                                        </div>
                                    )}

                                    {order.status !== 'pending' && (
                                        <div className="flex justify-end">
                                            <button className="text-orange-600 font-bold text-sm flex items-center gap-1 hover:underline">
                                                Lihat Rincian
                                                <ChevronRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })
                ) : (
                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                        <p className="text-gray-400 font-medium">Tidak ada pesanan di kategori ini.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
