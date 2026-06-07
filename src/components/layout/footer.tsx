import Link from 'next/link';
import { ROUTE_POINT } from "@/lib/constants/route-point";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold text-green-400 mb-4">TurfBooking</h3>
            <p className="text-gray-300 mb-4">
              Your premier destination for booking sports venues. Find, book, and play at the best turfs in your city.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-green-400">Facebook</a>
              <a href="#" className="text-gray-300 hover:text-green-400">Twitter</a>
              <a href="#" className="text-gray-300 hover:text-green-400">Instagram</a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href={ROUTE_POINT.reviews} className="text-gray-300 hover:text-green-400">Reviews</Link></li>
              <li><Link href={ROUTE_POINT.dashboard} className="text-gray-300 hover:text-green-400">Dashboard</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-green-400">Help Center</a></li>
              <li><a href="#" className="text-gray-300 hover:text-green-400">Contact Us</a></li>
              <li><a href="#" className="text-gray-300 hover:text-green-400">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-300 hover:text-green-400">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
          <p>&copy; 2024 TurfBooking. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}