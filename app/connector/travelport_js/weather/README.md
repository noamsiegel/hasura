# Weather API Module

This module provides a TypeScript interface for fetching weather data from the Open-Meteo API. It includes functions for retrieving weather forecasts for specific locations and date ranges, with customizable units for temperature, wind speed, and precipitation.

## Files

- `main.ts` - Main implementation of the weather API functions
- `types.ts` - TypeScript interfaces for the weather API
- `test.ts` - Test script for the weather API
- `run_test.sh` - Shell script to run the tests

## Usage

### Basic Usage

```typescript
import { getWeatherData } from './main';

// Using default parameters (Berlin, current date to current date + 3 days)
const weatherData = await getWeatherData();
console.log(weatherData);
```

### With Custom Parameters

```typescript
import { getWeatherData } from './main';

// Using individual parameters
const weatherData = await getWeatherData(
  '2023-06-01',  // startDate
  '2023-06-07',  // endDate
  40.7128,       // latitude (New York)
  -74.0060,      // longitude (New York)
  'celsius',     // temperatureUnit
  'mph',         // windSpeedUnit
  'inch'         // precipitationUnit
);
```

### Using Params Object

```typescript
import { getWeatherData } from './main';
import { WeatherDataParams } from './types';

// Using params object
const params: WeatherDataParams = {
  startDate: '2023-06-01',
  endDate: '2023-06-07',
  inputLatitude: 40.7128,
  inputLongitude: -74.0060,
  temperatureUnit: 'celsius',
  windSpeedUnit: 'mph',
  precipitationUnit: 'inch'
};

const weatherData = await getWeatherData(params);
```

## API Reference

### `getWeatherData` Function

The function accepts either individual parameters or a params object.

#### Parameters

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| startDate | string | Start date for weather forecast (YYYY-MM-DD) | Current date |
| endDate | string | End date for weather forecast (YYYY-MM-DD) | Current date + 3 days |
| inputLatitude | number | Latitude coordinate | 52.52 (Berlin) |
| inputLongitude | number | Longitude coordinate | 13.41 (Berlin) |
| temperatureUnit | string | Temperature unit ('celsius' or 'fahrenheit') | 'fahrenheit' |
| windSpeedUnit | string | Wind speed unit ('kmh', 'ms', 'mph', 'kn') | 'ms' |
| precipitationUnit | string | Precipitation unit ('mm' or 'inch') | 'inch' |

#### Return Value

The function returns a Promise that resolves to a `WeatherDataResponse` object with the following structure:

```typescript
{
  weatherData: {
    lat: string;
    lon: string;
    timezone: string;
    timezone_offset: string;
    daily: [
      {
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
        weather: [
          {
            id: string;
            main: string;
            description: string;
            icon: string;
          }
        ];
        clouds: string;
        pop: string;
        uvi: string;
      }
    ]
  }
}
```

## Running Tests

To run the tests, execute the shell script:

```bash
cd app/connector/travelport_js/weather
./run_test.sh
```

The test script will run several test cases with different parameters and log the results.

## Notes

- The Open-Meteo API has limitations on how far into the future forecasts can be requested. Typically, forecasts are available for up to 7-14 days in the future.
- All string values in the response are formatted as strings, even numeric values, for consistency.
- Temperature units can be 'celsius' or 'fahrenheit'.
- Wind speed units can be 'kmh' (kilometers per hour), 'ms' (meters per second), 'mph' (miles per hour), or 'kn' (knots).
- Precipitation units can be 'mm' (millimeters) or 'inch' (inches). 