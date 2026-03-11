"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import ProfileDropdown from "./ProfileDropdown";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-lg fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <h1 className="text-2xl font-bold text-green-600">TurfBooking</h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/catalog"
              className="text-gray-600 hover:text-green-600 px-3 py-2 text-sm font-medium"
            >
              Sports Catalog
            </Link>
            <Link
              href="/locations"
              className="text-gray-600 hover:text-green-600 px-3 py-2 text-sm font-medium"
            >
              Find Turfs
            </Link>
            <Link
              href="/events"
              className="text-gray-600 hover:text-green-600 px-3 py-2 text-sm font-medium"
            >
              Events
            </Link>
            <Link
              href="/friendly-matches"
              className="text-gray-600 hover:text-green-600 px-3 py-2 text-sm font-medium"
            >
              Friendly Matches
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <ProfileDropdown />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
            <Link
              href="/catalog"
              className="text-gray-600 hover:text-green-600 block px-3 py-2 text-sm font-medium"
            >
              Sports Catalog
            </Link>
            <Link
              href="/locations"
              className="text-gray-600 hover:text-green-600 block px-3 py-2 text-sm font-medium"
            >
              Find Turfs
            </Link>
            <Link
              href="/events"
              className="text-gray-600 hover:text-green-600 block px-3 py-2 text-sm font-medium"
            >
              Events
            </Link>
            <Link
              href="/friendly-matches"
              className="text-gray-600 hover:text-green-600 block px-3 py-2 text-sm font-medium"
            >
              Friendly Matches
            </Link>
            <div className="border-t border-gray-200 pt-4 pb-3">
              <div className="flex flex-col space-y-2 px-3">
                <ProfileDropdown />
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
