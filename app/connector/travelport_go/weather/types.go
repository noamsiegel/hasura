package weather

// WeatherDataParams represents the parameters for weather data request
type WeatherDataParams struct {
	CheckInDate       string `json:"checkInDate,omitempty"`
	CheckOutDate      string `json:"checkOutDate,omitempty"`
	Latitude          string `json:"latitude,omitempty"`
	Longitude         string `json:"longitude,omitempty"`
	TemperatureUnit   string `json:"temperatureUnit,omitempty"`
	WindSpeedUnit     string `json:"windSpeedUnit,omitempty"`
	PrecipitationUnit string `json:"precipitationUnit,omitempty"`
}

// WeatherDataResponse represents the response from the weather service
type WeatherDataResponse struct {
	WeatherData struct {
		Lat            string      `json:"lat"`
		Lon            string      `json:"lon"`
		Timezone       string      `json:"timezone"`
		TimezoneOffset string      `json:"timezone_offset"`
		Daily          []DailyItem `json:"daily"`
	} `json:"weatherData"`
}

// DailyItem represents daily weather information
type DailyItem struct {
	Date      string        `json:"date"`
	Sunrise   string        `json:"sunrise"`
	Sunset    string        `json:"sunset"`
	Summary   string        `json:"summary"`
	Temp      Temperature   `json:"temp"`
	FeelsLike FeelsLike     `json:"feels_like"`
	WindSpeed string        `json:"wind_speed"`
	WindDeg   string        `json:"wind_deg"`
	WindGust  string        `json:"wind_gust"`
	Weather   []WeatherInfo `json:"weather"`
	Clouds    string        `json:"clouds"`
	Pop       string        `json:"pop"`
	Uvi       string        `json:"uvi"`
}

// Temperature represents temperature information
type Temperature struct {
	Day   string `json:"day"`
	Min   string `json:"min"`
	Max   string `json:"max"`
	Night string `json:"night"`
	Eve   string `json:"eve"`
	Morn  string `json:"morn"`
}

// FeelsLike represents "feels like" temperature information
type FeelsLike struct {
	Day   string `json:"day"`
	Night string `json:"night"`
	Eve   string `json:"eve"`
	Morn  string `json:"morn"`
}

// WeatherInfo represents weather condition information
type WeatherInfo struct {
	ID          string `json:"id"`
	Main        string `json:"main"`
	Description string `json:"description"`
	Icon        string `json:"icon"`
}

// OpenMeteoResponse represents the raw response from Open Meteo API
type OpenMeteoResponse struct {
	Latitude         float64           `json:"latitude"`
	Longitude        float64           `json:"longitude"`
	Timezone         string            `json:"timezone"`
	TimezoneAbbr     string            `json:"timezone_abbreviation"`
	UTCOffsetSeconds int               `json:"utc_offset_seconds"`
	Daily            Daily             `json:"daily"`
	DailyUnits       map[string]string `json:"daily_units"`
	Error            bool              `json:"error"`
	Reason           string            `json:"reason"`
}

// Daily represents daily weather data from Open Meteo
type Daily struct {
	Time                        []string  `json:"time"`
	WeatherCode                 []int     `json:"weather_code"`
	Temperature2mMax            []float64 `json:"temperature_2m_max"`
	Temperature2mMin            []float64 `json:"temperature_2m_min"`
	ApparentTemperatureMax      []float64 `json:"apparent_temperature_max"`
	ApparentTemperatureMin      []float64 `json:"apparent_temperature_min"`
	Sunrise                     []string  `json:"sunrise"`
	Sunset                      []string  `json:"sunset"`
	DaylightDuration            []float64 `json:"daylight_duration"`
	SunshineDuration            []float64 `json:"sunshine_duration"`
	UVIndexMax                  []float64 `json:"uv_index_max"`
	UVIndexClearSkyMax          []float64 `json:"uv_index_clear_sky_max"`
	PrecipitationSum            []float64 `json:"precipitation_sum"`
	RainSum                     []float64 `json:"rain_sum"`
	ShowersSum                  []float64 `json:"showers_sum"`
	SnowfallSum                 []float64 `json:"snowfall_sum"`
	PrecipitationHours          []float64 `json:"precipitation_hours"`
	PrecipitationProbabilityMax []float64 `json:"precipitation_probability_max"`
	WindSpeed10mMax             []float64 `json:"wind_speed_10m_max"`
	WindGusts10mMax             []float64 `json:"wind_gusts_10m_max"`
	WindDirection10mDominant    []float64 `json:"wind_direction_10m_dominant"`
	ShortwaveRadiationSum       []float64 `json:"shortwave_radiation_sum"`
	ET0FaoEvapotranspiration    []float64 `json:"et0_fao_evapotranspiration"`
}

// WeatherCode represents weather code mapping
type WeatherCode struct {
	Main        string
	Description string
	Icon        string
}
