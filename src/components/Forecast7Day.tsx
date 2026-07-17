/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { WeatherResponse } from "../types";
import { getWeatherCondition } from "../utils";
import { WeatherIcon } from "./CurrentWeather";
import { Calendar } from "lucide-react";

interface Forecast7DayProps {
  weather: WeatherResponse;
  selectedDayIndex: number;
  onSelectDay: (index: number) => void;
}

export default function Forecast7Day({ weather, selectedDayIndex, onSelectDay }: Forecast7DayProps) {
  const getDayName = (dateStr: string, index: number) => {
    if (index === 0) return "Today";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { weekday: "short" });
  };

  const getFormattedDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  // Find overall max/min across the 7 days to draw scaled temperature range lines
  const overallMax = Math.max(...weather.daily.temperature_2m_max);
  const overallMin = Math.min(...weather.daily.temperature_2m_min);
  const scaleRange = overallMax - overallMin;

  return (
    <div id="forecast-7day-section" className="w-full flex flex-col gap-4">
      {/* Forecast Header */}
      <div className="flex items-center gap-2 text-slate-300">
        <Calendar className="w-5 h-5 text-slate-400" />
        <h3 className="font-display font-semibold text-lg text-white tracking-tight">
          7-Day Intelligence Forecast
        </h3>
        <span className="text-xs text-slate-500 font-mono ml-auto">Click a day to filter metrics</span>
      </div>

      {/* Grid container */}
      <div
        id="forecast-cards-container"
        className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3.5 w-full"
      >
        {weather.daily.time.map((time, index) => {
          const maxTemp = weather.daily.temperature_2m_max[index];
          const minTemp = weather.daily.temperature_2m_min[index];
          const code = weather.daily.weather_code[index];
          const condition = getWeatherCondition(code, true);
          const isSelected = index === selectedDayIndex;

          // Calculate temperature range line bar percentages
          const leftPercent = scaleRange > 0 ? ((minTemp - overallMin) / scaleRange) * 100 : 0;
          const widthPercent = scaleRange > 0 ? ((maxTemp - minTemp) / scaleRange) * 100 : 100;

          return (
            <button
              id={`forecast-card-day-${index}`}
              key={time}
              onClick={() => onSelectDay(index)}
              className={`flex flex-col justify-between items-center text-center p-4 rounded-3xl border transition-all duration-300 relative overflow-hidden group cursor-pointer ${
                isSelected
                  ? "bg-[#1c212c] border-blue-500/80 text-white shadow-xl shadow-blue-500/5 scale-[1.02] z-10"
                  : "bg-[#151921] border-[#2D333F] hover:border-[#3a4253] hover:shadow-lg text-slate-300 active:scale-98"
              }`}
            >
              {/* Glow Accent Indicator for selected card */}
              {isSelected && (
                <div
                  className="absolute -top-10 -right-10 w-20 h-20 rounded-full blur-2xl opacity-40 animate-pulse"
                  style={{ backgroundColor: condition.accentColor }}
                />
              )}

              {/* Day & Date info */}
              <div className="flex flex-col items-center">
                <span className={`text-sm font-semibold font-display tracking-tight ${isSelected ? "text-white" : "text-slate-200"}`}>
                  {getDayName(time, index)}
                </span>
                <span className={`text-[10px] font-mono mt-0.5 tracking-wide ${isSelected ? "text-slate-400" : "text-slate-500"}`}>
                  {getFormattedDate(time)}
                </span>
              </div>

              {/* Icon rendering with subtle group-hover floating animations */}
              <div
                className={`my-4 p-2.5 rounded-2xl transition-colors duration-300 ${
                  isSelected
                    ? "bg-[#0B0E14] border border-[#2D333F] text-white"
                    : `bg-[#0B0E14]/60 border border-[#2D333F]/50 ${condition.colorClass} group-hover:scale-110`
                }`}
              >
                <WeatherIcon name={condition.iconName} className="w-6 h-6" />
              </div>

              {/* Weather code state descriptor */}
              <span className={`text-[10px] font-medium tracking-wide truncate max-w-full ${isSelected ? "text-blue-400" : "text-slate-400"}`}>
                {condition.label}
              </span>

              {/* Detailed temperature numbers */}
              <div className="mt-3 w-full flex flex-col items-center gap-1.5">
                <div className="flex justify-center items-baseline gap-1.5 text-xs font-mono font-semibold">
                  <span className={isSelected ? "text-white" : "text-slate-200"}>{Math.round(maxTemp)}°</span>
                  <span className={isSelected ? "text-slate-500" : "text-slate-600"}>/</span>
                  <span className={isSelected ? "text-slate-400" : "text-slate-400"}>{Math.round(minTemp)}°</span>
                </div>

                {/* Minimalist Temperature Span Bar */}
                <div className={`h-1.5 w-full rounded-full overflow-hidden ${isSelected ? "bg-[#0B0E14]" : "bg-[#0B0E14]/80"}`}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      marginLeft: `${leftPercent}%`,
                      width: `${Math.max(10, widthPercent)}%`,
                      background: isSelected
                        ? `linear-gradient(90deg, ${condition.accentColor}, #3b82f6)`
                        : `linear-gradient(90deg, #1e293b, ${condition.accentColor})`,
                    }}
                  />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
