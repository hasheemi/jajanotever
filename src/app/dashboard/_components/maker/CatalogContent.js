"use client";

import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import AddProductCard from "./AddProductCard";
import { useRouter } from "next/navigation";
import { X, AlertCircle, Loader2, Camera } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function CatalogContent({ products = [] }) {
  const router = useRouter();
  const supabase = createClient();
  
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);

  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editImageFile, setEditImageFile] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Initialize edit form when product is selected
  useEffect(() => {
    if (editingProduct) {
      setEditName(editingProduct.name);
      setEditPrice(editingProduct.price.toString());
      setEditImagePreview(editingProduct.image_url || "");
      setEditImageFile(null);
    }
  }, [editingProduct]);

  const handleSend = (product) => {
    router.push(`/dashboard/catalog/${product.id}/send`);
  };

  const handleDelete = async () => {
    if (!deletingProduct) return;
    setIsDeleting(true);

    try {
      // If there's an image, attempt to delete it from storage
      if (deletingProduct.image_url) {
        // Extract filename from the URL
        const urlObj = new URL(deletingProduct.image_url);
        const parts = urlObj.pathname.split('/');
        const fileName = parts[parts.length - 1]; // e.g. "blabla_123.jpg"
        const filePath = `products/${fileName}`;
        
        await supabase.storage.from('buck').remove([filePath]);
      }

      const { error } = await supabase
        .from('products_v2')
        .delete()
        .eq('id', deletingProduct.id);

      if (error) throw error;

      setDeletingProduct(null);
      router.refresh();
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Gagal menghapus produk. Silakan coba lagi.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setEditImageFile(file);
      setEditImagePreview(URL.createObjectURL(file));
    }
  };

  const handleEditSubmit = async () => {
    if (!editName || !editPrice) {
      alert("Nama dan Harga tidak boleh kosong.");
      return;
    }
    
    setIsEditing(true);
    try {
      let finalImageUrl = editingProduct.image_url;

      // If a new image is selected, upload it and delete the old one
      if (editImageFile) {
        // Delete old image
        if (editingProduct.image_url) {
          try {
            const urlObj = new URL(editingProduct.image_url);
            const parts = urlObj.pathname.split('/');
            const oldFileName = parts[parts.length - 1];
            await supabase.storage.from('buck').remove([`products/${oldFileName}`]);
          } catch (e) {
            console.warn("Failed to delete old image", e);
          }
        }

        // Upload new image
        const fileExt = editImageFile.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = `products/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('buck')
          .upload(filePath, editImageFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('buck')
          .getPublicUrl(filePath);

        finalImageUrl = publicUrl;
      }

      // Update database row
      const { error: updateError } = await supabase
        .from('products_v2')
        .update({
          name: editName,
          price: parseFloat(editPrice),
          image_url: finalImageUrl
        })
        .eq('id', editingProduct.id);

      if (updateError) throw updateError;

      setEditingProduct(null);
      router.refresh();
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Gagal memperbarui produk. Silakan coba lagi.");
    } finally {
      setIsEditing(false);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Daftar Produk Anda</h1>
        <p className="text-gray-400 mt-1">
          Kelola barang dagangan Anda disini.
        </p>
      </div>

      {/* Product Grid */}
      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 bg-white rounded-3xl border border-dashed border-gray-200 text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <Camera className="w-10 h-10 text-gray-300" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Belum ada produk</h2>
            <p className="text-gray-400 max-w-sm mb-6">Mulai tambahkan produk ke katalog Anda agar dapat dilihat dan dipesan.</p>
            <AddProductCard />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              name={product.name}
              price={product.price}
              imageSrc={product.image_url}
              onSend={() => handleSend(product)}
              onEdit={() => setEditingProduct(product)}
              onDelete={() => setDeletingProduct(product)}
            />
          ))}
          <AddProductCard />
        </div>
      )}

      {/* Edit Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden relative animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setEditingProduct(null)}
              disabled={isEditing}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 transition-colors z-10 disabled:opacity-50"
            >
              <X className="w-6 h-6 text-gray-400" />
            </button>

            <div className="p-8 space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Edit Produk</h2>
                <p className="text-gray-400 text-sm mt-1">Perbarui informasi produk Anda.</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5 flex flex-col items-center">
                    <div className="relative w-32 h-32 rounded-2xl border-2 border-dashed border-orange-100 bg-orange-50/20 flex flex-col items-center justify-center overflow-hidden group cursor-pointer hover:bg-orange-50/40 transition-all">
                        {editImagePreview ? (
                            <img src={editImagePreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                        ) : (
                            <Camera className="w-8 h-8 text-orange-400" />
                        )}
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-white text-xs font-bold text-center px-2">Ubah<br/>Gambar</span>
                        </div>
                        <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleEditImageChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                            disabled={isEditing}
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase ml-1">Nama Produk</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    disabled={isEditing}
                    className="w-full px-4 py-2.5 md:px-5 md:py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium disabled:opacity-70"
                    placeholder="Contoh: Keripik Pisang"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase ml-1">Harga (Rp)</label>
                  <input
                    type="number"
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    disabled={isEditing}
                    className="w-full px-4 py-2.5 md:px-5 md:py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium disabled:opacity-70"
                    placeholder="15000"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setEditingProduct(null)}
                  disabled={isEditing}
                  className="flex-1 px-4 py-2 md:px-6 md:py-3.5 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 transition-colors disabled:opacity-70"
                >
                  Batal
                </button>
                <button
                  onClick={handleEditSubmit}
                  disabled={isEditing}
                  className="flex-1 px-4 py-2 md:px-6 md:py-3.5 bg-orange-600 text-white rounded-2xl font-bold hover:bg-orange-700 transition-all shadow-lg shadow-orange-200 flex justify-center items-center gap-2 disabled:opacity-70"
                >
                  {isEditing ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                  Simpan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deletingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl overflow-hidden relative animate-in fade-in zoom-in duration-200 text-center p-8">
            <button
              onClick={() => setDeletingProduct(null)}
              disabled={isDeleting}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-70"
            >
              <X className="w-6 h-6 text-gray-400" />
            </button>

            <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-10 h-10 text-red-500" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">Hapus Produk?</h2>
            <p className="text-gray-500 leading-relaxed mb-8">
              Apakah Anda yakin ingin menghapus <span className="font-bold text-gray-900">{deletingProduct.name}</span>? Tindakan ini tidak dapat dibatalkan.
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="w-full py-4 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-200 flex justify-center items-center gap-2 disabled:opacity-70"
              >
                {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                Ya, Hapus Produk
              </button>
              <button
                onClick={() => setDeletingProduct(null)}
                disabled={isDeleting}
                className="w-full py-4 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 transition-colors disabled:opacity-70"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
