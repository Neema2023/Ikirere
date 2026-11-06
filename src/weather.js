const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

export async function getWeather(latitude, longitude) {
    const url = `${FORECAST_URL}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=auto`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Unable to retrieve weather information.");
    }

    const data = await response.json();

    return data.current;
}