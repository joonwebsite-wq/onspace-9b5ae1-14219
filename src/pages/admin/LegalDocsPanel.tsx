import { useState, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { LEGAL_DOCUMENT_TYPES } from '@/types';
import { toast } from 'sonner';
import { Upload, Loader2, FileText, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export function LegalDocsPanel() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchDocuments();
    }
  }, [user]);

  const fetchDocuments = async () => {
    const { data, error } = await supabase
      .from('legal_documents')
      .select('*')
      .order('uploaded_at', { ascending: false });

    if (!error && data) {
      setDocuments(data);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error('File size should not exceed 10MB');
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!selectedDoc || !file || !user) {
      toast.error('Please select document type and file');
      return;
    }

    setUploading(true);

    const fileExt = file.name.split('.').pop();
    const fileName = `legal/${selectedDoc.replace(/\s+/g, '-')}-${Date.now()}.${fileExt}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('legal-documents')
      .upload(fileName, file);

    if (uploadError) {
      console.error('Upload error:', uploadError);
      toast.error('Failed to upload file');
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('legal-documents')
      .getPublicUrl(fileName);

    const existingDoc = documents.find((d) => d.name === selectedDoc);
    if (existingDoc) {
      const { error: updateError } = await supabase
        .from('legal_documents')
        .update({ file_url: publicUrl, uploaded_by: user.id })
        .eq('id', existingDoc.id);

      if (updateError) {
        console.error('Update error:', updateError);
        toast.error('Failed to update document');
      } else {
        toast.success('Document updated successfully');
      }
    } else {
      const { error: insertError } = await supabase
        .from('legal_documents')
        .insert({
          name: selectedDoc,
          file_url: publicUrl,
          uploaded_by: user.id,
        });

      if (insertError) {
        console.error('Insert error:', insertError);
        toast.error('Failed to save document');
      } else {
        toast.success('Document uploaded successfully');
      }
    }

    setUploading(false);
    setFile(null);
    setSelectedDoc('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    fetchDocuments();
  };

  const handleDelete = async (id: string, fileUrl: string) => {
    if (!confirm('Are you sure you want to delete this document?')) {
      return;
    }

    const { error } = await supabase
      .from('legal_documents')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete document');
    } else {
      toast.success('Document deleted successfully');
      fetchDocuments();
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
        <h2 className="text-xl font-bold text-navy mb-6">Upload Legal Document</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Document Type
            </label>
            <select
              value={selectedDoc}
              onChange={(e) => setSelectedDoc(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value="">Select Document Type</option>
              {LEGAL_DOCUMENT_TYPES.map((doc) => (
                <option key={doc} value={doc}>
                  {doc}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Upload File
            </label>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png"
              className="w-full"
            />
            {file && (
              <p className="text-sm text-gray-600 mt-2">Selected: {file.name}</p>
            )}
          </div>

          <button
            onClick={handleUpload}
            disabled={uploading || !selectedDoc || !file}
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
                Upload Document
              </>
            )}
          </button>
        </div>
      </div>

      {/* Uploaded Documents */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold text-navy mb-6">Uploaded Documents</h2>
        <div className="space-y-4">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <FileText size={24} className="text-indiaGreen" />
                <div>
                  <p className="font-semibold text-navy">{doc.name}</p>
                  <p className="text-xs text-gray-500">
                    Uploaded: {new Date(doc.uploaded_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <a
                  href={doc.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm bg-indiaGreen text-white px-4 py-2 rounded hover:bg-indiaGreen-dark"
                >
                  View
                </a>
                <button
                  onClick={() => handleDelete(doc.id, doc.file_url)}
                  className="text-sm bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 flex items-center gap-1"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          ))}
          {documents.length === 0 && (
            <p className="text-gray-500 text-center py-8">No documents uploaded yet</p>
          )}
        </div>
      </div>
    </div>
  );
}