'use client'

import React, { useState, useEffect } from 'react'
import {
    ArrowLeft,
    Search,
    CheckCircle2,
    XCircle,
    ChevronRight,
    Calendar,
    User,
    Loader2,
    Package,
    Clock
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { createNotification } from '@/lib/utils/notif'

export default function OrdersContent({ userData, user }) {
    const router = useRouter()
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
                    seller:users_v2!pesanan_v2_seller_id_fkey(name),
                    product:products_v2(name)
                `)
                .eq('maker_id', user.id)
                .order('created_at', { ascending: false })

            if (error) throw error
            setOrders(data || [])
        } catch (error) {
            console.error('Error fetching orders:', error)
        } finally {
            setLoading(false)
        }
    }

    const updateStatus = async (orderId, newStatus) => {
        setUpdating(orderId)
        try {
            const { error } = await supabase
                .from('pesanan_v2')
                .update({ status: newStatus })
                .eq('id', orderId)

            if (error) throw error

            // Send Notification to Seller
            const order = orders.find(o => o.id === orderId)
            if (order) {
                const statusLabels = {
                    accepted: 'diterima',
                    rejected: 'ditolak',
                    shipped: 'dikirim',
                    completed: 'selesai'
                }
                const label = statusLabels[newStatus] || newStatus
                await createNotification(
                    order.seller_id,
                    `Pesanan ${label.toUpperCase()}`,
                    `Maker ${userData?.name || 'seseorang'} telah memproses pesanan ${order.product?.name} Anda menjadi: ${label}.`,
                    orderId
                )
            }

            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o))
        } catch (error) {
            console.error('Error updating status:', error)
            alert('Gagal memperbarui status: ' + error.message)
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
        order.seller?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
            case 'pending': return 'PESANAN BARU'
            case 'accepted': return 'DITERIMA'
            case 'shipped': return 'DIKIRIM'
            case 'completed': return 'SELESAI'
            case 'rejected': return 'DITOLAK'
            case 'cancelled': return 'DIBATALKAN'
            default: return status.toUpperCase()
        }
    }

    return (
        <div className="p-4 md:p-8 lg:p-12 max-w-7xl mx-auto space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="p-3 hover:bg-white border border-transparent hover:border-gray-100 rounded-2xl transition-all shadow-sm group"
                    >
                        <ArrowLeft className="w-6 h-6 text-gray-400 group-hover:text-orange-600" />
                    </button>
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic leading-none">Kotak Pesanan</h1>
                        <p className="text-gray-400 font-medium mt-2">Kelola pesanan masuk dari pelanggan Anda</p>
                    </div>
                </div>

                <button
                    onClick={() => router.push('/dashboard/calendar')}
                    className="flex items-center justify-center gap-3 bg-white border border-gray-100 text-gray-900 px-4 py-3 md:px-8 md:py-5 rounded-[2rem] font-black text-lg hover:bg-orange-600 hover:text-white hover:border-orange-600 transition-all shadow-xl shadow-gray-100/50 active:scale-95 uppercase tracking-widest italic"
                >
                    <Calendar className="w-6 h-6" />
                    Cek Kalender
                </button>
            </div>

            {/* Tabs and Search */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <div className="relative group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400 group-focus-within:text-orange-600 transition-colors" />
                        <input
                            type="text"
                            placeholder="Cari nama penjual atau produk..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-16 pr-8 py-5 bg-white border border-gray-100 rounded-[2.5rem] focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all shadow-xl shadow-gray-100/50 font-bold text-gray-900 text-lg"
                        />
                    </div>
                </div>
                <div className="lg:col-span-1">
                    <div className="flex bg-gray-100/50 p-2 rounded-[2.5rem] border border-gray-100 h-full items-center">
                        {tabs.map((tab) => (
                            <button
                                key={tab.name}
                                onClick={() => setActiveTab(tab.name)}
                                className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-[2rem] text-xs font-black transition-all uppercase tracking-widest ${activeTab === tab.name
                                    ? 'bg-orange-600 text-white shadow-xl shadow-orange-200 italic'
                                    : 'text-gray-400 hover:text-gray-600 hover:bg-white/50'
                                    }`}
                            >
                                {tab.name}
                                {tab.count > 0 && (
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeTab === tab.name ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-500'}`}>
                                        {tab.count}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Orders List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {loading ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-32 space-y-6">
                        <Loader2 className="w-16 h-16 text-orange-600 animate-spin" />
                        <p className="text-gray-400 font-black uppercase tracking-widest italic">Memuat pesanan...</p>
                    </div>
                ) : filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => {
                        const color = getStatusColor(order.status)
                        return (
                            <div key={order.id} className="bg-white rounded-[3.5rem] border border-gray-100 shadow-2xl shadow-gray-100/50 overflow-hidden relative group hover:scale-[1.01] transition-all">
                                {updating === order.id && (
                                    <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
                                        <Loader2 className="w-12 h-12 text-orange-600 animate-spin" />
                                    </div>
                                )}
                                <div className="p-10 space-y-8">
                                    {/* Order Header */}
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-5">
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${color === 'orange' ? 'bg-orange-100 text-orange-600 shadow-orange-100' :
                                                color === 'blue' ? 'bg-blue-100 text-blue-600 shadow-blue-100' :
                                                    color === 'green' ? 'bg-green-100 text-green-600 shadow-green-100' : 'bg-red-100 text-red-600 shadow-red-100'
                                                }`}>
                                                <User className="w-8 h-8" />
                                            </div>
                                            <div>
                                                <h3 className="font-black text-gray-900 text-2xl italic tracking-tighter">{order.seller?.name}</h3>
                                                <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] flex items-center gap-2 mt-1">
                                                    <Clock className="w-3.5 h-3.5" />
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
                                        <span className={`text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest italic shadow-sm leading-none ${color === 'orange' ? 'bg-orange-500 text-white animate-pulse' :
                                            color === 'blue' ? 'bg-blue-600 text-white' :
                                                color === 'green' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                                            }`}>
                                            {getStatusLabel(order.status)}
                                        </span>
                                    </div>

                                    {/* Order Items */}
                                    <div className="bg-orange-50/50 rounded-[2.5rem] p-8 space-y-6 border border-orange-100/50">
                                        <p className="text-[10px] font-black text-orange-900/40 uppercase tracking-[0.3em] italic">Detail Pesanan:</p>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center text-gray-900">
                                                <span className="font-black text-xl italic tracking-tight">{order.quantity}x {order.product?.name}</span>
                                                <span className="font-black text-2xl italic tracking-tighter text-orange-600">Rp {order.total_price.toLocaleString('id-ID')}</span>
                                            </div>
                                            {order.description && (
                                                <div className="pt-4 border-t border-orange-100/30 text-sm text-gray-500 italic font-medium">
                                                    "{order.description}"
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    {order.status === 'pending' && (
                                        <div className="flex gap-4">
                                            <button
                                                onClick={() => updateStatus(order.id, 'accepted')}
                                                className="flex-1 flex items-center justify-center gap-3 bg-orange-600 text-white py-5 rounded-[2rem] font-black text-lg hover:bg-orange-700 transition-all shadow-2xl shadow-orange-100 active:scale-95 uppercase tracking-widest italic"
                                            >
                                                <CheckCircle2 className="w-6 h-6" />
                                                Terima
                                            </button>
                                            <button
                                                onClick={() => updateStatus(order.id, 'rejected')}
                                                className="px-8 flex items-center justify-center gap-3 bg-white border border-gray-100 text-gray-400 py-5 rounded-[2rem] font-black text-lg hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all active:scale-95 uppercase tracking-widest"
                                            >
                                                <XCircle className="w-6 h-6" />
                                            </button>
                                        </div>
                                    )}

                                    {order.status === 'accepted' && (
                                        <button
                                            onClick={() => updateStatus(order.id, 'shipped')}
                                            className="w-full flex items-center justify-center gap-3 bg-blue-600 text-white py-5 rounded-[2rem] font-black text-lg hover:bg-blue-700 transition-all shadow-2xl shadow-blue-100 active:scale-95 uppercase tracking-widest italic"
                                        >
                                            <Package className="w-6 h-6" />
                                            Kirim Pesanan
                                        </button>
                                    )}

                                    {order.status === 'shipped' && (
                                        <button
                                            onClick={() => updateStatus(order.id, 'completed')}
                                            className="w-full flex items-center justify-center gap-3 bg-green-600 text-white py-5 rounded-[2rem] font-black text-lg hover:bg-green-700 transition-all shadow-2xl shadow-green-100 active:scale-95 uppercase tracking-widest italic"
                                        >
                                            <CheckCircle2 className="w-6 h-6" />
                                            Selesaikan
                                        </button>
                                    )}

                                    {['completed', 'rejected', 'cancelled'].includes(order.status) && (
                                        <div className="flex justify-end">
                                            <button className="text-orange-600 font-black text-xs flex items-center gap-2 hover:underline uppercase tracking-[0.2em] italic">
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
                    <div className="col-span-full text-center py-40 bg-white rounded-[4rem] border-4 border-dashed border-gray-50 flex flex-col items-center justify-center gap-6">
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center">
                            <Package className="w-12 h-12 text-gray-200" />
                        </div>
                        <p className="text-gray-400 font-black uppercase tracking-widest italic">Tidak ada pesanan di kategori ini.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
