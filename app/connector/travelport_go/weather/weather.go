package weather

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strconv"
)

// DefaultParams represents the default configuration for weather data requests
var DefaultParams = struct {
	Latitude          float64
	Longitude         float64
	Daily             []string
	TemperatureUnit   string
	WindSpeedUnit     string
	PrecipitationUnit string
	Timezone          string
	Timeformat        string
}{
	Latitude:          defaultLatitude,
	Longitude:         defaultLongitude,
	Daily:             DefaultDailyParams,
	TemperatureUnit:   defaultTemperatureUnit,
	WindSpeedUnit:     defaultWindSpeedUnit,
	PrecipitationUnit: defaultPrecipitationUnit,
	Timezone:          defaultTimezone,
	Timeformat:        defaultTimeformat,
}

// WeatherService handles weather data operations
type WeatherService struct {
	client *http.Client
}

// NewWeatherService creates a new WeatherService instance
func NewWeatherService() *WeatherService {
	return &WeatherService{
		client: &http.Client{
			Timeout: defaultHTTPTimeout,
		},
	}
}

// GetWeatherData retrieves weather data based on provided parameters
func (s *WeatherService) GetWeatherData(params *WeatherDataParams) (*WeatherDataResponse, error) {
	// Use default or provided parameters
	today := getCurrentDate()
	startDate := today
	endDate := getDatePlusDays(3)
	lat := DefaultParams.Latitude
	lon := DefaultParams.Longitude

	// Set default units based on unit parameter
	unit := defaultUnit
	tempUnit := defaultTemperatureUnit
	windUnit := defaultWindSpeedUnit
	precipUnit := defaultPrecipitationUnit

	if params != nil {
		if params.CheckInDate != "" {
			startDate = params.CheckInDate
		}
		if params.CheckOutDate != "" {
			endDate = params.CheckOutDate
		}
		if params.Latitude != "" {
			if latVal, err := strconv.ParseFloat(params.Latitude, 64); err == nil {
				if latVal < minLatitude || latVal > maxLatitude {
					// Detect timezone based on coordinates
					detectedTz := ""
					if DefaultFinder != nil {
						detectedTz = DefaultFinder.GetTimezoneName(lon, latVal)
					}
					err := NewInvalidCoordinatesError(latVal, lon, detectedTz)
					return nil, err.ToSDKError()
				}
				lat = latVal
			}
		}
		if params.Longitude != "" {
			if lonVal, err := strconv.ParseFloat(params.Longitude, 64); err == nil {
				if lonVal < minLongitude || lonVal > maxLongitude {
					// Detect timezone based on coordinates
					detectedTz := ""
					if DefaultFinder != nil {
						detectedTz = DefaultFinder.GetTimezoneName(lonVal, lat)
					}
					err := NewInvalidCoordinatesError(lat, lonVal, detectedTz)
					return nil, err.ToSDKError()
				}
				lon = lonVal
			}
		}
		if params.Unit != "" {
			unit = params.Unit
			switch unit {
			case UnitImperial:
				tempUnit = imperialTemperatureUnit
				windUnit = imperialWindSpeedUnit
				precipUnit = imperialPrecipitationUnit
			case UnitMetric:
				tempUnit = metricTemperatureUnit
				windUnit = metricWindSpeedUnit
				precipUnit = metricPrecipitationUnit
			default:
				return nil, NewAPIError(400, fmt.Sprintf("invalid unit: %s. Must be either 'metric' or 'imperial'", unit)).ToSDKError()
			}
		}
	}

	// Detect timezone based on coordinates
	detectedTz := ""
	if DefaultFinder != nil {
		detectedTz = DefaultFinder.GetTimezoneName(lon, lat)
	}

	// Validate dates
	if err := validateBookingDates(startDate, endDate, detectedTz); err != nil {
		if we, ok := err.(*WeatherError); ok {
			return nil, we.ToSDKError()
		}
		return nil, NewAPIError(500, err.Error()).ToSDKError()
	}

	// Validate date range for API compatibility
	startDateErr := validateDateRange(startDate, detectedTz)
	endDateErr := validateDateRange(endDate, detectedTz)
	if startDateErr != nil || endDateErr != nil {
		if startDateErr != nil {
			if we, ok := startDateErr.(*WeatherError); ok {
				return nil, we.ToSDKError()
			}
		}
		if endDateErr != nil {
			if we, ok := endDateErr.(*WeatherError); ok {
				return nil, we.ToSDKError()
			}
		}
		// If we get here, return a generic error
		err := NewInvalidDateRangeError(fmt.Sprintf("%s to %s", startDate, endDate), detectedTz)
		return nil, err.ToSDKError()
	}

	// Get sunrise/sunset data
	sunriseData, err := s.fetchDirectData(lat, lon, startDate, endDate)
	if err != nil {
		return nil, NewAPIError(500, err.Error()).ToSDKError()
	}

	// Get weather data
	weatherData, err := s.fetchWeatherData(lat, lon, startDate, endDate, tempUnit, windUnit, precipUnit)
	if err != nil {
		return nil, NewAPIError(500, err.Error()).ToSDKError()
	}

	// Create response
	response := &WeatherDataResponse{}
	response.WeatherData.Lat = fmt.Sprintf("%f", lat)
	response.WeatherData.Lon = fmt.Sprintf("%f", lon)
	response.WeatherData.Timezone = weatherData.Timezone

	// Create daily items
	response.WeatherData.Daily = createDailyItemsFromResponses(weatherData, sunriseData)

	return response, nil
}

