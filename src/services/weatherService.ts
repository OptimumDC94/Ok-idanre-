export interface DayForecast {
  date: string;
  dayLabel: string;
  maxTemp: number;
  minTemp: number;
  weatherCode: number;
  conditionText: string;
  iconType: 'sun' | 'cloud-sun' | 'cloud' | 'cloud-rain' | 'cloud-lightning' | 'cloud-fog';
  precipitationProb: number;
}

export interface TownWeather {
  locationId: 'idanre' | 'ifedore';
  name: string;
  lgaName: string;
  headquarters: string;
  subtowns: string[];
  landmark: string;
  latitude: number;
  longitude: number;
  elevation: number;
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  precipitation: number;
  windSpeed: number;
  weatherCode: number;
  conditionText: string;
  iconType: 'sun' | 'cloud-sun' | 'cloud' | 'cloud-rain' | 'cloud-lightning' | 'cloud-fog';
  isDay: boolean;
  uvIndex: number;
  sunrise: string;
  sunset: string;
  forecast: DayForecast[];
  cocoaAdvisory: string;
  outdoorAdvisory: string;
  lastUpdated: string;
  isLive: boolean;
}

export const TOWNS_CONFIG: Record<'idanre' | 'ifedore', {
  name: string;
  lgaName: string;
  headquarters: string;
  subtowns: string[];
  landmark: string;
  latitude: number;
  longitude: number;
  elevation: number;
}> = {
  idanre: {
    name: 'Idanre',
    lgaName: 'Idanre LGA',
    headquarters: 'Odode Idanre',
    subtowns: ['Odode', 'Oke Idanre', 'Alade', 'Atosin', 'Owena Idanre'],
    landmark: 'Oke Idanre UNESCO Tentative Ridge (682 Steps)',
    latitude: 7.1106,
    longitude: 5.1051,
    elevation: 334,
  },
  ifedore: {
    name: 'Ifedore',
    lgaName: 'Ifedore LGA',
    headquarters: 'Igbara-Oke',
    subtowns: ['Igbara-Oke', 'Ilara-Mokin', 'Ipogun', 'Ijare', 'Ero'],
    landmark: 'Smokey Hills & Ilara-Mokin Tech Hub / Golf Arena',
    latitude: 7.3524,
    longitude: 5.0531,
    elevation: 326,
  },
};

export function interpretWeatherCode(code: number): {
  conditionText: string;
  iconType: 'sun' | 'cloud-sun' | 'cloud' | 'cloud-rain' | 'cloud-lightning' | 'cloud-fog';
} {
  switch (code) {
    case 0:
      return { conditionText: 'Clear & Sunny', iconType: 'sun' };
    case 1:
      return { conditionText: 'Mainly Sunny', iconType: 'sun' };
    case 2:
      return { conditionText: 'Partly Cloudy', iconType: 'cloud-sun' };
    case 3:
      return { conditionText: 'Overcast & Shaded', iconType: 'cloud' };
    case 45:
    case 48:
      return { conditionText: 'Harmattan Mist / Hill Fog', iconType: 'cloud-fog' };
    case 51:
    case 53:
    case 55:
      return { conditionText: 'Light Tropical Drizzle', iconType: 'cloud-rain' };
    case 61:
    case 63:
    case 65:
      return { conditionText: 'Rain Showers', iconType: 'cloud-rain' };
    case 80:
    case 81:
    case 82:
      return { conditionText: 'Sudden Tropical Showers', iconType: 'cloud-rain' };
    case 95:
    case 96:
    case 99:
      return { conditionText: 'Thunderstorm & Lightning', iconType: 'cloud-lightning' };
    default:
      return { conditionText: 'Fair Weather', iconType: 'cloud-sun' };
  }
}

function getAgriculturalAdvisory(weatherCode: number, precipitation: number, temp: number, lga: 'idanre' | 'ifedore'): string {
  if (weatherCode >= 95 || precipitation > 5) {
    return 'Heavy rain/storm alert: Cover outdoor cocoa bean drying patios immediately. Delay spraying agrochemicals.';
  }
  if (precipitation > 0 || [51, 53, 55, 61, 63, 80, 81].includes(weatherCode)) {
    return 'Showers expected: Keep cocoa beans on portable drying mats ready to shelter. Wet soil supports seedling planting.';
  }
  if (temp >= 31 && weatherCode <= 2) {
    return `Excellent cocoa sun-drying window! High solar radiation across ${lga === 'idanre' ? 'Idanre cocoa valleys' : 'Ifedore farm belts'}. Great for cassava processing.`;
  }
  return 'Favorable mild climate: Good conditions for field maintenance, cocoa harvesting, and market transit along Akure corridors.';
}

