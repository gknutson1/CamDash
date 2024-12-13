// Get API key from server side .ENV file
const APIKEY = import.meta.env.PUBLIC_WEATHER_API;

// API endpoint URL
const api = 'https://api.openweathermap.org/data/2.5';

async function getWeatherCurrentPosition(endpoint: string, processor) {
    console.log("Getting geolocation data")

    function onSuccess(data: GeolocationPosition) {
        return getWeather(endpoint, data, processor)
    }

    function onError(error: GeolocationPositionError) {
        // If our geolocation fails for whatever reason, fall back on hardcoded coordinates
        console.error(error);
        return getWeather(endpoint, { coords: {latitude: 47.650206, longitude: -118.158366}}, processor);
    }

    navigator.geolocation.getCurrentPosition(onSuccess, onError);
}

async function getWeather(endpoint: string, pos: { coords: { latitude: number; longitude: number } }, processor: (value: any) => any) {
    const params = new URLSearchParams({
        "lat": String(pos.coords.latitude),
        "lon": String(pos.coords.longitude),
        "appid": APIKEY,
        "units": "imperial"
    })

    const url = endpoint + '?' + params.toString()

    console.log(url)

    return fetch(url).then(res => res.json(), console.error).then(processor, console.error)
}

function genOverview() {
    getWeatherCurrentPosition(api + "/weather", parseOverview)
}

function parseOverview(data: any) {

    // Check-check: Is data good?
    console.log(data);

    // Get Container for Weather
    const weatherContainer = document.querySelector('.weather');
    const city = document.querySelector('.city');
    const temp = document.querySelector('.temp');
    const icon = document.querySelector('.icon');

    // Set DOM Elements
    city.textContent = data.name;
    temp.textContent = data.main.temp;

    icon.setAttribute('src', `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`)
}

export { genOverview }
