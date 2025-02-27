import { WeatherDataParams,WeatherDataResponse } from './types';

const params = {
    "latitude": 52.52,
    "longitude": 13.41,
    "daily": [
        "weather_code",
        "temperature_2m_max",
        "temperature_2m_min",
        "apparent_temperature_max",
        "apparent_temperature_min",
        "sunrise",
        "sunset",
        "daylight_duration",
        "sunshine_duration",
        "uv_index_max",
        "uv_index_clear_sky_max",
        "precipitation_sum",
        "rain_sum",
        "showers_sum",
        "snowfall_sum",
        "precipitation_hours",
        "precipitation_probability_max",
        "wind_speed_10m_max",
        "wind_gusts_10m_max",
        "wind_direction_10m_dominant",
        "shortwave_radiation_sum",
        "et0_fao_evapotranspiration"
    ],
    "temperature_unit": "fahrenheit",
    "wind_speed_unit": "ms",
    "precipitation_unit": "inch",
    "timezone": "GMT",
    "timeformat": "iso8601", // Can be changed to "unixtime" to get UNIX timestamps instead of ISO8601 strings
    "start_date": getCurrentDate(),
    "end_date": getDatePlusDays(3),
    "daily_units": {
        "sunrise": "iso8601",
        "sunset": "iso8601"
    }
};
const url = "https://api.open-meteo.com/v1/forecast";

// Helper function to get current date in YYYY-MM-DD format
function getCurrentDate(): string {
    const today = new Date();
    return formatDate(today);
}

// Helper function to get a date X days from now in YYYY-MM-DD format
function getDatePlusDays(days: number): string {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return formatDate(date);
}

// Helper function to format a date as YYYY-MM-DD
function formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2,'0');
    const day = String(date.getDate()).padStart(2,'0');
    return `${year}-${month}-${day}`;
}

// Helper function to convert weather code to description and icon
function getWeatherInfo(code: number): { main: string; description: string; icon: string } {
    // WMO Weather interpretation codes (WW)
    // https://open-meteo.com/en/docs
    const weatherCodes: Record<number,{ main: string; description: string; icon: string }> = {
        0: { main: "Clear",description: "Clear sky",icon: "01d" },
        1: { main: "Clear",description: "Mainly clear",icon: "01d" },
        2: { main: "Clouds",description: "Partly cloudy",icon: "02d" },
        3: { main: "Clouds",description: "Overcast",icon: "03d" },
        45: { main: "Fog",description: "Fog",icon: "50d" },
        48: { main: "Fog",description: "Depositing rime fog",icon: "50d" },
        51: { main: "Drizzle",description: "Light drizzle",icon: "09d" },
        53: { main: "Drizzle",description: "Moderate drizzle",icon: "09d" },
        55: { main: "Drizzle",description: "Dense drizzle",icon: "09d" },
        56: { main: "Drizzle",description: "Light freezing drizzle",icon: "09d" },
        57: { main: "Drizzle",description: "Dense freezing drizzle",icon: "09d" },
        61: { main: "Rain",description: "Slight rain",icon: "10d" },
        63: { main: "Rain",description: "Moderate rain",icon: "10d" },
        65: { main: "Rain",description: "Heavy rain",icon: "10d" },
        66: { main: "Rain",description: "Light freezing rain",icon: "13d" },
        67: { main: "Rain",description: "Heavy freezing rain",icon: "13d" },
        71: { main: "Snow",description: "Slight snow fall",icon: "13d" },
        73: { main: "Snow",description: "Moderate snow fall",icon: "13d" },
        75: { main: "Snow",description: "Heavy snow fall",icon: "13d" },
        77: { main: "Snow",description: "Snow grains",icon: "13d" },
        80: { main: "Rain",description: "Slight rain showers",icon: "09d" },
        81: { main: "Rain",description: "Moderate rain showers",icon: "09d" },
        82: { main: "Rain",description: "Violent rain showers",icon: "09d" },
        85: { main: "Snow",description: "Slight snow showers",icon: "13d" },
        86: { main: "Snow",description: "Heavy snow showers",icon: "13d" },
        95: { main: "Thunderstorm",description: "Thunderstorm",icon: "11d" },
        96: { main: "Thunderstorm",description: "Thunderstorm with slight hail",icon: "11d" },
        99: { main: "Thunderstorm",description: "Thunderstorm with heavy hail",icon: "11d" }
    };

    return weatherCodes[code] || { main: "Unknown",description: "Unknown weather",icon: "50d" };
}

