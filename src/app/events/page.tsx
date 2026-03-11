'use client';

import { useState } from 'react';
import Navbar from '@/components/layout/navbar/navbar';
import Footer from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, Users, MapPin, Plus, Filter } from 'lucide-react';

// Mock data for demonstration
const mockEvents = [
  {
    id: '1',
    title: 'Weekend Cricket Tournament',
    description: 'Join us for an exciting cricket tournament this weekend! Teams of 11 players each.',
    sport: 'Cricket',
    date: '2024-03-15',
    startTime: '09:00',
    endTime: '17:00',
    maxParticipants: 44,
    currentParticipants: 28,
    entryFee: 200,
    organizer: {
      name: 'Rajesh Kumar',
      id: 'user123'
    },
    isPublic: true,
    status: 'upcoming' as const,
    location: 'SportsPlex Arena, MP Nagar',
  },
  {
    id: '2',
    title: 'Football Friendly Match',
    description: 'Looking for players for a casual football match. All skill levels welcome!',
    sport: 'Football',
    date: '2024-03-12',
    startTime: '18:00',
    endTime: '20:00',
    maxParticipants: 22,
    currentParticipants: 18,
    entryFee: 100,
    organizer: {
      name: 'Amit Singh',
      id: 'user456'
    },
    isPublic: true,
    status: 'upcoming' as const,
    location: 'Metro Football Club, New Market',
  },
  {
    id: '3',
    title: 'Basketball Skills Workshop',
    description: 'Learn advanced basketball techniques from experienced coaches.',
    sport: 'Basketball',
    date: '2024-03-18',
    startTime: '10:00',
    endTime: '12:00',
    maxParticipants: 20,
    currentParticipants: 12,
    entryFee: 300,
    organizer: {
      name: 'Coach Sharma',
      id: 'coach789'
    },
    isPublic: true,
    status: 'upcoming' as const,
    location: 'City Basketball Court, Arera Colony',
  },
];

const sportsList = ['All Sports', 'Cricket', 'Football', 'Basketball', 'Tennis', 'Badminton'];

export default function EventsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSport, setSelectedSport] = useState('All Sports');
  const [activeTab, setActiveTab] = useState('browse');

  const filteredEvents = mockEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSport = selectedSport === 'All Sports' || event.sport === selectedSport;
    
    return matchesSearch && matchesSport;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Sports Events & Tournaments</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join exciting sports events, tournaments, and friendly matches in your area.
            </p>
          </div>

          <Tabs defaultValue="browse" className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8">
              <TabsTrigger value="browse">Browse Events</TabsTrigger>
              <TabsTrigger value="create">Create Event</TabsTrigger>
            </TabsList>

            <TabsContent value="browse" className="space-y-6">
              {/* Filters */}
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                  <div className="relative flex-1 max-w-md">
                    <Input
                      placeholder="Search events..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-4"
                    />
                  </div>
                  <Select value={selectedSport} onValueChange={(value) => setSelectedSport(value||'All Sports')}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {sportsList.map(sport => (
                        <SelectItem key={sport} value={sport}>{sport}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="text-sm text-gray-600">
                  {filteredEvents.length} events found
                </div>
              </div>

              {/* Events List */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredEvents.map((event) => (
                  <Card key={event.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl mb-2">{event.title}</CardTitle>
                          <Badge variant="secondary">{event.sport}</Badge>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-green-600">₹{event.entryFee}</p>
                          <p className="text-sm text-gray-600">per person</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="mb-4">{event.description}</CardDescription>
                      
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center text-gray-600">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span className="text-sm">{formatDate(event.date)}</span>
                        </div>
                        
                        <div className="flex items-center text-gray-600">
                          <Clock className="h-4 w-4 mr-2" />
                          <span className="text-sm">{event.startTime} - {event.endTime}</span>
                        </div>
                        
                        <div className="flex items-center text-gray-600">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span className="text-sm">{event.location}</span>
                        </div>
                        
                        <div className="flex items-center text-gray-600">
                          <Users className="h-4 w-4 mr-2" />
                          <span className="text-sm">
                            {event.currentParticipants}/{event.maxParticipants} participants
                          </span>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Registration Progress</span>
                          <span>{Math.round((event.currentParticipants / event.maxParticipants) * 100)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ width: `${(event.currentParticipants / event.maxParticipants) * 100}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Organized by</p>
                          <p className="text-sm font-medium">{event.organizer.name}</p>
                        </div>
                        <Button>
                          {event.currentParticipants >= event.maxParticipants ? 'Event Full' : 'Register Now'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredEvents.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-600">No events found matching your criteria.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="create">
              <Card className="max-w-2xl mx-auto">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Plus className="h-5 w-5 mr-2" />
                    Create New Event
                  </CardTitle>
                  <CardDescription>
                    Organize your own sports event and invite others to join.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <p className="text-gray-600 mb-6">
                      Event creation feature will be integrated with the backend once the events API is ready.
                    </p>
                    <p className="text-sm text-gray-500">
                      For now, please contact support to create an event.
                    </p>
                    <Button variant="outline" className="mt-4">
                      Contact Support
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}