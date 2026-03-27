'use client'

import React, { useState, useEffect } from 'react'
import {
    TrendingUp,
    Star,
    Package,
    Sun,
    Cloud,
    CloudRain,
    MoreVertical,
    User,
    Check,
    X,
    Loader2,
    Bell,
    MapPin
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatDistanceToNow } from 'date-fns'
import { id } from 'date-fns/locale'

export default function SellerDashboard({ userData, user }) {
    const supabase = createClient()
    const [stats, setStats] = useState({
        revenue: 0,
        bestSelling: '-',
        remainingStock: 0
    })
    const [notifications, setNotifications] = useState([])
    const [titipanList, setTitipanList] = useState([])
    const [weather, setWeather] = useState({
        location: 'Surabaya',
        temp: '--',
        condition: 'Memuat...'
    })
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
                    .eq('seller_id', user.id)
                    .gte('created_at', todayStr)

                if (transError) throw transError

                const totalRevenue = transData?.reduce((acc, curr) => acc + curr.total_uang, 0) || 0
                const totalStock = transData?.reduce((acc, curr) => acc + curr.jumlah_sisa, 0) || 0

                // 2. Fetch Best-Selling (Latest Titipan Product for Seller)
                const { data: latestTitip, error: titipError } = await supabase
                    .from('titip_v2')
                    .select('product_name')
                    .eq('seller_id', user.id)
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

                // 4. Fetch Titipan List
                const { data: listData, error: listError } = await supabase
                    .from('titip_v2')
                    .select(`
                        *,
                        maker:users_v2!titip_v2_maker_id_fkey(name)
                    `)
                    .eq('seller_id', user.id)
                    .eq('is_active', true)
                    .order('created_at', { ascending: false })
                    .limit(3)

                setStats({
                    revenue: totalRevenue,
                    bestSelling: latestTitip?.product_name || '-',
                    remainingStock: totalStock
                })
                setNotifications(notifData || [])
                setTitipanList(listData || [])

                // Fetch Weather
                const location = userData?.address || userData?.paguyuban || 'Surabaya'
                fetchWeather(location)

            } catch (error) {
                console.error('Error fetching dashboard data:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchDashboardData()
    }, [user.id, userData])

    const fetchWeather = async (location) => {
        try {
            // Simplified weather fetch using wttr.in
            const res = await fetch(`https://wttr.in/${encodeURIComponent(location)}?format=j1`)
            if (res.ok) {
                const data = await res.json()
                const current = data.current_condition[0]
                setWeather({
                    location: location,
                    temp: current.temp_C,
                    condition: current.lang_id?.[0]?.value || current.weatherDesc[0].value
                })
            }
        } catch (error) {
            console.error('Error fetching weather:', error)
            setWeather(prev => ({ ...prev, condition: 'Gagal memuat' }))
        }
    }

    const getWeatherIcon = (condition) => {
        const cond = condition.toLowerCase()
        if (cond.includes('rain')) return <CloudRain className="w-24 h-24 stroke-[1.5]" />
        if (cond.includes('cloud')) return <Cloud className="w-24 h-24 stroke-[1.5]" />
        return <Sun className="w-24 h-24 stroke-[1.5]" />
    }

    return (
        <div className="p-4 md:p-8 lg:p-12 max-w-7xl mx-auto space-y-10">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic leading-none">Halo, {userData?.name || 'Seller'}!</h1>
                <p className="text-gray-400 font-medium mt-2">Berikut adalah ringkasan harian Toko Anda.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-8 rounded-[2rem] border border-orange-50 shadow-xl shadow-orange-100/20 relative overflow-hidden group hover:scale-[1.02] transition-all">
                    <div className="flex items-center gap-2 text-orange-600 font-black mb-4 uppercase text-[10px] tracking-[0.2em] italic">
                        <TrendingUp className="w-4 h-4" />
                        Total Pendapatan
                    </div>
                    {loading ? (
                        <Loader2 className="w-6 h-6 animate-spin text-orange-200" />
                    ) : (
                        <div className="text-4xl font-black text-gray-900 leading-none italic">
                            Rp {stats.revenue.toLocaleString('id-ID')}
                        </div>
                    )}
                </div>
                <div className="bg-white p-8 rounded-[2rem] border border-orange-50 shadow-xl shadow-orange-100/20 relative overflow-hidden group hover:scale-[1.02] transition-all">
                    <div className="flex items-center gap-2 text-orange-600 font-black mb-4 uppercase text-[10px] tracking-[0.2em] italic">
                        <Star className="w-4 h-4" />
                        Titipan Terlaris
                    </div>
                    {loading ? (
                        <Loader2 className="w-6 h-6 animate-spin text-orange-200" />
                    ) : (
                        <div className="text-3xl font-black text-gray-900 leading-none truncate pr-2 italic" title={stats.bestSelling}>
                            {stats.bestSelling}
                        </div>
                    )}
                </div>
                <div className="bg-white p-8 rounded-[2rem] border border-orange-50 shadow-xl shadow-orange-100/20 relative overflow-hidden group hover:scale-[1.02] transition-all">
                    <div className="flex items-center gap-2 text-orange-600 font-black mb-4 uppercase text-[10px] tracking-[0.2em] italic">
                        <Package className="w-4 h-4" />
                        Stok Tersisa
                    </div>
                    {loading ? (
                        <Loader2 className="w-6 h-6 animate-spin text-orange-200" />
                    ) : (
                        <div className="text-4xl font-black text-gray-900 leading-none italic">
                            {stats.remainingStock} Produk
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Weather & Titipan List */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Weather Widget */}
                    <div className="bg-orange-500 p-8 rounded-3xl text-white shadow-lg relative overflow-hidden flex items-center justify-between">
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 opacity-80 mb-4 bg-black/10 w-fit px-4 py-1.5 rounded-full backdrop-blur-md">
                                <MapPin className="w-4 h-4" />
                                <span className="text-xs font-black uppercase tracking-[0.2em]">{weather.location}</span>
                            </div>
                            <h3 className="text-7xl font-black mb-2 tracking-tighter italic">{weather.temp}°C</h3>
                            <p className="text-2xl font-black opacity-90 uppercase tracking-tighter italic">{weather.condition}</p>
                        </div>
                        <div className="relative z-10">
                            {getWeatherIcon(weather.condition)}
                        </div>
                        {/* Decorative circles */}
                        <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-xl" />
                    </div>

                    {/* Titipan Maker List */}
                    <div className="bg-white p-10 rounded-[3rem] border border-gray-50 shadow-xl shadow-gray-100/50">
                        <div className="flex items-center justify-between mb-10">
                            <h3 className="text-2xl font-black text-gray-900 uppercase italic tracking-tighter">Daftar Titipan Aktif</h3>
                            <button
                                onClick={() => window.location.href = '/dashboard/product'}
                                className="text-orange-600 font-black text-xs hover:underline uppercase tracking-widest italic"
                            >
                                Lihat Semua
                            </button>
                        </div>

                        <div className="space-y-6">
                            {loading ? (
                                <div className="flex flex-col items-center justify-center py-12 gap-2">
                                    <Loader2 className="w-8 h-8 animate-spin text-orange-200" />
                                    <p className="text-xs text-gray-400 font-medium">Memuat data...</p>
                                </div>
                            ) : titipanList.length > 0 ? (
                                titipanList.map((item) => (
                                    <div key={item.id} className="flex items-center justify-between group p-3 hover:bg-orange-50/50 rounded-3xl transition-all border border-transparent hover:border-orange-100">
                                        <div className="flex items-center gap-5">
                                            <div className="w-20 h-20 bg-orange-50 rounded-3xl flex items-center justify-center border border-white shadow-sm overflow-hidden">
                                                <User className="w-10 h-10 text-orange-200" />
                                            </div>
                                            <div>
                                                <h4 className="font-black text-lg text-gray-900 italic tracking-tight leading-tight">{item.product_name}</h4>
                                                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Maker: {item.maker?.name || 'Unknown'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-8">
                                            <div className="text-right">
                                                <div className="text-2xl font-black text-gray-900 italic tracking-tighter">{item.quantity} pcs</div>
                                                <div className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em]">{item.status}</div>
                                            </div>
                                            <button className="p-2 hover:bg-white rounded-xl transition-colors border border-transparent hover:border-gray-100">
                                                <MoreVertical className="w-5 h-5 text-gray-400" />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12 bg-gray-50/50 rounded-2xl border border-dashed border-gray-100">
                                    <p className="text-xs text-gray-400 font-medium">Belum ada titipan aktif.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Notifications Panel */}
                <div className="bg-white p-10 rounded-[3rem] border border-gray-50 shadow-xl shadow-gray-100/50 flex flex-col">
                    <div className="flex items-center justify-between mb-10">
                        <h3 className="text-2xl font-black text-gray-900 uppercase italic tracking-tighter">Notifikasi</h3>
                        {notifications.length > 0 && (
                            <span className="bg-orange-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest italic animate-pulse">
                                {notifications.length} Baru
                            </span>
                        )}
                    </div>

                    <div className="space-y-4 flex-1">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-12 gap-2">
                                <Loader2 className="w-8 h-8 animate-spin text-orange-200" />
                                <p className="text-xs text-gray-400 font-medium">Memuat data...</p>
                            </div>
                        ) : notifications.length > 0 ? (
                            notifications.map((notif) => (
                                <div key={notif.id} className={`p-6 rounded-[2rem] border-l-[4px] transition-all hover:scale-[1.02] ${notif.is_read ? 'bg-gray-50/50 border-gray-200' : 'bg-orange-50/50 border-orange-500 shadow-lg shadow-orange-100/20'}`}>
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <h4 className="font-black text-gray-900 text-sm leading-tight italic">{notif.title}</h4>
                                            <p className="text-xs text-gray-500 mt-2 line-clamp-2 font-medium">{notif.message}</p>
                                            <p className="text-[10px] text-gray-400 mt-4 font-black uppercase tracking-widest italic">
                                                {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true, locale: id })}
                                            </p>
                                        </div>
                                        {!notif.is_read && <div className="w-2.5 h-2.5 bg-orange-600 rounded-full shrink-0 mt-1 shadow-sm" />}
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
        </div>
    )
}
