// Import the getWeatherData function from main.ts
import { getWeatherData } from './main';
import { WeatherDataParams } from './types';

/**
 * Test script for the weather data API
 * This file tests if the getWeatherData function works correctly
 */

async function testWeatherAPI() {
    console.log('Starting weather API test...');

    try {
        // Test 1: Call with default parameters
        console.log('\n--- Test 1: Using default parameters ---');
        const defaultWeatherData = await getWeatherData();
        console.log('Default parameters test successful!');
        console.log(`Retrieved ${defaultWeatherData.weatherData.daily.length} days of weather data`);
        console.log(`Location: Latitude ${defaultWeatherData.weatherData.lat}, Longitude ${defaultWeatherData.weatherData.lon}`);
        console.log(`Date range: ${defaultWeatherData.weatherData.daily[0].date} to ${defaultWeatherData.weatherData.daily[defaultWeatherData.weatherData.daily.length - 1].date}`);

        // Test 2: Call with custom date parameters for current week
        console.log('\n--- Test 2: Using custom date parameters (current week) ---');
        const today = new Date();
        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7);

        const formattedToday = formatDate(today);
        const formattedNextWeek = formatDate(nextWeek);

        const currentWeekWeatherData = await getWeatherData(formattedToday,formattedNextWeek);
        console.log('Custom date parameters test successful!');
        console.log(`Retrieved ${currentWeekWeatherData.weatherData.daily.length} days of weather data`);
        console.log(`Location: Latitude ${currentWeekWeatherData.weatherData.lat}, Longitude ${currentWeekWeatherData.weatherData.lon}`);
        console.log(`Date range: ${currentWeekWeatherData.weatherData.daily[0].date} to ${currentWeekWeatherData.weatherData.daily[currentWeekWeatherData.weatherData.daily.length - 1].date}`);

        // Test 3: Call with custom location parameters (New York City)
        console.log('\n--- Test 3: Using custom location parameters (New York City) ---');
        const nycWeatherData = await getWeatherData(undefined,undefined,40.7128,-74.0060);
        console.log('Custom location parameters test successful!');
        console.log(`Retrieved ${nycWeatherData.weatherData.daily.length} days of weather data`);
        console.log(`Location: Latitude ${nycWeatherData.weatherData.lat}, Longitude ${nycWeatherData.weatherData.lon}`);
        console.log(`Date range: ${nycWeatherData.weatherData.daily[0].date} to ${nycWeatherData.weatherData.daily[nycWeatherData.weatherData.daily.length - 1].date}`);

        // Test 4: Call with both custom date and location parameters (Tokyo, next few days)
        console.log('\n--- Test 4: Using custom date and location parameters (Tokyo, next few days) ---');

        // Instead of next month, use current date + a few days (within forecast range)
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        const fiveDaysLater = new Date(today);
        fiveDaysLater.setDate(today.getDate() + 5);

        const formattedTomorrow = formatDate(tomorrow);
        const formattedFiveDaysLater = formatDate(fiveDaysLater);

        console.log(`Testing Tokyo weather from ${formattedTomorrow} to ${formattedFiveDaysLater}`);

        const tokyoWeatherData = await getWeatherData(
            formattedTomorrow,
            formattedFiveDaysLater,
            35.6762,
            139.6503
        );
        console.log('Custom date and location parameters test successful!');
        console.log(`Retrieved ${tokyoWeatherData.weatherData.daily.length} days of weather data`);
        console.log(`Location: Latitude ${tokyoWeatherData.weatherData.lat}, Longitude ${tokyoWeatherData.weatherData.lon}`);
        console.log(`Date range: ${tokyoWeatherData.weatherData.daily[0].date} to ${tokyoWeatherData.weatherData.daily[tokyoWeatherData.weatherData.daily.length - 1].date}`);

        // Test 5: Call with custom units (London with Celsius, km/h, and mm)
        console.log('\n--- Test 5: Using custom units (London with Celsius, km/h, and mm) ---');
        const londonWeatherData = await getWeatherData(
            formattedToday,
            formattedNextWeek,
            51.5074,
            -0.1278,
            "celsius",
            "kmh",
            "mm"
        );
        console.log('Custom units test successful!');
        console.log(`Retrieved ${londonWeatherData.weatherData.daily.length} days of weather data`);
        console.log(`Location: Latitude ${londonWeatherData.weatherData.lat}, Longitude ${londonWeatherData.weatherData.lon}`);
        console.log(`Date range: ${londonWeatherData.weatherData.daily[0].date} to ${londonWeatherData.weatherData.daily[londonWeatherData.weatherData.daily.length - 1].date}`);

        // Test 6: Call with params object (Paris with custom parameters)
        console.log('\n--- Test 6: Using params object (Paris with custom parameters) ---');
        const parisParams: WeatherDataParams = {
            startDate: formattedToday,
            endDate: formattedNextWeek,
            inputLatitude: 48.8566,
            inputLongitude: 2.3522,
            temperatureUnit: "celsius",
            windSpeedUnit: "kmh",
            precipitationUnit: "mm"
        };

        const parisWeatherData = await getWeatherData(parisParams);
        console.log('Params object test successful!');
        console.log(`Retrieved ${parisWeatherData.weatherData.daily.length} days of weather data`);
        console.log(`Location: Latitude ${parisWeatherData.weatherData.lat}, Longitude ${parisWeatherData.weatherData.lon}`);
        console.log(`Date range: ${parisWeatherData.weatherData.daily[0].date} to ${parisWeatherData.weatherData.daily[parisWeatherData.weatherData.daily.length - 1].date}`);

        // Print full data from the last test for verification
        console.log('\n--- Full data from Paris test with params object ---');
        console.log(JSON.stringify(parisWeatherData,null,2));

        return parisWeatherData;
    } catch (error) {
        console.error('Weather API test failed:',error);
        throw error;
    }
}

/**
 * Helper function to format a date as YYYY-MM-DD
 */
function formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2,'0');
    const day = String(date.getDate()).padStart(2,'0');
    return `${year}-${month}-${day}`;
}

// Execute the test function
testWeatherAPI()
    .then(() => console.log('\nAll tests completed successfully'))
    .catch(error => console.error('Test failed with error:',error)); 