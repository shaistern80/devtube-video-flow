
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import VideoCard from '../components/VideoCard';
import videosData from '../data/videos.json';

const Home = () => {
  const categories = [
    { name: 'Enrichment', slug: 'enrichment', description: 'Advanced learning content for professional growth' },
    { name: 'Tech Support', slug: 'tech-support', description: 'Troubleshooting and debugging tutorials' },
    { name: 'BE', slug: 'be', description: 'Backend development and architecture' }
  ];

  const getLatestVideos = (categorySlug: string) => {
    return videosData[categorySlug as keyof typeof videosData]?.slice(0, 2) || [];
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Welcome to DevTube
        </h1>
        <p className="text-xl text-gray-300">
          Premium video content for developers and tech professionals
        </p>
      </div>

      {categories.map((category) => {
        const latestVideos = getLatestVideos(category.slug);
        
        return (
          <section key={category.slug} className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">{category.name}</h2>
                <p className="text-gray-400">{category.description}</p>
              </div>
              <Link
                to={`/category/${category.slug}`}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg transition-colors group"
              >
                <span>View All</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {latestVideos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default Home;
