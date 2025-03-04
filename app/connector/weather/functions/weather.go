package functions

import (
	"context"

	"hasura-ndc.dev/ndc-go/types"
	"hasura-ndc.dev/ndc-go/weather"
)

// WeatherArguments represents the input arguments for the weather function
type WeatherArguments struct {
	CheckInDate  *string `json:"checkInDate,omitempty"`
	CheckOutDate *string `json:"checkOutDate,omitempty"`
	Latitude     *string `json:"latitude,omitempty"`
	Longitude    *string `json:"longitude,omitempty"`
	Unit         *string `json:"unit,omitempty"`
}

func FunctionGetWeather(ctx context.Context, state *types.State, arguments *WeatherArguments) (*weather.WeatherDataResponse, error) {
	// Create weather service
	service := weather.NewWeatherService()

	// Convert arguments to WeatherDataParams
	params := &weather.WeatherDataParams{}
	if arguments != nil {
		if arguments.CheckInDate != nil {
			params.CheckInDate = *arguments.CheckInDate
		}
		if arguments.CheckOutDate != nil {
			params.CheckOutDate = *arguments.CheckOutDate
		}
		if arguments.Latitude != nil {
			params.Latitude = *arguments.Latitude
		}
		if arguments.Longitude != nil {
			params.Longitude = *arguments.Longitude
		}
		if arguments.Unit != nil {
			params.Unit = *arguments.Unit
		}
	}

	// Get weather data
	return service.GetWeatherData(params)
}
