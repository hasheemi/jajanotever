'use client'

import React, { useState, useEffect } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { format, isSameDay } from 'date-fns'
import { id } from 'date-fns/locale'
import {
    ArrowLeft,
    Calendar as CalendarIcon,
    User,
    Clock,
    Loader2
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function CalendarContent({ userData, user }) {
    const router = useRouter()
    const supabase = createClient()
    const [date, setDate] = useState(new Date())
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchOrders()
    }, [user.id])

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
            console.error('Error fetching orders for calendar:', error)
        } finally {
            setLoading(false)
        }
    }

    const ordersOnSelectedDate = orders.filter(order =>
        isSameDay(new Date(order.created_at), date)
    )

    const tileClassName = ({ date: tileDate, view }) => {
        if (view === 'month') {
            const hasOrder = orders.some(order => isSameDay(new Date(order.created_at), tileDate))
            if (hasOrder) {
                return 'has-order'
            }
        }
        return null
    }

    return (
        <div className="p-4 md:p-8 lg:p-12 max-w-7xl mx-auto space-y-10">
            <style jsx global>{`
                .react-calendar {
                    width: 100%;
                    border: none;
                    background: transparent;
                    font-family: inherit;
                }
                .react-calendar__navigation {
                    margin-bottom: 2rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .react-calendar__navigation button {
                    color: #111827;
                    font-weight: 900 !important;
                    font-size: 1.5rem !important;
                    text-transform: uppercase;
                    font-style: italic;
                    letter-spacing: -0.05em;
                }
                .react-calendar__navigation button:enabled:hover,
                .react-calendar__navigation button:enabled:focus {
                    background-color: white;
                    border-radius: 1.5rem;
                }
                .react-calendar__month-view__weekdays {
                    font-weight: 900;
                    text-transform: uppercase;
                    font-size: 0.75rem;
                    color: #9ca3af;
                    margin-bottom: 1rem;
                }
                .react-calendar__month-view__weekdays__weekday abbr {
                    text-decoration: none;
                    letter-spacing: 0.1em;
                }
                .react-calendar__tile {
                    padding: 2rem 0.5rem !important;
                    font-weight: 900;
                    color: #374151;
                    border-radius: 2rem;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    font-size: 1.125rem;
                }
                .react-calendar__tile:enabled:hover,
                .react-calendar__tile:enabled:focus {
                    background-color: white;
                    color: #f97316;
                    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
                    transform: scale(1.05);
                }
                .react-calendar__tile--now {
                    background: #fff7ed !important;
                    color: #f97316 !important;
                    border: 2px solid #fdba74;
                }
                .react-calendar__tile--active {
                    background: #ea580c !important;
                    color: white !important;
                    box-shadow: 0 20px 25px -5px rgb(234 88 12 / 0.3);
                }
                .has-order {
                    position: relative;
                }
                .has-order:not(.react-calendar__tile--active)::after {
                    content: '';
                    position: absolute;
                    bottom: 20%;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 8px;
                    height: 8px;
                    background-color: #f97316;
                    border-radius: 50%;
                    box-shadow: 0 0 10px #f97316;
                }
            `}</style>

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="p-3 hover:bg-white border border-transparent hover:border-gray-100 rounded-2xl transition-all shadow-sm group"
                    >
                        <ArrowLeft className="w-6 h-6 text-gray-400 group-hover:text-orange-600" />
                    </button>
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic leading-none">Kalender Pesanan</h1>
                        <p className="text-gray-400 font-medium mt-2">Lihat jadwal dan riwayat pesanan Anda</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Left Column: Calendar */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-[3.5rem] p-8 md:p-12 border border-gray-100 shadow-2xl shadow-gray-100/50">
                        <Calendar
                            onChange={setDate}
                            value={date}
                            locale="id-ID"
                            tileClassName={tileClassName}
                            next2Label={null}
                            prev2Label={null}
                        />
                    </div>
                </div>

                {/* Right Column: Events */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-xl shadow-gray-100/50 space-y-8">
                        <div>
                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest italic mb-2">Terpilih:</p>
                            <h3 className="text-2xl font-black text-gray-900 uppercase italic tracking-tighter">
                                {format(date, 'd MMMM yyyy', { locale: id })}
                            </h3>
                        </div>

                        <div className="space-y-4 max-h-[500px] overflow-auto pr-2 custom-scrollbar">
                            {loading ? (
                                <div className="flex flex-col items-center justify-center py-20 gap-4">
                                    <Loader2 className="w-10 h-10 text-orange-600 animate-spin" />
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Memuat...</p>
                                </div>
                            ) : ordersOnSelectedDate.length > 0 ? (
                                ordersOnSelectedDate.map(order => (
                                    <div key={order.id} className="p-6 rounded-[2rem] bg-orange-50/50 border border-orange-100/50 group hover:scale-[1.02] transition-all">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-10 h-10 rounded-xl bg-white border border-orange-100 flex items-center justify-center text-orange-600 shadow-sm">
                                                <User className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h4 className="font-black text-gray-900 text-sm uppercase italic tracking-tight">{order.seller?.name}</h4>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <Clock className="w-3 h-3 text-gray-400" />
                                                    <span className="text-[10px] font-black text-gray-400 uppercase">
                                                        {new Date(order.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="pt-4 border-t border-orange-100/30 flex justify-between items-end">
                                            <div>
                                                <p className="text-[10px] font-black text-orange-900/40 uppercase tracking-widest">Pesanan:</p>
                                                <p className="font-bold text-gray-900 text-sm">{order.quantity}x {order.product?.name}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-black text-orange-600 italic tracking-tighter">Rp {order.total_price.toLocaleString('id-ID')}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-20 bg-gray-50/50 rounded-[2.5rem] border border-dashed border-gray-100 flex flex-col items-center justify-center gap-4">
                                    <CalendarIcon className="w-10 h-10 text-gray-100" />
                                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest italic">Tidak ada pesanan</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