// fetchDirectData fetches sunrise/sunset data from the API
func (s *WeatherService) fetchDirectData(lat, lon float64, startDate, endDate string) (*SunriseSunsetResponse, error) {
	// Detect timezone based on coordinates
	detectedTz := ""
	if DefaultFinder != nil {
		detectedTz = DefaultFinder.GetTimezoneName(lon, lat)
	}

	// Construct URL with timezone if available
	url := fmt.Sprintf(
		"https://api.sunrisesunset.io/json?lat=%f&lng=%f&date_start=%s&date_end=%s",
		lat, lon, startDate, endDate,
	)
	if detectedTz != "" {
		url = fmt.Sprintf(
			"https://api.sunrisesunset.io/json?lat=%f&lng=%f&date_start=%s&date_end=%s&timezone=%s",
			lat, lon, startDate, endDate, detectedTz,
		)
	}

	// Make the request
	resp, err := http.Get(url)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	// Read the response
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	// Parse the response
	var sunriseData SunriseSunsetResponse
	if err := json.Unmarshal(body, &sunriseData); err != nil {
		return nil, err
	}

	return &sunriseData, nil
}

// fetchWeatherData fetches weather data from the API
func (s *WeatherService) fetchWeatherData(lat, lon float64, startDate, endDate, tempUnit, windUnit, precipUnit string) (*WeatherResponse, error) {
	// Detect timezone based on coordinates
	detectedTz := ""
	if DefaultFinder != nil {
		detectedTz = DefaultFinder.GetTimezoneName(lon, lat)
	}

	// Construct base URL with required parameters
	baseURL := "https://api.open-meteo.com/v1/forecast?" +
		"latitude=%f&longitude=%f&" +
		"daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,rain_sum,showers_sum," +
		"snowfall_sum,precipitation_hours,precipitation_probability_max,windspeed_10m_max,windgusts_10m_max,winddirection_10m_dominant&" +
		"current_weather=true&" +
		"start_date=%s&end_date=%s&" +
		"temperature_unit=%s&windspeed_unit=%s&precipitation_unit=%s"

	// Construct URL with timezone if available
	var url string
	if detectedTz != "" {
		url = fmt.Sprintf(baseURL+"&timezone=%s", lat, lon, startDate, endDate, tempUnit, windUnit, precipUnit, detectedTz)
	} else {
		url = fmt.Sprintf(baseURL+"&timezone=UTC", lat, lon, startDate, endDate, tempUnit, windUnit, precipUnit)
	}

	fmt.Printf("DEBUG: Making API request to URL: %s\n", url)
	fmt.Printf("DEBUG: Parameters - Temp Unit: %s, Wind Unit: %s, Precip Unit: %s\n", tempUnit, windUnit, precipUnit)

	// Make the request
	resp, err := http.Get(url)
	if err != nil {
		fmt.Printf("DEBUG: HTTP request failed with error: %v\n", err)
		return nil, err
	}
	defer resp.Body.Close()

	fmt.Printf("DEBUG: API Response Status Code: %d\n", resp.StatusCode)

	// Read the response
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		fmt.Printf("DEBUG: Failed to read response body: %v\n", err)
		return nil, err
	}

	fmt.Printf("DEBUG: Raw API Response: %s\n", string(body))

	// Parse the response
	var weatherData WeatherResponse
	if err := json.Unmarshal(body, &weatherData); err != nil {
		fmt.Printf("DEBUG: Failed to parse JSON response: %v\n", err)
		return nil, err
	}

	fmt.Printf("DEBUG: Parsed Weather Data\n")
	if weatherData.Daily.WeatherCode != nil {
		fmt.Printf("DEBUG: Weather Codes Length: %d\n", len(weatherData.Daily.WeatherCode))
	} else {
		fmt.Printf("DEBUG: Weather Codes are nil\n")
	}

	// Validate the response data
	if weatherData.Daily.WeatherCode == nil || len(weatherData.Daily.WeatherCode) == 0 {
		fmt.Printf("DEBUG: Weather codes validation failed - codes are missing or empty\n")
		return nil, fmt.Errorf("weather codes are missing in the API response")
	}

	if weatherData.Daily.WindSpeed10mMax == nil {
		return nil, fmt.Errorf("wind speed array is nil in the API response")
	}
	if len(weatherData.Daily.WindSpeed10mMax) == 0 {
		return nil, fmt.Errorf("wind speed array is empty in the API response")
	}

	return &weatherData, nil
}

