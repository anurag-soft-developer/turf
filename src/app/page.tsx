import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ROUTE_POINT } from "@/lib/constants/route-point";
import { MapPin, Calendar, Users} from "lucide-react";

export default function Home() {
  return (
    <>
      <section className="bg-gradient-to-br from-green-50 to-blue-50 pb-16 pt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center pt-10">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Find & Book <span className="text-green-600">Premium Sports Turfs</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Discover amazing sports venues, book instantly, and enjoy your favorite sports with friends. 
              Cricket, Football, Basketball and more!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={ROUTE_POINT.auth.register}>
                <Button size="lg" className="text-lg px-8 py-3">
                  Get Started Free
                </Button>
              </Link>
              <Link href={ROUTE_POINT.auth.login}>
                <Button size="lg" variant="outline" className="text-lg px-8 py-3">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose TurfBooking?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We make it easy to find, book, and enjoy the best sports facilities in your area.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <MapPin className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle>Find Nearby Turfs</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Discover premium sports venues near your location with detailed information, 
                  photos, and real-time availability.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <Calendar className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle>Instant Booking</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Book your favorite time slots instantly with our easy-to-use booking system. 
                  No phone calls, no waiting.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle>Play with Friends</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Connect with other sports enthusiasts in your community and play together.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Sports Categories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Popular Sports</h2>
            <p className="text-gray-600">Choose from a wide variety of sports and activities</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'Cricket', icon: '🏏', count: '120+ venues' },
              { name: 'Football', icon: '⚽', count: '80+ venues' },
              { name: 'Basketball', icon: '🏀', count: '60+ venues' },
              { name: 'Tennis', icon: '🎾', count: '45+ venues' },
              { name: 'Badminton', icon: '🏸', count: '90+ venues' },
              { name: 'Volleyball', icon: '🏐', count: '30+ venues' },
              { name: 'Table Tennis', icon: '🏓', count: '40+ venues' },
              { name: 'Hockey', icon: '🏒', count: '25+ venues' },
            ].map((sport) => (
              <Link key={sport.name} href={ROUTE_POINT.catalog}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-2">{sport.icon}</div>
                    <h3 className="font-semibold text-gray-900">{sport.name}</h3>
                    <p className="text-sm text-gray-600">{sport.count}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Play?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of sports enthusiasts who trust TurfBooking for their games
          </p>
          <Link href={ROUTE_POINT.auth.register}>
            <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
              Start Booking Now
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
