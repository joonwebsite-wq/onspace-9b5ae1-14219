import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Video, Play } from 'lucide-react';

interface VideoItem {
  id: string;
  title: string;
  youtube_url: string;
  video_id: string;
  display_order: number;
  created_at: string;
}

export function VideoSection() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching videos:', error);
    } else {
      setVideos(data || []);
    }
    setLoading(false);
  };

  if (loading) {
    return null;
  }

  if (videos.length === 0) {
    return null;
  }

  return (
    <section id="videos" className="py-16 md:py-24 bg-navy">
      <div className="container-custom px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Video className="text-saffron" size={32} />
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Project Overview & Application Guidance Videos
            </h2>
          </div>
          <p className="text-xl text-saffron font-semibold">
            परियोजना जानकारी एवं आवेदन मार्गदर्शन वीडियो
          </p>
          <div className="w-24 h-1 bg-saffron mx-auto mt-4"></div>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {videos.map((video, index) => (
            <div
              key={video.id}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
              style={{
                animation: `fadeIn 0.5s ease-out ${index * 0.1}s both`,
              }}
            >
              {/* Video Embed */}
              <div className="relative aspect-video bg-black">
                <iframe
                  src={`https://www.youtube.com/embed/${video.video_id}?rel=0&modestbranding=1`}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                  className="absolute inset-0 w-full h-full"
                ></iframe>
              </div>

              {/* Video Title */}
              <div className="p-4 bg-white/5">
                <h3 className="text-white font-semibold text-lg line-clamp-2">
                  {video.title}
                </h3>
                <div className="flex items-center gap-2 mt-2 text-saffron text-sm">
                  <Play size={16} />
                  <span>Watch Now</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-white/80 mb-4">
            Watch all videos to understand the complete application process
          </p>
          <a
            href="#apply"
            className="cta-button inline-flex"
          >
            Apply Now After Watching
          </a>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
