/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { WeatherResponse } from "../types";
import { calculatePlanningMetrics } from "../utils";
import * as Icons from "lucide-react";

interface PlanningIntelligenceProps {
  weather: WeatherResponse;
  selectedDayIndex: number;
}

export default function PlanningIntelligence({ weather, selectedDayIndex }: PlanningIntelligenceProps) {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  // Extract variables for selected day
  const temp = (weather.daily.temperature_2m_max[selectedDayIndex] + weather.daily.temperature_2m_min[selectedDayIndex]) / 2;
  const rainSum = weather.daily.rain_sum[selectedDayIndex];
  const cloudCover = selectedDayIndex === 0 ? weather.current.cloud_cover : 45; // default approximation
  const windSpeed = selectedDayIndex === 0 ? weather.current.wind_speed_10m : 12;
  const uvIndex = weather.daily.uv_index_max[selectedDayIndex];
  const weatherCode = weather.daily.weather_code[selectedDayIndex];

  // Calculate high-fidelity heuristic recommendations
  const metrics = calculatePlanningMetrics(temp, rainSum, cloudCover, windSpeed, uvIndex, weatherCode);

  const toggleChecklist = (item: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [item]: !prev[item],
    }));
  };

  const getScoreColor = (score: number) => {
    if (score >= 75) return { bg: "bg-emerald-50", border: "border-emerald-100", text: "text-emerald-700", fill: "bg-emerald-500", raw: "#10b981" };
    if (score >= 45) return { bg: "bg-amber-50", border: "border-amber-100", text: "text-amber-700", fill: "bg-amber-500", raw: "#f59e0b" };
    return { bg: "bg-rose-50", border: "border-rose-100", text: "text-rose-700", fill: "bg-rose-500", raw: "#f43f5e" };
  };

  const activities = [
    { name: "Running", score: metrics.runningScore, reason: metrics.runningReason, icon: "Activity" },
    { name: "Cycling", score: metrics.cyclingScore, reason: metrics.cyclingReason, icon: "Navigation" },
    { name: "Stargazing", score: metrics.stargazingScore, reason: metrics.stargazingReason, icon: "Eye" },
    { name: "Photography", score: metrics.photographyScore, reason: metrics.photographyReason, icon: "Camera" },
    { name: "Gardening", score: metrics.gardeningScore, reason: metrics.gardeningReason, icon: "Sprout" },
    { name: "Laundry Drying", score: metrics.laundryScore, reason: metrics.laundryReason, icon: "Shirt" },
  ];

  const renderIcon = (name: string, className: string) => {
    const IconComponent = (Icons as any)[name] || Icons.HelpCircle;
    return <IconComponent className={className} />;
  };

  return (
    <div id="planning-intelligence-section" className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
      {/* Dynamic Activity Compatibility Widgets */}
      <div id="activities-dashboard" className="lg:col-span-8 flex flex-col gap-5">
        <div className="flex items-center gap-2 text-slate-300">
          <Icons.Sparkles className="w-5 h-5 text-slate-400" />
          <h3 className="font-display font-semibold text-lg text-white tracking-tight">
            Outdoor & Activity Compatibility Indices
          </h3>
        </div>

        <div id="activity-cards-grid" className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activities.map((act) => {
            const colors = getScoreColor(act.score);
            return (
              <div
                id={`activity-card-${act.name.toLowerCase().replace(/\s+/g, "-")}`}
                key={act.name}
                className="bg-[#151921] border border-[#2D333F] rounded-3xl p-5 shadow-lg flex gap-4 hover:border-[#3c4556] transition-all duration-300"
              >
                {/* Circular Percentage gauge */}
                <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      className="text-[#0B0E14]"
                      strokeWidth="5"
                      stroke="currentColor"
                      fill="transparent"
                    />
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      strokeWidth="5"
                      strokeDasharray={2 * Math.PI * 28}
                      strokeDashoffset={2 * Math.PI * 28 * (1 - act.score / 100)}
                      strokeLinecap="round"
                      stroke={colors.raw}
                      fill="transparent"
                    />
                  </svg>
                  <span className="absolute text-[11px] font-bold font-mono text-white">
                    {act.score}%
                  </span>
                </div>

                {/* Content details */}
                <div className="flex flex-col justify-center min-w-0">
                  <div className="flex items-center gap-2">
                    {renderIcon(act.icon, "w-4.5 h-4.5 text-slate-400")}
                    <h4 className="font-display font-semibold text-sm text-white">{act.name}</h4>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1.5 font-sans leading-relaxed line-clamp-2" title={act.reason}>
                    {act.reason}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Clothing layers, advisory, and checklist */}
      <div id="clothing-checklist-sidebar" className="lg:col-span-4 flex flex-col gap-6">
        {/* Clothing Layer Advisory Widget */}
        <div id="clothing-advisory-card" className="bg-[#151921] border border-[#2D333F] rounded-[2rem] p-6 shadow-2xl flex flex-col justify-between">
          <div className="flex justify-between items-center text-slate-500 mb-4">
            <span className="text-[11px] font-mono tracking-wider uppercase font-semibold">Clothing Outfit Guide</span>
            <Icons.Shirt className="w-5 h-5 text-indigo-400" />
          </div>

          <div className="p-4 bg-[#0B0E14] border border-[#2D333F]/80 rounded-2xl">
            <p className="text-xs font-sans text-slate-300 leading-relaxed font-medium">
              "{metrics.clothingAdvice}"
            </p>
          </div>

          <p className="text-[10px] text-slate-500 font-sans mt-3">
            *Layering recommendations scale adaptively according to humidity, precipitation, and wind speeds.
          </p>
        </div>

        {/* Dynamic Packing Checklist Widget */}
        <div id="packing-checklist-card" className="bg-[#151921] border border-[#2D333F] rounded-[2rem] p-6 shadow-2xl flex-1 flex flex-col">
          <div className="flex justify-between items-center text-slate-500 mb-4">
            <span className="text-[11px] font-mono tracking-wider uppercase font-semibold">Interactive Smart Checklist</span>
            <Icons.CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>

          {metrics.checklist.length > 0 ? (
            <ul className="flex flex-col gap-3">
              {metrics.checklist.map((item) => (
                <li key={item}>
                  <button
                    id={`checklist-item-${item.toLowerCase().replace(/\s+/g, "-")}`}
                    onClick={() => toggleChecklist(item)}
                    className="w-full flex items-start gap-3 text-left group cursor-pointer"
                  >
                    <span
                      className={`w-4.5 h-4.5 border rounded-md flex items-center justify-center shrink-0 transition-all mt-0.5 ${
                        checkedItems[item]
                          ? "bg-blue-600 border-blue-600 text-white"
                          : "border-[#2D333F] text-transparent group-hover:border-slate-500"
                      }`}
                    >
                      <Icons.Check className="w-3.5 h-3.5" />
                    </span>
                    <span
                      className={`text-xs font-sans transition-all leading-snug ${
                        checkedItems[item] ? "text-slate-500 line-through" : "text-slate-300 font-medium group-hover:text-white"
                      }`}
                    >
                      {item}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-6 text-slate-500 text-xs font-sans">
              No specific items needed. Pack light!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
