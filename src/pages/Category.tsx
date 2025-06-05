
import React from 'react';
import { useParams } from 'react-router-dom';
import VideoCard from '../components/VideoCard';
import videosData from '../data/videos.json';

const Category = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();

  const getCategoryName = (slug: string) => {
    const categoryNames: { [key: string]: string } = {
      'enrichment': 'Enrichment',
      'tech-support': 'Tech Support',
      'be': 'BE'
    };
    return categoryNames[slug] || slug;
  };

  const getCategoryDescription = (slug: string) => {
    const descriptions: { [key: string]: string } = {
      'enrichment': 'Advanced learning content for professional growth and skill enhancement',
      'tech-support': 'Comprehensive troubleshooting guides and debugging tutorials',
      'be': 'Backend development, architecture patterns, and server-side technologies'
    };
    return descriptions[slug] || '';
  };

  if (!categorySlug || !videosData[categorySlug as keyof typeof videosData]) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Category Not Found</h1>
        <p className="text-gray-400">The requested category does not exist.</p>
      </div>
    );
  }

  const videos = videosData[categorySlug as keyof typeof videosData];
  const categoryName = getCategoryName(categorySlug);
  const categoryDescription = getCategoryDescription(categorySlug);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">{categoryName}</h1>
        <p className="text-xl text-gray-300 mb-2">{categoryDescription}</p>
        <p className="text-gray-400">{videos.length} video{videos.length !== 1 ? 's' : ''} available</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {videos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
    </div>
  );
};

export default Category;
