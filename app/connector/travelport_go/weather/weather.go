package weather

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strconv"
	"strings"
	"time"
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
	Latitude:  52.52,
	Longitude: 13.41,
	Daily: []string{
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
		"et0_fao_evapotranspiration",
	},
	TemperatureUnit:   "fahrenheit",
	WindSpeedUnit:     "ms",
	PrecipitationUnit: "inch",
	Timezone:          "GMT",
	Timeformat:        "iso8601",
}

const baseURL = "https://api.open-meteo.com/v1/forecast"

// WeatherService handles weather data operations
type WeatherService struct {
	client *http.Client
}

// NewWeatherService creates a new WeatherService instance
func NewWeatherService() *WeatherService {
	return &WeatherService{
		client: &http.Client{
			Timeout: time.Second * 10,
		},
	}
}

// GetWeatherData retrieves weather data based on provided parameters
func (s *WeatherService) GetWeatherData(params *WeatherDataParams) (*WeatherDataResponse, error) {
	// Use default or provided parameters
	startDate := getCurrentDate()
	endDate := getDatePlusDays(3)
	lat := DefaultParams.Latitude
	lon := DefaultParams.Longitude
	tempUnit := DefaultParams.TemperatureUnit
	windUnit := DefaultParams.WindSpeedUnit
	precipUnit := DefaultParams.PrecipitationUnit

	if params != nil {
		if params.CheckInDate != "" {
			startDate = params.CheckInDate
		}
		if params.CheckOutDate != "" {
			endDate = params.CheckOutDate
		}
		if params.Latitude != "" {
			if latVal, err := strconv.ParseFloat(params.Latitude, 64); err == nil {
				lat = latVal
			}
		}
		if params.Longitude != "" {
			if lonVal, err := strconv.ParseFloat(params.Longitude, 64); err == nil {
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

	// Validate dates
	if err := validateBookingDates(startDate, endDate); err != nil {
		return nil, err
	}

	// Validate date range for API compatibility
	if !validateDateRange(startDate) || !validateDateRange(endDate) {
		return nil, fmt.Errorf("dates must be between today and 16 days from today")
	}

	// Get sunrise/sunset data
	sunriseData, err := s.fetchDirectData(lat, lon, startDate, endDate)
	if err != nil {
		return nil, fmt.Errorf("error fetching sunrise/sunset data: %w", err)
	}

	// Get main weather data
	weatherData, err := s.fetchWeatherData(lat, lon, startDate, endDate, tempUnit, windUnit, precipUnit)
	if err != nil {
		return nil, fmt.Errorf("error fetching weather data: %w", err)
	}

	// Create response
	response := &WeatherDataResponse{}
	response.WeatherData.Lat = fmt.Sprintf("%f", weatherData.Latitude)
	response.WeatherData.Lon = fmt.Sprintf("%f", weatherData.Longitude)
	response.WeatherData.Timezone = weatherData.Timezone
	response.WeatherData.TimezoneOffset = fmt.Sprintf("%d", weatherData.UTCOffsetSeconds)

	// Create daily items
	response.WeatherData.Daily = createDailyItems(weatherData, sunriseData)

	return response, nil
}

func (s *WeatherService) fetchDirectData(lat, lon float64, startDate, endDate string) (*OpenMeteoResponse, error) {
	url := fmt.Sprintf("%s?latitude=%f&longitude=%f&daily=sunrise,sunset&timezone=%s&timeformat=%s&start_date=%s&end_date=%s",
		baseURL, lat, lon, DefaultParams.Timezone, DefaultParams.Timeformat, startDate, endDate)

	resp, err := s.client.Get(url)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("API error (sunrise/sunset): %d - %s", resp.StatusCode, string(body))
	}

	var data OpenMeteoResponse
	if err := json.NewDecoder(resp.Body).Decode(&data); err != nil {
		return nil, err
	}

	if data.Error {
		return nil, fmt.Errorf("API error: %s", data.Reason)
	}

	return &data, nil
}

func (s *WeatherService) fetchWeatherData(lat, lon float64, startDate, endDate, tempUnit, windUnit, precipUnit string) (*OpenMeteoResponse, error) {
	dailyParams := strings.Join(DefaultParams.Daily, ",")
	url := fmt.Sprintf("%s?latitude=%f&longitude=%f&daily=%s&temperature_unit=%s&wind_speed_unit=%s&precipitation_unit=%s&timezone=%s&timeformat=%s&start_date=%s&end_date=%s",
		baseURL, lat, lon, dailyParams, tempUnit, windUnit, precipUnit, DefaultParams.Timezone, DefaultParams.Timeformat, startDate, endDate)

	resp, err := s.client.Get(url)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("API error (main): %d - %s", resp.StatusCode, string(body))
	}

	var data OpenMeteoResponse
	if err := json.NewDecoder(resp.Body).Decode(&data); err != nil {
		return nil, err
	}

	if data.Error {
		return nil, fmt.Errorf("API error: %s", data.Reason)
	}

	return &data, nil
}

func createDailyItems(weatherData, sunriseData *OpenMeteoResponse) []DailyItem {
	var items []DailyItem

	for i := 0; i < len(weatherData.Daily.Time); i++ {
		weatherInfo := getWeatherInfo(weatherData.Daily.WeatherCode[i])

		item := DailyItem{
			Date:    weatherData.Daily.Time[i][:10], // Get date part only
			Sunrise: sunriseData.Daily.Sunrise[i],
			Sunset:  sunriseData.Daily.Sunset[i],
			Summary: weatherInfo.Description,
			Temp: Temperature{
				Day:   fmt.Sprintf("%f", weatherData.Daily.Temperature2mMax[i]),
				Min:   fmt.Sprintf("%f", weatherData.Daily.Temperature2mMin[i]),
				Max:   fmt.Sprintf("%f", weatherData.Daily.Temperature2mMax[i]),
				Night: fmt.Sprintf("%f", weatherData.Daily.Temperature2mMin[i]),
				Eve:   fmt.Sprintf("%f", weatherData.Daily.Temperature2mMax[i]),
				Morn:  fmt.Sprintf("%f", weatherData.Daily.Temperature2mMin[i]),
			},
			FeelsLike: FeelsLike{
				Day:   fmt.Sprintf("%f", weatherData.Daily.ApparentTemperatureMax[i]),
				Night: fmt.Sprintf("%f", weatherData.Daily.ApparentTemperatureMin[i]),
				Eve:   fmt.Sprintf("%f", weatherData.Daily.ApparentTemperatureMax[i]),
				Morn:  fmt.Sprintf("%f", weatherData.Daily.ApparentTemperatureMin[i]),
			},
			WindSpeed: fmt.Sprintf("%f", weatherData.Daily.WindSpeed10mMax[i]),
			WindDeg:   fmt.Sprintf("%f", weatherData.Daily.WindDirection10mDominant[i]),
			WindGust:  fmt.Sprintf("%f", weatherData.Daily.WindGusts10mMax[i]),
			Weather: []WeatherInfo{
				{
					ID:          fmt.Sprintf("%d", weatherData.Daily.WeatherCode[i]),
					Main:        weatherInfo.Main,
					Description: weatherInfo.Description,
					Icon:        weatherInfo.Icon,
				},
			},
			Clouds: "0",
			Pop:    fmt.Sprintf("%f", weatherData.Daily.PrecipitationProbabilityMax[i]/100),
			Uvi:    fmt.Sprintf("%f", weatherData.Daily.UVIndexMax[i]),
		}

		items = append(items, item)
	}

	return items
}
