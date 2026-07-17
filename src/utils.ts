/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { WeatherCondition, PlanningMetrics } from "./types";

/**
 * Maps WMO Weather Codes (0-99) to elegant metadata including labels, icons, and theme gradients.
 */
export function getWeatherCondition(code: number, isDay: boolean = true): WeatherCondition {
  switch (code) {
    case 0:
      return {
        label: isDay ? "Clear Sky" : "Clear Night",
        iconName: isDay ? "Sun" : "Moon",
        colorClass: isDay ? "text-amber-500" : "text-indigo-400",
        accentColor: isDay ? "#f59e0b" : "#818cf8",
        bgGradient: isDay
          ? "from-amber-500/10 via-orange-500/5 to-transparent"
          : "from-indigo-900/20 via-slate-900/10 to-transparent",
      };
    case 1:
    case 2:
      return {
        label: isDay ? "Partly Cloudy" : "Partly Cloudy Night",
        iconName: isDay ? "CloudSun" : "CloudMoon",
        colorClass: isDay ? "text-sky-500" : "text-slate-400",
        accentColor: isDay ? "#0ea5e9" : "#94a3b8",
        bgGradient: isDay
          ? "from-sky-500/10 via-blue-500/5 to-transparent"
          : "from-slate-800/20 via-slate-900/10 to-transparent",
      };
    case 3:
      return {
        label: "Overcast",
        iconName: "Cloud",
        colorClass: "text-slate-500",
        accentColor: "#64748b",
        bgGradient: "from-slate-500/15 via-zinc-500/5 to-transparent",
      };
    case 45:
    case 48:
      return {
        label: "Foggy",
        iconName: "CloudFog",
        colorClass: "text-zinc-400",
        accentColor: "#a1a1aa",
        bgGradient: "from-zinc-400/15 via-neutral-400/5 to-transparent",
      };
    case 51:
    case 53:
    case 55:
      return {
        label: "Drizzle",
        iconName: "CloudDrizzle",
        colorClass: "text-teal-500",
        accentColor: "#14b8a6",
        bgGradient: "from-teal-500/10 via-emerald-500/5 to-transparent",
      };
    case 56:
    case 57:
    case 66:
    case 67:
      return {
        label: "Freezing Rain",
        iconName: "CloudSnow",
        colorClass: "text-cyan-400",
        accentColor: "#22d3ee",
        bgGradient: "from-cyan-500/15 via-blue-500/5 to-transparent",
      };
    case 61:
    case 63:
    case 65:
      return {
        label: "Rainy",
        iconName: "CloudRain",
        colorClass: "text-blue-500",
        accentColor: "#3b82f6",
        bgGradient: "from-blue-500/15 via-sky-500/5 to-transparent",
      };
    case 71:
    case 73:
    case 75:
    case 77:
      return {
        label: "Snowy",
        iconName: "Snowflake",
        colorClass: "text-blue-300",
        accentColor: "#93c5fd",
        bgGradient: "from-blue-200/20 via-slate-100/10 to-transparent",
      };
    case 80:
    case 81:
    case 82:
      return {
        label: "Rain Showers",
        iconName: "CloudLightning",
        colorClass: "text-indigo-500",
        accentColor: "#6366f1",
        bgGradient: "from-indigo-500/15 via-purple-500/5 to-transparent",
      };
    case 85:
    case 86:
      return {
        label: "Snow Showers",
        iconName: "CloudSnow",
        colorClass: "text-sky-300",
        accentColor: "#7dd3fc",
        bgGradient: "from-sky-300/15 via-indigo-100/10 to-transparent",
      };
    case 95:
    case 96:
    case 99:
      return {
        label: "Thunderstorm",
        iconName: "Zap",
        colorClass: "text-violet-600",
        accentColor: "#7c3aed",
        bgGradient: "from-violet-600/20 via-fuchsia-600/5 to-transparent",
      };
    default:
      return {
        label: "Unknown Weather",
        iconName: "HelpCircle",
        colorClass: "text-gray-400",
        accentColor: "#9ca3af",
        bgGradient: "from-gray-400/10 to-transparent",
      };
  }
}

