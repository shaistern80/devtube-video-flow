
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  videoUrl: string;
  externalLink?: string;
  category: string;
}

interface VideoCardProps {
  video: Video;
}

const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 group">
      <Link to={`/video/${video.id}`} className="block relative">
        <div className="relative aspect-video overflow-hidden">
          <img
            src={video.thumbnail}
            alt={video.title}
            className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
          />
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-700 animate-pulse" />
          )}
          
          <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="bg-blue-600 rounded-full p-4 transform scale-90 group-hover:scale-100 transition-transform duration-300">
              <Play className="w-8 h-8 text-white fill-current" />
            </div>
          </div>
        </div>
      </Link>

      <div className="p-6">
        <h3 className="text-xl font-semibold text-white mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
          <Link to={`/video/${video.id}`}>
            {video.title}
          </Link>
        </h3>
        
        {video.externalLink && (
          <a
            href={video.externalLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
          >
            External Resource →
          </a>
        )}
      </div>
    </div>
  );
};

export default VideoCard;
