package weather

import (
	"time"

	"github.com/ringsaturn/tzf"
)

// Global timezone finder instance
var DefaultFinder, _ = tzf.NewDefaultFinder()

// API related constants
const (
	baseURL            = "https://api.open-meteo.com/v1/forecast"
	apiVersion         = "v1"
	defaultHTTPTimeout = time.Second * 10
)

// Default configuration values
const (
	defaultLatitude  = 52.52
	defaultLongitude = 13.41
)

// Unit system constants
const (
	UnitMetric   = "metric"
	UnitImperial = "imperial"
)

// Unit defaults for metric system
const (
	metricTemperatureUnit   = "celsius"
	metricWindSpeedUnit     = "kmh"
	metricPrecipitationUnit = "mm"
)

// Unit defaults for imperial system
const (
	imperialTemperatureUnit   = "fahrenheit"
	imperialWindSpeedUnit     = "mph"
	imperialPrecipitationUnit = "inch"
)

// Default unit values
const (
	defaultUnit              = UnitMetric
	defaultTemperatureUnit   = metricTemperatureUnit
	defaultWindSpeedUnit     = metricWindSpeedUnit
	defaultPrecipitationUnit = metricPrecipitationUnit
	defaultTimezone          = "GMT"
	defaultTimeformat        = "iso8601"
)

// Date format constants
const (
	dateFormat      = "2006-01-02"
	maxForecastDays = 16
)

// Default daily parameters
var DefaultDailyParams = []string{
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
	"winddirection_10m_dominant",
	"shortwave_radiation_sum",
	"et0_fao_evapotranspiration",
}

// Coordinate validation constants
const (
	minLatitude  = -90.0
	maxLatitude  = 90.0
	minLongitude = -180.0
	maxLongitude = 180.0
)
