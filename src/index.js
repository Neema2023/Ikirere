#!/usr/bin/env node

import { getCoordinates } from "./geocoding.js";
import { getWeather } from "./weather.js";

async function main() {
    try {
        const command = process.argv[2];
        const city = process.argv.slice(3).join(" ");

        if (command !== "weather") {
            console.log("Usage: node src/index.js weather <city>");
            process.exitCode = 1;
            return;
        }

        if (!city) {
            console.log("Please provide a city name.");
            process.exitCode = 1;
            return;
        }

        console.log(`Fetching weather for ${city}...`);

        const location = await getCoordinates(city);

        const weather = await getWeather(
            location.latitude,
            location.longitude
        );

        console.log("\n===== IKIRERE WEATHER =====");
        console.log(`City: ${location.name}`);
        console.log(`Country: ${location.country}`);
        console.log(`Temperature: ${weather.temperature_2m} °C`);
        console.log(`Humidity: ${weather.relative_humidity_2m}%`);
        console.log(`Feels like: ${weather.apparent_temperature} °C`);
        console.log(`Wind speed: ${weather.wind_speed_10m} km/h`);
        console.log("===========================");

    } catch (error) {
        console.error("Error:", error.message);
        process.exitCode = 1;
    }
}

main();