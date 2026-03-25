"use client";

import React, { useState } from "react";
import { ArrowLeft, Camera, CheckCircle2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AddProductForm({ makerId }) {
    const router = useRouter();
    const supabase = createClient();
    
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState("");
    const [loading, setLoading] = useState(false);

    const handleBack = () => {
        router.back();
    };

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async () => {
        if (!name || !price || !makerId || !imageFile) {
            alert("Harap lengkapi semua field yang wajib (Nama, Harga, dan Foto).");
            return;
        }

        setLoading(true);

        try {
            // Upload Image to buck
            const fileExt = imageFile.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
            const filePath = `products/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('buck')
                .upload(filePath, imageFile);

            if (uploadError) {
                throw uploadError;
            }

            const { data: { publicUrl } } = supabase.storage
                .from('buck')
                .getPublicUrl(filePath);

            // Insert into Database
            const { error: dbError } = await supabase
                .from('products_v2')
                .insert({
                    maker_id: makerId,
                    name,
                    price: parseFloat(price),
                    description,
                    image_url: publicUrl
                });

            if (dbError) {
                throw dbError;
            }

            router.push('/dashboard/catalog');
            router.refresh();
        } catch (error) {
            console.error("Error adding product:", error);
            alert("Terjadi kesalahan saat menambahkan produk. Silakan coba lagi.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-8 min-h-screen">
            {/* Header */}
            <div className="flex items-start gap-4">
                <button
                    onClick={handleBack}
                    className="mt-1 p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ArrowLeft className="w-6 h-6 text-gray-900" />
                </button>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Tambahkan Produk</h1>
                    <p className="text-gray-400 mt-1">
                        Lengkapi detail informasi untuk mendaftarkan produk baru ke katalog.
                    </p>
                </div>
            </div>

            {/* Form Container */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 space-y-8">
                {/* Photo Upload Placeholder */}
                <div className="space-y-4">
                    <label className="text-lg font-bold text-gray-900 block">Foto Produk</label>
                    <div className="relative border-2 border-dashed border-orange-100 rounded-3xl p-12 bg-orange-50/20 flex flex-col items-center justify-center gap-4 hover:bg-orange-50/40 transition-all group overflow-hidden">
                        {imagePreview ? (
                            <img src={imagePreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                        ) : (
                            <>
                                <div className="w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-200 group-hover:scale-110 transition-transform">
                                    <Camera className="w-8 h-8" />
                                </div>
                                <p className="text-orange-600 font-bold">Klik untuk mengunggah gambar</p>
                            </>
                        )}
                        <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleImageChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                        />
                    </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-lg font-bold text-gray-900 block" htmlFor="productName">Nama Produk</label>
                        <input
                            id="productName"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Contoh: Keripik Singkong"
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-gray-300"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-lg font-bold text-gray-900 block" htmlFor="price">Harga Jual (Rp)</label>
                        <input
                            id="price"
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="Contoh: 15000"
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-gray-300"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-lg font-bold text-gray-900 block" htmlFor="description">Deskripsi</label>
                        <textarea
                            id="description"
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Detail produk..."
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-gray-300 resize-none"
                        ></textarea>
                    </div>
                </div>

                {/* Submit Buttons */}
                <div className="space-y-4 pt-4">
                    <button 
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full bg-orange-600 text-white py-4 rounded-3xl font-bold flex items-center justify-center gap-2 hover:bg-orange-700 transition-colors text-xl shadow-lg shadow-orange-100 disabled:opacity-70"
                    >
                        {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <CheckCircle2 className="w-6 h-6" />}
                        {loading ? "Menyimpan..." : "Simpan & Daftarkan Produk"}
                    </button>
                    <button
                        onClick={handleBack}
                        disabled={loading}
                        className="w-full text-gray-500 font-bold hover:text-gray-900 transition-colors disabled:opacity-70"
                    >
                        Batalkan
                    </button>
                </div>
            </div>
        </div>
    );
}
