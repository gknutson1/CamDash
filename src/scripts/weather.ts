// Get API key from server side .ENV file
const APIKEY = import.meta.env.PUBLIC_WEATHER_API;

// API endpoint URL
const api = 'https://api.openweathermap.org/data/2.5';

let coords: Promise<{ latitude: number; longitude: number }> = new Promise(resolve => {
    navigator.geolocation.getCurrentPosition(
        // Return our coords
        data => resolve(data.coords),
        // If we can't get our coordinates, default to Davenport, Washington
        error => {
            console.log(error)
            resolve({ latitude: 47.650206, longitude: -118.158366})
        }
    )
})

async function getWeather(endpoint: string, processor: (value: any) => any) {
    const data = await coords

    const params = new URLSearchParams({
        "lat": String(data.latitude),
        "lon": String(data.longitude),
        "appid": APIKEY,
        "units": "imperial"
    })

    const url = endpoint + '?' + params.toString()

    console.log(url)

    return fetch(url)
        .then(res => res.json(), console.error)
        .then(processor, console.error)
}

function genOverview() {
    getWeather(api + "/weather", parseOverview)
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

function genForecast() {
    getWeather(api + "/forecast", parseForecast)
}

function parseForecast(data: any) {}

export { genOverview, genForecast }