// createDailyItemsFromResponses creates daily items from the weather and sunrise/sunset responses
func createDailyItemsFromResponses(weatherData *WeatherResponse, sunriseData *SunriseSunsetResponse) []DailyItem {
	items := make([]DailyItem, 0)

	// Check for nil pointers
	if weatherData == nil {
		return items
	}
	if weatherData.Daily.Time == nil {
		return items
	}

	// Create a map of date to sunrise/sunset data for easier lookup
	sunriseMap := make(map[string]struct {
		Sunrise string
		Sunset  string
	})
	if sunriseData != nil {
		for _, result := range sunriseData.Results {
			sunriseMap[result.Date] = struct {
				Sunrise string
				Sunset  string
			}{
				Sunrise: result.Sunrise,
				Sunset:  result.Sunset,
			}
		}
	}

	// Create daily items
	for i, date := range weatherData.Daily.Time {
		// Skip if any required array doesn't have this index
		if i >= len(weatherData.Daily.WeatherCode) ||
			i >= len(weatherData.Daily.Temperature2mMax) ||
			i >= len(weatherData.Daily.Temperature2mMin) ||
			i >= len(weatherData.Daily.WindSpeed10mMax) ||
			i >= len(weatherData.Daily.WindDirection10mDominant) {
			continue
		}

		// Get sunrise/sunset data for this date
		sunriseInfo, ok := sunriseMap[date]
		sunrise := ""
		sunset := ""
		if ok {
			sunrise = sunriseInfo.Sunrise
			sunset = sunriseInfo.Sunset
		} else if i < len(weatherData.Daily.Sunrise) && i < len(weatherData.Daily.Sunset) {
			sunrise = weatherData.Daily.Sunrise[i]
			sunset = weatherData.Daily.Sunset[i]
		}

		// Get weather description
		weatherDesc := getWeatherDescription(weatherData.Daily.WeatherCode[i])

		// Safely get wind gust value
		var windGust string
		if len(weatherData.Daily.WindGusts10mMax) > i {
			windGust = fmt.Sprintf("%f", weatherData.Daily.WindGusts10mMax[i])
		} else {
			windGust = "0"
		}

		// Safely get precipitation probability
		var pop string
		if len(weatherData.Daily.PrecipitationProbabilityMax) > i {
			pop = fmt.Sprintf("%f", weatherData.Daily.PrecipitationProbabilityMax[i]/100)
		} else {
			pop = "0"
		}

		item := DailyItem{
			Date:    date,
			Sunrise: sunrise,
			Sunset:  sunset,
			Summary: weatherDesc,
			Temp: Temperature{
				Day:   fmt.Sprintf("%f", weatherData.Daily.Temperature2mMax[i]),
				Min:   fmt.Sprintf("%f", weatherData.Daily.Temperature2mMin[i]),
				Max:   fmt.Sprintf("%f", weatherData.Daily.Temperature2mMax[i]),
				Night: fmt.Sprintf("%f", weatherData.Daily.Temperature2mMin[i]),
				Eve:   fmt.Sprintf("%f", weatherData.Daily.Temperature2mMax[i]),
				Morn:  fmt.Sprintf("%f", weatherData.Daily.Temperature2mMin[i]),
			},
			FeelsLike: FeelsLike{
				Day:   fmt.Sprintf("%f", weatherData.Daily.Temperature2mMax[i]),
				Night: fmt.Sprintf("%f", weatherData.Daily.Temperature2mMin[i]),
				Eve:   fmt.Sprintf("%f", weatherData.Daily.Temperature2mMax[i]),
				Morn:  fmt.Sprintf("%f", weatherData.Daily.Temperature2mMin[i]),
			},
			WindSpeed: fmt.Sprintf("%f", weatherData.Daily.WindSpeed10mMax[i]),
			WindDeg:   fmt.Sprintf("%f", weatherData.Daily.WindDirection10mDominant[i]),
			WindGust:  windGust,
			Weather: []WeatherInfo{
				{
					ID:          fmt.Sprintf("%d", weatherData.Daily.WeatherCode[i]),
					Main:        getWeatherMain(weatherData.Daily.WeatherCode[i]),
					Description: weatherDesc,
					Icon:        getWeatherIcon(weatherData.Daily.WeatherCode[i]),
				},
			},
			Clouds: "0",
			Pop:    pop,
			Uvi:    "0",
		}
		items = append(items, item)
	}

	return items
}

// SunriseSunsetResponse represents the response from the sunrise-sunset API
type SunriseSunsetResponse struct {
	Status  string `json:"status"`
	Results []struct {
		Date    string `json:"date"`
		Sunrise string `json:"sunrise"`
		Sunset  string `json:"sunset"`
	} `json:"results"`
}

// WeatherResponse represents the response from the weather API
type WeatherResponse = OpenMeteoResponse
