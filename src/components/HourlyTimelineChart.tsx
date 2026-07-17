/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { WeatherResponse } from "../types";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { AreaChart as ChartIcon, Droplets } from "lucide-react";

interface HourlyTimelineChartProps {
  weather: WeatherResponse;
  selectedDayIndex: number;
}

export default function HourlyTimelineChart({ weather, selectedDayIndex }: HourlyTimelineChartProps) {
  // Extract 24 hours of data for the selected day
  const startHour = selectedDayIndex * 24;
  const endHour = startHour + 24;
  const chartData = [];

  for (let i = startHour; i < endHour; i++) {
    if (weather.hourly && weather.hourly.time[i] !== undefined) {
      const dateObj = new Date(weather.hourly.time[i]);
      const formattedTime = dateObj.toLocaleTimeString("en-US", {
        hour: "numeric",
        hour12: true,
      });

      chartData.push({
        time: formattedTime,
        temp: Math.round(weather.hourly.temperature_2m[i]),
        rain: weather.hourly.precipitation ? parseFloat(weather.hourly.precipitation[i].toFixed(2)) : 0,
      });
    }
  }

  // Custom Tooltip component for Recharts
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#151921]/95 backdrop-blur-md border border-[#2D333F] p-3.5 rounded-2xl shadow-xl font-sans text-xs">
          <p className="font-semibold text-white mb-1">{payload[0].payload.time}</p>
          <div className="flex flex-col gap-1 text-slate-300">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
              Temperature: <strong className="text-white">{payload[0].value}°C</strong>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
              Precipitation: <strong className="text-white">{payload[1]?.value || 0} mm</strong>
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div id="hourly-chart-container" className="bg-[#151921] border border-[#2D333F] rounded-[2rem] p-8 shadow-2xl w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2">
          <ChartIcon className="w-5 h-5 text-slate-400" />
          <h3 className="font-display font-semibold text-lg text-white tracking-tight">
            Hourly Diagnostic Timeline
          </h3>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-semibold font-mono text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            Temperature (°C)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-blue-400" />
            Rain/Precip (mm)
          </span>
        </div>
      </div>

      {/* Recharts Wrapper */}
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorRain" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="time"
              stroke="#5a657c"
              fontSize={9}
              fontFamily="var(--font-mono)"
              tickLine={false}
              axisLine={false}
              dy={10}
              interval={2}
            />
            <YAxis
              yAxisId="left"
              stroke="#5a657c"
              fontSize={9}
              fontFamily="var(--font-mono)"
              tickLine={false}
              axisLine={false}
              dx={-5}
              domain={["auto", "auto"]}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#5a657c"
              fontSize={9}
              fontFamily="var(--font-mono)"
              tickLine={false}
              axisLine={false}
              dx={5}
              domain={[0, "auto"]}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#2D333F", strokeWidth: 1 }} />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="temp"
              stroke="#f59e0b"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorTemp)"
              activeDot={{ r: 6 }}
            />
            <Area
              yAxisId="right"
              type="monotone"
              dataKey="rain"
              stroke="#3b82f6"
              strokeWidth={1.5}
              fillOpacity={1}
              fill="url(#colorRain)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
