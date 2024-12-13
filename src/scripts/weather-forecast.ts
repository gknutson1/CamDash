// Generated with https://transform.tools/json-to-typescript

interface WeatherForcast {
    cod: string
    message: number
    cnt: number
    list: List[]
    city: City
}

interface List {
    dt: number
    main: Main
    weather: Weather[]
    clouds: { all: number }
    wind: Wind
    visibility?: number
    pop: number
    sys: { pod: string }
    dt_txt: string
    snow?: { "3h": number }
    rain?: { "3h": number }
}

interface Main {
    temp: number
    feels_like: number
    temp_min: number
    temp_max: number
    pressure: number
    sea_level: number
    grnd_level: number
    humidity: number
    temp_kf: number
}

interface Weather {
    id: number
    main: string
    description: string
    icon: string
}

interface Wind {
    speed: number
    deg: number
    gust: number
}

interface City {
    id: number
    name: string
    coord: Coord
    country: string
    population: number
    timezone: number
    sunrise: number
    sunset: number
}

interface Coord {
    lat: number
    lon: number
}

export type { WeatherForcast }