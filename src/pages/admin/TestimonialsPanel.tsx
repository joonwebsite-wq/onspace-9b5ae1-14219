import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { 
  Loader2, 
  Plus, 
  Edit2, 
  Trash2, 
  Star, 
  Eye, 
  EyeOff, 
  Save,
  X,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Testimonial {
  id: string;
  name: string;
  state: string;
  position: string;
  image_url: string;
  review: string;
  rating: number;
  is_active: boolean;
  display_order: number;
  created_at: string;
}

export function TestimonialsPanel() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    state: '',
    position: '',
    image_url: '',
    review: '',
    rating: 5,
    is_active: true,
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchTestimonials();
    }
  }, [user]);

  const fetchTestimonials = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching testimonials:', error);
      toast.error('Failed to load testimonials');
    } else {
      setTestimonials(data || []);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.state || !formData.position || !formData.review) {
      toast.error('Please fill all required fields');
      return;
    }

    if (editingId) {
      // Update existing
      const { error } = await supabase
        .from('testimonials')
        .update({
          ...formData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', editingId);

      if (error) {
        console.error('Update error:', error);
        toast.error('Failed to update testimonial');
      } else {
        toast.success('Testimonial updated successfully');
        resetForm();
        fetchTestimonials();
      }
    } else {
      // Insert new
      const { error } = await supabase
        .from('testimonials')
        .insert({
          ...formData,
          uploaded_by: user?.id,
        });

      if (error) {
        console.error('Insert error:', error);
        toast.error('Failed to add testimonial');
      } else {
        toast.success('Testimonial added successfully');
        resetForm();
        fetchTestimonials();
      }
    }
  };

  const handleEdit = (testimonial: Testimonial) => {
    setFormData({
      name: testimonial.name,
      state: testimonial.state,
      position: testimonial.position,
      image_url: testimonial.image_url,
      review: testimonial.review,
      rating: testimonial.rating,
      is_active: testimonial.is_active,
    });
    setEditingId(testimonial.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) {
      return;
    }

    const { error } = await supabase
      .from('testimonials')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete testimonial');
    } else {
      toast.success('Testimonial deleted successfully');
      fetchTestimonials();
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('testimonials')
      .update({ is_active: !currentStatus })
      .eq('id', id);

    if (error) {
      console.error('Toggle error:', error);
      toast.error('Failed to update status');
    } else {
      toast.success(`Testimonial ${!currentStatus ? 'activated' : 'deactivated'}`);
      fetchTestimonials();
    }
  };

  const moveTestimonial = async (id: string, direction: 'up' | 'down') => {
    const currentIndex = testimonials.findIndex((t) => t.id === id);
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === testimonials.length - 1)
    ) {
      return;
    }

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const current = testimonials[currentIndex];
    const target = testimonials[targetIndex];

    const { error } = await supabase.rpc('swap_testimonial_order', {
      id1: current.id,
      id2: target.id,
      order1: target.display_order,
      order2: current.display_order,
    });

    if (error) {
      // Fallback: manual update
      await supabase
        .from('testimonials')
        .update({ display_order: target.display_order })
        .eq('id', current.id);

      await supabase
        .from('testimonials')
        .update({ display_order: current.display_order })
        .eq('id', target.id);
    }

    fetchTestimonials();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      state: '',
      position: '',
      image_url: '',
      review: '',
      rating: 5,
      is_active: true,
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
          <h2 className="text-2xl font-bold text-navy">Manage Testimonials</h2>
          <p className="text-gray-600">टेस्टिमोनियल्स को मैनेज करें</p>
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
              Add New
            </>
          )}
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold text-navy mb-6">
            {editingId ? 'Edit Testimonial' : 'Add New Testimonial'}
          </h3>
          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Enter name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                State *
              </label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="e.g., Rajasthan"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Position *
              </label>
              <select
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                required
              >
                <option value="">Select Position</option>
                <option value="State Project Manager">State Project Manager</option>
                <option value="District Project Manager">District Project Manager</option>
                <option value="Project Facilitator">Project Facilitator</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Image URL *
              </label>
              <input
                type="url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="https://..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Rating *
              </label>
              <select
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border rounded-lg"
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>
                    {num} Star{num > 1 ? 's' : ''}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-5 h-5 text-saffron"
              />
              <label htmlFor="is_active" className="font-semibold text-gray-700">
                Active (Show on website)
              </label>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Review/Testimonial *
              </label>
              <textarea
                value={formData.review}
                onChange={(e) => setFormData({ ...formData, review: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                rows={4}
                placeholder="Enter testimonial text"
                required
              />
            </div>

            <div className="md:col-span-2 flex gap-4">
              <button
                type="submit"
                className="flex items-center gap-2 bg-indiaGreen hover:bg-indiaGreen-dark text-white font-bold px-8 py-3 rounded-lg transition-colors"
              >
                <Save size={20} />
                {editingId ? 'Update' : 'Save'} Testimonial
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

      {/* Testimonials List */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-bold text-navy mb-6">
          All Testimonials ({testimonials.length})
        </h3>
        <div className="space-y-4">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className={`border-2 rounded-lg p-6 transition-all ${
                testimonial.is_active
                  ? 'border-green-200 bg-white'
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Photo */}
                <img
                  src={testimonial.image_url}
                  alt={testimonial.name}
                  className="w-20 h-20 rounded-full object-cover border-2 border-saffron flex-shrink-0"
                />

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-bold text-navy text-lg">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">{testimonial.position}</p>
                      <p className="text-xs text-saffron">{testimonial.state}</p>
                    </div>

                    {/* Rating */}
                    <div className="flex gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>

                  <p className="text-gray-700 italic mb-4">"{testimonial.review}"</p>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => toggleActive(testimonial.id, testimonial.is_active)}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded text-sm font-semibold transition-colors ${
                        testimonial.is_active
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {testimonial.is_active ? (
                        <>
                          <Eye size={14} />
                          Active
                        </>
                      ) : (
                        <>
                          <EyeOff size={14} />
                          Inactive
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleEdit(testimonial)}
                      className="flex items-center gap-1 bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-1.5 rounded text-sm font-semibold transition-colors"
                    >
                      <Edit2 size={14} />
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(testimonial.id)}
                      className="flex items-center gap-1 bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1.5 rounded text-sm font-semibold transition-colors"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>

                    {/* Order Controls */}
                    <div className="flex gap-1 ml-auto">
                      <button
                        onClick={() => moveTestimonial(testimonial.id, 'up')}
                        disabled={index === 0}
                        className="bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed p-2 rounded transition-colors"
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button
                        onClick={() => moveTestimonial(testimonial.id, 'down')}
                        disabled={index === testimonials.length - 1}
                        className="bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed p-2 rounded transition-colors"
                      >
                        <ArrowDown size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {testimonials.length === 0 && (
            <p className="text-gray-500 text-center py-8">No testimonials added yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
