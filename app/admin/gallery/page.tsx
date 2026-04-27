'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function GalleryPage() {
  const [items, setItems] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchItems = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from('gallery_items')
        .select('*')
        .order('sort_order');
      if (data) setItems(data);
    };
    fetchItems();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const supabase = createClient();
    const fileName = `${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from('gallery')
      .upload(fileName, file);
    if (!error && data) {
      const { data: urlData } = supabase.storage
        .from('gallery')
        .getPublicUrl(fileName);
      await supabase.from('gallery_items').insert({
        category: 'hair',
        image_url: urlData.publicUrl,
      });
      const { data: newItems } = await supabase
        .from('gallery_items')
        .select('*')
        .order('sort_order');
      if (newItems) setItems(newItems);
    }
    setUploading(false);
  };

  const handleDelete = async (id: string, imageUrl: string) => {
    const supabase = createClient();
    await supabase.from('gallery_items').delete().eq('id', id);
    setItems(items.filter((i) => i.id !== id));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-white text-2xl font-semibold uppercase tracking-widest">
          Gallery
        </h1>
        <label className="border border-[#B8860B] text-[#B8860B] px-6 py-2 text-xs uppercase tracking-widest cursor-pointer hover:bg-[#B8860B] hover:text-white transition-all">
          {uploading ? 'Uploading...' : 'Upload Image'}
          <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
        </label>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((item) => (
          <div key={item.id} className="relative group">
            <img src={item.image_url} alt={item.caption || ''} className="w-full aspect-square object-cover" />
            <button
              onClick={() => handleDelete(item.id, item.image_url)}
              className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}