"use client";

import { useEffect, useState } from "react";
import ENV_CONFIG from "@/config/env.config";

const GOOGLE_MAPS_SCRIPT_ID = "google-maps-script";
const INIT_CALLBACK = "__googleMapsInit";

let loadPromise: Promise<void> | null = null;
let isLoaded = false;

function markLoaded() {
  isLoaded = true;
  document.getElementById(GOOGLE_MAPS_SCRIPT_ID)?.setAttribute("data-loaded", "true");
}

function registerInitCallback(onReady: () => void) {
  (window as Window & { [INIT_CALLBACK]?: () => void })[INIT_CALLBACK] = () => {
    markLoaded();
    onReady();
  };
}

function loadGoogleMapsScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (isLoaded) return Promise.resolve();
  if (loadPromise) return loadPromise;

  loadPromise = new Promise((resolve, reject) => {
    const apiKey = ENV_CONFIG.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      loadPromise = null;
      reject(new Error("Google Maps API key is not configured"));
      return;
    }

    if (
      document.getElementById(GOOGLE_MAPS_SCRIPT_ID)?.getAttribute("data-loaded") ===
      "true"
    ) {
      markLoaded();
      resolve();
      return;
    }

    const existing = document.getElementById(GOOGLE_MAPS_SCRIPT_ID);
    if (existing) {
      registerInitCallback(resolve);
      const interval = setInterval(() => {
        if (isLoaded) {
          clearInterval(interval);
          resolve();
        }
      }, 100);
      return;
    }

    registerInitCallback(resolve);

    const script = document.createElement("script");
    script.id = GOOGLE_MAPS_SCRIPT_ID;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&loading=async&callback=${INIT_CALLBACK}`;
    script.async = true;
    script.defer = true;
    script.onerror = () => {
      loadPromise = null;
      reject(new Error("Failed to load Google Maps"));
    };
    document.head.appendChild(script);
  });

  return loadPromise;
}

export function useGoogleMapsScript() {
  const [ready, setReady] = useState(isLoaded);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadGoogleMapsScript()
      .then(() => setReady(true))
      .catch((err: Error) => setError(err.message));
  }, []);

  return { ready, error };
}
