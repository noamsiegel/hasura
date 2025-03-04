// Code generated by qtc from "weather.qtpl". DO NOT EDIT.
// See https://github.com/valyala/quicktemplate for details.

//line weather.qtpl:1
package weather

//line weather.qtpl:1
import (
	qtio422016 "io"

	qt422016 "github.com/valyala/quicktemplate"
)

//line weather.qtpl:1
var (
	_ = qtio422016.Copy
	_ = qt422016.AcquireByteBuffer
)

//line weather.qtpl:1
func StreamWeatherDataResponseJSON(qw422016 *qt422016.Writer, r *WeatherDataResponse) {
//line weather.qtpl:1
	qw422016.N().S(`
{
    "weatherData":{
        "lat":"`)
//line weather.qtpl:4
	qw422016.E().S(r.WeatherData.Lat)
//line weather.qtpl:4
	qw422016.N().S(`",
        "lon":"`)
//line weather.qtpl:5
	qw422016.E().S(r.WeatherData.Lon)
//line weather.qtpl:5
	qw422016.N().S(`",
        "timezone":"`)
//line weather.qtpl:6
	qw422016.E().S(r.WeatherData.Timezone)
//line weather.qtpl:6
	qw422016.N().S(`",
        "daily":[
            `)
//line weather.qtpl:8
	for i, item := range r.WeatherData.Daily {
//line weather.qtpl:8
		qw422016.N().S(`
                `)
//line weather.qtpl:9
		if i > 0 {
//line weather.qtpl:9
			qw422016.N().S(`,`)
//line weather.qtpl:9
		}
//line weather.qtpl:9
		qw422016.N().S(`
                {
                    "date":"`)
//line weather.qtpl:11
		qw422016.E().S(item.Date)
//line weather.qtpl:11
		qw422016.N().S(`",
                    "sunrise":"`)
//line weather.qtpl:12
		qw422016.E().S(item.Sunrise)
//line weather.qtpl:12
		qw422016.N().S(`",
                    "sunset":"`)
//line weather.qtpl:13
		qw422016.E().S(item.Sunset)
//line weather.qtpl:13
		qw422016.N().S(`",
                    "summary":"`)
//line weather.qtpl:14
		qw422016.E().S(item.Summary)
//line weather.qtpl:14
		qw422016.N().S(`",
                    "temp":{
                        "day":"`)
//line weather.qtpl:16
		qw422016.E().S(item.Temp.Day)
//line weather.qtpl:16
		qw422016.N().S(`",
                        "min":"`)
//line weather.qtpl:17
		qw422016.E().S(item.Temp.Min)
//line weather.qtpl:17
		qw422016.N().S(`",
                        "max":"`)
//line weather.qtpl:18
		qw422016.E().S(item.Temp.Max)
//line weather.qtpl:18
		qw422016.N().S(`",
                        "night":"`)
//line weather.qtpl:19
		qw422016.E().S(item.Temp.Night)
//line weather.qtpl:19
		qw422016.N().S(`",
                        "eve":"`)
//line weather.qtpl:20
		qw422016.E().S(item.Temp.Eve)
//line weather.qtpl:20
		qw422016.N().S(`",
                        "morn":"`)
//line weather.qtpl:21
		qw422016.E().S(item.Temp.Morn)
//line weather.qtpl:21
		qw422016.N().S(`"
                    },
                    "feels_like":{
                        "day":"`)
//line weather.qtpl:24
		qw422016.E().S(item.FeelsLike.Day)
//line weather.qtpl:24
		qw422016.N().S(`",
                        "night":"`)
//line weather.qtpl:25
		qw422016.E().S(item.FeelsLike.Night)
//line weather.qtpl:25
		qw422016.N().S(`",
                        "eve":"`)
//line weather.qtpl:26
		qw422016.E().S(item.FeelsLike.Eve)
//line weather.qtpl:26
		qw422016.N().S(`",
                        "morn":"`)
//line weather.qtpl:27
		qw422016.E().S(item.FeelsLike.Morn)
//line weather.qtpl:27
		qw422016.N().S(`"
                    },
                    "wind_speed":"`)
//line weather.qtpl:29
		qw422016.E().S(item.WindSpeed)
//line weather.qtpl:29
		qw422016.N().S(`",
                    "wind_deg":"`)
//line weather.qtpl:30
		qw422016.E().S(item.WindDeg)
//line weather.qtpl:30
		qw422016.N().S(`",
                    "wind_gust":"`)
//line weather.qtpl:31
		qw422016.E().S(item.WindGust)
//line weather.qtpl:31
		qw422016.N().S(`",
                    "weather":[
                        `)
//line weather.qtpl:33
		for j, w := range item.Weather {
//line weather.qtpl:33
			qw422016.N().S(`
                            `)
//line weather.qtpl:34
			if j > 0 {
//line weather.qtpl:34
				qw422016.N().S(`,`)
//line weather.qtpl:34
			}
//line weather.qtpl:34
			qw422016.N().S(`
                            {
                                "id":"`)
//line weather.qtpl:36
			qw422016.E().S(w.ID)
//line weather.qtpl:36
			qw422016.N().S(`",
                                "main":"`)
//line weather.qtpl:37
			qw422016.E().S(w.Main)
//line weather.qtpl:37
			qw422016.N().S(`",
                                "description":"`)
//line weather.qtpl:38
			qw422016.E().S(w.Description)
//line weather.qtpl:38
			qw422016.N().S(`",
                                "icon":"`)
//line weather.qtpl:39
			qw422016.E().S(w.Icon)
//line weather.qtpl:39
			qw422016.N().S(`"
                            }
                        `)
//line weather.qtpl:41
		}
//line weather.qtpl:41
		qw422016.N().S(`
                    ],
                    "clouds":"`)
//line weather.qtpl:43
		qw422016.E().S(item.Clouds)
//line weather.qtpl:43
		qw422016.N().S(`",
                    "pop":"`)
//line weather.qtpl:44
		qw422016.E().S(item.Pop)
//line weather.qtpl:44
		qw422016.N().S(`",
                    "uvi":"`)
//line weather.qtpl:45
		qw422016.E().S(item.Uvi)
//line weather.qtpl:45
		qw422016.N().S(`"
                }
            `)
//line weather.qtpl:47
	}
//line weather.qtpl:47
	qw422016.N().S(`
        ]
    }
}
`)
//line weather.qtpl:51
}

//line weather.qtpl:51
func WriteWeatherDataResponseJSON(qq422016 qtio422016.Writer, r *WeatherDataResponse) {
//line weather.qtpl:51
	qw422016 := qt422016.AcquireWriter(qq422016)
//line weather.qtpl:51
	StreamWeatherDataResponseJSON(qw422016, r)
//line weather.qtpl:51
	qt422016.ReleaseWriter(qw422016)
//line weather.qtpl:51
}

//line weather.qtpl:51
func WeatherDataResponseJSON(r *WeatherDataResponse) string {
//line weather.qtpl:51
	qb422016 := qt422016.AcquireByteBuffer()
//line weather.qtpl:51
	WriteWeatherDataResponseJSON(qb422016, r)
//line weather.qtpl:51
	qs422016 := string(qb422016.B)
//line weather.qtpl:51
	qt422016.ReleaseByteBuffer(qb422016)
//line weather.qtpl:51
	return qs422016
//line weather.qtpl:51
}
