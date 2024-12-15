import type {WeatherOverview} from "./weather-overview.ts";
import type {WeatherForecast} from "./weather-forecast.ts";

// Get API key from server side .ENV file
const APIKEY = import.meta.env.PUBLIC_WEATHER_API;

// API endpoint URL
const api = 'https://api.openweathermap.org/data/2.5';

// Asynchronously get geolocation data
let coords: Promise<{ latitude: number; longitude: number }> = new Promise(resolve => {
    navigator.geolocation.getCurrentPosition(
        // Return our coords
        data => resolve(data.coords),
        // If we can't get our coordinates, default to Davenport, Washington
        error => {
            console.log(error)

            // Create alert indicating geolocation failed
            const alert_toast = document.createElement("div")
            alert_toast.classList.add("alert", "alert-warning", "no-geo")

            // Geolocation failure text
            const alert_span = document.createElement("span")
            alert_span.textContent = "Unable to get current location - defaulting to Davenport, Washington"
            alert_toast.append(alert_span)

            // Button to close the alert
            const alert_close = document.createElement("button")
            alert_close.textContent = "✖"
            alert_close.classList.add("btn", "btn-warning", "btn-xs")
            alert_close.addEventListener("click", () => document.querySelector('.no-geo').remove())
            alert_toast.append(alert_close)

            // Register alert
            document.querySelector('#alerts').appendChild(alert_toast)

            // Send default out
            resolve({ latitude: 47.650206, longitude: -118.158366})
        }
    )
})

// Update the text of the loading div when we finish fetching location
coords.then(() => document.querySelector("#weather-status").textContent = "Downloading weather data")

// Call openweathermap api
async function getWeather(endpoint: string, processor: (value: any) => any) {
    const data = await coords

    // Form url
    const params = new URLSearchParams({
        "lat": String(data.latitude),
        "lon": String(data.longitude),
        "appid": APIKEY,
        "units": "imperial"
    })

    const url = endpoint + '?' + params.toString()

    console.log(url)

    // Wait for processor to finish
    await fetch(url)
        .then(res => res.json(), console.error)
        .then(processor, console.error)
}

function parseOverview(data: WeatherOverview) {
    // Check-check: Is data good?
    console.log(data);

    // Set all relevant html elements
    const city = document.querySelector('.city');
    city.setAttribute("data", String(data.id))
    city.textContent = data.name

    const temp = document.querySelector('.temp');
    temp.setAttribute("data", String(data.main.temp))
    temp.textContent = data.main.temp + "℉"

    const icon = document.querySelector('.icon');
    icon.setAttribute('src', `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`)
    icon.setAttribute('alt', data.weather[0].description)

    const windSpeed = document.querySelector('.wind-speed')
    windSpeed.textContent = String(data.wind.speed)
    windSpeed.setAttribute("data", String(data.wind.speed))

    // Rotate the arrow to indicate wind direction
    const windDirection = document.querySelector('.wind-direction')
    windDirection.setAttribute("style", `transform: rotate(${data.wind.deg}deg)`)
    windDirection.setAttribute("data", String(data.wind.deg))
}

function genForecast() {
    getWeather(api + "/forecast", parseForecast)
}

async function genWeather() {
    // Start data gathering
    const overview = getWeather(api + "/weather", parseOverview)
    const forecast = getWeather(api + "/forecast", parseForecast)

    // Wait for everything to finish up
    await overview
    await forecast

    // Remove the loading placeholder and unhide the weather data
    document.querySelector('#weather-loader').remove()
    document.querySelector('#weather-data').removeAttribute("style")
}

export { genWeather }
