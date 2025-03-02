package weather

import (
	"fmt"
)

// Error types for the weather service
var (
	ErrInvalidDateFormat   = fmt.Errorf("invalid date format")
	ErrInvalidDateRange    = fmt.Errorf("date must be between today and %d days from today", maxForecastDays)
	ErrInvalidBookingRange = fmt.Errorf("booking period cannot exceed %d days", maxBookingDays)
	ErrInvalidCheckInDate  = fmt.Errorf("check-in date cannot be before today")
	ErrInvalidCheckOutDate = fmt.Errorf("check-out date cannot be before check-in date")
	ErrInvalidCoordinates  = fmt.Errorf("invalid coordinates provided")
	ErrAPIResponse         = fmt.Errorf("API response error")
)

// WeatherError represents a custom error type for weather service
type WeatherError struct {
	Code    string
	Message string
	Err     error
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

// NewInvalidDateFormatError creates a new invalid date format error
func NewInvalidDateFormatError(date string) *WeatherError {
	return &WeatherError{
		Code:    "INVALID_DATE_FORMAT",
		Message: fmt.Sprintf("invalid date format: %s", date),
		Err:     ErrInvalidDateFormat,
	}
}

// NewInvalidDateRangeError creates a new invalid date range error
func NewInvalidDateRangeError(date string) *WeatherError {
	return &WeatherError{
		Code:    "INVALID_DATE_RANGE",
		Message: fmt.Sprintf("date %s is outside the valid range", date),
		Err:     ErrInvalidDateRange,
	}
}

// NewInvalidBookingRangeError creates a new invalid booking range error
func NewInvalidBookingRangeError(checkIn, checkOut string) *WeatherError {
	return &WeatherError{
		Code:    "INVALID_BOOKING_RANGE",
		Message: fmt.Sprintf("booking period from %s to %s exceeds maximum allowed days", checkIn, checkOut),
		Err:     ErrInvalidBookingRange,
	}
}

// NewInvalidCoordinatesError creates a new invalid coordinates error
func NewInvalidCoordinatesError(lat, lon float64) *WeatherError {
	return &WeatherError{
		Code:    "INVALID_COORDINATES",
		Message: fmt.Sprintf("invalid coordinates: lat=%f, lon=%f", lat, lon),
		Err:     ErrInvalidCoordinates,
	}
}

// NewAPIError creates a new API error
func NewAPIError(statusCode int, message string) *WeatherError {
	return &WeatherError{
		Code:    "API_ERROR",
		Message: fmt.Sprintf("API request failed with status %d: %s", statusCode, message),
		Err:     ErrAPIResponse,
	}
}

// IsInvalidDateFormat checks if the error is an invalid date format error
func IsInvalidDateFormat(err error) bool {
	return errorIs(err, ErrInvalidDateFormat)
}

// IsInvalidDateRange checks if the error is an invalid date range error
func IsInvalidDateRange(err error) bool {
	return errorIs(err, ErrInvalidDateRange)
}

// IsInvalidBookingRange checks if the error is an invalid booking range error
func IsInvalidBookingRange(err error) bool {
	return errorIs(err, ErrInvalidBookingRange)
}

// IsInvalidCoordinates checks if the error is an invalid coordinates error
func IsInvalidCoordinates(err error) bool {
	return errorIs(err, ErrInvalidCoordinates)
}

// IsAPIError checks if the error is an API error
func IsAPIError(err error) bool {
	return errorIs(err, ErrAPIResponse)
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
