'use client'

import React, { useState } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { format, isSameDay } from 'date-fns'
import {
    ArrowLeft,
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight,
    Search,
    User,
    Clock
} from 'lucide-react'
import Link from 'next/link'

export default function CalendarContent({ userData, user }) {
    const [date, setDate] = useState(new Date())

    // Dummy data for orders on specific dates
    const orders = [
        { id: 1, customer: 'Ibu Siti Aminah', items: '2x Keripik Pisang', total: 30000, date: new Date() },
        { id: 2, customer: 'Bapak Bambang', items: '5x Keripik Singkong', total: 75000, date: new Date() },
        { id: 3, customer: 'Teh Ratna', items: '3x Makaroni Pedas', total: 45000, date: new Date(new Date().setDate(new Date().getDate() - 2)) },
    ]

    const ordersOnSelectedDate = orders.filter(order => isSameDay(order.date, date))

    // Function to style dates with orders
    const tileClassName = ({ date: tileDate, view }) => {
        if (view === 'month') {
            const hasOrder = orders.some(order => isSameDay(order.date, tileDate))
            if (hasOrder) {
                return 'has-order'
            }
        }
        return null
    }

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-8">
            <style jsx global>{`
                .react-calendar {
                    width: 100%;
                    border: none;
                    background: white;
                    font-family: inherit;
                    border-radius: 2rem;
                    padding: 1.5rem;
                    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05);
                }
                .react-calendar__navigation {
                    margin-bottom: 2rem;
                }
                .react-calendar__navigation button {
                    color: #111827;
                    font-weight: 700;
                    font-size: 1.125rem;
                }
                .react-calendar__navigation button:enabled:hover,
                .react-calendar__navigation button:enabled:focus {
                    background-color: #f9fafb;
                    border-radius: 1rem;
                }
                .react-calendar__month-view__weekdays {
                    font-weight: 700;
                    text-transform: uppercase;
                    font-size: 0.75rem;
                    color: #9ca3af;
                }
                .react-calendar__month-view__weekdays__weekday abbr {
                    text-decoration: none;
                    letter-spacing: 0.05em;
                }
                .react-calendar__tile {
                    padding: 1.25rem 0.5rem;
                    font-weight: 600;
                    color: #374151;
                    border-radius: 1rem;
                    transition: all 0.2s;
                }
                .react-calendar__tile:enabled:hover,
                .react-calendar__tile:enabled:focus {
                    background-color: #f3f4f6;
                    color: #111827;
                }
                .react-calendar__tile--now {
                    background: #fff7ed;
                    color: #f97316;
                }
                .react-calendar__tile--active {
                    background: #f97316 !important;
                    color: white !important;
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
                    width: 6px;
                    height: 6px;
                    background-color: #f97316;
                    border-radius: 50%;
                }
            `}</style>

            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/dashboard/order" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft className="w-6 h-6 text-gray-900" />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Kalender Pesanan</h1>
                    <p className="text-gray-400 mt-1">Lihat jadwal pesanan Anda</p>
                </div>
            </div>

            {/* Calendar Section */}
            <div className="bg-white rounded-[2.5rem] p-4 border border-gray-100 shadow-sm">
                <Calendar
                    onChange={setDate}
                    value={date}
                    locale="id-ID"
                    tileClassName={tileClassName}
                    next2Label={null}
                    prev2Label={null}
                />
            </div>

            {/* Events Section */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-900">
                        Pesanan pada {format(date, 'd MMMM yyyy')}
                    </h3>
                </div>

                <div className="space-y-4">
                    {ordersOnSelectedDate.length > 0 ? (
                        ordersOnSelectedDate.map(order => (
                            <div key={order.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between hover:border-orange-200 transition-colors group">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
                                        <User className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">{order.customer}</h4>
                                        <p className="text-sm text-gray-400 mt-0.5">{order.items}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-lg font-bold text-orange-600">Rp {order.total.toLocaleString('id-ID')}</div>
                                    <div className="text-xs text-gray-400 mt-1 flex items-center gap-1 justify-end">
                                        <Clock className="w-3 h-3" />
                                        10:30 WIB
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-16 bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                                <CalendarIcon className="w-6 h-6" />
                            </div>
                            <p className="text-gray-400 font-medium italic">Tidak ada event</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
