"use client";

import { parseAddressComponents } from "@/lib/places/address-components";
import { Input } from "@/components/ui/input";
import { useGoogleMapsScript } from "@/lib/hooks/use-google-maps-script";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useRef, useState } from "react";

export interface PlaceSelection {
  address: string;
  latitude: number;
  longitude: number;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
}

interface SuggestionItem {
  id: string;
  label: string;
  placePrediction: google.maps.places.PlacePrediction;
}

interface PlacesAutocompleteProps {
  id?: string;
  value: string;
  onAddressChange: (address: string) => void;
  onPlaceSelect: (place: PlaceSelection) => void;
  disabled?: boolean;
  placeholder?: string;
  errorMessage?: string;
  helperText?: string;
}

function getLatLng(location: google.maps.LatLng | google.maps.LatLngLiteral) {
  if (typeof (location as google.maps.LatLng).lat === "function") {
    const latLng = location as google.maps.LatLng;
    return { lat: latLng.lat(), lng: latLng.lng() };
  }

  const literal = location as google.maps.LatLngLiteral;
  return { lat: literal.lat, lng: literal.lng };
}

export function PlacesAutocomplete({
  id,
  value,
  onAddressChange,
  onPlaceSelect,
  disabled,
  placeholder = "Search for an address",
  errorMessage,
  helperText,
}: PlacesAutocompleteProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sessionTokenRef = useRef<google.maps.places.AutocompleteSessionToken | null>(
    null,
  );
  const requestIdRef = useRef(0);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { ready, error } = useGoogleMapsScript();
  const [inputValue, setInputValue] = useState(value);
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setSuggestions([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(
    () => () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    },
    [],
  );

  const ensureSessionToken = useCallback(async () => {
    if (!sessionTokenRef.current) {
      const { AutocompleteSessionToken } =
        (await google.maps.importLibrary("places")) as google.maps.PlacesLibrary;
      sessionTokenRef.current = new AutocompleteSessionToken();
    }

    return sessionTokenRef.current;
  }, []);

  const refreshSessionToken = useCallback(async () => {
    const { AutocompleteSessionToken } =
      (await google.maps.importLibrary("places")) as google.maps.PlacesLibrary;
    sessionTokenRef.current = new AutocompleteSessionToken();
  }, []);

  const fetchSuggestions = useCallback(
    async (input: string) => {
      if (!input.trim()) {
        setSuggestions([]);
        return;
      }

      const requestId = ++requestIdRef.current;

      try {
        const { AutocompleteSuggestion } =
          (await google.maps.importLibrary("places")) as google.maps.PlacesLibrary;
        const sessionToken = await ensureSessionToken();

        const { suggestions: results } =
          await AutocompleteSuggestion.fetchAutocompleteSuggestions({
            input,
            sessionToken,
            region: "in",
          });

        if (requestId !== requestIdRef.current) return;

        setSuggestions(
          results.flatMap((suggestion, index) => {
            const placePrediction = suggestion.placePrediction;
            if (!placePrediction) return [];

            return [
              {
                id: placePrediction.placeId ?? `${index}-${placePrediction.text}`,
                label: placePrediction.text.toString(),
                placePrediction,
              },
            ];
          }),
        );
      } catch {
        if (requestId === requestIdRef.current) {
          setSuggestions([]);
        }
      }
    },
    [ensureSessionToken],
  );

  const handleInputChange = (next: string) => {
    setInputValue(next);
    onAddressChange(next);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      void fetchSuggestions(next);
    }, 300);
  };

  const handleSelect = (item: SuggestionItem) => async () => {
    const label = item.label;
    setInputValue(label);
    onAddressChange(label);
    setSuggestions([]);
    requestIdRef.current++;

    try {
      const place = item.placePrediction.toPlace();
      await place.fetchFields({
        fields: ["formattedAddress", "location", "addressComponents"],
      });

      const address = place.formattedAddress ?? label;
      const location = place.location;
      const { city, state, zip, country } = parseAddressComponents(
        place.addressComponents,
      );

      if (location) {
        const { lat, lng } = getLatLng(location);
        onPlaceSelect({
          address,
          latitude: lat,
          longitude: lng,
          city,
          state,
          zip,
          country,
        });
        setInputValue(address);
        onAddressChange(address);
      }
    } catch {
      // Address is still set; coordinates require a valid selection.
    } finally {
      await refreshSessionToken();
    }
  };

  if (error) {
    return (
      <div className="space-y-2">
        <Input
          id={id}
          value={value}
          onChange={(e) => onAddressChange(e.target.value)}
          disabled={disabled}
          placeholder="Enter address manually"
        />
        <p className="text-xs text-muted-foreground">{error}</p>
        {errorMessage ? (
          <p className="text-sm text-destructive">{errorMessage}</p>
        ) : helperText ? (
          <p className="text-xs text-muted-foreground">{helperText}</p>
        ) : null}
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      <Input
        id={id}
        value={inputValue}
        onChange={(e) => handleInputChange(e.target.value)}
        disabled={disabled || !ready}
        placeholder={ready ? placeholder : "Loading maps…"}
        autoComplete="off"
      />
      {suggestions.length > 0 ? (
        <ul
          className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border bg-popover py-1 text-popover-foreground shadow-md ring-1 ring-foreground/10"
          role="listbox"
        >
          {suggestions.map((suggestion) => (
            <li key={suggestion.id} role="option">
              <button
                type="button"
                className={cn(
                  "w-full px-2.5 py-2 text-left text-sm",
                  "hover:bg-accent hover:text-accent-foreground",
                )}
                onMouseDown={(e) => e.preventDefault()}
                onClick={handleSelect(suggestion)}
              >
                {suggestion.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
      {errorMessage ? (
        <p className="mt-2 text-sm text-destructive">{errorMessage}</p>
      ) : helperText ? (
        <p className="mt-2 text-xs text-muted-foreground">{helperText}</p>
      ) : null}
    </div>
  );
}
