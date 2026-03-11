'use client';

import { useSports } from '@/lib/hooks/turf';
import Navbar from '@/components/layout/navbar/navbar';
import Footer from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MapPin } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function CatalogPage() {
  const { data: sports, isLoading, error } = useSports();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSports = sports?.filter(sport =>
    sport.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const popularSports = sports?.filter(sport => sport.isPopular) || [];
  const otherSports = sports?.filter(sport => !sport.isPopular) || [];

  if (error) {
    console.error('Failed to load sports:', error);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Sports Catalog</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Browse through our comprehensive collection of sports and find the perfect venue for your game.
            </p>
          </div>

          {/* Search */}
          <div className="max-w-md mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search sports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading sports...</p>
            </div>
          ) : (
            <>
              {/* Popular Sports */}
              {searchTerm === '' && (
                <div className="mb-16">
                  <h2 className="text-2xl font-bold text-gray-900 mb-8">Popular Sports</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {popularSports.map((sport) => (
                      <Link key={sport.id} href={`/sports/${sport.id}`}>
                        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                          <CardContent className="p-6 text-center">
                            <div className="text-6xl mb-4">{sport.icon}</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">{sport.name}</h3>
                            <p className="text-gray-600 text-sm mb-4">{sport.description}</p>
                            <Button size="sm" className="w-full">
                              <MapPin className="h-4 w-4 mr-2" />
                              Find Venues
                            </Button>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* All Sports / Search Results */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-8">
                  {searchTerm ? `Search Results (${filteredSports.length})` : 'All Sports'}
                </h2>
                {filteredSports.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-600">
                      {searchTerm ? 'No sports found matching your search.' : 'No sports available.'}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {(searchTerm ? filteredSports : otherSports).map((sport) => (
                      <Link key={sport.id} href={`/sports/${sport.id}`}>
                        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                          <CardContent className="p-6 text-center">
                            <div className="text-5xl mb-3">{sport.icon}</div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">{sport.name}</h3>
                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{sport.description}</p>
                            <Button size="sm" variant="outline" className="w-full">
                              View Details
                            </Button>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
}