import { useState, useEffect } from 'react';
import { FileText, Eye, X, CheckCircle, FileUp } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { LegalDocument } from '@/types';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const REQUIRED_DOCUMENTS = [
  { id: 'organization_pan', name: 'Organization PAN Card', nameHindi: 'संस्था पैन कार्ड' },
  { id: 'owner_photo', name: 'Owner Photo', nameHindi: 'मालिक की फोटो' },
  { id: 'did', name: 'DID / Registration ID', nameHindi: 'डीआईडी / पंजीकरण आईडी' },
  { id: 'agreement', name: 'Agreement Document', nameHindi: 'समझौता दस्तावेज' },
  { id: '12a', name: '12A Certificate', nameHindi: '12A प्रमाण पत्र' },
  { id: '80g', name: '80G Certificate', nameHindi: '80G प्रमाण पत्र' },
  { id: 'ngo_darpan', name: 'NGO Darpan', nameHindi: 'एनजीओ दर्पण' },
  { id: 'niti_aayog', name: 'NITI Aayog', nameHindi: 'नीति आयोग' },
  { id: 'owner_pan', name: 'Owner PAN Card', nameHindi: 'मालिक पैन कार्ड' },
  { id: 'cancel_cheque', name: 'Cancel Cheque', nameHindi: 'कैंसिल चेक' },
];

export function LegalDocumentsSection() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<LegalDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewDoc, setPreviewDoc] = useState<LegalDocument | null>(null);

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

  const getDocumentByType = (docId: string) => {
    return documents.find((doc) => doc.name === docId);
  };

  const handlePreview = (doc: LegalDocument) => {
    setPreviewDoc(doc);
  };

  const handleAdminAccess = () => {
    if (user) {
      navigate('/admin/legal-docs');
    } else {
      navigate('/login');
    }
  };

  if (loading) {
    return (
      <section id="legal" className="section-padding bg-white">
        <div className="container-custom text-center">
          <p className="text-gray-600">Loading legal documents...</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section id="legal" className="section-padding bg-white">
        <div className="container-custom max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <p className="text-saffron text-sm font-bold mb-3 tracking-wide uppercase">
              LEGAL COMPLIANCE
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-3">
              Legal Documents
            </h2>
            <p className="text-gray-600 text-sm mb-6">
              कानूनी दस्तावेज़
            </p>
            <p className="text-gray-700 max-w-2xl mx-auto leading-relaxed">
              View our official organization documents for transparency and verification
            </p>
            <p className="text-sm text-gray-600">
              पारदर्शिता और सत्यापन के लिए हमारे आधिकारिक संगठन दस्तावेज़ देखें
            </p>

            {/* Admin Access Button */}
            <div className="mt-6">
              <button
                onClick={handleAdminAccess}
                className="inline-flex items-center gap-2 bg-navy hover:bg-navy-light text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <FileUp size={20} />
                {user ? 'Manage Documents' : 'Admin Login'}
              </button>
            </div>
          </div>

          {/* Documents Grid */}
          <div className="grid md:grid-cols-2 gap-4">
            {REQUIRED_DOCUMENTS.map((reqDoc) => {
              const uploadedDoc = getDocumentByType(reqDoc.id);
              const isUploaded = !!uploadedDoc;

              return (
                <div
                  key={reqDoc.id}
                  className={`bg-white border-2 rounded-xl p-5 transition-all duration-200 ${
                    isUploaded
                      ? 'border-green-200 hover:shadow-md'
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div
                      className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${
                        isUploaded
                          ? 'bg-green-50 text-green-600'
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {isUploaded ? (
                        <CheckCircle size={24} fill="currentColor" />
                      ) : (
                        <FileText size={24} />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-navy text-sm mb-1 truncate">
                        {reqDoc.name}
                      </h3>
                      <p className="text-xs text-gray-600 mb-3">
                        {reqDoc.nameHindi}
                      </p>

                      {isUploaded ? (
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 text-xs text-green-600 font-semibold">
                            <CheckCircle size={14} />
                            Uploaded
                          </span>
                          <button
                            onClick={() => handlePreview(uploadedDoc)}
                            className="text-xs bg-saffron hover:bg-saffron-dark text-white font-semibold px-3 py-1.5 rounded transition-colors flex items-center gap-1"
                          >
                            <Eye size={14} />
                            View
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-500">
                          Not uploaded yet
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Stats */}
          <div className="mt-8 bg-gradient-to-r from-orange-50 to-orange-100 border-2 border-orange-200 rounded-xl p-6">
            <div className="grid grid-cols-2 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-saffron">
                  {documents.length}
                </div>
                <div className="text-sm text-gray-600 mt-1">Documents Uploaded</div>
                <div className="text-xs text-gray-500">अपलोड किए गए दस्तावेज़</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-navy">
                  {REQUIRED_DOCUMENTS.length}
                </div>
                <div className="text-sm text-gray-600 mt-1">Total Required</div>
                <div className="text-xs text-gray-500">कुल आवश्यक</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="bg-gradient-to-r from-navy to-navy-light text-white p-6 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-1">
                  {REQUIRED_DOCUMENTS.find((d) => d.id === previewDoc.name)?.name || previewDoc.name}
                </h3>
                <p className="text-sm text-gray-200">
                  {REQUIRED_DOCUMENTS.find((d) => d.id === previewDoc.name)?.nameHindi}
                </p>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Preview Content */}
            <div className="p-6 overflow-auto max-h-[calc(90vh-180px)]">
              {previewDoc.file_url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                <img
                  src={previewDoc.file_url}
                  alt={previewDoc.name}
                  className="w-full h-auto rounded-lg shadow-md"
                />
              ) : previewDoc.file_url.match(/\.pdf$/i) ? (
                <iframe
                  src={previewDoc.file_url}
                  className="w-full h-[600px] rounded-lg border-2 border-gray-200"
                  title={previewDoc.name}
                />
              ) : (
                <div className="text-center py-12">
                  <FileText size={64} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-4">Preview not available for this file type</p>
                  <a
                    href={previewDoc.file_url}
                    download
                    className="inline-flex items-center gap-2 bg-saffron hover:bg-saffron-dark text-white font-bold px-6 py-3 rounded-lg transition-colors"
                  >
                    Download Document
                  </a>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-gray-50 border-t border-gray-200 p-6 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Uploaded: {new Date(previewDoc.uploaded_at).toLocaleString()}
              </div>
              <a
                href={previewDoc.file_url}
                download
                className="bg-indiaGreen hover:bg-indiaGreen-dark text-white font-semibold px-6 py-2 rounded-lg transition-colors"
              >
                Download
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}