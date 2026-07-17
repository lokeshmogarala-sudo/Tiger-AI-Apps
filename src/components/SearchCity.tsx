/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { Search, MapPin, Loader2, X, Compass } from "lucide-react";
import { CitySuggestion } from "../types";

interface SearchCityProps {
  onSelectCity: (city: CitySuggestion) => void;
  currentCityName: string;
}

export default function SearchCity({ onSelectCity, currentCityName }: SearchCityProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debouncing API call
  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
            query.trim()
          )}&count=6&language=en&format=json`
        );
        const data = await response.json();
        if (data.results) {
          setSuggestions(data.results);
        } else {
          setSuggestions([]);
        }
      } catch (error) {
        console.error("Geocoding fetch error:", error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  // Handle outside clicks to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (city: CitySuggestion) => {
    onSelectCity(city);
    setQuery("");
    setIsOpen(false);
    setActiveIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
    if (!isOpen || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === "Enter") {
      if (activeIndex >= 0 && activeIndex < suggestions.length) {
        handleSelect(suggestions[activeIndex]);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // Reverse geocoding or direct fetch
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await response.json();
          const cityName = data.address?.city || data.address?.town || data.address?.village || "Current Location";
          const countryName = data.address?.country || "";
          
          onSelectCity({
            id: Date.now(),
            name: cityName,
            latitude,
            longitude,
            country: countryName,
            admin1: data.address?.state || undefined,
          });
        } catch {
          // Fallback to anonymous coordinates if reverse lookup fails
          onSelectCity({
            id: Date.now(),
            name: "My Location",
            latitude,
            longitude,
            country: "GPS Coordinates",
          });
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("Could not access location. Please make sure location permissions are enabled.");
        setLoading(false);
      }
    );
  };

  return (
    <div id="search-city-container" className="relative w-full max-w-lg mx-auto z-50" ref={dropdownRef}>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
            ) : (
              <Search className="w-5 h-5" />
            )}
          </span>
          <input
            id="city-search-input"
            type="text"
            className="w-full pl-11 pr-10 py-3.5 bg-[#151921] text-slate-100 border border-[#2D333F] rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all font-sans text-sm tracking-wide placeholder-slate-500"
            placeholder={`Search city (e.g. London, Tokyo, New York)...`}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
              setActiveIndex(-1);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
          />
          {query && (
            <button
              id="clear-search-button"
              onClick={() => {
                setQuery("");
                setSuggestions([]);
              }}
              className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <button
          id="geolocation-button"
          onClick={handleCurrentLocation}
          title="Use current GPS location"
          className="p-3.5 bg-[#151921] hover:bg-[#1c212c] border border-[#2D333F] rounded-2xl shadow-lg text-slate-300 hover:text-white active:scale-95 transition-all cursor-pointer"
        >
          <Compass className="w-5 h-5" />
        </button>
      </div>

      {isOpen && (suggestions.length > 0 || (query.trim().length >= 2 && !loading)) && (
        <div
          id="search-dropdown-menu"
          className="absolute w-full mt-2 bg-[#151921]/95 backdrop-blur-md border border-[#2D333F] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50"
        >
          {suggestions.length > 0 ? (
            <ul className="py-2 divide-y divide-[#2D333F]/40">
              {suggestions.map((city, index) => (
                <li key={city.id}>
                  <button
                    id={`city-suggestion-option-${index}`}
                    onClick={() => handleSelect(city)}
                    className={`w-full px-5 py-3.5 text-left flex items-start gap-3 transition-colors ${
                      index === activeIndex ? "bg-[#1c212c] text-white" : "hover:bg-[#1c212c]/70 text-slate-300"
                    }`}
                  >
                    <MapPin className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
                    <div className="flex flex-col">
                      <span className="font-semibold text-white text-sm">
                        {city.name}
                      </span>
                      <span className="text-xs text-slate-400 mt-0.5">
                        {city.admin1 ? `${city.admin1}, ` : ""}
                        {city.country}
                        <span className="ml-2 px-1.5 py-0.5 bg-[#0B0E14] rounded text-[10px] font-mono tracking-normal text-slate-400 border border-[#2D333F]/40">
                          Lat: {city.latitude.toFixed(2)}°, Lon: {city.longitude.toFixed(2)}°
                        </span>
                      </span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div id="city-not-found-message" className="px-5 py-5 text-center text-slate-400 text-sm font-sans flex flex-col items-center gap-1.5 animate-in fade-in zoom-in-95 duration-150">
              <span className="font-bold text-rose-400 tracking-wide uppercase text-xs">City not found</span>
              <span className="text-xs text-slate-500">Please check the spelling or search for another city</span>
            </div>
          )}
        </div>
      )}

      {/* Breadcrumb banner indicating current city */}
      {currentCityName && !isOpen && (
        <div id="active-location-badge" className="mt-3 flex items-center justify-center gap-1.5 text-xs font-semibold text-blue-400 tracking-wider uppercase font-display bg-blue-500/10 max-w-fit mx-auto px-4.5 py-2 rounded-full border border-blue-500/20 shadow-sm shadow-blue-500/5">
          <MapPin className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
          <span>Viewing: <strong className="text-white">{currentCityName}</strong></span>
        </div>
      )}
    </div>
  );
}
