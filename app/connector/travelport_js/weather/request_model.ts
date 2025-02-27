/**
 * Weather API Types
 * This file contains TypeScript interfaces for the weather API functions
 */

/**
 * Parameters for the getWeatherData function
 */
export interface WeatherDataParams {
    /**
     * Start date for weather forecast in YYYY-MM-DD format
     * If not provided, defaults to current date
     */
    startDate?: string;
    
    /**
     * End date for weather forecast in YYYY-MM-DD format
     * If not provided, defaults to current date + 3 days
     */
    endDate?: string;
    
    /**
     * Latitude coordinate for location
     * If not provided, defaults to 52.52 (Berlin)
     */
    inputLatitude?: number;
    
    /**
     * Longitude coordinate for location
     * If not provided, defaults to 13.41 (Berlin)
     */
    inputLongitude?: number;
    
    /**
     * Temperature unit to use
     * Options: "celsius", "fahrenheit"
     * If not provided, defaults to "fahrenheit"
     */
    temperatureUnit?: string;
    
    /**
     * Wind speed unit to use
     * Options: "kmh" (kilometers per hour), "ms" (meters per second), "mph" (miles per hour), "kn" (knots)
     * If not provided, defaults to "ms"
     */
    windSpeedUnit?: string;
    
    /**
     * Precipitation unit to use
     * Options: "mm", "inch"
     * If not provided, defaults to "inch"
     */
    precipitationUnit?: string;
  }
  
  /**
   * Weather data response interfaces
   */
  
  export interface WeatherDataResponse {
    weatherData: {
      lat: string;
      lon: string;
      timezone: string;
      timezone_offset: string;
      daily: DailyWeatherItem[];
    };
  }
  
  export interface DailyWeatherItem {
    date: string;
    sunrise: string;
    sunset: string;
    summary: string;
    temp: {
      day: string;
      min: string;
      max: string;
      night: string;
      eve: string;
      morn: string;
    };
    feels_like: {
      day: string;
      night: string;
      eve: string;
      morn: string;
    };
    wind_speed: string;
    wind_deg: string;
    wind_gust: string;
    weather: WeatherCondition[];
    clouds: string;
    pop: string;
    uvi: string;
  }
  
  export interface WeatherCondition {
    id: string;
    main: string;
    description: string;
    icon: string;
  }