'use client'

import React, { useState, useEffect } from 'react'
import {
    TrendingUp,
    Star,
    Package,
    Sparkles,
    Loader2,
    Bell
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatDistanceToNow } from 'date-fns'
import { id } from 'date-fns/locale'

export default function MakerDashboard({ userData, user }) {
    const supabase = createClient()
    const [stats, setStats] = useState({
        revenue: 0,
        bestSelling: '-',
        remainingStock: 0
    })
    const [notifications, setNotifications] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true)
            try {
                const today = new Date()
                today.setHours(0, 0, 0, 0)
                const todayStr = today.toISOString()

                // 1. Fetch Stats from titip_transaksi_v2 (Today)
                const { data: transData, error: transError } = await supabase
                    .from('titip_transaksi_v2')
                    .select('total_uang, jumlah_sisa')
                    .eq('maker_id', user.id)
                    .gte('created_at', todayStr)

                if (transError) throw transError

                const totalRevenue = transData?.reduce((acc, curr) => acc + curr.total_uang, 0) || 0
                const totalStock = transData?.reduce((acc, curr) => acc + curr.jumlah_sisa, 0) || 0

                // 2. Fetch Best-Selling (Latest Product for Maker)
                const { data: latestProduct, error: prodError } = await supabase
                    .from('products_v2')
                    .select('name')
                    .eq('maker_id', user.id)
                    .order('created_at', { ascending: false })
                    .limit(1)
                    .maybeSingle()

                // 3. Fetch Notifications from notif_v2
                const { data: notifData, error: notifError } = await supabase
                    .from('notif_v2')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false })
                    .limit(5)

                if (notifError) throw notifError

                setStats({
                    revenue: totalRevenue,
                    bestSelling: latestProduct?.name || '-',
                    remainingStock: totalStock
                })
                setNotifications(notifData || [])

            } catch (error) {
                console.error('Error fetching dashboard data:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchDashboardData()
    }, [user.id])

    return (
        <div className="p-4 md:p-8 lg:p-12 max-w-7xl mx-auto space-y-10">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic leading-none">Halo, {userData?.name || 'Maker'}!</h1>
                <p className="text-gray-400 font-medium mt-2">Berikut adalah ringkasan harian produk Anda.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-orange-50 shadow-sm relative overflow-hidden">
                    <div className="flex items-center gap-2 text-orange-600 font-bold mb-2 uppercase text-xs tracking-wider">
                        <TrendingUp className="w-4 h-4" />
                        Total Pendapatan
                    </div>
                    {loading ? (
                        <Loader2 className="w-6 h-6 animate-spin text-orange-200" />
                    ) : (
                        <div className="text-3xl font-bold text-gray-900 leading-none">
                            Rp {stats.revenue.toLocaleString('id-ID')}
                        </div>
                    )}
                </div>
                <div className="bg-white p-6 rounded-2xl border border-orange-50 shadow-sm relative overflow-hidden">
                    <div className="flex items-center gap-2 text-orange-600 font-bold mb-2 uppercase text-xs tracking-wider">
                        <Star className="w-4 h-4" />
                        Produk Terlaris
                    </div>
                    {loading ? (
                        <Loader2 className="w-6 h-6 animate-spin text-orange-200" />
                    ) : (
                        <div className="text-3xl font-bold text-gray-900 leading-none truncate pr-2" title={stats.bestSelling}>
                            {stats.bestSelling}
                        </div>
                    )}
                </div>
                <div className="bg-white p-6 rounded-2xl border border-orange-50 shadow-sm relative overflow-hidden">
                    <div className="flex items-center gap-2 text-orange-600 font-bold mb-2 uppercase text-xs tracking-wider">
                        <Package className="w-4 h-4" />
                        Stok Tersisa
                    </div>
                    {loading ? (
                        <Loader2 className="w-6 h-6 animate-spin text-orange-200" />
                    ) : (
                        <div className="text-3xl font-bold text-gray-900 leading-none">
                            {stats.remainingStock} Produk
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Weekly Sales Chart Placeholder */}
                <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-bold text-gray-900">Grafik Penjualan Mingguan</h3>
                        <div className="bg-gray-50 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-600">Minggu Ini</div>
                    </div>

                    <div className="flex items-end justify-between h-48 gap-4 px-2">
                        {[
                            { day: 'Sen', value: 40 },
                            { day: 'Sel', value: 20 },
                            { day: 'Rab', value: 30 },
                            { day: 'Kam', value: 25 },
                            { day: 'Jum', value: 50 },
                            { day: 'Sab', value: 90 },
                            { day: 'Min', value: 75 }
                        ].map((item) => (
                            <div key={item.day} className="flex-1 flex flex-col items-center gap-4">
                                <div
                                    className="w-full bg-orange-500 rounded-t-2xl transition-all duration-500 ease-out hover:bg-orange-600"
                                    style={{ height: `${item.value}%` }}
                                />
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-tighter">{item.day}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Notifications Panel */}
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-black text-gray-900 uppercase italic tracking-tighter">Notifikasi</h3>
                        {notifications.length > 0 && (
                            <span className="bg-orange-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest italic shadow-lg shadow-orange-100 animate-pulse">
                                {notifications.length} Baru
                            </span>
                        )}
                    </div>

                    <div className="space-y-4">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-12 gap-2">
                                <Loader2 className="w-8 h-8 animate-spin text-orange-200" />
                                <p className="text-xs text-gray-400 font-medium">Memuat data...</p>
                            </div>
                        ) : notifications.length > 0 ? (
                            notifications.map((notif) => (
                                <div key={notif.id} className={`p-5 rounded-2xl border-l-[3px] transition-all ${notif.is_read ? 'bg-gray-50/50 border-gray-200' : 'bg-orange-50/50 border-orange-500'}`}>
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex-1">
                                            <h4 className="font-black text-gray-900 text-sm leading-tight italic">{notif.title}</h4>
                                            <p className="text-xs text-gray-500 mt-1 line-clamp-2 font-medium">{notif.message}</p>
                                            <p className="text-[10px] text-gray-400 mt-3 font-black uppercase tracking-widest italic">
                                                {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true, locale: id })}
                                            </p>
                                        </div>
                                        {!notif.is_read && <div className="w-2 h-2 bg-orange-500 rounded-full shrink-0 mt-1" />}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12">
                                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Bell className="w-6 h-6 text-gray-200" />
                                </div>
                                <p className="text-xs text-gray-400 font-medium">Tidak ada notifikasi baru.</p>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => window.location.href = '/dashboard/history'}
                        className="w-full text-center text-orange-600 font-black text-xs mt-10 uppercase tracking-widest hover:underline italic"
                    >
                        Lihat Semua Riwayat
                    </button>
                </div>
            </div>

            {/* Ringkasan Pintar */}
            <div className="bg-[#FFF1E0] p-8 rounded-3xl border border-orange-100/50">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-200">
                        <Sparkles className="w-6 h-6 fill-current" />
                    </div>
                    <h3 className="font-black text-orange-900 uppercase italic tracking-widest">Ringkasan Pintar Jajanote</h3>
                </div>
                <p className="text-orange-900/80 leading-relaxed font-bold italic">
                    {stats.revenue > 0
                        ? `Penjualan Anda hari ini mencapai Rp ${stats.revenue.toLocaleString('id-ID')}. Produk ${stats.bestSelling} merupakan produk terbaru Anda yang menarik perhatian. Semangat jualan, ${userData?.name || 'Bu Maker'}!`
                        : `Belum ada penjualan tercatat hari ini. Jangan menyerah, ${userData?.name || 'Bu Maker'}! Pastikan produk Anda sudah dikirim ke Seller ya.`}
                </p>
            </div>
        </div>
    )
}
