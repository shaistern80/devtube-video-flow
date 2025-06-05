
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Play } from 'lucide-react';

const categories = [
  { name: 'Enrichment', slug: 'enrichment' },
  { name: 'Tech Support', slug: 'tech-support' },
  { name: 'BE', slug: 'be' }
];

const Header = () => {
  const location = useLocation();

  const isActiveCategory = (categorySlug: string) => {
    return location.pathname.includes(`/category/${categorySlug}`);
  };

  return (
    <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Play className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">DevTube</span>
          </Link>

          <nav className="flex space-x-8">
            {categories.map((category) => (
              <Link
                key={category.slug}
                to={`/category/${category.slug}`}
                className={`text-lg font-medium transition-colors hover:text-blue-400 ${
                  isActiveCategory(category.slug)
                    ? 'text-blue-400 border-b-2 border-blue-400 pb-1'
                    : 'text-gray-300'
                }`}
              >
                {category.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
