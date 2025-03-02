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
	return formatDate(time.Now())
}

// getDatePlusDays returns date X days from now in YYYY-MM-DD format
func getDatePlusDays(days int) string {
	date := time.Now().AddDate(0, 0, days)
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

// validateDateRange validates if date is within API's supported range
func validateDateRange(date string) bool {
	checkDate, err := time.Parse("2006-01-02", date)
	if err != nil {
		return false
	}

	today := time.Now()
	today = time.Date(today.Year(), today.Month(), today.Day(), 0, 0, 0, 0, today.Location())
	maxDate := today.AddDate(0, 0, 16)

	return !checkDate.Before(today) && !checkDate.After(maxDate)
}

// validateBookingDates validates check-in and check-out dates
func validateBookingDates(checkInDate, checkOutDate string) error {
	today := time.Now()
	today = time.Date(today.Year(), today.Month(), today.Day(), 0, 0, 0, 0, today.Location())

	checkIn, err := time.Parse("2006-01-02", checkInDate)
	if err != nil {
		return fmt.Errorf("invalid check-in date format: %s", checkInDate)
	}

	checkOut, err := time.Parse("2006-01-02", checkOutDate)
	if err != nil {
		return fmt.Errorf("invalid check-out date format: %s", checkOutDate)
	}

	// Calculate date 15 days from check-in date
	maxDate := checkIn.AddDate(0, 0, 15)

	if checkIn.Before(today) {
		return fmt.Errorf("check-in date (%s) cannot be before today (%s)", checkInDate, formatDate(today))
	}

	if checkOut.After(maxDate) {
		return fmt.Errorf("check-out date (%s) cannot be more than 15 days from check-in date (%s)", checkOutDate, formatDate(maxDate))
	}

	if checkIn.After(checkOut) {
		return fmt.Errorf("check-in date (%s) cannot be after check-out date (%s)", checkInDate, checkOutDate)
	}

	return nil
}
