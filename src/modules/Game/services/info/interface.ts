export interface AuthInterface {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_units: {
    time: string;
    interval: string;
    temperature_2m: string;
    wind_speed_10m: string;
  };
  current: {
    time: string;
    interval: number;
    temperature_2m: number;
    wind_speed_10m: number;
    is_day: number;
    cloud_cover: number;
    rain: number;
    snowfall: number;
  };
}

export interface CityInterface {
  id: number;
  name: string;
  latitude: string;
  longitude: string;
}
