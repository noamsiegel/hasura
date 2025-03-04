package weather

import (
	"fmt"
	"time"
)

// Weather codes mapping
var weatherCodes = map[int]WeatherCode{
	0:  {Main: "Clear", Description: "Clear sky", Icon: "01d"},
	1:  {Main: "Clear", Description: "Mainly clear", Icon: "01d"},
	2:  {Main: "Clouds", Description: "Partly cloudy", Icon: "02d"},
	3:  {Main: "Clouds", Description: "Overcast", Icon: "03d"},
	45: {Main: "Fog", Description: "Fog", Icon: "50d"},
	48: {Main: "Fog", Description: "Depositing rime fog", Icon: "50d"},
	51: {Main: "Drizzle", Description: "Light drizzle", Icon: "09d"},
	53: {Main: "Drizzle", Description: "Moderate drizzle", Icon: "09d"},
	55: {Main: "Drizzle", Description: "Dense drizzle", Icon: "09d"},
	56: {Main: "Drizzle", Description: "Light freezing drizzle", Icon: "09d"},
	57: {Main: "Drizzle", Description: "Dense freezing drizzle", Icon: "09d"},
	61: {Main: "Rain", Description: "Slight rain", Icon: "10d"},
	63: {Main: "Rain", Description: "Moderate rain", Icon: "10d"},
	65: {Main: "Rain", Description: "Heavy rain", Icon: "10d"},
	66: {Main: "Rain", Description: "Light freezing rain", Icon: "13d"},
	67: {Main: "Rain", Description: "Heavy freezing rain", Icon: "13d"},
	71: {Main: "Snow", Description: "Slight snow fall", Icon: "13d"},
	73: {Main: "Snow", Description: "Moderate snow fall", Icon: "13d"},
	75: {Main: "Snow", Description: "Heavy snow fall", Icon: "13d"},
	77: {Main: "Snow", Description: "Snow grains", Icon: "13d"},
	80: {Main: "Rain", Description: "Slight rain showers", Icon: "09d"},
	81: {Main: "Rain", Description: "Moderate rain showers", Icon: "09d"},
	82: {Main: "Rain", Description: "Violent rain showers", Icon: "09d"},
	85: {Main: "Snow", Description: "Slight snow showers", Icon: "13d"},
	86: {Main: "Snow", Description: "Heavy snow showers", Icon: "13d"},
	95: {Main: "Thunderstorm", Description: "Thunderstorm", Icon: "11d"},
	96: {Main: "Thunderstorm", Description: "Thunderstorm with slight hail", Icon: "11d"},
	99: {Main: "Thunderstorm", Description: "Thunderstorm with heavy hail", Icon: "11d"},
}

// getCurrentDate returns current date in YYYY-MM-DD format
func getCurrentDate() string {
	// Use UTC to ensure consistency across different server environments
	now := time.Now().UTC()
	return formatDate(now)
}

// getDatePlusDays returns date X days from now in YYYY-MM-DD format
func getDatePlusDays(days int) string {
	date := time.Now().UTC().AddDate(0, 0, days)
	return formatDate(date)
}

// formatDate formats a date as YYYY-MM-DD
func formatDate(date time.Time) string {
	return date.Format("2006-01-02")
}

// getWeatherInfo converts weather code to description and icon
func getWeatherInfo(code int) WeatherCode {
	if info, ok := weatherCodes[code]; ok {
		return info
	}
	return WeatherCode{
		Main:        "Unknown",
		Description: "Unknown weather",
		Icon:        "50d",
	}
}

// getWeatherDescription returns a description for a weather code
// Uses getWeatherInfo internally for consistency
func getWeatherDescription(code int) string {
	return getWeatherInfo(code).Description
}

// getWeatherMain returns a main category for a weather code
// Uses getWeatherInfo internally for consistency
func getWeatherMain(code int) string {
	return getWeatherInfo(code).Main
}

// getWeatherIcon returns an icon code for a weather code
// Uses getWeatherInfo internally for consistency
func getWeatherIcon(code int) string {
	return getWeatherInfo(code).Icon
}

// validateDateRange checks if a date is within the valid range for the API
func validateDateRange(date string, timezone string) error {
	// Get the location for the provided timezone
	loc := time.UTC // Default to UTC if no timezone provided
	if timezone != "" {
		var err error
		loc, err = time.LoadLocation(timezone)
		if err != nil {
			loc = time.UTC
		}
	}

	// Get current time in the target timezone
	rawToday := time.Now().In(loc)

	// Truncate time component to get just the date at midnight in the target timezone
	today := time.Date(rawToday.Year(), rawToday.Month(), rawToday.Day(), 0, 0, 0, 0, loc)

	// Parse the input date in the target timezone
	inputDate, err := time.ParseInLocation("2006-01-02", date, loc)
	if err != nil {
		return fmt.Errorf("invalid date format: %s", date)
	}

	// Calculate the maximum date (today + maxForecastDays) in the target timezone
	maxDate := today.AddDate(0, 0, maxForecastDays)

	// Check if the date is within the valid range
	isValid := (inputDate.After(today) || inputDate.Equal(today)) &&
		(inputDate.Before(maxDate) || inputDate.Equal(maxDate))

	if !isValid {
		return NewInvalidDateRangeError(date, timezone)
	}
	return nil
}

// validateBookingDates validates check-in and check-out dates
func validateBookingDates(checkInDate, checkOutDate string, timezone string) error {
	// Get the location for the provided timezone
	loc := time.UTC // Default to UTC if no timezone provided
	if timezone != "" {
		var err error
		loc, err = time.LoadLocation(timezone)
		if err != nil {
			loc = time.UTC
		}
	}

	// Use the location's time for validation
	now := time.Now().In(loc)
	today := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, loc)

	// Parse dates in the target timezone
	checkIn, err := time.ParseInLocation("2006-01-02", checkInDate, loc)
	if err != nil {
		return fmt.Errorf("invalid check-in date format: %s", checkInDate)
	}

	checkOut, err := time.ParseInLocation("2006-01-02", checkOutDate, loc)
	if err != nil {
		return fmt.Errorf("invalid check-out date format: %s", checkOutDate)
	}

	// Calculate date 15 days from check-in date
	maxDate := checkIn.AddDate(0, 0, 15)

	// Check if check-in date is not before today
	if checkIn.Before(today) {
		return NewInvalidCheckInDateError(checkInDate, formatDate(today), timezone)
	}

	if checkOut.After(maxDate) {
		return fmt.Errorf("check-out date (%s) cannot be more than 15 days from check-in date (%s)", checkOutDate, formatDate(maxDate))
	}

	if checkIn.After(checkOut) {
		return fmt.Errorf("check-in date (%s) cannot be after check-out date (%s)", checkInDate, checkOutDate)
	}

	return nil
}
