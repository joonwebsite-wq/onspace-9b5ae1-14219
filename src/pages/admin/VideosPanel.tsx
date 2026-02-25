import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Loader2, Plus, Edit2, Trash2, Save, X, Video } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface VideoItem {
  id: string;
  title: string;
  youtube_url: string;
  video_id: string;
  display_order: number;
  created_at: string;
}

// Extract video ID from various YouTube URL formats
const extractVideoId = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
};

export function VideosPanel() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    youtube_url: '',
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchVideos();
    }
  }, [user]);

  const fetchVideos = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching videos:', error);
      toast.error('Failed to load videos');
    } else {
      setVideos(data || []);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.youtube_url.trim()) {
      toast.error('Please fill all required fields');
      return;
    }

    const videoId = extractVideoId(formData.youtube_url);
    if (!videoId) {
      toast.error('Invalid YouTube URL. Please use format: https://youtu.be/VIDEO_ID or https://youtube.com/watch?v=VIDEO_ID');
      return;
    }

    setSaving(true);

    if (editingId) {
      // Update existing
      const { error } = await supabase
        .from('videos')
        .update({
          title: formData.title,
          youtube_url: formData.youtube_url,
          video_id: videoId,
        })
        .eq('id', editingId);

      if (error) {
        console.error('Update error:', error);
        toast.error('Failed to update video');
      } else {
        toast.success('Video updated successfully');
        resetForm();
        fetchVideos();
      }
    } else {
      // Insert new
      const maxOrder = videos.length > 0 ? Math.max(...videos.map(v => v.display_order)) : 0;
      
      const { error } = await supabase
        .from('videos')
        .insert({
          title: formData.title,
          youtube_url: formData.youtube_url,
          video_id: videoId,
          display_order: maxOrder + 1,
        });

      if (error) {
        console.error('Insert error:', error);
        toast.error('Failed to add video');
      } else {
        toast.success('Video added successfully');
        resetForm();
        fetchVideos();
      }
    }

    setSaving(false);
  };

  const handleEdit = (video: VideoItem) => {
    setFormData({
      title: video.title,
      youtube_url: video.youtube_url,
    });
    setEditingId(video.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this video?')) {
      return;
    }

    const { error } = await supabase
      .from('videos')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete video');
    } else {
      toast.success('Video deleted successfully');
      fetchVideos();
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      youtube_url: '',
    });
    setEditingId(null);
    setShowForm(false);
  };

  if (authLoading || loading) {
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
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-navy">YouTube Video Gallery</h2>
          <p className="text-gray-600">परियोजना वीडियो प्रबंधन</p>
          <p className="text-sm text-gray-500 mt-1">{videos.length} videos uploaded</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-saffron hover:bg-saffron-dark text-white font-semibold px-6 py-3 rounded-lg transition-colors"
        >
          {showForm ? (
            <>
              <X size={20} />
              Cancel
            </>
          ) : (
            <>
              <Plus size={20} />
              Add Video
            </>
          )}
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold text-navy mb-6">
            {editingId ? 'Edit Video' : 'Add New Video'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Video Title * शीर्षक
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="e.g., PM Surya Ghar Muft Bijli Yojana Overview"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                YouTube URL * लिंक
              </label>
              <input
                type="text"
                value={formData.youtube_url}
                onChange={(e) => setFormData({ ...formData, youtube_url: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="https://youtu.be/VIDEO_ID or https://youtube.com/watch?v=VIDEO_ID"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Supported formats: youtu.be/VIDEO_ID, youtube.com/watch?v=VIDEO_ID, or just VIDEO_ID
              </p>
            </div>

            {/* Preview */}
            {formData.youtube_url && extractVideoId(formData.youtube_url) && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Preview
                </label>
                <div className="aspect-video bg-black rounded-lg overflow-hidden">
                  <iframe
                    src={`https://www.youtube.com/embed/${extractVideoId(formData.youtube_url)}?rel=0&modestbranding=1`}
                    title="Preview"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  ></iframe>
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 bg-indiaGreen hover:bg-indiaGreen-dark text-white font-bold px-8 py-3 rounded-lg transition-colors disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    {editingId ? 'Update' : 'Save'} Video
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-8 py-3 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Videos Grid */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-bold text-navy mb-6">
          All Videos ({videos.length})
        </h3>
        
        {videos.length === 0 ? (
          <div className="text-center py-12">
            <Video size={64} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No videos added yet. Click "Add Video" to get started.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <div
                key={video.id}
                className="border-2 border-gray-200 rounded-lg overflow-hidden hover:border-saffron transition-all"
              >
                {/* Video Embed */}
                <div className="aspect-video bg-black">
                  <iframe
                    src={`https://www.youtube.com/embed/${video.video_id}?rel=0&modestbranding=1`}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                    className="w-full h-full"
                  ></iframe>
                </div>

                {/* Video Info */}
                <div className="p-4 bg-gray-50">
                  <h4 className="font-bold text-navy mb-2 line-clamp-2">{video.title}</h4>
                  <p className="text-xs text-gray-500 mb-3">Video ID: {video.video_id}</p>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(video)}
                      className="flex-1 flex items-center justify-center gap-1 bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-2 rounded text-sm font-semibold transition-colors"
                    >
                      <Edit2 size={14} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(video.id)}
                      className="flex-1 flex items-center justify-center gap-1 bg-red-100 text-red-700 hover:bg-red-200 px-3 py-2 rounded text-sm font-semibold transition-colors"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