// Helper function to convert UNIX timestamp to ISO string with UTC offset
function convertUnixTimeToISOString(unixTime: string | number,utcOffsetSeconds: number): string {
    if (unixTime === "N/A" || unixTime === undefined || unixTime === null) {
        return "N/A";
    }

    const timestamp = typeof unixTime === 'string' ? Number(unixTime) : unixTime;
    if (isNaN(timestamp)) {
        return "N/A";
    }

    // Apply UTC offset and convert to milliseconds
    const date = new Date((timestamp + utcOffsetSeconds) * 1000);
    return date.toISOString();
}

// Extend the raw weather data interface to include ISO format sunrise/sunset
interface RawWeatherData {
    daily: {
        time: Date[];
        weatherCode: number[];
        temperature2mMax: number[];
        temperature2mMin: number[];
        apparentTemperatureMax: number[];
        apparentTemperatureMin: number[];
        sunrise: string[];
        sunset: string[];
        daylightDuration: number[];
        sunshineDuration: number[];
        uvIndexMax: number[];
        uvIndexClearSkyMax: number[];
        precipitationSum: number[];
        rainSum: number[];
        showersSum: number[];
        snowfallSum: number[];
        precipitationHours: number[];
        precipitationProbabilityMax: number[];
        windSpeed10mMax: number[];
        windGusts10mMax: number[];
        windDirection10mDominant: number[];
        shortwaveRadiationSum: number[];
        et0FaoEvapotranspiration: number[];
    };
}

// Helper function to validate date range
function validateDateRange(date: string): boolean {
    const minDate = new Date('2016-01-01');
    const maxDate = new Date('2025-03-14');
    const checkDate = new Date(date);
    
    return checkDate >= minDate && checkDate <= maxDate;
}

// Helper function to validate check-in and check-out dates
function validateBookingDates(checkInDate: string, checkOutDate: string): void {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to beginning of day for accurate comparison
    
    const checkIn = new Date(checkInDate);
    checkIn.setHours(0, 0, 0, 0);
    
    const checkOut = new Date(checkOutDate);
    checkOut.setHours(0, 0, 0, 0);
    
    // Calculate date 15 days from check-in date, not from today
    const maxDate = new Date(checkIn);
    maxDate.setDate(checkIn.getDate() + 15);
    
    if (checkIn < today) {
        throw new Error(`Check-in date (${checkInDate}) cannot be before today (${formatDate(today)})`);
    }
    
    if (checkOut > maxDate) {
        throw new Error(`Check-out date (${checkOutDate}) cannot be more than 15 days from check-in date (${formatDate(maxDate)})`);
    }
    
    if (checkIn > checkOut) {
        throw new Error(`Check-in date (${checkInDate}) cannot be after check-out date (${checkOutDate})`);
    }
}

// Export the function so it can be imported by other files
export async function getWeatherData(
    startDate?: string,
    endDate?: string,
    inputLatitude?: number,
    inputLongitude?: number,
    temperatureUnit?: string,
    windSpeedUnit?: string,
    precipitationUnit?: string
): Promise<WeatherDataResponse>;

// Overloaded version that accepts a params object
export async function getWeatherData(params?: WeatherDataParams): Promise<WeatherDataResponse>;

