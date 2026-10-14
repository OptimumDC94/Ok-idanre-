import React, { useState, useEffect, useCallback } from 'react';
import {
  TownWeather,
  fetchTownWeather,
  FALLBACK_WEATHER,
  TOWNS_CONFIG,
} from '../services/weatherService';
import {
  Sun,
  CloudSun,
  Cloud,
  CloudRain,
  CloudLightning,
  CloudFog,
  Wind,
  Droplets,
  Compass,
  RefreshCw,
  MapPin,
  Calendar,
  AlertCircle,
  Sparkles,
  Mountain,
  Leaf,
  ChevronDown,
  ChevronUp,
  Info,
  Check,
} from 'lucide-react';

interface WeatherWidgetProps {
  variant?: 'dashboard' | 'compact' | 'banner';
  initialTown?: 'idanre' | 'ifedore';
  className?: string;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({
  variant = 'dashboard',
  initialTown = 'idanre',
  className = '',
}) => {
  const [selectedTown, setSelectedTown] = useState<'idanre' | 'ifedore'>(initialTown);
  const [weatherData, setWeatherData] = useState<Record<'idanre' | 'ifedore', TownWeather | null>>({
    idanre: null,
    ifedore: null,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [unit, setUnit] = useState<'C' | 'F'>('C');
  const [isForecastExpanded, setIsForecastExpanded] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'single' | 'compare'>('single');
  const [refreshToast, setRefreshToast] = useState<string | null>(null);

  const loadWeather = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    try {
      const [idanreRes, ifedoreRes] = await Promise.all([
        fetchTownWeather('idanre'),
        fetchTownWeather('ifedore'),
      ]);

      setWeatherData({
        idanre: idanreRes,
        ifedore: ifedoreRes,
      });

      if (isManualRefresh) {
        setRefreshToast('Updated weather for Idanre & Ifedore');
        setTimeout(() => setRefreshToast(null), 2500);
      }
    } catch (err) {
      console.warn('Weather fetch fallback triggered', err);
      setWeatherData(FALLBACK_WEATHER);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadWeather(false);

    // Refresh every 20 minutes automatically
    const interval = setInterval(() => {
      loadWeather(false);
    }, 20 * 60 * 1000);

    return () => clearInterval(interval);
  }, [loadWeather]);

  const currentWeather = weatherData[selectedTown] || FALLBACK_WEATHER[selectedTown];
  const compareWeather = weatherData[selectedTown === 'idanre' ? 'ifedore' : 'idanre'] ||
    FALLBACK_WEATHER[selectedTown === 'idanre' ? 'ifedore' : 'idanre'];

  const convertTemp = (celsius: number) => {
    if (unit === 'F') {
      return Math.round((celsius * 9) / 5 + 32);
    }
    return Math.round(celsius * 10) / 10;
  };

  const renderWeatherIcon = (
    type: 'sun' | 'cloud-sun' | 'cloud' | 'cloud-rain' | 'cloud-lightning' | 'cloud-fog',
    classNameStr = 'w-6 h-6'
  ) => {
    switch (type) {
      case 'sun':
        return <Sun className={`${classNameStr} text-amber-500 animate-pulse`} />;
      case 'cloud-sun':
        return <CloudSun className={`${classNameStr} text-amber-400`} />;
      case 'cloud':
        return <Cloud className={`${classNameStr} text-stone-400 dark:text-stone-300`} />;
      case 'cloud-rain':
        return <CloudRain className={`${classNameStr} text-blue-500 dark:text-blue-400`} />;
      case 'cloud-lightning':
        return <CloudLightning className={`${classNameStr} text-amber-500`} />;
      case 'cloud-fog':
        return <CloudFog className={`${classNameStr} text-stone-400`} />;
      default:
        return <CloudSun className={`${classNameStr} text-amber-400`} />;
    }
  };

  // Compact banner variant
  if (variant === 'banner') {
    return (
      <div
        className={`bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white rounded-2xl p-4 shadow-sm border border-emerald-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${className}`}
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-xs">
            {renderWeatherIcon(currentWeather.iconType, 'w-6 h-6')}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-wide">
                {currentWeather.name}, Ondo State
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-100 font-mono">
                {currentWeather.lastUpdated}
              </span>
            </div>
            <p className="text-xs text-emerald-100/90 font-medium mt-0.5">
              {currentWeather.conditionText} · {convertTemp(currentWeather.temperature)}°{unit} (Feels {convertTemp(currentWeather.apparentTemperature)}°)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setSelectedTown(prev => (prev === 'idanre' ? 'ifedore' : 'idanre'))}
            className="text-xs px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors font-medium"
          >
            Switch to {selectedTown === 'idanre' ? 'Ifedore' : 'Idanre'}
          </button>
          <button
            onClick={() => loadWeather(true)}
            disabled={isRefreshing}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            title="Refresh weather"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs overflow-hidden transition-all ${className}`}
    >
      {/* Toast */}
      {refreshToast && (
        <div className="fixed top-20 right-4 z-50 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs px-3.5 py-2 rounded-xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <Check className="w-3.5 h-3.5 text-emerald-400 dark:text-emerald-600" />
          <span>{refreshToast}</span>
        </div>
      )}

      {/* Widget Header with Town Selector & Controls */}
      <div className="p-4 sm:p-5 border-b border-stone-100 dark:border-stone-800/80 bg-stone-50/70 dark:bg-stone-900/60">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-400 flex items-center justify-center">
              <Sun className="w-4 h-4 text-amber-500 dark:text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                  Local Microclimate & Weather
                </h3>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-bold">
                  WAT GMT+1
                </span>
              </div>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                Live readings for Idanre Hills & Ifedore Agritech Belt
              </p>
            </div>
          </div>

          {/* Quick Utility Buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setUnit(u => (u === 'C' ? 'F' : 'C'))}
              className="text-[11px] font-mono font-bold px-2 py-1 rounded-lg bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
              title="Toggle Celsius / Fahrenheit"
            >
              °{unit}
            </button>
            <button
              onClick={() => loadWeather(true)}
              disabled={isRefreshing}
              className="p-1.5 rounded-lg bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
              title="Refresh live weather"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-emerald-600' : ''}`} />
            </button>
          </div>
        </div>

        {/* Town Tabs Segmented Control */}
        <div className="flex items-center gap-1.5 p-1 bg-stone-200/60 dark:bg-stone-800 rounded-xl">
          <button
            onClick={() => {
              setSelectedTown('idanre');
              setViewMode('single');
            }}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              selectedTown === 'idanre' && viewMode === 'single'
                ? 'bg-white dark:bg-stone-900 text-emerald-800 dark:text-emerald-400 shadow-2xs font-bold'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            <Mountain className="w-3.5 h-3.5" />
            <span>Idanre LGA</span>
          </button>

          <button
            onClick={() => {
              setSelectedTown('ifedore');
              setViewMode('single');
            }}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              selectedTown === 'ifedore' && viewMode === 'single'
                ? 'bg-white dark:bg-stone-900 text-emerald-800 dark:text-emerald-400 shadow-2xs font-bold'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            <Leaf className="w-3.5 h-3.5" />
            <span>Ifedore LGA</span>
          </button>

          <button
            onClick={() => setViewMode(prev => (prev === 'compare' ? 'single' : 'compare'))}
            className={`py-1.5 px-2.5 rounded-lg text-xs font-medium transition-all ${
              viewMode === 'compare'
                ? 'bg-emerald-800 text-white font-bold shadow-2xs'
                : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
            title="Compare Idanre & Ifedore side by side"
          >
            Compare Both
          </button>
        </div>
      </div>

      {/* Main Body */}
      <div className="p-4 sm:p-5 space-y-4">
        {isLoading ? (
          <div className="py-8 flex flex-col items-center justify-center gap-3 text-stone-400 dark:text-stone-500">
            <RefreshCw className="w-6 h-6 animate-spin text-emerald-600" />
            <p className="text-xs">Fetching current weather from Open-Meteo...</p>
          </div>
        ) : viewMode === 'compare' ? (
          /* Dual Comparative View */
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Idanre Column */}
            {(['idanre', 'ifedore'] as const).map(townKey => {
              const town = weatherData[townKey] || FALLBACK_WEATHER[townKey];
              return (
                <div
                  key={townKey}
                  className="p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/40 space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-emerald-700" />
                        {town.name}
                      </div>
                      <div className="text-[10px] text-stone-500 dark:text-stone-400">
                        HQ: {town.headquarters} · {town.elevation}m alt
                      </div>
                    </div>
                    <div>{renderWeatherIcon(town.iconType, 'w-6 h-6')}</div>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold font-mono text-stone-900 dark:text-stone-100">
                      {convertTemp(town.temperature)}°{unit}
                    </span>
                    <span className="text-xs text-stone-500 dark:text-stone-400">
                      Feels {convertTemp(town.apparentTemperature)}°
                    </span>
                  </div>

                  <p className="text-[11px] font-medium text-emerald-800 dark:text-emerald-400">
                    {town.conditionText}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-[10px] text-stone-600 dark:text-stone-400 pt-1 border-t border-stone-200/60 dark:border-stone-800">
                    <div>Humidity: <strong className="text-stone-800 dark:text-stone-200">{town.humidity}%</strong></div>
                    <div>Wind: <strong className="text-stone-800 dark:text-stone-200">{town.windSpeed} km/h</strong></div>
                  </div>

                  <p className="text-[10px] text-stone-500 dark:text-stone-400 italic line-clamp-2">
                    {town.cocoaAdvisory}
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          /* Single Detailed View */
          <>
            {/* Primary Hero Weather Card */}
            <div className="relative overflow-hidden rounded-2xl p-4 sm:p-5 bg-gradient-to-br from-emerald-50 via-teal-50/60 to-stone-50 dark:from-emerald-950/40 dark:via-stone-900 dark:to-stone-900 border border-emerald-100/80 dark:border-emerald-900/40">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* Left: Location & Conditions */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base sm:text-lg text-stone-900 dark:text-stone-100">
                      {currentWeather.name} LGA
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-900 dark:text-emerald-300 font-medium">
                      HQ: {currentWeather.headquarters}
                    </span>
                  </div>

                  <p className="text-xs text-stone-600 dark:text-stone-300 flex items-center gap-1 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    <span>{currentWeather.landmark}</span>
                  </p>

                  <div className="pt-2 flex items-baseline gap-3">
                    <span className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight text-stone-900 dark:text-stone-100">
                      {convertTemp(currentWeather.temperature)}°{unit}
                    </span>
                    <div className="text-xs text-stone-500 dark:text-stone-400">
                      <div>Feels like <strong>{convertTemp(currentWeather.apparentTemperature)}°{unit}</strong></div>
                      <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
                        {currentWeather.conditionText}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Weather Icon & Altitude Info */}
                <div className="flex flex-col sm:items-end justify-between self-start sm:self-auto gap-2">
                  <div className="p-3 rounded-2xl bg-white/80 dark:bg-stone-800/80 shadow-2xs backdrop-blur-xs flex items-center justify-center">
                    {renderWeatherIcon(currentWeather.iconType, 'w-10 h-10')}
                  </div>
                  <div className="text-[11px] font-mono text-stone-500 dark:text-stone-400 flex items-center gap-1 sm:text-right">
                    <span>Elevation: {currentWeather.elevation}m</span>
                    <span>·</span>
                    <span className={currentWeather.isLive ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-amber-600'}>
                      {currentWeather.isLive ? '● Live Open-Meteo' : '● Offline Cache'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Subtown Coverage Tags */}
              <div className="mt-4 pt-3 border-t border-emerald-200/50 dark:border-stone-800 flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mr-1">
                  Subtowns:
                </span>
                {currentWeather.subtowns.map(subtown => (
                  <span
                    key={subtown}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-white/80 dark:bg-stone-800/80 text-stone-700 dark:text-stone-300 border border-stone-200/60 dark:border-stone-700/60 font-medium"
                  >
                    {subtown}
                  </span>
                ))}
              </div>
            </div>

            {/* Weather Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200/80 dark:border-stone-800">
                <div className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400 mb-1">
                  <Droplets className="w-3.5 h-3.5 text-blue-500" />
                  <span>Humidity</span>
                </div>
                <div className="text-base sm:text-lg font-bold font-mono text-stone-900 dark:text-stone-100">
                  {currentWeather.humidity}%
                </div>
                <div className="w-full bg-stone-200 dark:bg-stone-700 h-1 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className="bg-blue-500 h-full rounded-full transition-all"
                    style={{ width: `${currentWeather.humidity}%` }}
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200/80 dark:border-stone-800">
                <div className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400 mb-1">
                  <Wind className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  <span>Wind Speed</span>
                </div>
                <div className="text-base sm:text-lg font-bold font-mono text-stone-900 dark:text-stone-100">
                  {currentWeather.windSpeed} <span className="text-xs font-normal text-stone-500">km/h</span>
                </div>
                <p className="text-[10px] text-stone-400 mt-1">Light mountain breeze</p>
              </div>

              <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200/80 dark:border-stone-800">
                <div className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400 mb-1">
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  <span>UV Index</span>
                </div>
                <div className="text-base sm:text-lg font-bold font-mono text-stone-900 dark:text-stone-100">
                  {currentWeather.uvIndex}
                </div>
                <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-1 font-medium">
                  {currentWeather.uvIndex >= 8 ? 'Very High (Sunscreen)' : currentWeather.uvIndex >= 6 ? 'High (Peak Sun)' : 'Moderate'}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200/80 dark:border-stone-800">
                <div className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400 mb-1">
                  <Compass className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Sunrise / Sunset</span>
                </div>
                <div className="text-xs font-bold font-mono text-stone-900 dark:text-stone-100 flex items-center justify-between pt-0.5">
                  <span>🌅 {currentWeather.sunrise}</span>
                  <span>🌇 {currentWeather.sunset}</span>
                </div>
                <p className="text-[10px] text-stone-400 mt-1">West Africa Time</p>
              </div>
            </div>

            {/* Localized Youth & Agribusiness Advisories */}
            <div className="space-y-2">
              {/* Cocoa & Agribusiness Advisory */}
              <div className="p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-900/50 flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 flex items-center justify-center shrink-0 mt-0.5">
                  <Leaf className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
                </div>
                <div className="space-y-0.5 flex-1 min-w-0">
                  <div className="text-xs font-bold text-amber-900 dark:text-amber-200">
                    Cocoa Farming & Agribusiness Advisory
                  </div>
                  <p className="text-[11px] leading-relaxed text-stone-700 dark:text-stone-300">
                    {currentWeather.cocoaAdvisory}
                  </p>
                </div>
              </div>

              {/* Outdoor & Oke Idanre Advisory */}
              <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-900/50 flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 flex items-center justify-center shrink-0 mt-0.5">
                  <Mountain className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                </div>
                <div className="space-y-0.5 flex-1 min-w-0">
                  <div className="text-xs font-bold text-emerald-950 dark:text-emerald-200">
                    {selectedTown === 'idanre' ? 'Oke Idanre Hiking & Outdoor Advisory' : 'Ifedore Transport & Youth Hangout Advisory'}
                  </div>
                  <p className="text-[11px] leading-relaxed text-stone-700 dark:text-stone-300">
                    {currentWeather.outdoorAdvisory}
                  </p>
                </div>
              </div>
            </div>

            {/* 3-Day Forecast Toggle Strip */}
            <div className="pt-2">
              <button
                onClick={() => setIsForecastExpanded(!isForecastExpanded)}
                className="w-full py-2 px-3 rounded-xl border border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800/60 text-xs font-semibold text-stone-700 dark:text-stone-300 flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                  <span>3-Day Outlook for {currentWeather.name}</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-stone-500">
                  <span>{isForecastExpanded ? 'Hide forecast' : 'Show forecast'}</span>
                  {isForecastExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </div>
              </button>

              {isForecastExpanded && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2 pt-1 animate-in fade-in duration-200">
                  {currentWeather.forecast.map((day, idx) => (
                    <div
                      key={day.date || idx}
                      className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-800 flex items-center justify-between gap-2"
                    >
                      <div>
                        <div className="text-xs font-bold text-stone-900 dark:text-stone-100">
                          {day.dayLabel}
                        </div>
                        <div className="text-[11px] text-stone-500 dark:text-stone-400">
                          {day.conditionText}
                        </div>
                        <div className="text-[10px] text-blue-600 dark:text-blue-400 mt-0.5">
                          Rain risk: {day.precipitationProb}%
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1 shrink-0">
                        {renderWeatherIcon(day.iconType, 'w-5 h-5')}
                        <div className="text-xs font-mono font-bold text-stone-800 dark:text-stone-200">
                          <span>{convertTemp(day.maxTemp)}°</span>
                          <span className="text-stone-400 text-[10px] ml-1">/ {convertTemp(day.minTemp)}°</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Widget Footer */}
      <div className="px-4 py-2.5 bg-stone-50 dark:bg-stone-900 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-[11px] text-stone-400">
        <span className="flex items-center gap-1">
          <Info className="w-3 h-3" />
          <span>Coordinates: {TOWNS_CONFIG[selectedTown].latitude.toFixed(2)}°N, {TOWNS_CONFIG[selectedTown].longitude.toFixed(2)}°E</span>
        </span>
        <span className="font-mono">
          Updated: {currentWeather.lastUpdated}
        </span>
      </div>
    </div>
  );
};
