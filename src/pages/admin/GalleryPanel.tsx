import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { GALLERY_CATEGORIES } from '@/types';
import { toast } from 'sonner';
import { Upload, Loader2, Image as ImageIcon, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function GalleryPanel() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [images, setImages] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchImages();
    }
  }, [user]);

  const fetchImages = async () => {
    const { data, error } = await supabase
      .from('gallery_images')
      .select('*')
      .order('uploaded_at', { ascending: false });

    if (!error && data) {
      setImages(data);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error('Image size should not exceed 5MB');
        return;
      }
      if (!selectedFile.type.startsWith('image/')) {
        toast.error('Please upload a valid image file');
        return;
      }
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!title || !category || !file || !user) {
      toast.error('Please fill all fields');
      return;
    }

    setUploading(true);

    const fileExt = file.name.split('.').pop();
    const fileName = `gallery/${category.toLowerCase()}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('gallery-images')
      .upload(fileName, file);

    if (uploadError) {
      console.error('Upload error:', uploadError);
      toast.error('Failed to upload image');
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('gallery-images')
      .getPublicUrl(fileName);

    const { error: insertError } = await supabase
      .from('gallery_images')
      .insert({
        title,
        category,
        image_url: publicUrl,
        uploaded_by: user.id,
      });

    if (insertError) {
      console.error('Insert error:', insertError);
      toast.error('Failed to save image');
    } else {
      toast.success('Image uploaded successfully');
      setTitle('');
      setCategory('');
      setFile(null);
      setPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      fetchImages();
    }

    setUploading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image?')) {
      return;
    }

    const { error } = await supabase
      .from('gallery_images')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete image');
    } else {
      toast.success('Image deleted successfully');
      fetchImages();
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="animate-spin text-saffron" size={48} />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-8">
      {/* Upload Form */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold text-navy mb-6">Upload Gallery Image</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Image Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Enter image title"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value="">Select Category</option>
              {GALLERY_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Upload Image
            </label>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              className="w-full"
            />
            {preview && (
              <div className="mt-4">
                <img src={preview} alt="Preview" className="h-40 rounded-lg object-cover" />
              </div>
            )}
          </div>

          <button
            onClick={handleUpload}
            disabled={uploading || !title || !category || !file}
            className="w-full bg-saffron hover:bg-saffron-dark text-white font-bold py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {uploading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Uploading...
              </>
            ) : (
              <>
                <Upload size={20} />
                Upload Image
              </>
            )}
          </button>
        </div>
      </div>

      {/* Uploaded Images */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold text-navy mb-6">Uploaded Images ({images.length})</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((img) => (
            <div key={img.id} className="relative group">
              <img
                src={img.image_url}
                alt={img.title}
                className="w-full aspect-square object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex flex-col items-center justify-center p-4">
                <p className="text-white font-semibold text-sm mb-1 text-center">{img.title}</p>
                <p className="text-gray-300 text-xs mb-3">{img.category}</p>
                <button
                  onClick={() => handleDelete(img.id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
        {images.length === 0 && (
          <p className="text-gray-500 text-center py-8">No images uploaded yet</p>
        )}
      </div>
    </div>
  );
}