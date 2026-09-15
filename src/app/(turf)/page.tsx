import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CalendarCheck,
  LayoutDashboard,
  MapPin,
  UserPlus,
  Upload,
  Wallet,
} from "lucide-react";
import HomeAuthCtas from "./_components/home-auth-ctas";

const HERO_IMAGE =
  "https://images.pexels.com/photos/399187/pexels-photo-399187.jpeg?auto=compress&cs=tinysrgb&w=1200";

const GALLERY_IMAGES = [
  {
    src: "https://images.pexels.com/photos/114296/pexels-photo-114296.jpeg?auto=compress&cs=tinysrgb&w=800",
    alt: "Football match on turf",
  },
  {
    src: "https://images.pexels.com/photos/3651674/pexels-photo-3651674.jpeg?auto=compress&cs=tinysrgb&w=800",
    alt: "Cricket batsman on field",
  },
  {
    src: "https://images.pexels.com/photos/47730/the-ball-stadion-football-the-pitch-47730.jpeg?auto=compress&cs=tinysrgb&w=800",
    alt: "Soccer stadium at night",
  },
];

const STEPS = [
  {
    step: 1,
    icon: UserPlus,
    title: "Create your account",
    description: "Sign up as a turf owner and set up your host profile in minutes.",
  },
  {
    step: 2,
    icon: Upload,
    title: "Publish your turf",
    description: "Add photos, pricing, amenities, and location to list your venue.",
  },
  {
    step: 3,
    icon: CalendarCheck,
    title: "Accept bookings",
    description: "Manage requests, confirm slots, and grow your bookings over time.",
  },
];

const FEATURES = [
  {
    icon: MapPin,
    title: "Publish & manage listings",
    description:
      "Add turf details, photos, and pricing. Update availability and keep your listing current.",
  },
  {
    icon: LayoutDashboard,
    title: "Booking dashboard",
    description:
      "Confirm, complete, or cancel bookings from one place. Stay on top of every reservation.",
  },
  {
    icon: Wallet,
    title: "Wallet & payouts",
    description:
      "Track earnings, request withdrawals, and manage payout details with ease.",
  },
];

export default function Home() {
  return (
    <div className="bg-white text-gray-900">
      {/* Hero — text left, image right */}
      <section className="overflow-hidden bg-gradient-to-br from-emerald-50/80 via-white to-sky-50/60">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24">
          <div className="order-2 text-center lg:order-1 lg:text-left">
            <p className="mb-4 font-heading text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
              For turf owners
            </p>
            <h1 className="font-heading mb-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              List Your Turf.
              <br />
              Take Bookings.
              <br />
              <span className="text-emerald-600">Grow Your Business.</span>
            </h1>
            <p className="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-gray-600 lg:mx-0">
              Publish your sports venue, manage time slots, accept bookings, and
              track earnings — all from one simple host dashboard.
            </p>
            <div className="flex justify-center lg:justify-start">
              <HomeAuthCtas variant="hero" />
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="relative mx-auto aspect-[4/3] w-full max-w-xl overflow-hidden rounded-3xl shadow-xl shadow-emerald-900/10 ring-1 ring-black/5 lg:max-w-none">
              <Image
                src={HERO_IMAGE}
                alt="Sports turf field"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="scroll-mt-20 border-t border-gray-100 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="font-heading mb-3 text-3xl font-bold text-gray-900">
              How it works
            </h2>
            <p className="mx-auto max-w-xl text-gray-600">
              Get your turf live and taking bookings in three simple steps.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {STEPS.map(({ step, icon: Icon, title, description }) => (
              <div key={step} className="relative text-center">
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <Icon className="h-7 w-7" />
                </div>
                <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-emerald-600">
                  Step {step}
                </span>
                <h3 className="font-heading mb-2 text-xl font-semibold text-gray-900">
                  {title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-600">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="scroll-mt-20 border-t border-gray-100 bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="font-heading mb-3 text-3xl font-bold text-gray-900">
              Built for turf owners
            </h2>
            <p className="mx-auto max-w-xl text-gray-600">
              Everything you need to publish, manage, and monetize your sports venue.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <Card
                key={title}
                className="border-gray-200 bg-white text-center shadow-sm"
              >
                <CardHeader>
                  <Icon className="mx-auto mb-3 h-10 w-10 text-emerald-600" />
                  <CardTitle className="font-heading text-gray-900">{title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="border-t border-gray-100 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-3">
            {GALLERY_IMAGES.map(({ src, alt }) => (
              <div
                key={src}
                className="relative aspect-[4/3] overflow-hidden rounded-2xl"
              >
                <Image
                  src={src}
                  alt={alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-emerald-500 bg-emerald-600 py-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-heading mb-3 text-3xl font-bold text-white">
            Ready to list your turf?
          </h2>
          <p className="mb-8 text-lg text-emerald-50">
            Join turf owners who publish their venues and take bookings online.
          </p>
          <HomeAuthCtas variant="final" />
        </div>
      </section>
    </div>
  );
}
