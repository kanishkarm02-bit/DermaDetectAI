import { useState, useEffect } from 'react';
import { Cloud, Sun, Droplets, Wind, Loader2, MapPin } from 'lucide-react';
import { getWeatherTips } from '@/services/analysisService';

interface WeatherData {
  temp_C: string;
  weatherDesc: { value: string }[];
  humidity: string;
  windspeedKmph: string;
}

interface WeatherWidgetProps {
  city: string;
}

export function WeatherWidget({ city }: WeatherWidgetProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [tip, setTip] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [locationName, setLocationName] = useState(city);
  const [usingGeo, setUsingGeo] = useState(false);

  useEffect(() => {
    const fetchWeatherAndTips = async () => {
      try {
        setLoading(true);
        let query = encodeURIComponent(city);
        
        // Try to get geolocation for better accuracy
        if ("geolocation" in navigator) {
          try {
            const position = await new Promise<GeolocationPosition>((resolve, reject) => {
              navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
            });
            query = `${position.coords.latitude},${position.coords.longitude}`;
            setUsingGeo(true);
          } catch (e) {
            console.log("Geolocation failed, falling back to city", e);
            setUsingGeo(false);
          }
        }

        // Fetch weather from wttr.in
        const response = await fetch(`https://wttr.in/${query}?format=j1`);
        if (!response.ok) throw new Error('Failed to fetch weather');
        
        const data = await response.json();
        const current = data.current_condition[0];
        
        // If using coordinates, try to get the nearest area name
        if (usingGeo && data.nearest_area && data.nearest_area[0]) {
          const area = data.nearest_area[0];
          setLocationName(area.areaName[0].value || city);
        } else {
          setLocationName(city);
        }
        
        setWeather(current);
        
        // Get AI tip based on weather
        const aiTip = await getWeatherTips(
          locationName, 
          current.weatherDesc[0].value, 
          current.temp_C
        );
        setTip(aiTip);
        
      } catch (err) {
        console.error(err);
        setError('Could not load weather data');
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherAndTips();
  }, [city]);

  if (loading) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex items-center justify-center h-48">
        <Loader2 className="animate-spin text-teal-500" size={24} />
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center text-slate-400">
        <Cloud size={32} className="mx-auto mb-2 opacity-50" />
        <p>{error || 'Weather unavailable'}</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-indigo-900/50 to-slate-900 border border-indigo-500/20 rounded-2xl p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Cloud size={20} className="text-indigo-400" />
              Skin Forecast
            </h3>
            <div className="flex items-center gap-1 text-indigo-200/60 text-sm">
              {usingGeo && <MapPin size={12} />}
              {locationName}
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-white">{weather.temp_C}°C</div>
            <div className="text-sm text-indigo-300">{weather.weatherDesc[0].value}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-slate-950/30 rounded-xl p-3 flex items-center gap-3">
            <Droplets size={18} className="text-blue-400" />
            <div>
              <div className="text-xs text-slate-400">Humidity</div>
              <div className="font-semibold text-slate-200">{weather.humidity}%</div>
            </div>
          </div>
          <div className="bg-slate-950/30 rounded-xl p-3 flex items-center gap-3">
            <Wind size={18} className="text-slate-400" />
            <div>
              <div className="text-xs text-slate-400">Wind</div>
              <div className="font-semibold text-slate-200">{weather.windspeedKmph} km/h</div>
            </div>
          </div>
        </div>

        <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="p-1.5 bg-indigo-500/20 rounded-lg shrink-0 mt-0.5">
              <Sun size={16} className="text-indigo-300" />
            </div>
            <div>
              <div className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-1">AI Recommendation</div>
              <p className="text-sm text-indigo-100 leading-relaxed">
                {tip}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
