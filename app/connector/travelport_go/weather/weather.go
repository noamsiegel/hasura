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
	fmt.Printf("DEBUG: Starting GetWeatherData with params: %+v\n", params)
	// Use default or provided parameters
	today := getCurrentDate()
	startDate := today
	endDate := getDatePlusDays(3)
	lat := DefaultParams.Latitude
	lon := DefaultParams.Longitude
	tempUnit := DefaultParams.TemperatureUnit
	windUnit := DefaultParams.WindSpeedUnit
	precipUnit := DefaultParams.PrecipitationUnit

	// Debug log for date values
	fmt.Printf("DEBUG: Today's date (UTC): %s\n", today)

	if params != nil {
		if params.CheckInDate != "" {
			startDate = params.CheckInDate
			fmt.Printf("DEBUG: Using check-in date: %s\n", startDate)
		}
		if params.CheckOutDate != "" {
			endDate = params.CheckOutDate
			fmt.Printf("DEBUG: Using check-out date: %s\n", endDate)
		}
		if params.Latitude != "" {
			if latVal, err := strconv.ParseFloat(params.Latitude, 64); err == nil {
				if latVal < minLatitude || latVal > maxLatitude {
					// Detect timezone based on coordinates
					detectedTz := ""
					if DefaultFinder != nil {
						detectedTz = DefaultFinder.GetTimezoneName(lon, latVal)
						fmt.Printf("DEBUG: Detected timezone for invalid coordinates: %s\n", detectedTz)
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
						fmt.Printf("DEBUG: Detected timezone for invalid coordinates: %s\n", detectedTz)
					}
					err := NewInvalidCoordinatesError(lat, lonVal, detectedTz)
					return nil, err.ToSDKError()
				}
				lon = lonVal
			}
		}
		if params.TemperatureUnit != "" {
			tempUnit = params.TemperatureUnit
		}
		if params.WindSpeedUnit != "" {
			windUnit = params.WindSpeedUnit
		}
		if params.PrecipitationUnit != "" {
			precipUnit = params.PrecipitationUnit
		}
	}

	// Detect timezone based on coordinates
	detectedTz := ""
	if DefaultFinder != nil {
		detectedTz = DefaultFinder.GetTimezoneName(lon, lat)
		fmt.Printf("DEBUG: Detected timezone for coordinates: %s\n", detectedTz)
	}

	// Validate dates
	if err := validateBookingDates(startDate, endDate, detectedTz); err != nil {
		if we, ok := err.(*WeatherError); ok {
			return nil, we.ToSDKError()
		}
		return nil, NewAPIError(500, err.Error()).ToSDKError()
	}

	// Validate date range for API compatibility
	fmt.Printf("DEBUG: Validating date range for startDate: %s and endDate: %s\n", startDate, endDate)
	startDateErr := validateDateRange(startDate, detectedTz)
	endDateErr := validateDateRange(endDate, detectedTz)
	if startDateErr != nil || endDateErr != nil {
		fmt.Printf("DEBUG: Date range validation failed\n")
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
		fmt.Printf("ERROR: Failed to fetch sunrise data: %v\n", err)
		return nil, NewAPIError(500, err.Error()).ToSDKError()
	}
	fmt.Printf("DEBUG: Successfully fetched sunrise data: %+v\n", sunriseData)

	// Get weather data
	weatherData, err := s.fetchWeatherData(lat, lon, startDate, endDate, tempUnit, windUnit, precipUnit)
	if err != nil {
		fmt.Printf("ERROR: Failed to fetch weather data: %v\n", err)
		return nil, NewAPIError(500, err.Error()).ToSDKError()
	}
	fmt.Printf("DEBUG: Successfully fetched weather data: %+v\n", weatherData)

	// Create response
	response := &WeatherDataResponse{}
	response.WeatherData.Lat = fmt.Sprintf("%f", lat)
	response.WeatherData.Lon = fmt.Sprintf("%f", lon)
	response.WeatherData.Timezone = weatherData.Timezone

	// Create daily items
	response.WeatherData.Daily = createDailyItemsFromResponses(weatherData, sunriseData)
	fmt.Printf("DEBUG: Final response: %+v\n", response)

	return response, nil
}

