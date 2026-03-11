import Navbar from '@/components/layout/navbar/navbar';
import Footer from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Users } from 'lucide-react';

// Mock data for reviews
const mockReviews = [
  {
    id: '1',
    rating: 5,
    comment: 'Excellent facility with top-notch amenities. The turf quality is outstanding and staff is very helpful.',
    user: {
      name: 'Rahul Sharma',
      avatar: null,
    },
    turfName: 'SportsPlex Arena',
    turfLocation: 'MP Nagar, Bhopal',
    createdAt: '2024-02-28',
  },
  {
    id: '2',
    rating: 4,
    comment: 'Good cricket ground with proper lighting. Parking could be better but overall a great experience.',
    user: {
      name: 'Priya Singh',
      avatar: null,
    },
    turfName: 'Champions Cricket Ground',
    turfLocation: 'Arera Colony, Bhopal',
    createdAt: '2024-02-25',
  },
  {
    id: '3',
    rating: 4,
    comment: 'Great for football matches. The synthetic grass is of good quality. Recommended for weekend games.',
    user: {
      name: 'Amit Kumar',
      avatar: null,
    },
    turfName: 'Metro Football Club',
    turfLocation: 'New Market, Bhopal',
    createdAt: '2024-02-20',
  },
];

const averageRating = mockReviews.reduce((sum, review) => sum + review.rating, 0) / mockReviews.length;

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function ReviewsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-20 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Turf Reviews</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Read what players are saying about their experiences at various sports venues.
            </p>
            
            <div className="mt-8 flex justify-center items-center space-x-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{averageRating.toFixed(1)}</div>
                <StarRating rating={Math.round(averageRating)} />
                <div className="text-sm text-gray-600 mt-1">Average Rating</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{mockReviews.length}</div>
                <div className="text-sm text-gray-600">Total Reviews</div>
              </div>
            </div>
          </div>

          {/* Reviews List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {mockReviews.map((review) => (
              <Card key={review.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{review.turfName}</CardTitle>
                      <div className="flex items-center text-gray-600 mt-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span className="text-sm">{review.turfLocation}</span>
                      </div>
                    </div>
                    <Badge variant="outline">{formatDate(review.createdAt)}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <StarRating rating={review.rating} />
                      <span className="text-lg font-semibold text-gray-900">{review.rating}/5</span>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center">
                      <div className="bg-gray-200 rounded-full h-8 w-8 flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-700">
                          {review.user.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <span className="ml-2 text-sm font-medium text-gray-900">
                        {review.user.name}
                      </span>
                    </div>
                    <Badge variant="secondary">Verified</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">Showing {mockReviews.length} reviews</p>
            <button className="text-green-600 hover:text-green-700 font-medium">
              Load more reviews
            </button>
          </div>

          {/* Add Review CTA */}
          <Card className="mt-16 bg-gradient-to-r from-green-50 to-blue-50">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Share Your Experience</h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Help other players by sharing your honest review about the turfs you've played at.
              </p>
              <div className="text-sm text-gray-500">
                * Review feature will be available after booking and playing at a venue
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}