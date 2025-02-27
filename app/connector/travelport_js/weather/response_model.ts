export interface Root {
    $schema: string
    title: string
    type: string
    properties: Properties
}

export interface Properties {
    detailedWeatherData: DetailedWeatherData
    dailyWeather: DailyWeather
}

export interface DetailedWeatherData {
    type: string
    properties: Properties2
}

export interface Properties2 {
    lat: Lat
    lon: Lon
    timezone: Timezone
    timezone_offset: TimezoneOffset
    daily: Daily
}

export interface Lat {
    type: string
}

export interface Lon {
    type: string
}

export interface Timezone {
    type: string
}

export interface TimezoneOffset {
    type: string
}

export interface Daily {
    type: string
    items: Items
}

export interface Items {
    type: string
    properties: Properties3
}

export interface Properties3 {
    date: Date
    sunrise: Sunrise
    sunset: Sunset
    moonrise: Moonrise
    moonset: Moonset
    moon_phase: MoonPhase
    summary: Summary
    temp: Temp
    feels_like: FeelsLike
    pressure: Pressure
    humidity: Humidity
    dew_point: DewPoint
    wind_speed: WindSpeed
    wind_deg: WindDeg
    wind_gust: WindGust
    weather: Weather
    clouds: Clouds
    pop: Pop
    uvi: Uvi
}

export interface Date {
    type: string
}

export interface Sunrise {
    type: string
}

export interface Sunset {
    type: string
}

export interface Moonrise {
    type: string
}

export interface Moonset {
    type: string
}

export interface MoonPhase {
    type: string
}

export interface Summary {
    type: string
}

export interface Temp {
    type: string
    properties: Properties4
}

export interface Properties4 {
    day: Day
    min: Min
    max: Max
    night: Night
    eve: Eve
    morn: Morn
}

export interface Day {
    type: string
}

export interface Min {
    type: string
}

export interface Max {
    type: string
}

export interface Night {
    type: string
}

export interface Eve {
    type: string
}

export interface Morn {
    type: string
}

export interface FeelsLike {
    type: string
    properties: Properties5
}

export interface Properties5 {
    day: Day2
    night: Night2
    eve: Eve2
    morn: Morn2
}

export interface Day2 {
    type: string
}

export interface Night2 {
    type: string
}

export interface Eve2 {
    type: string
}

export interface Morn2 {
    type: string
}

export interface Pressure {
    type: string
}

export interface Humidity {
    type: string
}

export interface DewPoint {
    type: string
}

export interface WindSpeed {
    type: string
}

export interface WindDeg {
    type: string
}

export interface WindGust {
    type: string
}

export interface Weather {
    type: string
    items: Items2
}

export interface Items2 {
    type: string
    properties: Properties6
}

export interface Properties6 {
    id: Id
    main: Main
    description: Description
    icon: Icon
}

export interface Id {
    type: string
}

export interface Main {
    type: string
}

export interface Description {
    type: string
}

export interface Icon {
    type: string
}

export interface Clouds {
    type: string
}

export interface Pop {
    type: string
}

export interface Uvi {
    type: string
}

export interface DailyWeather {
    type: string
    properties: Properties7
}

export interface Properties7 {
    date: Date2
    units: Units
    cloud_cover: CloudCover
    humidity: Humidity2
    precipitation: Precipitation
    temperature: Temperature
    pressure: Pressure2
    wind: Wind
}

export interface Date2 {
    type: string
}

export interface Units {
    type: string
}

export interface CloudCover {
    type: string
    properties: Properties8
}

export interface Properties8 {
    afternoon: Afternoon
}

export interface Afternoon {
    type: string
}

export interface Humidity2 {
    type: string
    properties: Properties9
}

export interface Properties9 {
    afternoon: Afternoon2
}

export interface Afternoon2 {
    type: string
}

export interface Precipitation {
    type: string
    properties: Properties10
}

export interface Properties10 {
    total: Total
}

export interface Total {
    type: string
}

export interface Temperature {
    type: string
    properties: Properties11
}

export interface Properties11 {
    min: Min2
    max: Max2
    afternoon: Afternoon3
    night: Night3
    evening: Evening
    morning: Morning
}

export interface Min2 {
    type: string
}

export interface Max2 {
    type: string
}

export interface Afternoon3 {
    type: string
}

export interface Night3 {
    type: string
}

export interface Evening {
    type: string
}

export interface Morning {
    type: string
}

export interface Pressure2 {
    type: string
    properties: Properties12
}

export interface Properties12 {
    afternoon: Afternoon4
}

export interface Afternoon4 {
    type: string
}

export interface Wind {
    type: string
    properties: Properties13
}

export interface Properties13 {
    max: Max3
}

export interface Max3 {
    type: string
    properties: Properties14
}

export interface Properties14 {
    speed: Speed
    direction: Direction
}

export interface Speed {
    type: string
}

export interface Direction {
    type: string
}
