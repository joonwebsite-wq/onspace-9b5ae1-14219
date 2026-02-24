import { useState, useEffect } from 'react';
import { FileText, Download, ExternalLink } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { LegalDocument } from '@/types';
import { toast } from 'sonner';

export function LegalDocumentsSection() {
  const [documents, setDocuments] = useState<LegalDocument[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    const { data, error } = await supabase
      .from('legal_documents')
      .select('*')
      .order('uploaded_at', { ascending: false });

    if (error) {
      console.error('Error fetching legal documents:', error);
      toast.error('Failed to load legal documents');
    } else {
      setDocuments(data || []);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <section id="legal" className="section-padding bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container-custom text-center">
          <p className="text-gray-600">Loading legal documents...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="legal" className="section-padding bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
            Legal Documents
          </h2>
          <div className="w-24 h-1 bg-saffron mx-auto mb-6"></div>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            View and download our official organization documents for transparency
          </p>
        </div>

        {documents.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-md">
            <FileText size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">No documents available yet</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-200"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-indiaGreen/10 text-indiaGreen rounded-lg flex items-center justify-center">
                    <FileText size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-navy mb-2 truncate">{doc.name}</h3>
                    <p className="text-xs text-gray-500 mb-4">
                      Uploaded: {new Date(doc.uploaded_at).toLocaleDateString()}
                    </p>
                    <div className="flex gap-2">
                      <a
                        href={doc.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm bg-saffron hover:bg-saffron-dark text-white px-3 py-2 rounded transition-colors"
                      >
                        <ExternalLink size={14} />
                        View
                      </a>
                      <a
                        href={doc.file_url}
                        download
                        className="flex items-center gap-1 text-sm bg-indiaGreen hover:bg-indiaGreen-dark text-white px-3 py-2 rounded transition-colors"
                      >
                        <Download size={14} />
                        Download
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}