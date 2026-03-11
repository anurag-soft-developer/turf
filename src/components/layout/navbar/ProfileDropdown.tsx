import { Button } from "@/components/ui/button";
import { useLogout, useProfile } from "@/lib/hooks/auth";
import {
  User,
  ChevronDown,
  Settings,
  Bell,
  LogOut,
  Loader,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const ProfileDropdown = () => {
  const { data, isLoading } = useProfile();
  const logoutMutation = useLogout();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const linkButtons = [
    {
      href: "/dashboard",
      icon: <User className="w-4 h-4" />,
      label: "Dashboard",
    },
    {
      href: "/settings",
      icon: <Settings className="w-4 h-4" />,
      label: "Settings",
    },

    {
      href: "/notifications",
      icon: <Bell className="w-4 h-4" />,
      label: "Notifications",
    },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (isLoading)
    return (
      <>
        <Loader />
      </>
    );

  if (!data)
    return (
      <>
        <Link href="/auth/login">
          <Button variant="ghost" className="w-full">
            Sign In
          </Button>
        </Link>
        <Link href="/auth/register">
          <Button className="w-full">Get Started</Button>
        </Link>
      </>
    );

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        className="w-full cursor-pointer flex items-center gap-2 p-2"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
          {data?.avatar ? (
            <img
              src={data.avatar}
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <User className="w-4 h-4 text-white" />
          )}
        </div>
        <span className="hidden sm:block text-sm font-medium">
          {data.fullName}
        </span>
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
        />
      </Button>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          {linkButtons.map(({ href, icon, label }) => {
            return (
              <>
                <Link
                  href={href}
                  className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  {icon}
                  {label}
                </Link>
              </>
            );
          })}
          <hr className="my-1 border-gray-200" />
          <button
            className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
            onClick={async () => {
              setIsDropdownOpen(false);
              await logoutMutation.mutateAsync();
            }}
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
