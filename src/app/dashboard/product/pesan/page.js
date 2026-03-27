"use client";

import React, { useState, useEffect, Suspense } from "react";
import { ArrowLeft, Send, Search, User, Package, MessageSquare, Loader2, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { createNotification } from "@/lib/utils/notif";

function PesanForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const supabase = createClient();

    const [loading, setLoading] = useState(false);
    const [fetchingProducts, setFetchingProducts] = useState(false);
    const [products, setProducts] = useState([]);
    const [userId, setUserId] = useState(null);
    const [sellerName, setSellerName] = useState("");

    const productIdParam = searchParams.get("product_id");
    const productNameParam = searchParams.get("name");
    const productPriceParam = searchParams.get("price");
    const makerIdParam = searchParams.get("maker_id");
    const makerNameParam = searchParams.get("maker_name");

    const [formData, setFormData] = useState({
        productId: productIdParam || "",
        productName: productNameParam || "",
        price: productPriceParam || "",
        makerId: makerIdParam || "",
        makerName: makerNameParam || "",
        quantity: "",
        notes: ""
    });

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUserId(user.id);
                // Fetch seller name
                const { data: profile } = await supabase
                    .from('users_v2')
                    .select('name')
                    .eq('id', user.id)
                    .single();
                if (profile) setSellerName(profile.name);
            }
        };
        getUser();

        if (!productIdParam) {
            fetchProducts();
        }
    }, [productIdParam, supabase.auth]);

    const fetchProducts = async () => {
        setFetchingProducts(true);
        try {
            const { data, error } = await supabase
                .from('products_v2')
                .select('*, maker:users_v2(name)');
            if (error) throw error;
            setProducts(data || []);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setFetchingProducts(false);
        }
    };

    const handleProductSelect = (e) => {
        const selectedId = e.target.value;
        const product = products.find(p => p.id === selectedId);
        if (product) {
            setFormData({
                ...formData,
                productId: product.id,
                productName: product.name,
                price: product.price,
                makerId: product.maker_id,
                makerName: product.maker?.name || ""
            });
        } else {
            setFormData({
                ...formData,
                productId: "",
                productName: "",
                price: "",
                makerId: "",
                makerName: ""
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!userId) {
            alert("Silakan masuk terlebih dahulu.");
            return;
        }

        if (!formData.productId) {
            alert("Silakan pilih produk.");
            return;
        }

        const qty = parseInt(formData.quantity);
        if (isNaN(qty) || qty <= 0) {
            alert("Jumlah pesanan harus lebih dari 0.");
            return;
        }

        setLoading(true);
        try {
            const totalPrice = qty * formData.price;
            const { error } = await supabase
                .from('pesanan_v2')
                .insert({
                    seller_id: userId,
                    maker_id: formData.makerId,
                    product_id: formData.productId,
                    price: formData.price,
                    quantity: qty,
                    total_price: totalPrice,
                    description: formData.notes,
                    status: 'pending'
                });

            if (error) throw error;

            // Send Notification to Maker
            await createNotification(
                formData.makerId,
                'Pesanan Baru',
                `Seller ${sellerName || 'seseorang'} telah membuat pesanan baru: ${qty}x ${formData.productName}.`,
                null
            );

            alert("Pesanan berhasil dikirim!");
            router.push('/dashboard/order');
        } catch (error) {
            console.error('Error submitting order:', error);
            alert("Gagal mengirim pesanan: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const totalPrice = (parseInt(formData.quantity) || 0) * (formData.price || 0);

    return (
        <div className="min-h-screen bg-[#FDFDFD] p-4 md:p-8 lg:p-12">
            <div className="max-w-7xl mx-auto space-y-10">
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
                            <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic">Buat Pesanan</h1>
                            <p className="text-gray-400 font-medium">Pesan jajan langsung ke Maker</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Left Column: Product Selection */}
                    <div className="lg:col-span-2 space-y-10">
                        <div className="bg-white rounded-[3.5rem] p-8 md:p-12 border border-gray-100 shadow-2xl shadow-gray-100/50 space-y-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Product Selection */}
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-gray-400 uppercase flex items-center gap-2 ml-1 tracking-widest">
                                        <Package className="w-4 h-4" />
                                        Pilih Jajan
                                    </label>
                                    {productIdParam ? (
                                        <div className="w-full px-6 py-4 bg-orange-50 border border-orange-100/50 rounded-3xl font-black text-orange-600 text-lg flex justify-between items-center italic">
                                            <span>{formData.productName}</span>
                                            <span className="text-orange-600">Rp {Number(formData.price).toLocaleString('id-ID')}</span>
                                        </div>
                                    ) : (
                                        <div className="relative">
                                            <select
                                                required
                                                value={formData.productId}
                                                onChange={handleProductSelect}
                                                className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-3xl focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:bg-white focus:border-orange-500 transition-all font-bold text-gray-900 appearance-none"
                                            >
                                                <option value="">-- Pilih Produk --</option>
                                                {products.map(p => (
                                                    <option key={p.id} value={p.id}>
                                                        {p.name} - Rp {p.price.toLocaleString('id-ID')} ({p.maker?.name})
                                                    </option>
                                                ))}
                                            </select>
                                            {fetchingProducts && (
                                                <div className="absolute right-6 top-1/2 -translate-y-1/2">
                                                    <Loader2 className="w-5 h-5 animate-spin text-orange-600" />
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Maker Info */}
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-gray-400 uppercase flex items-center gap-2 ml-1 tracking-widest">
                                        <User className="w-4 h-4" />
                                        Pembuat (Maker)
                                    </label>
                                    <input
                                        type="text"
                                        readOnly
                                        value={formData.makerName || "Pilih jajan dahulu"}
                                        className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-3xl font-bold text-gray-400 cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            {/* Additional Notes */}
                            <div className="space-y-3">
                                <label className="text-xs font-black text-gray-400 uppercase flex items-center gap-2 ml-1 tracking-widest">
                                    <MessageSquare className="w-4 h-4" />
                                    Tambahkan Catatan
                                </label>
                                <textarea
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-3xl focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:bg-white focus:border-orange-500 transition-all font-bold text-gray-900 min-h-[160px]"
                                    placeholder="Tuliskan permintaan khusus Anda di sini..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Order Summary & Action */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-xl shadow-gray-100/50 space-y-8 sticky top-24">
                            <h3 className="text-2xl font-black text-gray-900 tracking-tight uppercase italic border-b border-gray-50 pb-4">Ringkasan Pesanan</h3>

                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-gray-400 uppercase flex items-center gap-2 ml-1 tracking-widest">
                                        <Search className="w-4 h-4" />
                                        Jumlah (Pcs)
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        min="1"
                                        value={formData.quantity}
                                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                        className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-3xl focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:bg-white focus:border-orange-500 transition-all font-black text-2xl text-gray-900"
                                        placeholder="0"
                                    />
                                </div>

                                <div className="p-8 bg-orange-600 rounded-[2.5rem] text-white shadow-xl shadow-orange-200 space-y-2">
                                    <p className="text-xs font-black uppercase tracking-widest text-orange-200">Total Pembayaran</p>
                                    <p className="text-4xl font-black italic tracking-tighter">
                                        Rp {totalPrice.toLocaleString('id-ID')}
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-5 bg-orange-600 text-white rounded-[2rem] font-black text-lg hover:bg-orange-700 transition-all shadow-2xl shadow-orange-100 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 uppercase tracking-widest"
                                >
                                    {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
                                    {loading ? "Mengirim..." : "Kirim Pesanan"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => router.back()}
                                    className="w-full py-5 bg-gray-100 text-gray-500 rounded-[2rem] font-black text-lg hover:bg-gray-200 transition-all flex items-center justify-center gap-3 active:scale-95 uppercase tracking-widest"
                                >
                                    <X className="w-6 h-6" />
                                    Batalkan
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function PesanJajanPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="w-10 h-10 animate-spin text-orange-600" /></div>}>
            <PesanForm />
        </Suspense>
    );
}
