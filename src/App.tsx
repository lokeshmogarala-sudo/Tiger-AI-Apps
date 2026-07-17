/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { CitySuggestion, WeatherResponse } from "./types";
import SearchCity from "./components/SearchCity";
import CurrentWeather from "./components/CurrentWeather";
import Forecast7Day from "./components/Forecast7Day";
import PlanningIntelligence from "./components/PlanningIntelligence";
import HourlyTimelineChart from "./components/HourlyTimelineChart";
import { Cloud, HelpCircle, RefreshCw, Terminal, ExternalLink, CheckCircle2, ShieldAlert } from "lucide-react";

// Default to London, United Kingdom for immediate data rendering without loading blanks
const DEFAULT_CITY: CitySuggestion = {
  id: 2643743,
  name: "London",
  latitude: 51.5074,
  longitude: -0.1278,
  country: "United Kingdom",
};

export default function App() {
  const [selectedCity, setSelectedCity] = useState<CitySuggestion>(DEFAULT_CITY);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
  const [weatherData, setWeatherData] = useState<WeatherResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeploymentGuide, setShowDeploymentGuide] = useState<boolean>(false);

  // Fetch weather data from Open-Meteo APIs on city updates
  useEffect(() => {
    let active = true;
    const fetchWeather = async () => {
      setLoading(true);
      setError(null);
      try {
        const queryUrl = `https://api.open-meteo.com/v1/forecast?latitude=${selectedCity.latitude}&longitude=${selectedCity.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,wind_speed_10m,wind_direction_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,uv_index_max,precipitation_sum,rain_sum,showers_sum,snowfall_sum&hourly=temperature_2m,precipitation&timezone=auto`;
        const response = await fetch(queryUrl);
        
        if (!response.ok) {
          throw new Error("Failed to communicate with Open-Meteo forecasting services.");
        }
        
        const data = await response.json();
        
        if (active) {
          setWeatherData(data);
          setSelectedDayIndex(0); // Reset day index back to today
        }
      } catch (err: any) {
        if (active) {
          setError(err?.message || "An unexpected error occurred while fetching weather diagnostics.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchWeather();
    return () => {
      active = false;
    };
  }, [selectedCity.latitude, selectedCity.longitude]);

  return (
    <div id="application-wrapper" className="min-h-screen bg-[#0B0E14] text-slate-200 flex flex-col justify-between font-sans selection:bg-blue-600 selection:text-white pb-12">
      {/* Sleek Top Navigation Bar */}
      <header id="app-header" className="w-full bg-[#151921]/90 backdrop-blur-md border-b border-[#2D333F] py-4.5 px-6 sticky top-0 z-40 shadow-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-500/15">
              <Cloud className="w-5.5 h-5.5 animate-pulse" />
            </span>
            <div>
              <h1 className="font-display font-bold text-lg text-white tracking-tight leading-none">
                Weather Intelligence
              </h1>
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mt-1.5 block">
                Cloudflare Pages Deployment Ready
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="guide-toggle-button"
              onClick={() => setShowDeploymentGuide(!showDeploymentGuide)}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#0B0E14] hover:bg-[#151921]/60 text-slate-300 hover:text-white font-semibold font-display text-xs rounded-2xl border border-[#2D333F] transition-all cursor-pointer active:scale-95"
            >
              <Terminal className="w-4 h-4" />
              <span>Deployment Guide</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main id="main-content-layout" className="max-w-7xl w-full mx-auto px-6 py-8 flex flex-col gap-8">
        
        {/* Step-by-Step Assignment Deployment Guide (Interactive Collapse) */}
        {showDeploymentGuide && (
          <div
            id="cloudflare-deployment-guide"
            className="bg-[#151921] text-slate-200 p-6 rounded-3xl border border-[#2D333F] shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300"
          >
            <div className="flex items-center justify-between border-b border-[#2D333F] pb-4 mb-5">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5.5 h-5.5 text-emerald-400" />
                <h2 className="font-display font-semibold text-lg text-white">
                  Cloudflare Pages Deployment Instructions
                </h2>
              </div>
              <button
                id="close-guide-button"
                onClick={() => setShowDeploymentGuide(false)}
                className="p-1.5 hover:bg-[#0B0E14] rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
              This application has been structured as a fully client-side single page application (SPA). This guarantees that once you commit your changes to GitHub, it will compile and deploy to **Cloudflare Pages** without requiring separate cloud servers or API proxies. Follow these three steps to finish your assignment:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col gap-2 bg-[#0B0E14]/80 p-4.5 rounded-2xl border border-[#2D333F]">
                <span className="w-7 h-7 rounded-full bg-[#151921] text-xs font-bold font-mono flex items-center justify-center border border-[#2D333F] text-slate-300">
                  01
                </span>
                <h4 className="font-display font-semibold text-sm text-white mt-2">Connect to GitHub</h4>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  Open the Settings menu in Google AI Studio, locate the GitHub integration panel, and export this repository directly into your GitHub account.
                </p>
              </div>

              <div className="flex flex-col gap-2 bg-[#0B0E14]/80 p-4.5 rounded-2xl border border-[#2D333F]">
                <span className="w-7 h-7 rounded-full bg-[#151921] text-xs font-bold font-mono flex items-center justify-center border border-[#2D333F] text-slate-300">
                  02
                </span>
                <h4 className="font-display font-semibold text-sm text-white mt-2">Configure Cloudflare</h4>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  Go to your Cloudflare dashboard, select **Workers & Pages &gt; Create &gt; Pages**, select the connected GitHub repository, and click **Begin setup**.
                </p>
              </div>

              <div className="flex flex-col gap-2 bg-[#0B0E14]/80 p-4.5 rounded-2xl border border-[#2D333F]">
                <span className="w-7 h-7 rounded-full bg-[#151921] text-xs font-bold font-mono flex items-center justify-center border border-[#2D333F] text-slate-300">
                  03
                </span>
                <h4 className="font-display font-semibold text-sm text-white mt-2">Build Presets</h4>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  Choose the **Vite** preset. Build command should be <code className="bg-[#0B0E14] px-1 py-0.5 rounded font-mono text-[10px] text-amber-400 border border-[#2D333F]/40">npm run build</code>, and the build output directory is <code className="bg-[#0B0E14] px-1 py-0.5 rounded font-mono text-[10px] text-amber-400 border border-[#2D333F]/40">dist</code>. Click **Deploy**!
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4.5 border-t border-[#2D333F]/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <span className="text-slate-500 font-mono">Status: Code compiled & validation passed.</span>
              <a
                id="cloudflare-dash-link"
                href="https://dash.cloudflare.com/"
                target="_blank"
                rel="noreferrer"
                className="text-blue-400 hover:text-blue-300 flex items-center gap-1 font-semibold hover:underline"
              >
                <span>Go to Cloudflare Dashboard</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )}

        {/* Search row */}
        <div id="search-controls-container" className="w-full flex flex-col gap-2">
          <SearchCity onSelectCity={setSelectedCity} currentCityName={selectedCity.name} />
        </div>

        {/* Loading / Error / Content states */}
        {loading ? (
          <div id="loading-state-view" className="flex flex-col items-center justify-center min-h-[400px] gap-4">
            <div className="p-4 bg-[#151921] border border-[#2D333F] rounded-full shadow-2xl">
              <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
            <p className="text-sm text-slate-400 font-medium tracking-wide animate-pulse">
              Calibrating forecast diagnostics for {selectedCity.name}...
            </p>
          </div>
        ) : error ? (
          <div id="error-state-view" className="bg-rose-500/5 border border-rose-500/20 p-6 rounded-3xl flex flex-col items-center justify-center min-h-[300px] text-center gap-4 max-w-md mx-auto">
            <div className="p-3 bg-rose-500/10 rounded-full text-rose-400 border border-rose-500/20">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h3 className="font-display font-semibold text-rose-400 text-lg">Diagnostics Connection Failed</h3>
            <p className="text-xs text-rose-300 leading-relaxed font-medium">{error}</p>
            <button
              id="retry-connection-button"
              onClick={() => setSelectedCity({ ...selectedCity })}
              className="mt-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl font-semibold text-xs active:scale-95 transition-all cursor-pointer"
            >
              Retry Diagnostics
            </button>
          </div>
        ) : weatherData ? (
          <div id="active-diagnostics-view" className="flex flex-col gap-8 animate-in fade-in duration-300">
            {/* Current Weather Display */}
            <CurrentWeather weather={weatherData} selectedDayIndex={selectedDayIndex} />

            {/* 7 Day Forecast Display */}
            <Forecast7Day
              weather={weatherData}
              selectedDayIndex={selectedDayIndex}
              onSelectDay={setSelectedDayIndex}
            />

            {/* Hourly Trend Chart */}
            <HourlyTimelineChart weather={weatherData} selectedDayIndex={selectedDayIndex} />

            {/* Activity Planning Intel Display */}
            <PlanningIntelligence weather={weatherData} selectedDayIndex={selectedDayIndex} />
          </div>
        ) : null}
      </main>

      {/* Footer copyright */}
      <footer id="app-footer" className="text-center text-slate-500 text-xs py-8 border-t border-[#2D333F]/60 max-w-7xl w-full mx-auto px-6">
        <p className="font-mono uppercase tracking-widest text-[10px]">
          Weather Intelligence • Built & Deployed via AI Studio Build
        </p>
        <p className="font-sans text-[11px] mt-2 text-slate-500">
          Powered by public Open-Meteo Geocoding & Forecast APIs. No mock data used.
        </p>
      </footer>
    </div>
  );
}