function getOutdoorAdvisory(weatherCode: number, precipitation: number, lga: 'idanre' | 'ifedore'): string {
  if (lga === 'idanre') {
    if (precipitation > 1 || weatherCode >= 80) {
      return 'Oke Idanre hiking alert: Granite rocks & 682 steps are slippery. Wear high-traction footwear or wait for rain to pass.';
    }
    if (weatherCode <= 2) {
      return 'Great day for Oke Idanre hiking! Clear panoramic views of ancient palaces, Owa hilltops, and valley vegetation.';
    }
    return 'Cool mountain breeze over Idanre ridge. Mild conditions for outdoor youth meetups and sports.';
  } else {
    if (precipitation > 1 || weatherCode >= 80) {
      return 'Wet asphalt on Igbara-Oke / Ilara-Mokin roads. Exercise caution on farm feeder routes.';
    }
    return 'Pleasant conditions across Ifedore. Ideal for community sports, campus activities, and outdoor markets.';
  }
}

function getDayName(dateStr: string, index: number): string {
  if (index === 0) return 'Today';
  if (index === 1) return 'Tomorrow';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { weekday: 'short' });
  } catch {
    return `Day ${index + 1}`;
  }
}

// Fallback data if user is offline or API fails
export const FALLBACK_WEATHER: Record<'idanre' | 'ifedore', TownWeather> = {
  idanre: {
    locationId: 'idanre',
    name: 'Idanre',
    lgaName: 'Idanre LGA',
    headquarters: 'Odode Idanre',
    subtowns: ['Odode', 'Oke Idanre', 'Alade', 'Atosin', 'Owena Idanre'],
    landmark: 'Oke Idanre UNESCO Tentative Ridge (682 Steps)',
    latitude: 7.1106,
    longitude: 5.1051,
    elevation: 334,
    temperature: 30.5,
    apparentTemperature: 36.2,
    humidity: 65,
    precipitation: 0.1,
    windSpeed: 5.4,
    weatherCode: 2,
    conditionText: 'Partly Cloudy with Hill Breeze',
    iconType: 'cloud-sun',
    isDay: true,
    uvIndex: 6.8,
    sunrise: '06:28',
    sunset: '18:36',
    forecast: [
      {
        date: new Date().toISOString().slice(0, 10),
        dayLabel: 'Today',
        maxTemp: 31.8,
        minTemp: 23.2,
        weatherCode: 2,
        conditionText: 'Partly Cloudy',
        iconType: 'cloud-sun',
        precipitationProb: 25,
      },
      {
        date: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
        dayLabel: 'Tomorrow',
        maxTemp: 32.4,
        minTemp: 22.8,
        weatherCode: 1,
        conditionText: 'Mainly Sunny',
        iconType: 'sun',
        precipitationProb: 15,
      },
      {
        date: new Date(Date.now() + 172800000).toISOString().slice(0, 10),
        dayLabel: 'Next Day',
        maxTemp: 30.1,
        minTemp: 23.5,
        weatherCode: 61,
        conditionText: 'Scattered Showers',
        iconType: 'cloud-rain',
        precipitationProb: 60,
      },
    ],
    cocoaAdvisory: 'Prime cocoa sun-drying window! Spread beans on raised mats until late afternoon.',
    outdoorAdvisory: 'Great day for Oke Idanre hiking! Clear mountain views with comfortable cloud cover.',
    lastUpdated: 'Recently (Cached)',
    isLive: false,
  },
  ifedore: {
    locationId: 'ifedore',
    name: 'Ifedore',
    lgaName: 'Ifedore LGA',
    headquarters: 'Igbara-Oke',
    subtowns: ['Igbara-Oke', 'Ilara-Mokin', 'Ipogun', 'Ijare', 'Ero'],
    landmark: 'Smokey Hills & Ilara-Mokin Tech Hub / Golf Arena',
    latitude: 7.3524,
    longitude: 5.0531,
    elevation: 326,
    temperature: 31.2,
    apparentTemperature: 37.0,
    humidity: 62,
    precipitation: 0.0,
    windSpeed: 4.8,
    weatherCode: 1,
    conditionText: 'Warm & Sunny',
    iconType: 'sun',
    isDay: true,
    uvIndex: 7.2,
    sunrise: '06:27',
    sunset: '18:37',
    forecast: [
      {
        date: new Date().toISOString().slice(0, 10),
        dayLabel: 'Today',
        maxTemp: 32.5,
        minTemp: 23.0,
        weatherCode: 1,
        conditionText: 'Mainly Sunny',
        iconType: 'sun',
        precipitationProb: 18,
      },
      {
        date: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
        dayLabel: 'Tomorrow',
        maxTemp: 33.1,
        minTemp: 23.4,
        weatherCode: 2,
        conditionText: 'Partly Cloudy',
        iconType: 'cloud-sun',
        precipitationProb: 20,
      },
      {
        date: new Date(Date.now() + 172800000).toISOString().slice(0, 10),
        dayLabel: 'Next Day',
        maxTemp: 30.8,
        minTemp: 22.9,
        weatherCode: 80,
        conditionText: 'Afternoon Rain',
        iconType: 'cloud-rain',
        precipitationProb: 55,
      },
    ],
    cocoaAdvisory: 'Sunny intervals ideal for cassava flour drying and transporting farm produce to Igbara-Oke market.',
    outdoorAdvisory: 'Pleasant conditions across Ifedore. Great for student sports and community activities.',
    lastUpdated: 'Recently (Cached)',
    isLive: false,
  },
};

