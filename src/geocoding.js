const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";

export async function getCoordinates(city) {
    const url = `${GEOCODING_URL}?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Unable to connect to the geocoding service.");
    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
        throw new Error(`City "${city}" was not found.`);
    }

    const location = data.results[0];

    return {
        name: location.name,
        country: location.country,
        latitude: location.latitude,
        longitude: location.longitude
    };
}