// Implementation that handles both call signatures
export async function getWeatherData(
    startDateOrParams?: string | WeatherDataParams,
    endDate?: string,
    inputLatitude?: number,
    inputLongitude?: number,
    temperatureUnit?: string,
    windSpeedUnit?: string,
    precipitationUnit?: string
): Promise<WeatherDataResponse> {
    try {
        // Check if first parameter is a params object
        let start: string | undefined;
        let end: string | undefined;
        let lat: number | undefined;
        let lon: number | undefined;
        let tempUnit: string | undefined;
        let windUnit: string | undefined;
        let precipUnit: string | undefined;

        if (startDateOrParams && typeof startDateOrParams === 'object') {
            // Using params object
            start = startDateOrParams.checkInDate;
            end = startDateOrParams.checkOutDate;
            // Convert string latitude/longitude to numbers
            lat = startDateOrParams.latitude ? parseFloat(startDateOrParams.latitude) : undefined;
            lon = startDateOrParams.longitude ? parseFloat(startDateOrParams.longitude) : undefined;
            tempUnit = startDateOrParams.temperatureUnit;
            windUnit = startDateOrParams.windSpeedUnit;
            precipUnit = startDateOrParams.precipitationUnit;
        } else {
            // Using individual parameters
            start = startDateOrParams as string | undefined;
            end = endDate;
            lat = inputLatitude;
            lon = inputLongitude;
            tempUnit = temperatureUnit;
            windUnit = windSpeedUnit;
            precipUnit = precipitationUnit;
        }

        // Use provided parameters or fall back to default values from params
        const finalStart = start || params.start_date;
        const finalEnd = end || params.end_date;
        const finalLat = lat !== undefined ? lat : params.latitude;
        const finalLon = lon !== undefined ? lon : params.longitude;
        const finalTempUnit = tempUnit || params.temperature_unit;
        const finalWindUnit = windUnit || params.wind_speed_unit;
        const finalPrecipUnit = precipUnit || params.precipitation_unit;

        // Validate date range for API compatibility
        if (!validateDateRange(finalStart)) {
            throw new Error(`Start date ${finalStart} is out of allowed range (2016-01-01 to 2025-03-14)`);
        }
        
        if (!validateDateRange(finalEnd)) {
            throw new Error(`End date ${finalEnd} is out of allowed range (2016-01-01 to 2025-03-14)`);
        }
        
        // Validate check-in and check-out dates for business rules
        validateBookingDates(finalStart, finalEnd);

        console.log(`Fetching weather data for: Lat ${finalLat}, Lon ${finalLon}, from ${finalStart} to ${finalEnd}`);
        console.log(`Units: Temp: ${finalTempUnit}, Wind: ${finalWindUnit}, Precip: ${finalPrecipUnit}`);

        // Make a direct fetch to the API to get the raw JSON response
        // This allows us to access the sunrise and sunset string values directly
        const directResponse = await fetch(`${url}?latitude=${finalLat}&longitude=${finalLon}&daily=sunrise,sunset&timezone=${params.timezone}&timeformat=${params.timeformat}&start_date=${finalStart}&end_date=${finalEnd}`);

        if (!directResponse.ok) {
            const errorText = await directResponse.text();
            throw new Error(`API error (sunrise/sunset): ${directResponse.status} - ${errorText}`);
        }

        const directData = await directResponse.json() as {
            daily?: {
                sunrise?: string[];
                sunset?: string[];
            },
            error?: boolean,
            reason?: string
        };

        // Check for API error response
        if (directData.error) {
            throw new Error(`API error: ${directData.reason || 'Unknown error'}`);
        }

        // Extract sunrise and sunset from the direct API response
        const sunriseStrings = directData.daily?.sunrise || [];
        const sunsetStrings = directData.daily?.sunset || [];

        // Replace SDK call with direct fetch for all weather data
        const dailyParams = params.daily.join(',');
        const mainResponse = await fetch(`${url}?latitude=${finalLat}&longitude=${finalLon}&daily=${dailyParams}&temperature_unit=${finalTempUnit}&wind_speed_unit=${finalWindUnit}&precipitation_unit=${finalPrecipUnit}&timezone=${params.timezone}&timeformat=${params.timeformat}&start_date=${finalStart}&end_date=${finalEnd}`);

        if (!mainResponse.ok) {
            const errorText = await mainResponse.text();
            throw new Error(`API error (main): ${mainResponse.status} - ${errorText}`);
        }

        // Define the type for the Open Meteo API response
        interface OpenMeteoResponse {
            latitude: number;
            longitude: number;
            timezone: string;
            timezone_abbreviation: string;
            utc_offset_seconds: number;
            daily: {
                time: string[];
                weather_code: number[];
                temperature_2m_max: number[];
                temperature_2m_min: number[];
                apparent_temperature_max: number[];
                apparent_temperature_min: number[];
                sunrise: string[];
                sunset: string[];
                daylight_duration: number[];
                sunshine_duration: number[];
                uv_index_max: number[];
                uv_index_clear_sky_max: number[];
                precipitation_sum: number[];
                rain_sum: number[];
                showers_sum: number[];
                snowfall_sum: number[];
                precipitation_hours: number[];
                precipitation_probability_max: number[];
                wind_speed_10m_max: number[];
                wind_gusts_10m_max: number[];
                wind_direction_10m_dominant: number[];
                shortwave_radiation_sum: number[];
                et0_fao_evapotranspiration: number[];
            };
            daily_units: {
                [key: string]: string;
            };
            error?: boolean;
            reason?: string;
        }

        const weatherData = await mainResponse.json() as OpenMeteoResponse;

        // Log the raw response for debugging
        console.log("Weather data response:",JSON.stringify(weatherData,null,2));

        // Check for API error response
        if (weatherData.error) {
            throw new Error(`API error: ${weatherData.reason || 'Unknown error'}`);
        }

        if (!weatherData || !weatherData.daily) {
            throw new Error("No weather data received");
        }

        // Extract location data
        const utcOffsetSeconds = weatherData.utc_offset_seconds || 0;
        const timezone = weatherData.timezone || "GMT";
        const responseLatitude = weatherData.latitude;
        const responseLongitude = weatherData.longitude;

        // Map the response to our data structure
        const rawWeatherData: RawWeatherData = {
            daily: {
                time: weatherData.daily.time.map((t: string) => {
                    // Handle time based on the timeformat
                    if (params.timeformat === "unixtime") {
                        // For unixtime, convert to ISO string and then to Date
                        return new Date(convertUnixTimeToISOString(t,utcOffsetSeconds));
                    } else {
                        // For iso8601, parse the string directly
                        return new Date(t);
                    }
                }),
                weatherCode: weatherData.daily.weather_code || [],
                temperature2mMax: weatherData.daily.temperature_2m_max || [],
                temperature2mMin: weatherData.daily.temperature_2m_min || [],
                apparentTemperatureMax: weatherData.daily.apparent_temperature_max || [],
                apparentTemperatureMin: weatherData.daily.apparent_temperature_min || [],
                sunrise: sunriseStrings, // Use the values from direct API call
                sunset: sunsetStrings, // Use the values from direct API call
                daylightDuration: weatherData.daily.daylight_duration || [],
                sunshineDuration: weatherData.daily.sunshine_duration || [],
                uvIndexMax: weatherData.daily.uv_index_max || [],
                uvIndexClearSkyMax: weatherData.daily.uv_index_clear_sky_max || [],
                precipitationSum: weatherData.daily.precipitation_sum || [],
                rainSum: weatherData.daily.rain_sum || [],
                showersSum: weatherData.daily.showers_sum || [],
                snowfallSum: weatherData.daily.snowfall_sum || [],
                precipitationHours: weatherData.daily.precipitation_hours || [],
                precipitationProbabilityMax: weatherData.daily.precipitation_probability_max || [],
                windSpeed10mMax: weatherData.daily.wind_speed_10m_max || [],
                windGusts10mMax: weatherData.daily.wind_gusts_10m_max || [],
                windDirection10mDominant: weatherData.daily.wind_direction_10m_dominant || [],
                shortwaveRadiationSum: weatherData.daily.shortwave_radiation_sum || [],
                et0FaoEvapotranspiration: weatherData.daily.et0_fao_evapotranspiration || [],
            }
        };

        // Create a clean response object
        const responseObj = {
            weatherData: {
                lat: responseLatitude.toString(),
                lon: responseLongitude.toString(),
                timezone: timezone || "GMT",
                timezone_offset: utcOffsetSeconds.toString(),
                daily: createCleanDailyItems(rawWeatherData,utcOffsetSeconds)
            }
        };

        return responseObj;

    } catch (error) {
        console.error("Error processing weather data:",error);
        throw error;
    }
}

