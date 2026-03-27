'use client'

import React, { useState, useEffect } from 'react'
import {
    User,
    Mail,
    MapPin,
    BadgeCheck,
    Save,
    Loader2,
    ArrowLeft,
    Power,
    X
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function ProfilePage() {
    const router = useRouter()
    const supabase = createClient()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [userData, setUserData] = useState(null)
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        is_jualan: true
    })

    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true)
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push('/login')
                return
            }

            const { data, error } = await supabase
                .from('users_v2')
                .select('*')
                .eq('id', user.id)
                .single()

            if (data) {
                setUserData(data)
                setFormData({
                    name: data.name || '',
                    address: data.address || data.paguyuban || '',
                    is_jualan: data.is_jualan ?? true
                })
            }
            setLoading(false)
        }
        fetchUser()
    }, [router, supabase])

    const handleSave = async (e) => {
        e.preventDefault()
        setSaving(true)
        try {
            const { data: { user } } = await supabase.auth.getUser()
            const { error } = await supabase
                .from('users_v2')
                .update({
                    name: formData.name,
                    address: formData.address,
                    is_jualan: formData.is_jualan
                })
                .eq('id', user.id)

            if (error) throw error
            alert('Profil berhasil diperbarui!')
        } catch (error) {
            console.error('Error updating profile:', error)
            alert('Gagal memperbarui profil.')
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="w-10 h-10 text-orange-600 animate-spin" />
            </div>
        )
    }

    return (
        <div className="p-4 md:p-8 lg:p-12 max-w-7xl mx-auto space-y-10">
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
                        <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic">Profil Saya</h1>
                        <p className="text-gray-400 font-medium">Kelola informasi diri Anda di Jajanote</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Left Column: Info Card */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-xl shadow-gray-100/50 flex flex-col items-center text-center">
                        <div className="w-32 h-32 bg-orange-100 rounded-[2.5rem] flex items-center justify-center text-orange-600 relative group overflow-hidden border-4 border-white shadow-lg">
                            {userData?.img ? (
                                <img src={userData.img} alt={userData.name} className="w-full h-full object-cover" />
                            ) : (
                                <User className="w-16 h-16" />
                            )}
                        </div>
                        <div className="mt-8 space-y-2">
                            <h2 className="text-2xl font-black text-gray-900 tracking-tight">{userData?.name || 'User'}</h2>
                            <p className="text-sm text-gray-400 font-bold flex items-center justify-center gap-2">
                                <Mail className="w-4 h-4" />
                                {userData?.email}
                            </p>
                        </div>
                        <div className="mt-8 pt-8 border-t border-gray-50 w-full">
                            <span className="px-4 py-2 bg-black text-white text-xs font-black rounded-full uppercase tracking-widest italic">
                                Role: {userData?.role === 'maker' ? 'Pembuat' : 'Penjual'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Right Column: Edit Form */}
                <div className="lg:col-span-2">
                    <form onSubmit={handleSave} className="bg-white rounded-[3.5rem] p-8 md:p-12 border border-gray-100 shadow-2xl shadow-gray-100/50 space-y-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Name */}
                            <div className="space-y-3">
                                <label className="text-xs font-black text-gray-400 uppercase flex items-center gap-2 ml-1 tracking-widest">
                                    <User className="w-4 h-4" />
                                    Nama Lengkap
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-3xl focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:bg-white focus:border-orange-500 transition-all font-bold text-gray-900"
                                    placeholder="Cth: Budi Santoso"
                                />
                            </div>

                            {/* Address */}
                            <div className="space-y-3">
                                <label className="text-xs font-black text-gray-400 uppercase flex items-center gap-2 ml-1 tracking-widest">
                                    <MapPin className="w-4 h-4" />
                                    Alamat / Kota
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.address}
                                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-3xl focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:bg-white focus:border-orange-500 transition-all font-bold text-gray-900"
                                    placeholder="Cth: Surabaya, Jawa Timur"
                                />
                            </div>
                        </div>

                        {/* Toggle Status */}
                        <div className="flex items-center justify-between p-8 bg-orange-50/50 rounded-[2.5rem] border border-orange-100/50">
                            <div className="flex items-center gap-5">
                                <div className={`p-4 rounded-[1.5rem] shadow-sm ${formData.is_jualan ? 'bg-orange-500 text-white shadow-orange-200' : 'bg-gray-200 text-gray-400'}`}>
                                    <Power className="w-8 h-8" />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="font-black text-gray-900 text-lg uppercase italic tracking-tighter">Status Aktivitas</h4>
                                    <p className="text-sm text-gray-500 font-medium">
                                        {formData.is_jualan ? 'Anda sedang aktif berjualan/titip.' : 'Anda sedang tidak aktif.'}
                                    </p>
                                </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer scale-125">
                                <input
                                    type="checkbox"
                                    checked={formData.is_jualan}
                                    onChange={(e) => setFormData(prev => ({ ...prev, is_jualan: e.target.checked }))}
                                    className="sr-only peer"
                                />
                                <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-orange-600"></div>
                            </label>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col md:flex-row items-center gap-4 pt-4">
                            <button
                                type="submit"
                                disabled={saving}
                                className="w-full md:flex-1 py-5 bg-orange-600 text-white rounded-[2rem] font-black text-lg hover:bg-orange-700 transition-all shadow-2xl shadow-orange-100 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 uppercase tracking-widest"
                            >
                                {saving ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />}
                                {saving ? "Menyimpan..." : "Simpan Perubahan"}
                            </button>
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="w-full md:w-auto px-10 py-5 bg-gray-100 text-gray-500 rounded-[2rem] font-black text-lg hover:bg-gray-200 transition-all flex items-center justify-center gap-3 active:scale-95 uppercase tracking-widest"
                            >
                                <X className="w-6 h-6" />
                                Batalkan
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
