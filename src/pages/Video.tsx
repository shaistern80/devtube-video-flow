
import React, { useState, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Play, Pause } from 'lucide-react';
import videosData from '../data/videos.json';

const Video = () => {
  const { videoId } = useParams<{ videoId: string }>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Find the video in all categories
  const findVideo = () => {
    for (const categoryVideos of Object.values(videosData)) {
      const video = categoryVideos.find(v => v.id === videoId);
      if (video) return video;
    }
    return null;
  };

  const video = findVideo();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [isPlaying, showControls]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
  };

  if (!video) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Video Not Found</h1>
        <p className="text-gray-400 mb-8">The requested video does not exist.</p>
        <Link to="/" className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg transition-colors">
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        to={`/category/${video.category}`}
        className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to {video.category.charAt(0).toUpperCase() + video.category.slice(1)}</span>
      </Link>

      <div className="bg-gray-800 rounded-xl overflow-hidden shadow-2xl">
        <div 
          className="relative aspect-video bg-black group cursor-pointer"
          onMouseMove={handleMouseMove}
          onClick={togglePlay}
        >
          <video
            ref={videoRef}
            className="w-full h-full"
            poster={video.thumbnail}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          >
            <source src={video.videoUrl} type="application/x-mpegURL" />
            Your browser does not support HLS video playback.
          </video>

          {/* Custom Play/Pause Overlay */}
          <div 
            className={`absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-opacity duration-300 ${
              showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <button
              onClick={togglePlay}
              className="bg-blue-600 hover:bg-blue-700 rounded-full p-6 transition-all duration-300 transform hover:scale-110"
            >
              {isPlaying ? (
                <Pause className="w-12 h-12 text-white" />
              ) : (
                <Play className="w-12 h-12 text-white fill-current" />
              )}
            </button>
          </div>

          {/* Loading state when video is not playing */}
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-blue-600 rounded-full p-6">
                <Play className="w-12 h-12 text-white fill-current" />
              </div>
            </div>
          )}
        </div>

        <div className="p-8">
          <h1 className="text-3xl font-bold text-white mb-4">{video.title}</h1>
          
          {video.externalLink && (
            <div className="border-t border-gray-700 pt-6">
              <h3 className="text-lg font-semibold text-white mb-3">Additional Resources</h3>
              <a
                href={video.externalLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg transition-colors"
              >
                <span>Open External Link</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Video description or additional content can be added here */}
      <div className="mt-8 bg-gray-800 rounded-xl p-8">
        <h3 className="text-xl font-semibold text-white mb-4">About this video</h3>
        <p className="text-gray-300 leading-relaxed">
          This video is part of our {video.category.replace('-', ' ')} series, designed to provide 
          comprehensive learning experiences for developers and tech professionals. 
          Each video is carefully crafted to deliver practical knowledge and real-world insights.
        </p>
      </div>
    </div>
  );
};

export default Video;