function createCleanDailyItems(rawWeatherData: RawWeatherData,utcOffsetSeconds: number) {
    // utcOffsetSeconds is used to adjust UNIX timestamps when timeformat is 'unixtime'
    // According to Open-Meteo docs: "For daily values with unix timestamps, please apply utc_offset_seconds again to get the correct date"
    const dailyItems = [];

    for (let i = 0; i < rawWeatherData.daily.time.length; i++) {
        const time = rawWeatherData.daily.time[i];
        const weatherInfo = getWeatherInfo(rawWeatherData.daily.weatherCode[i] || 0);

        // Use the API-provided sunrise/sunset times directly
        let sunriseTime = rawWeatherData.daily.sunrise[i] || "N/A";
        let sunsetTime = rawWeatherData.daily.sunset[i] || "N/A";

        // If the timeformat is unixtime, apply the UTC offset to get the correct date
        if (params.timeformat === "unixtime") {
            sunriseTime = convertUnixTimeToISOString(sunriseTime,utcOffsetSeconds);
            sunsetTime = convertUnixTimeToISOString(sunsetTime,utcOffsetSeconds);
        }

        const dailyItem = {
            date: time.toISOString().split('T')[0],
            sunrise: sunriseTime,
            sunset: sunsetTime,
            // moonrise: "N/A",
            // moonset: "N/A",
            // moon_phase: "0",
            summary: weatherInfo.description,
            temp: {
                day: (rawWeatherData.daily.temperature2mMax[i] || 0).toString(),
                min: (rawWeatherData.daily.temperature2mMin[i] || 0).toString(),
                max: (rawWeatherData.daily.temperature2mMax[i] || 0).toString(),
                night: (rawWeatherData.daily.temperature2mMin[i] || 0).toString(),
                eve: (rawWeatherData.daily.temperature2mMax[i] || 0).toString(),
                morn: (rawWeatherData.daily.temperature2mMin[i] || 0).toString()
            },
            feels_like: {
                day: (rawWeatherData.daily.apparentTemperatureMax[i] || 0).toString(),
                night: (rawWeatherData.daily.apparentTemperatureMin[i] || 0).toString(),
                eve: (rawWeatherData.daily.apparentTemperatureMax[i] || 0).toString(),
                morn: (rawWeatherData.daily.apparentTemperatureMin[i] || 0).toString()
            },
            // pressure: "1013",
            // humidity: "70",
            // dew_point: "0",
            wind_speed: (rawWeatherData.daily.windSpeed10mMax[i] || 0).toString(),
            wind_deg: (rawWeatherData.daily.windDirection10mDominant[i] || 0).toString(),
            wind_gust: (rawWeatherData.daily.windGusts10mMax[i] || 0).toString(),
            weather: [
                {
                    id: (rawWeatherData.daily.weatherCode[i] || 0).toString(),
                    main: weatherInfo.main,
                    description: weatherInfo.description,
                    icon: weatherInfo.icon
                }
            ],
            clouds: "0",
            pop: ((rawWeatherData.daily.precipitationProbabilityMax[i] || 0) / 100).toString(),
            uvi: (rawWeatherData.daily.uvIndexMax[i] || 0).toString()
        };

        dailyItems.push(dailyItem);
    }

    return dailyItems;
}

// Execute the async function and print only the response object
// Comment out this execution when importing the function elsewhere
// getWeatherData()
//     .then(response => console.log(JSON.stringify(response,null,2)))
//     .catch(error => console.error('Error fetching weather data:',error));
