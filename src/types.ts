/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CitySuggestion {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  feature_code?: string;
  country_code?: string;
  admin1?: string;
  country: string;
  admin2?: string;
  admin3?: string;
  admin4?: string;
}

export interface CurrentWeatherData {
  time: string;
  interval: number;
  temperature_2m: number;
  relative_humidity_2m: number;
  apparent_temperature: number;
  is_day: number;
  precipitation: number;
  rain: number;
  showers: number;
  snowfall: number;
  weather_code: number;
  cloud_cover: number;
  pressure_msl: number;
  wind_speed_10m: number;
  wind_direction_10m: number;
}

export interface DailyWeatherData {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  apparent_temperature_max: number[];
  apparent_temperature_min: number[];
  uv_index_max: number[];
  precipitation_sum: number[];
  rain_sum: number[];
  showers_sum: number[];
  snowfall_sum: number[];
}

export interface HourlyWeatherData {
  time: string[];
  temperature_2m: number[];
  precipitation_probability: number[];
  precipitation: number[];
  weather_code: number[];
}

export interface WeatherResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current: CurrentWeatherData;
  hourly: HourlyWeatherData;
  daily: DailyWeatherData;
}

export interface WeatherCondition {
  label: string;
  iconName: string;
  colorClass: string;
  accentColor: string;
  bgGradient: string;
}

export interface PlanningMetrics {
  runningScore: number;
  runningReason: string;
  cyclingScore: number;
  cyclingReason: string;
  stargazingScore: number;
  stargazingReason: string;
  photographyScore: number;
  photographyReason: string;
  gardeningScore: number;
  gardeningReason: string;
  laundryScore: number;
  laundryReason: string;
  checklist: string[];
  clothingAdvice: string;
}
