import Navbar from "@/components/layout/navbar/navbar";
import Footer from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users, MapPin, Trophy, Play } from "lucide-react";

// Mock data for friendly matches
const mockMatches = [
  {
    id: "1",
    title: "Evening Cricket Match",
    sport: "Cricket",
    date: "2024-03-10",
    time: "17:00",
    duration: "2 hours",
    location: "SportsPlex Arena, MP Nagar",
    organizer: "Rajesh Kumar",
    participantsNeeded: 6,
    totalSlots: 11,
    skillLevel: "Intermediate",
    description:
      "Looking for players for a friendly cricket match. Bring your own kit.",
    status: "open" as const,
  },
  {
    id: "2",
    title: "Sunday Football Game",
    sport: "Football",
    date: "2024-03-12",
    time: "09:00",
    duration: "90 minutes",
    location: "Metro Football Club, New Market",
    organizer: "Amit Singh",
    participantsNeeded: 4,
    totalSlots: 11,
    skillLevel: "Beginner",
    description:
      "Casual football match for fitness and fun. All skill levels welcome!",
    status: "open" as const,
  },
  {
    id: "3",
    title: "Basketball Pickup Game",
    sport: "Basketball",
    date: "2024-03-11",
    time: "18:30",
    duration: "1 hour",
    location: "City Basketball Court, Arera Colony",
    organizer: "Priya Sharma",
    participantsNeeded: 2,
    totalSlots: 10,
    skillLevel: "Mixed",
    description: "3v3 basketball game. Come and show your skills!",
    status: "open" as const,
  },
  {
    id: "4",
    title: "Tennis Doubles Match",
    sport: "Tennis",
    date: "2024-03-09",
    time: "16:00",
    duration: "1.5 hours",
    location: "Elite Tennis Club, Shahpura",
    organizer: "Suresh Patel",
    participantsNeeded: 0,
    totalSlots: 4,
    skillLevel: "Advanced",
    description: "Competitive doubles match for experienced players.",
    status: "full" as const,
  },
];

const skillLevelColors = {
  Beginner: "bg-green-100 text-green-800",
  Intermediate: "bg-yellow-100 text-yellow-800",
  Advanced: "bg-red-100 text-red-800",
  Mixed: "bg-blue-100 text-blue-800",
};

function formatDate(dateString: string) {
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === today.toDateString()) {
    return "Today";
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return "Tomorrow";
  } else {
    return date.toLocaleDateString("en-IN", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  }
}

export default function FriendlyMatchesPage() {
  const openMatches = mockMatches.filter((match) => match.status === "open");
  const fullMatches = mockMatches.filter((match) => match.status === "full");

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Friendly Matches
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join casual sports matches in your area. Perfect for staying fit
              and meeting new people!
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="text-center">
              <CardContent className="p-6">
                <Play className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">
                  {openMatches.length}
                </div>
                <div className="text-sm text-gray-600">Open Matches</div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">
                  {mockMatches.reduce(
                    (sum, match) =>
                      sum + (match.totalSlots - match.participantsNeeded),
                    0,
                  )}
                </div>
                <div className="text-sm text-gray-600">Active Players</div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <Trophy className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">4</div>
                <div className="text-sm text-gray-600">Sports Available</div>
              </CardContent>
            </Card>
          </div>

          {/* Open Matches */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Join a Match
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {openMatches.map((match) => (
                <Card
                  key={match.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{match.title}</CardTitle>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="secondary">{match.sport}</Badge>
                          <Badge
                            variant="outline"
                            className={
                              skillLevelColors[
                                match.skillLevel as keyof typeof skillLevelColors
                              ]
                            }
                          >
                            {match.skillLevel}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">Spots left</div>
                        <div className="text-2xl font-bold text-green-600">
                          {match.participantsNeeded}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{match.description}</p>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span className="text-sm">
                          {formatDate(match.date)} at {match.time}
                        </span>
                      </div>

                      <div className="flex items-center text-gray-600">
                        <Clock className="h-4 w-4 mr-2" />
                        <span className="text-sm">{match.duration}</span>
                      </div>

                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span className="text-sm">{match.location}</span>
                      </div>

                      <div className="flex items-center text-gray-600">
                        <Users className="h-4 w-4 mr-2" />
                        <span className="text-sm">
                          Organized by {match.organizer} •{" "}
                          {match.totalSlots - match.participantsNeeded}/
                          {match.totalSlots} joined
                        </span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{
                            width: `${((match.totalSlots - match.participantsNeeded) / match.totalSlots) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600">
                        Free to join
                      </span>
                      <Button>Join Match</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Upcoming Full Matches */}
          {fullMatches.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Upcoming Matches (Full)
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {fullMatches.map((match) => (
                  <Card key={match.id} className="opacity-75">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl text-gray-600">
                            {match.title}
                          </CardTitle>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="secondary">{match.sport}</Badge>
                            <Badge
                              variant="outline"
                              className="bg-gray-100 text-gray-600"
                            >
                              Full
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span className="text-sm">
                            {formatDate(match.date)} at {match.time}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span className="text-sm">{match.location}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Create Match CTA */}
          <Card className="bg-gradient-to-r from-green-50 to-blue-50">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Organize Your Own Match
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Can't find a match that fits your schedule? Create your own and
                invite players from the community.
              </p>
              <Button size="lg" disabled>
                Create Match (Coming Soon)
              </Button>
              <div className="text-sm text-gray-500 mt-4">
                * This feature will be available once user authentication is set
                up
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}