export async function fetchTownWeather(locationId: 'idanre' | 'ifedore'): Promise<TownWeather> {
  const config = TOWNS_CONFIG[locationId];
  const cacheKey = `weather_cache_${locationId}`;

  // Try fetching live from Open-Meteo
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${config.latitude}&longitude=${config.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,uv_index_max,sunrise,sunset&timezone=Africa%2FLagos&forecast_days=3`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Weather API returned HTTP ${response.status}`);
    }

    const data = await response.json();
    const current = data.current || {};
    const daily = data.daily || {};

    const weatherCode = current.weather_code ?? 1;
    const { conditionText, iconType } = interpretWeatherCode(weatherCode);

    const formatSunTime = (isoString?: string) => {
      if (!isoString) return '--:--';
      const parts = isoString.split('T');
      return parts[1] ? parts[1].slice(0, 5) : '--:--';
    };

    // Parse daily forecast
    const forecast: DayForecast[] = [];
    if (Array.isArray(daily.time)) {
      for (let i = 0; i < Math.min(3, daily.time.length); i++) {
        const dCode = daily.weather_code?.[i] ?? weatherCode;
        const dInterp = interpretWeatherCode(dCode);
        forecast.push({
          date: daily.time[i],
          dayLabel: getDayName(daily.time[i], i),
          maxTemp: Math.round(daily.temperature_2m_max?.[i] ?? (current.temperature_2m + 2)),
          minTemp: Math.round(daily.temperature_2m_min?.[i] ?? (current.temperature_2m - 5)),
          weatherCode: dCode,
          conditionText: dInterp.conditionText,
          iconType: dInterp.iconType,
          precipitationProb: daily.precipitation_probability_max?.[i] ?? 0,
        });
      }
    }

    const nowWAT = new Date().toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Africa/Lagos',
    });

    const weatherResult: TownWeather = {
      locationId,
      name: config.name,
      lgaName: config.lgaName,
      headquarters: config.headquarters,
      subtowns: config.subtowns,
      landmark: config.landmark,
      latitude: config.latitude,
      longitude: config.longitude,
      elevation: Math.round(data.elevation ?? config.elevation),
      temperature: Math.round((current.temperature_2m ?? 30) * 10) / 10,
      apparentTemperature: Math.round((current.apparent_temperature ?? current.temperature_2m ?? 32) * 10) / 10,
      humidity: current.relative_humidity_2m ?? 65,
      precipitation: current.precipitation ?? 0,
      windSpeed: Math.round((current.wind_speed_10m ?? 5) * 10) / 10,
      weatherCode,
      conditionText,
      iconType,
      isDay: current.is_day === 1,
      uvIndex: daily.uv_index_max?.[0] ?? 6.5,
      sunrise: formatSunTime(daily.sunrise?.[0]),
      sunset: formatSunTime(daily.sunset?.[0]),
      forecast,
      cocoaAdvisory: getAgriculturalAdvisory(weatherCode, current.precipitation ?? 0, current.temperature_2m ?? 30, locationId),
      outdoorAdvisory: getOutdoorAdvisory(weatherCode, current.precipitation ?? 0, locationId),
      lastUpdated: `${nowWAT} WAT`,
      isLive: true,
    };

    // Cache locally
    try {
      localStorage.setItem(cacheKey, JSON.stringify(weatherResult));
    } catch {
      // storage quota
    }

    return weatherResult;
  } catch (error) {
    console.warn(`Could not fetch live weather for ${locationId}:`, error);

    // Try reading last good cached weather
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        return { ...parsed, isLive: false, lastUpdated: 'Cached offline' };
      }
    } catch {
      // fallback
    }

    // Otherwise return robust fallback
    return FALLBACK_WEATHER[locationId];
  }
}
