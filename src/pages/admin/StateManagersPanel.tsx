import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Loader2, Plus, Edit2, Trash2, Save, X, Upload, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface StateManager {
  id: string;
  state: string;
  name: string;
  mobile: string;
  photo_url: string;
  email?: string;
  is_active: boolean;
  created_at: string;
}

const STATES = [
  'Rajasthan',
  'Andhra Pradesh',
  'Telangana',
  'Karnataka',
  'Tamil Nadu',
  'Kerala',
];

export function StateManagersPanel() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [managers, setManagers] = useState<StateManager[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    state: '',
    name: '',
    mobile: '',
    email: '',
    is_active: true,
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchManagers();
    }
  }, [user]);

  const fetchManagers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('state_project_managers')
      .select('*')
      .order('state', { ascending: true });

    if (error) {
      console.error('Error fetching managers:', error);
      toast.error('Failed to load managers');
    } else {
      setManagers(data || []);
    }
    setLoading(false);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should not exceed 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload a valid image file');
        return;
      }
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadPhoto = async (): Promise<string | null> => {
    if (!photoFile) return null;

    const fileExt = photoFile.name.split('.').pop();
    const fileName = `managers/${formData.state.toLowerCase().replace(/\s+/g, '-')}/${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('manager-photos')
      .upload(fileName, photoFile);

    if (error) {
      console.error('Photo upload error:', error);
      toast.error('Failed to upload photo');
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('manager-photos')
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.state || !formData.name || !formData.mobile) {
      toast.error('Please fill all required fields');
      return;
    }

    if (!editingId && !photoFile) {
      toast.error('Please upload manager photo');
      return;
    }

    setUploading(true);

    let photoUrl = photoPreview;
    if (photoFile) {
      photoUrl = await uploadPhoto();
      if (!photoUrl) {
        setUploading(false);
        return;
      }
    }

    if (editingId) {
      // Update existing
      const updateData: any = {
        name: formData.name,
        mobile: formData.mobile,
        email: formData.email,
        is_active: formData.is_active,
        updated_at: new Date().toISOString(),
      };

      if (photoUrl && photoUrl !== photoPreview) {
        updateData.photo_url = photoUrl;
      }

      const { error } = await supabase
        .from('state_project_managers')
        .update(updateData)
        .eq('id', editingId);

      if (error) {
        console.error('Update error:', error);
        toast.error('Failed to update manager');
      } else {
        toast.success('Manager updated successfully');
        resetForm();
        fetchManagers();
      }
    } else {
      // Insert new
      const { error } = await supabase
        .from('state_project_managers')
        .insert({
          state: formData.state,
          name: formData.name,
          mobile: formData.mobile,
          email: formData.email,
          photo_url: photoUrl,
          is_active: formData.is_active,
          uploaded_by: user?.id,
        });

      if (error) {
        console.error('Insert error:', error);
        if (error.code === '23505') {
          toast.error(`Manager for ${formData.state} already exists`);
        } else {
          toast.error('Failed to add manager');
        }
      } else {
        toast.success('Manager added successfully');
        resetForm();
        fetchManagers();
      }
    }

    setUploading(false);
  };

  const handleEdit = (manager: StateManager) => {
    setFormData({
      state: manager.state,
      name: manager.name,
      mobile: manager.mobile,
      email: manager.email || '',
      is_active: manager.is_active,
    });
    setPhotoPreview(manager.photo_url);
    setEditingId(manager.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this manager?')) {
      return;
    }

    const { error } = await supabase
      .from('state_project_managers')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete manager');
    } else {
      toast.success('Manager deleted successfully');
      fetchManagers();
    }
  };

  const resetForm = () => {
    setFormData({
      state: '',
      name: '',
      mobile: '',
      email: '',
      is_active: true,
    });
    setPhotoFile(null);
    setPhotoPreview(null);
    setEditingId(null);
    setShowForm(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getAvailableStates = () => {
    if (editingId) {
      return STATES;
    }
    const assignedStates = managers.map((m) => m.state);
    return STATES.filter((state) => !assignedStates.includes(state));
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
          <h2 className="text-2xl font-bold text-navy">State Project Managers</h2>
          <p className="text-gray-600">राज्य परियोजना प्रबंधक</p>
          <p className="text-sm text-gray-500 mt-1">
            {managers.length} of {STATES.length} states assigned
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          disabled={!editingId && getAvailableStates().length === 0}
          className="flex items-center gap-2 bg-saffron hover:bg-saffron-dark text-white font-semibold px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {showForm ? (
            <>
              <X size={20} />
              Cancel
            </>
          ) : (
            <>
              <Plus size={20} />
              Add Manager
            </>
          )}
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold text-navy mb-6">
            {editingId ? 'Edit Manager' : 'Add New Manager'}
          </h3>
          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                State * राज्य
              </label>
              <select
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                required
                disabled={!!editingId}
              >
                <option value="">Select State</option>
                {getAvailableStates().map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Name * नाम
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Enter full name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Mobile Number * मोबाइल
              </label>
              <input
                type="tel"
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Enter 10-digit mobile"
                pattern="[0-9]{10}"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email (Optional)
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Enter email"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Photo * फोटो
              </label>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handlePhotoChange}
                accept="image/*"
                className="w-full px-4 py-2 border rounded-lg"
              />
              {photoPreview && (
                <div className="mt-4">
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="w-32 h-32 rounded-lg object-cover border-2 border-saffron"
                  />
                </div>
              )}
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

            <div className="md:col-span-2 flex gap-4">
              <button
                type="submit"
                disabled={uploading}
                className="flex items-center gap-2 bg-indiaGreen hover:bg-indiaGreen-dark text-white font-bold px-8 py-3 rounded-lg transition-colors disabled:opacity-50"
              >
                {uploading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    {editingId ? 'Update' : 'Save'} Manager
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

      {/* Managers Grid */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-bold text-navy mb-6">
          All State Managers ({managers.length}/{STATES.length})
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {STATES.map((state) => {
            const manager = managers.find((m) => m.state === state);
            
            if (!manager) {
              return (
                <div
                  key={state}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50"
                >
                  <User size={48} className="mx-auto text-gray-400 mb-3" />
                  <h4 className="font-bold text-gray-600 mb-1">{state}</h4>
                  <p className="text-sm text-gray-500">No manager assigned</p>
                </div>
              );
            }

            return (
              <div
                key={manager.id}
                className={`border-2 rounded-lg p-6 transition-all ${
                  manager.is_active
                    ? 'border-green-200 bg-white'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="text-center mb-4">
                  <img
                    src={manager.photo_url}
                    alt={manager.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-saffron mx-auto mb-3"
                  />
                  <h4 className="font-bold text-navy text-lg">{manager.name}</h4>
                  <p className="text-sm text-saffron font-semibold">{manager.state}</p>
                  <p className="text-sm text-gray-600 mt-1">📱 {manager.mobile}</p>
                  {manager.email && (
                    <p className="text-xs text-gray-500">✉️ {manager.email}</p>
                  )}
                </div>

                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => handleEdit(manager)}
                    className="flex items-center gap-1 bg-blue-100 text-blue-700 hover:bg-blue-200 px-4 py-2 rounded text-sm font-semibold transition-colors"
                  >
                    <Edit2 size={14} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(manager.id)}
                    className="flex items-center gap-1 bg-red-100 text-red-700 hover:bg-red-200 px-4 py-2 rounded text-sm font-semibold transition-colors"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>

                {!manager.is_active && (
                  <div className="mt-3 text-center">
                    <span className="inline-block bg-gray-200 text-gray-700 text-xs font-semibold px-3 py-1 rounded">
                      Inactive
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