/**
 * Calculates high-fidelity weather metrics and compatibility index ratings for user activities.
 */
export function calculatePlanningMetrics(
  temp: number,
  rainSum: number,
  cloudCover: number,
  windSpeed: number,
  uvIndex: number,
  weatherCode: number
): PlanningMetrics {
  const checklist: string[] = [];
  
  // 1. Clothing Advice Heuristics
  let clothingAdvice = "";
  if (temp < 0) {
    clothingAdvice = "Heavy sub-zero insulation required. Pack thermals, a thick down jacket, gloves, and a beanie.";
    checklist.push("Thermal gloves & beanie", "Thick winter coat", "Lip balm for frost protection");
  } else if (temp >= 0 && temp < 10) {
    clothingAdvice = "Chilly conditions. Wear a warm winter coat or thick jacket layered over a wool sweater.";
    checklist.push("Thick wool sweater", "Windproof jacket", "Scarf");
  } else if (temp >= 10 && temp < 18) {
    clothingAdvice = "Mild and cool. A light jacket, trench coat, or comfortable sweater over long sleeves is ideal.";
    checklist.push("Light jacket or trench coat", "Layered shirts");
  } else if (temp >= 18 && temp < 26) {
    clothingAdvice = "Pleasantly warm. T-shirt, light trousers, shorts, or a casual dress will keep you comfortable.";
    checklist.push("Sunglasses", "Breathable fabrics");
  } else {
    clothingAdvice = "Hot conditions. Keep it minimal and highly breathable. Wear loose-fitting, light-colored clothing.";
    checklist.push("Sun hat", "Hydration flask", "Light linen clothing");
  }

  // Weather check-ins for checklist
  if (uvIndex >= 6) {
    checklist.push("Broad-spectrum SPF 30+ sunscreen", "UV polarized sunglasses");
  }
  if (rainSum > 0 || [51, 53, 55, 61, 63, 65, 80, 81, 82, 95].includes(weatherCode)) {
    checklist.push("Compact umbrella or rain poncho", "Waterproof shoes / boots");
  }
  if (windSpeed > 25) {
    checklist.push("Windbreaker jacket");
  }

  // 2. Activity Scoring (0 to 100)
  
  // A. Running
  let runningScore = 100;
  let runningReason = "Ideal conditions for an outdoor run.";
  if (temp < 5) {
    runningScore -= 30;
    runningReason = "Too cold; muscle strains are more likely in freezing temperatures.";
  } else if (temp > 28) {
    runningScore -= 40;
    runningReason = "High heat poses dehydration and heat exhaustion risks.";
  } else if (temp >= 10 && temp <= 18) {
    runningScore += 10; // Extra score for perfect running temp!
  }
  
  if (rainSum > 0) {
    runningScore -= Math.min(rainSum * 15, 60);
    runningReason = "Wet paths present slipping hazards and discomfort.";
  }
  if (windSpeed > 20) {
    runningScore -= Math.min((windSpeed - 20) * 2, 30);
    runningReason = "Strong headwinds will make running significantly harder.";
  }
  if (weatherCode >= 95) {
    runningScore = 0;
    runningReason = "Severe safety hazard: active lightning and thunderstorm warning.";
  }
  runningScore = Math.max(0, Math.min(100, runningScore));

  // B. Cycling
  let cyclingScore = 100;
  let cyclingReason = "Excellent weather for a scenic cycling ride.";
  if (temp < 8) {
    cyclingScore -= 25;
    cyclingReason = "Cold air makes high-speed cycling uncomfortable on the lungs.";
  } else if (temp > 32) {
    cyclingScore -= 30;
    cyclingReason = "Extreme heat can cause dizziness on extended bike routes.";
  }
  if (windSpeed > 15) {
    cyclingScore -= Math.min((windSpeed - 15) * 3, 50);
    cyclingReason = `Challenging gusty winds (${Math.round(windSpeed)} km/h) threaten stability.`;
  }
  if (rainSum > 0) {
    cyclingScore -= Math.min(rainSum * 25, 75);
    cyclingReason = "Slick roads and reduced braking efficiency make cycling risky.";
  }
  if (weatherCode >= 95) {
    cyclingScore = 0;
    cyclingReason = "Dangerous thunderstorm. Cycling outside is extremely hazardous.";
  }
  cyclingScore = Math.max(0, Math.min(100, cyclingScore));

  // C. Stargazing
  let stargazingScore = 100;
  let stargazingReason = "Crystal clear skies! Perfect conditions for observing stars and deep sky targets.";
  stargazingScore -= cloudCover; // Direct correlation with cloud cover
  if (cloudCover > 20 && cloudCover <= 50) {
    stargazingReason = "Partly cloudy. Some constellations will be obscured.";
  } else if (cloudCover > 50) {
    stargazingReason = "Heavy cloud cover will block almost all astronomical views.";
  }
  if (rainSum > 0) {
    stargazingScore -= 50;
    stargazingReason = "Active precipitation and thick cloud cover make observing impossible.";
  }
  if (temp < 0) {
    stargazingReason += " Extreme cold tonight; dress in double layers and bring hot cocoa.";
  }
  stargazingScore = Math.max(0, Math.min(100, stargazingScore));

  // D. Photography (Golden hour/Landscape)
  let photographyScore = 100;
  let photographyReason = "Perfect balanced lighting for landscape and portrait photography.";
  if (cloudCover < 10) {
    photographyScore -= 15;
    photographyReason = "Harsher direct sunlight; shadows will be sharp and contrasty.";
  } else if (cloudCover > 20 && cloudCover < 60) {
    photographyScore += 10; // Clouds add depth and drama to skies!
    photographyReason = "Spectacular textured clouds! Incredible golden hour and sky drama potential.";
  } else if (cloudCover >= 85) {
    photographyScore -= 35;
    photographyReason = "Overcast lighting is flat, dull, and shadows are absent.";
  }
  if (rainSum > 0) {
    photographyScore -= 40;
    photographyReason = "Rain limits camera usage unless employing waterproof enclosures.";
  }
  photographyScore = Math.max(0, Math.min(100, photographyScore));

  // E. Gardening
  let gardeningScore = 100;
  let gardeningReason = "Perfect day to weed, prune, plant new seeds, or repot.";
  if (temp < 5) {
    gardeningScore = 20;
    gardeningReason = "Risk of ground frost. Protect fragile plants with coverings instead.";
  } else if (temp > 35) {
    gardeningScore = 30;
    gardeningReason = "Severe heat. Hold off on planting; focus entirely on deep watering.";
  }
  if (rainSum > 0 && rainSum < 5) {
    gardeningScore = 90;
    gardeningReason = "Gentle rain saves you watering time! Ideal for soil nutrient absorption.";
  } else if (rainSum >= 10) {
    gardeningScore = 40;
    gardeningReason = "Heavy downpours could waterlog the soil or damage young seedlings.";
  }
  gardeningScore = Math.max(0, Math.min(100, gardeningScore));

  // F. Laundry Air-Drying
  let laundryScore = 100;
  let laundryReason = "Premium drying conditions: strong sun and light breeze.";
  laundryScore -= Math.min(rainSum * 40, 100);
  if (rainSum > 0) {
    laundryReason = "Precipitation will soak your clothes. Use indoor drying racks instead.";
  } else {
    // Humidity effect (Open-Meteo current humidity would be useful here, but we can approximate)
    if (cloudCover > 80) {
      laundryScore -= 30;
      laundryReason = "Thick clouds slow down temperature rise, increasing drying duration.";
    }
    if (windSpeed < 5) {
      laundryScore -= 15;
      laundryReason = "Still air will slow down evaporation rates.";
    } else if (windSpeed > 30) {
      laundryScore -= 20;
      laundryReason = "High winds might blow garments off the line or tangle them.";
    }
  }
  laundryScore = Math.max(0, Math.min(100, laundryScore));

  return {
    runningScore,
    runningReason,
    cyclingScore,
    cyclingReason,
    stargazingScore,
    stargazingReason,
    photographyScore,
    photographyReason,
    gardeningScore,
    gardeningReason,
    laundryScore,
    laundryReason,
    checklist: Array.from(new Set(checklist)), // unique values
    clothingAdvice,
  };
}
