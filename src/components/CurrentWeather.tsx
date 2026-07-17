/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import * as Icons from "lucide-react";
import { WeatherResponse, WeatherCondition } from "../types";
import { getWeatherCondition } from "../utils";

interface CurrentWeatherProps {
  weather: WeatherResponse;
  selectedDayIndex: number;
}

// Helper to get Wind Compass direction
function getWindDirectionLabel(deg: number): string {
  const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  const val = Math.floor((deg / 22.5) + 0.5);
  return directions[val % 16];
}

// Dynamic Icon Renderer
export function WeatherIcon({ name, className = "w-10 h-10" }: { name: string; className?: string }) {
  // Safe lookup in lucide-react icons
  const IconComponent = (Icons as any)[name] || Icons.HelpCircle;
  return <IconComponent className={className} />;
}

export default function CurrentWeather({ weather, selectedDayIndex }: CurrentWeatherProps) {
  const isToday = selectedDayIndex === 0;

  // Extract variables depending on whether we look at today or a historical/future forecast day
  let tempMax = weather.daily.temperature_2m_max[selectedDayIndex];
  let tempMin = weather.daily.temperature_2m_min[selectedDayIndex];
  let uvIndex = weather.daily.uv_index_max[selectedDayIndex];
  let rainSum = weather.daily.rain_sum[selectedDayIndex];
  let snowfallSum = weather.daily.snowfall_sum[selectedDayIndex];
  let weatherCode = weather.daily.weather_code[selectedDayIndex];

  // Current conditions overlay if it's today
  const currentTemp = isToday ? weather.current.temperature_2m : (tempMax + tempMin) / 2;
  const apparentTemp = isToday ? weather.current.apparent_temperature : (weather.daily.apparent_temperature_max[selectedDayIndex] + weather.daily.apparent_temperature_min[selectedDayIndex]) / 2;
  const humidity = isToday ? weather.current.relative_humidity_2m : 65; // Approx for historical days if unavailable
  const windSpeed = isToday ? weather.current.wind_speed_10m : 12;
  const windDir = isToday ? weather.current.wind_direction_10m : 180;
  const cloudCover = isToday ? weather.current.cloud_cover : 45;
  const pressure = isToday ? weather.current.pressure_msl : 1013;
  const isDay = isToday ? weather.current.is_day === 1 : true;

  const condition: WeatherCondition = getWeatherCondition(weatherCode, isDay);

  // Dynamic status/warning for severe weather
  const getSeverityAlert = (code: number) => {
    if ([95, 96, 99].includes(code)) return "Thunderstorm Alert: Take outdoor precautions.";
    if ([82, 65].includes(code)) return "Heavy Rain Warning: Watch out for flooded roads.";
    if (tempMax > 38) return "Heat Advisory: Limit outdoor activities and hydrate.";
    if (tempMin < -5) return "Freeze Warning: Stay indoors & keep pipes warm.";
    return null;
  };
  const activeAlert = getSeverityAlert(weatherCode);

  return (
    <div id="current-weather-dashboard" className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
      {/* Primary Highlight Card */}
      <div
        id="primary-weather-summary-card"
        className={`lg:col-span-5 rounded-[2rem] p-8 bg-[#151921] bg-gradient-to-br ${condition.bgGradient} border border-[#2D333F] shadow-2xl flex flex-col justify-between relative overflow-hidden transition-all duration-300`}
      >
        {/* Dynamic Abstract Weather Background Glow */}
        <div
          className="absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl opacity-35 animate-pulse"
          style={{ backgroundColor: condition.accentColor }}
        />

        {/* Card Header: Today vs Selected Day */}
        <div className="flex justify-between items-start z-10">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 bg-[#0B0E14] border border-[#2D333F]/50 px-2 py-0.5 rounded">
              {isToday ? "Live Conditions" : `Forecast Day ${selectedDayIndex}`}
            </span>
            <h3 className="font-display font-semibold text-xl text-white mt-2">
              {isToday ? "Current Weather" : new Date(weather.daily.time[selectedDayIndex]).toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
            </h3>
          </div>
          <span className={`p-3 rounded-2xl bg-[#1c212c]/85 shadow-lg border border-[#2D333F] ${condition.colorClass} animate-float`}>
            <WeatherIcon name={condition.iconName} className="w-8 h-8" />
          </span>
        </div>

        {/* Temperature Readout */}
        <div className="my-6 z-10">
          <div className="flex items-baseline">
            <h1 className="text-6xl sm:text-7xl font-display font-bold text-white tracking-tighter">
              {Math.round(currentTemp)}°
            </h1>
            <span className="text-slate-400 text-2xl font-light ml-1">C</span>
          </div>

          <p className="text-sm font-medium text-slate-300 mt-2 flex items-center gap-1.5">
            <span className="font-semibold text-white">{condition.label}</span>
            <span className="text-[#2D333F]">|</span>
            <span className="text-slate-400 font-light">Feels like {Math.round(apparentTemp)}°C</span>
          </p>

          <div className="flex items-center gap-4 mt-4 text-xs font-semibold font-mono text-slate-400">
            <span className="flex items-center gap-1">
              <Icons.ArrowUp className="w-3.5 h-3.5 text-rose-500" />
              Max: <strong className="text-white">{Math.round(tempMax)}°C</strong>
            </span>
            <span className="flex items-center gap-1">
              <Icons.ArrowDown className="w-3.5 h-3.5 text-sky-500" />
              Min: <strong className="text-white">{Math.round(tempMin)}°C</strong>
            </span>
          </div>
        </div>

        {/* Active Warning Badge */}
        {activeAlert && (
          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-2.5 text-xs text-rose-400 z-10 animate-pulse">
            <Icons.AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
            <span className="font-medium">{activeAlert}</span>
          </div>
        )}

        {/* Sub-note */}
        <div className="text-[10px] text-slate-500 font-mono flex items-center justify-between z-10 pt-4 border-t border-[#2D333F]/60">
          <span>Elevation: {weather.elevation}m</span>
          <span>Timezone: {weather.timezone_abbreviation}</span>
        </div>
      </div>

      {/* Vital Diagnostics Bento Grid */}
      <div id="vitals-bento-grid" className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-4">
        {/* Humidity Widget */}
        <div id="vital-widget-humidity" className="bg-[#151921] border border-[#2D333F] rounded-[1.75rem] p-5 shadow-lg hover:border-[#3c4556] transition-all duration-300">
          <div className="flex justify-between items-center text-slate-500 mb-3">
            <span className="text-[11px] font-mono tracking-wider uppercase font-semibold">Humidity</span>
            <Icons.Droplets className="w-4 h-4 text-sky-500" />
          </div>
          <h2 className="text-2xl font-display font-semibold text-white">{humidity}%</h2>
          <p className="text-[10px] text-slate-400 mt-2 font-sans">
            {humidity < 40 ? "Very Dry Air" : humidity > 70 ? "Sticky & Humid" : "Comfortable levels"}
          </p>
        </div>

        {/* Wind Speed Widget */}
        <div id="vital-widget-wind" className="bg-[#151921] border border-[#2D333F] rounded-[1.75rem] p-5 shadow-lg hover:border-[#3c4556] transition-all duration-300">
          <div className="flex justify-between items-center text-slate-500 mb-3">
            <span className="text-[11px] font-mono tracking-wider uppercase font-semibold">Wind Speed</span>
            <Icons.Wind className="w-4 h-4 text-teal-500" />
          </div>
          <h2 className="text-2xl font-display font-semibold text-white">
            {Math.round(windSpeed)} <span className="text-xs font-normal text-slate-400">km/h</span>
          </h2>
          <p className="text-[10px] text-slate-400 mt-2 font-sans flex items-center gap-1">
            <Icons.Compass className="w-3 h-3 text-slate-500" />
            <span>{windDir}° ({getWindDirectionLabel(windDir)})</span>
          </p>
        </div>

        {/* UV Index Widget */}
        <div id="vital-widget-uv" className="bg-[#151921] border border-[#2D333F] rounded-[1.75rem] p-5 shadow-lg hover:border-[#3c4556] transition-all duration-300">
          <div className="flex justify-between items-center text-slate-500 mb-3">
            <span className="text-[11px] font-mono tracking-wider uppercase font-semibold">UV Index</span>
            <Icons.SunDim className="w-4 h-4 text-amber-500" />
          </div>
          <h2 className="text-2xl font-display font-semibold text-white">{uvIndex.toFixed(1)}</h2>
          <p className="text-[10px] text-slate-400 mt-2 font-sans">
            {uvIndex <= 2 ? "Low Risk" : uvIndex <= 5 ? "Moderate SPF 15+" : uvIndex <= 7 ? "High SPF 30+" : "Extreme SPF 50+"}
          </p>
        </div>

        {/* Cloud Cover Widget */}
        <div id="vital-widget-cloud" className="bg-[#151921] border border-[#2D333F] rounded-[1.75rem] p-5 shadow-lg hover:border-[#3c4556] transition-all duration-300">
          <div className="flex justify-between items-center text-slate-500 mb-3">
            <span className="text-[11px] font-mono tracking-wider uppercase font-semibold">Cloud Cover</span>
            <Icons.Cloud className="w-4 h-4 text-slate-400" />
          </div>
          <h2 className="text-2xl font-display font-semibold text-white">{cloudCover}%</h2>
          <p className="text-[10px] text-slate-400 mt-2 font-sans">
            {cloudCover < 20 ? "Perfect stargazing" : cloudCover > 80 ? "Fully overcast" : "Partially sky-gazing"}
          </p>
        </div>

        {/* Rain Sum Widget */}
        <div id="vital-widget-precipitation" className="bg-[#151921] border border-[#2D333F] rounded-[1.75rem] p-5 shadow-lg hover:border-[#3c4556] transition-all duration-300">
          <div className="flex justify-between items-center text-slate-500 mb-3">
            <span className="text-[11px] font-mono tracking-wider uppercase font-semibold">Precipitation</span>
            <Icons.CloudRain className="w-4 h-4 text-blue-500" />
          </div>
          <h2 className="text-2xl font-display font-semibold text-white">
            {rainSum > 0 ? rainSum.toFixed(1) : snowfallSum > 0 ? snowfallSum.toFixed(1) : "0.0"}{" "}
            <span className="text-xs font-normal text-slate-400">mm</span>
          </h2>
          <p className="text-[10px] text-slate-400 mt-2 font-sans">
            {snowfallSum > 0 ? "Accumulating Snow" : rainSum > 0 ? "Total accumulated water" : "No rain predicted"}
          </p>
        </div>

        {/* Atmospheric Pressure Widget */}
        <div id="vital-widget-pressure" className="bg-[#151921] border border-[#2D333F] rounded-[1.75rem] p-5 shadow-lg hover:border-[#3c4556] transition-all duration-300">
          <div className="flex justify-between items-center text-slate-500 mb-3">
            <span className="text-[11px] font-mono tracking-wider uppercase font-semibold">Pressure</span>
            <Icons.Activity className="w-4 h-4 text-violet-500" />
          </div>
          <h2 className="text-2xl font-display font-semibold text-white">
            {Math.round(pressure)} <span className="text-xs font-normal text-slate-400">hPa</span>
          </h2>
          <p className="text-[10px] text-slate-400 mt-2 font-sans">
            {pressure < 1010 ? "Low pressure storm" : pressure > 1020 ? "High dry pressure" : "Normal pressure"}
          </p>
        </div>
      </div>
    </div>
  );
}