// fetchDirectData fetches sunrise/sunset data from the API
func (s *WeatherService) fetchDirectData(lat, lon float64, startDate, endDate string) (*SunriseSunsetResponse, error) {
	// Detect timezone based on coordinates
	detectedTz := ""
	if DefaultFinder != nil {
		detectedTz = DefaultFinder.GetTimezoneName(lon, lat)
		fmt.Printf("DEBUG: Detected timezone for fetchDirectData: %s\n", detectedTz)
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

	fmt.Printf("DEBUG: Fetching direct data from URL: %s\n", url)

	// Make the request
	resp, err := http.Get(url)
	if err != nil {
		fmt.Printf("ERROR: Failed to fetch direct data: %v\n", err)
		return nil, err
	}
	defer resp.Body.Close()

	// Read the response
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		fmt.Printf("ERROR: Failed to read direct data response: %v\n", err)
		return nil, err
	}

	// Parse the response
	var sunriseData SunriseSunsetResponse
	if err := json.Unmarshal(body, &sunriseData); err != nil {
		fmt.Printf("ERROR: Failed to parse direct data response: %v\n", err)
		return nil, err
	}

	return &sunriseData, nil
}

// fetchWeatherData fetches weather data from the API
func (s *WeatherService) fetchWeatherData(lat, lon float64, startDate, endDate, tempUnit, windUnit, precipUnit string) (*WeatherResponse, error) {
	fmt.Printf("DEBUG: fetchWeatherData called with params - lat: %f, lon: %f, startDate: %s, endDate: %s\n", lat, lon, startDate, endDate)

	// Detect timezone based on coordinates
	detectedTz := ""
	if DefaultFinder != nil {
		detectedTz = DefaultFinder.GetTimezoneName(lon, lat)
		fmt.Printf("DEBUG: Detected timezone for fetchWeatherData: %s\n", detectedTz)
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

	fmt.Printf("DEBUG: Fetching weather data from URL: %s\n", url)

	// Make the request
	resp, err := http.Get(url)
	if err != nil {
		fmt.Printf("ERROR: Failed to fetch weather data: %v\n", err)
		return nil, err
	}
	defer resp.Body.Close()

	// Read the response
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		fmt.Printf("ERROR: Failed to read weather data response: %v\n", err)
		return nil, err
	}

	fmt.Printf("DEBUG: Raw API response: %s\n", string(body))

	// Parse the response
	var weatherData WeatherResponse
	if err := json.Unmarshal(body, &weatherData); err != nil {
		fmt.Printf("ERROR: Failed to parse weather data response: %v\n", err)
		return nil, err
	}

	// Validate the response data
	if weatherData.Daily.WeatherCode == nil || len(weatherData.Daily.WeatherCode) == 0 {
		fmt.Printf("ERROR: Weather codes are missing in the API response\n")
		return nil, fmt.Errorf("weather codes are missing in the API response")
	}

	fmt.Printf("DEBUG: Wind speed data - nil check: %v, length: %d\n", weatherData.Daily.WindSpeed10mMax == nil, len(weatherData.Daily.WindSpeed10mMax))
	if weatherData.Daily.WindSpeed10mMax == nil {
		fmt.Printf("ERROR: Wind speed array is nil in the API response\n")
		return nil, fmt.Errorf("wind speed array is nil in the API response")
	}
	if len(weatherData.Daily.WindSpeed10mMax) == 0 {
		fmt.Printf("ERROR: Wind speed array is empty in the API response\n")
		return nil, fmt.Errorf("wind speed array is empty in the API response")
	}

	fmt.Printf("DEBUG: Parsed weather data: %+v\n", weatherData)
	fmt.Printf("DEBUG: Daily data lengths - Time: %d, WeatherCode: %d, Temperature2mMax: %d, Temperature2mMin: %d, WindSpeed10mMax: %d\n",
		len(weatherData.Daily.Time),
		len(weatherData.Daily.WeatherCode),
		len(weatherData.Daily.Temperature2mMax),
		len(weatherData.Daily.Temperature2mMin),
		len(weatherData.Daily.WindSpeed10mMax))

	// Add debug for WindGusts10mMax and WindDirection10mDominant
	fmt.Printf("DEBUG: Additional array lengths - WindGusts10mMax: %d, WindDirection10mDominant: %d\n",
		len(weatherData.Daily.WindGusts10mMax),
		len(weatherData.Daily.WindDirection10mDominant))

	return &weatherData, nil
}

