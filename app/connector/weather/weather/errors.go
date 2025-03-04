package weather

import (
	"fmt"
	"time"

	"github.com/hasura/ndc-sdk-go/schema"
)

// Error types for the weather service
var (
	ErrInvalidDateFormat   = fmt.Errorf("invalid date format")
	ErrInvalidDateRange    = fmt.Errorf("date must be between today and %d days from today in the local timezone", maxForecastDays)
	ErrInvalidCheckInDate  = fmt.Errorf("check-in date cannot be before today in the local timezone")
	ErrInvalidCheckOutDate = fmt.Errorf("check-out date cannot be before check-in date")
	ErrInvalidCoordinates  = fmt.Errorf("invalid coordinates provided")
	ErrAPIResponse         = fmt.Errorf("API response error")
)

// WeatherError represents a custom error type for weather service
type WeatherError struct {
	Code    string
	Message string
	Err     error
	Details map[string]interface{}
}

// Error implements the error interface
func (e *WeatherError) Error() string {
	if e.Err != nil {
		return fmt.Sprintf("[%s] %s: %v", e.Code, e.Message, e.Err)
	}
	return fmt.Sprintf("[%s] %s", e.Code, e.Message)
}

// Unwrap implements the errors.Unwrap interface
func (e *WeatherError) Unwrap() error {
	return e.Err
}

// ToSDKError converts WeatherError to Hasura SDK error
func (e *WeatherError) ToSDKError() error {
	details := e.Details
	if details == nil {
		details = make(map[string]interface{})
	}
	details["code"] = e.Code
	return schema.UnprocessableContentError(e.Message, details)
}

// NewInvalidCheckInDateError creates a new invalid check-in date error
func NewInvalidCheckInDateError(checkInDate, today string, timezone string) *WeatherError {
	localTimeInfo := ""
	if timezone != "" {
		if loc, err := time.LoadLocation(timezone); err == nil {
			now := time.Now().In(loc)
			localTimeInfo = fmt.Sprintf(" (current time in %s: %s)", timezone, now.Format("2006-01-02 15:04:05"))
		}
	}

	return &WeatherError{
		Code:    "INVALID_CHECK_IN_DATE",
		Message: fmt.Sprintf("check-in date (%s) cannot be before today (%s)%s", checkInDate, today, localTimeInfo),
		Err:     ErrInvalidCheckInDate,
		Details: map[string]interface{}{
			"checkInDate": checkInDate,
			"today":       today,
			"timezone":    timezone,
		},
	}
}

// NewInvalidDateRangeError creates a new invalid date range error
func NewInvalidDateRangeError(date string, timezone string) *WeatherError {
	localTimeInfo := ""
	if timezone != "" {
		if loc, err := time.LoadLocation(timezone); err == nil {
			now := time.Now().In(loc)
			localTimeInfo = fmt.Sprintf(" (current time in %s: %s)", timezone, now.Format("2006-01-02 15:04:05"))
		}
	}

	return &WeatherError{
		Code:    "INVALID_DATE_RANGE",
		Message: fmt.Sprintf("date %s is outside the valid range%s", date, localTimeInfo),
		Err:     ErrInvalidDateRange,
		Details: map[string]interface{}{
			"date":            date,
			"maxForecastDays": maxForecastDays,
			"timezone":        timezone,
		},
	}
}

// NewInvalidCoordinatesError creates a new invalid coordinates error
func NewInvalidCoordinatesError(lat, lon float64, timezone string) *WeatherError {
	localTimeInfo := ""
	if timezone != "" {
		if loc, err := time.LoadLocation(timezone); err == nil {
			now := time.Now().In(loc)
			localTimeInfo = fmt.Sprintf(" (current time in %s: %s)", timezone, now.Format("2006-01-02 15:04:05"))
		}
	}

	return &WeatherError{
		Code:    "INVALID_COORDINATES",
		Message: fmt.Sprintf("invalid coordinates: lat=%f, lon=%f%s", lat, lon, localTimeInfo),
		Err:     ErrInvalidCoordinates,
		Details: map[string]interface{}{
			"latitude":  lat,
			"longitude": lon,
			"timezone":  timezone,
		},
	}
}

// NewAPIError creates a new API error
func NewAPIError(statusCode int, message string) *WeatherError {
	return &WeatherError{
		Code:    "API_ERROR",
		Message: fmt.Sprintf("API request failed with status %d: %s", statusCode, message),
		Err:     ErrAPIResponse,
		Details: map[string]interface{}{
			"statusCode": statusCode,
		},
	}
}

// Helper function to check error types
func errorIs(err, target error) bool {
	for err != nil {
		if err == target {
			return true
		}
		if unwrapper, ok := err.(interface{ Unwrap() error }); ok {
			err = unwrapper.Unwrap()
			continue
		}
		break
	}
	return false
}
