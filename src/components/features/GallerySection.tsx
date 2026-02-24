import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { GalleryImage, GALLERY_CATEGORIES } from '@/types';
import { toast } from 'sonner';
import { X } from 'lucide-react';

export function GallerySection() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [filteredImages, setFilteredImages] = useState<GalleryImage[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [loading, setLoading] = useState(true);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  useEffect(() => {
    fetchImages();
  }, []);

  useEffect(() => {
    if (selectedCategory === 'All') {
      setFilteredImages(images);
    } else {
      setFilteredImages(images.filter((img) => img.category === selectedCategory));
    }
  }, [selectedCategory, images]);

  const fetchImages = async () => {
    const { data, error } = await supabase
      .from('gallery_images')
      .select('*')
      .order('uploaded_at', { ascending: false });

    if (error) {
      console.error('Error fetching gallery:', error);
      toast.error('Failed to load gallery');
    } else {
      console.log('✅ Gallery images fetched:', data);
      setImages(data || []);
      setFilteredImages(data || []);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <section id="gallery" className="section-padding bg-white">
        <div className="container-custom text-center">
          <p className="text-gray-600">Loading gallery...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="gallery" className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center mb-12">
          <p className="text-saffron text-sm font-bold mb-3 tracking-wide uppercase">
            फोटो गैलरी
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-navy mb-3">
            Photo Gallery
          </h2>
          <p className="text-gray-600 text-sm mb-6">
            फोटो गैलरी
          </p>
          <p className="text-gray-700 max-w-2xl mx-auto leading-relaxed">
            Explore our projects, team, and events through our photo gallery.
          </p>
          <p className="text-sm text-gray-600">
            हमारी फोटो गैलरी के माध्यम से हमारी परियोजनाओं, टीम और कार्यक्रमों को देखें।
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-6 py-2 rounded-full font-semibold transition-all ${
              selectedCategory === 'All'
                ? 'bg-saffron text-white shadow-lg'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All (सभी)
          </button>
          {GALLERY_CATEGORIES.map((category) => {
            const categoryLabels: Record<string, string> = {
              'Projects': 'Projects (परियोजनाएं)',
              'Team': 'Our Team (हमारी टीम)',
              'Events': 'Events (कार्यक्रम)',
              'Certificates': 'Certificates (प्रमाण पत्र)'
            };
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-semibold transition-all ${
                  selectedCategory === category
                    ? 'bg-saffron text-white shadow-lg'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {categoryLabels[category] || category}
              </button>
            );
          })}
        </div>

        {/* Gallery Grid */}
        {filteredImages.length === 0 ? (
          <div className="bg-gray-50 rounded-xl p-12 text-center">
            <p className="text-gray-600 mb-2">No images available in this category</p>
            <p className="text-sm text-gray-500">Total images in database: {images.length}</p>
            {images.length > 0 && (
              <p className="text-xs text-gray-400 mt-2">Try selecting "All" category</p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {filteredImages.map((image) => (
              <div
                key={image.id}
                onClick={() => setLightboxImage(image.image_url)}
                className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group hover:shadow-xl transition-all duration-300"
              >
                <img
                  src={image.image_url}
                  alt={image.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="p-4 w-full">
                    <p className="text-white font-semibold text-sm">{image.title}</p>
                    <p className="text-gray-300 text-xs">{image.category}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Lightbox */}
        {lightboxImage && (
          <div
            onClick={() => setLightboxImage(null)}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          >
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-4 right-4 text-white bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors"
            >
              <X size={24} />
            </button>
            <img
              src={lightboxImage}
              alt="Full size"
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}
      </div>
    </section>
  );
}