// createDailyItemsFromResponses creates daily items from the weather and sunrise/sunset responses
func createDailyItemsFromResponses(weatherData *WeatherResponse, sunriseData *SunriseSunsetResponse) []DailyItem {
	fmt.Printf("DEBUG: Starting createDailyItemsFromResponses\n")
	fmt.Printf("DEBUG: WeatherData: %+v\n", weatherData)
	fmt.Printf("DEBUG: SunriseData: %+v\n", sunriseData)

	items := make([]DailyItem, 0)

	// Debug check for nil pointers
	if weatherData == nil {
		fmt.Printf("ERROR: weatherData is nil\n")
		return items
	}
	if weatherData.Daily.Time == nil {
		fmt.Printf("ERROR: weatherData.Daily.Time is nil\n")
		return items
	}

	// Create a map of date to sunrise/sunset data for easier lookup
	sunriseMap := make(map[string]struct {
		Sunrise string
		Sunset  string
	})
	if sunriseData != nil {
		fmt.Printf("DEBUG: Processing sunrise data, results count: %d\n", len(sunriseData.Results))
		for _, result := range sunriseData.Results {
			fmt.Printf("DEBUG: Adding sunrise data for date: %s\n", result.Date)
			sunriseMap[result.Date] = struct {
				Sunrise string
				Sunset  string
			}{
				Sunrise: result.Sunrise,
				Sunset:  result.Sunset,
			}
		}
	}

	// Debug print array lengths
	fmt.Printf("DEBUG: Array lengths - Time: %d, WeatherCode: %d, Temperature2mMax: %d, Temperature2mMin: %d, WindSpeed10mMax: %d\n",
		len(weatherData.Daily.Time),
		len(weatherData.Daily.WeatherCode),
		len(weatherData.Daily.Temperature2mMax),
		len(weatherData.Daily.Temperature2mMin),
		len(weatherData.Daily.WindSpeed10mMax))

	// Add debug for WindGusts10mMax and WindDirection10mDominant
	fmt.Printf("DEBUG: Additional array lengths - WindGusts10mMax: %d, WindDirection10mDominant: %d, PrecipitationProbabilityMax: %d\n",
		len(weatherData.Daily.WindGusts10mMax),
		len(weatherData.Daily.WindDirection10mDominant),
		len(weatherData.Daily.PrecipitationProbabilityMax))

	// Create daily items
	for i, date := range weatherData.Daily.Time {
		fmt.Printf("DEBUG: Processing date: %s (index: %d)\n", date, i)

		// Skip if any required array doesn't have this index
		if i >= len(weatherData.Daily.WeatherCode) ||
			i >= len(weatherData.Daily.Temperature2mMax) ||
			i >= len(weatherData.Daily.Temperature2mMin) ||
			i >= len(weatherData.Daily.WindSpeed10mMax) ||
			i >= len(weatherData.Daily.WindDirection10mDominant) {
			fmt.Printf("ERROR: Index %d out of bounds for one or more required arrays\n", i)
			continue
		}

		// Get sunrise/sunset data for this date
		sunriseInfo, ok := sunriseMap[date]
		sunrise := ""
		sunset := ""
		if ok {
			fmt.Printf("DEBUG: Found sunrise data for date: %s\n", date)
			sunrise = sunriseInfo.Sunrise
			sunset = sunriseInfo.Sunset
		} else if i < len(weatherData.Daily.Sunrise) && i < len(weatherData.Daily.Sunset) {
			fmt.Printf("DEBUG: Using weather API sunrise data for date: %s\n", date)
			sunrise = weatherData.Daily.Sunrise[i]
			sunset = weatherData.Daily.Sunset[i]
		} else {
			fmt.Printf("DEBUG: No sunrise data available for date: %s\n", date)
		}

		// Get weather description
		weatherDesc := getWeatherDescription(weatherData.Daily.WeatherCode[i])
		fmt.Printf("DEBUG: Weather description for date %s: %s\n", date, weatherDesc)

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
		fmt.Printf("DEBUG: Created daily item for date %s: %+v\n", date, item)
		items = append(items, item)
	}

	fmt.Printf("DEBUG: Returning %d daily items\n", len(items))
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
