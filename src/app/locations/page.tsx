"use client";

import { useState } from "react";
import Navbar from "@/components/layout/navbar/navbar";
import Footer from "@/components/layout/footer";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  MapPin,
  Star,
  Wifi,
  Car,
  Camera,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import Link from "next/link";
import Image from "next/image";

const mockTurfs = [
  {
    id: "1",
    name: "SportsPlex Arena",
    description: "Premium multi-sport facility with top-class amenities",
    location: {
      name: "Bhopal Central",
      address: "MP Nagar, Bhopal",
      distance: "2.3 km away",
    },
    sports: ["Cricket", "Football", "Basketball"],
    images: ["/api/placeholder/400/250"],
    amenities: ["Parking", "Changing Rooms", "Lighting", "Cafeteria", "WiFi"],
    priceRange: { min: 800, max: 1500 },
    rating: 4.8,
    reviewCount: 124,
    isActive: true,
  },
  {
    id: "2",
    name: "Champions Cricket Ground",
    description: "Professional cricket turf with excellent pitch quality",
    location: {
      name: "Arera Colony",
      address: "Arera Colony, Bhopal",
      distance: "3.1 km away",
    },
    sports: ["Cricket"],
    images: ["/api/placeholder/400/250"],
    amenities: ["Parking", "Changing Rooms", "Lighting", "Seating Area"],
    priceRange: { min: 1000, max: 2000 },
    rating: 4.6,
    reviewCount: 89,
    isActive: true,
  },
  {
    id: "3",
    name: "Metro Football Club",
    description: "FIFA standard football turf with synthetic grass",
    location: {
      name: "New Market",
      address: "New Market, Bhopal",
      distance: "1.8 km away",
    },
    sports: ["Football"],
    images: ["/api/placeholder/400/250"],
    amenities: ["Parking", "Changing Rooms", "Lighting", "Equipment Rental"],
    priceRange: { min: 600, max: 1200 },
    rating: 4.4,
    reviewCount: 67,
    isActive: true,
  },
];

const sportsList = [
  "All Sports",
  "Cricket",
  "Football",
  "Basketball",
  "Tennis",
  "Badminton",
];

export default function LocationsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSport, setSelectedSport] = useState("All Sports");
  const [priceRange, setPriceRange] = useState([0, 3000]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const filteredTurfs = mockTurfs.filter((turf) => {
    const matchesSearch =
      turf.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      turf.location.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSport =
      selectedSport === "All Sports" || turf.sports.includes(selectedSport);
    const matchesPrice =
      turf.priceRange.min >= priceRange[0] &&
      turf.priceRange.max <= priceRange[1];
    const matchesAmenities =
      selectedAmenities.length === 0 ||
      selectedAmenities.every((amenity) => turf.amenities.includes(amenity));

    return matchesSearch && matchesSport && matchesPrice && matchesAmenities;
  });

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity],
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Find Sports Turfs Near You
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover and book premium sports facilities in your area with
              real-time availability.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Filters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Search */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Search Location
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search by name or area..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Sport Filter */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Sport
                    </label>
                    <Select
                      value={selectedSport}
                      onValueChange={(value) =>
                        setSelectedSport(value || "All Sports")
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {sportsList.map((sport) => (
                          <SelectItem key={sport} value={sport}>
                            {sport}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
                    </label>
                    <Slider
                      value={priceRange}
                      onValueChange={(value) => {
                        if (Array.isArray(value)) {
                          setPriceRange(value);
                        }
                        setPriceRange([0, 3000]);
                      }}
                      max={3000}
                      min={0}
                      step={100}
                      className="w-full"
                    />
                  </div>

                  {/* Amenities */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Amenities
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "Parking",
                        "Changing Rooms",
                        "Lighting",
                        "Cafeteria",
                        "WiFi",
                        "Equipment Rental",
                      ].map((amenity) => (
                        <Badge
                          key={amenity}
                          variant={
                            selectedAmenities.includes(amenity)
                              ? "default"
                              : "outline"
                          }
                          className="cursor-pointer"
                          onClick={() => toggleAmenity(amenity)}
                        >
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedSport("All Sports");
                      setPriceRange([0, 3000]);
                      setSelectedAmenities([]);
                    }}
                    className="w-full"
                  >
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Results */}
            <div className="lg:col-span-3">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {filteredTurfs.length} Turfs Found
                </h2>
                <Select defaultValue="distance">
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="distance">Distance</SelectItem>
                    <SelectItem value="price">Price</SelectItem>
                    <SelectItem value="rating">Rating</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredTurfs.map((turf) => (
                  <Card
                    key={turf.id}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <div className="relative h-48 w-full">
                      <Image
                        src={turf.images[0]}
                        alt={turf.name}
                        fill
                        className="object-cover rounded-t-lg"
                      />
                      <div className="absolute top-2 right-2 bg-white rounded-full px-2 py-1 text-sm font-medium">
                        ₹{turf.priceRange.min}-{turf.priceRange.max}
                      </div>
                    </div>

                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {turf.name}
                        </h3>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm text-gray-600 ml-1">
                            {turf.rating} ({turf.reviewCount})
                          </span>
                        </div>
                      </div>

                      <p className="text-gray-600 mb-3">{turf.description}</p>

                      <div className="flex items-center text-gray-600 mb-3">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span className="text-sm">
                          {turf.location.address} • {turf.location.distance}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-4">
                        {turf.sports.map((sport) => (
                          <Badge
                            key={sport}
                            variant="secondary"
                            className="text-xs"
                          >
                            {sport}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 text-gray-500">
                          <Car className="h-4 w-4" />
                          <Wifi className="h-4 w-4" />
                          <Camera className="h-4 w-4" />
                        </div>
                        <Link href={`/turf/${turf.id}`}>
                          <Button>View Details</Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredTurfs.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-600">
                    No turfs found matching your criteria. Try adjusting your
                    filters.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
