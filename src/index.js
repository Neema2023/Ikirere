#!/usr/bin/env node

import { parseArgs } from "node:util";

import { getCoordinates } from "./geocoding.js";
import { getWeather } from "./weather.js";

import {
    addFavorite,
    getFavorites,
    addHistory,
    getHistory,
    getSettings,
    updateSettings
} from "./storage.js";

async function main() {
    try {
        const { values, positionals } = parseArgs({
            args: process.argv.slice(2),
            options: {
                help: {
                    type: "boolean",
                    short: "h"
                },
                units: {
                    type: "string",
                    short: "u"
                }
            },
            allowPositionals: true,
            strict: false
        });

        const command = positionals[0];
        const subCommand = positionals[1];

        if (values.help || !command) {
            showHelp();
            return;
        }

        // WEATHER COMMAND
        if (command === "weather") {
            const city = positionals.slice(1).join(" ").trim();

            if (!city) {
                throw new Error(
                    "Please provide a city name. Example: node src/index.js weather Kigali"
                );
            }

            console.log(`Fetching weather for ${city}...`);

            const location = await getCoordinates(city);

            const weather = await getWeather(
                location.latitude,
                location.longitude
            );

            await addHistory(location.name);

            const settings = await getSettings();
            const units = values.units || settings.units;

            if (!["celsius", "fahrenheit"].includes(units)) {
                throw new Error(
                    "Invalid units. Use celsius or fahrenheit."
                );
            }

            let temperature = weather.temperature_2m;
            let feelsLike = weather.apparent_temperature;
            let unitSymbol = "°C";

            if (units === "fahrenheit") {
                temperature = (temperature * 9 / 5) + 32;
                feelsLike = (feelsLike * 9 / 5) + 32;
                unitSymbol = "°F";
            }

            console.log("\n===== IKIRERE WEATHER =====");
            console.log(`City: ${location.name}`);
            console.log(`Country: ${location.country}`);
            console.log(`Temperature: ${temperature.toFixed(1)} ${unitSymbol}`);
            console.log(`Humidity: ${weather.relative_humidity_2m}%`);
            console.log(`Feels like: ${feelsLike.toFixed(1)} ${unitSymbol}`);
            console.log(`Wind speed: ${weather.wind_speed_10m} km/h`);
            console.log("===========================");

            return;
        }

        // FAVORITE COMMAND
        if (command === "favorite") {
            if (subCommand === "add") {
                const city = positionals.slice(2).join(" ").trim();

                if (!city) {
                    throw new Error(
                        "Provide a city. Example: node src/index.js favorite add Kigali"
                    );
                }

                const added = await addFavorite(city);

                console.log(
                    added ?
                    `${city} added to favourites.` :
                    `${city} is already in your favourites.`
                );

                return;
            }

            if (subCommand === "list") {
                const favorites = await getFavorites();

                console.log("\n===== FAVOURITE CITIES =====");

                if (favorites.length === 0) {
                    console.log("You have no favourite cities yet.");
                } else {
                    favorites.forEach((city, index) => {
                        console.log(`${index + 1}. ${city}`);
                    });
                }

                return;
            }

            throw new Error(
                "Use: favorite add <city> OR favorite list"
            );
        }

        // HISTORY COMMAND
        if (command === "history") {
            const history = await getHistory();

            console.log("\n===== SEARCH HISTORY =====");

            if (history.length === 0) {
                console.log("No weather searches yet.");
            } else {
                history.forEach((item, index) => {
                    console.log(
                        `${index + 1}. ${item.city} - ${new Date(item.searchedAt).toLocaleString()}`
                    );
                });
            }

            return;
        }

        // SETTINGS COMMAND
        if (command === "settings") {
            if (values.units) {
                const units = values.units.toLowerCase();

                if (!["celsius", "fahrenheit"].includes(units)) {
                    throw new Error(
                        "Units must be celsius or fahrenheit."
                    );
                }

                await updateSettings({ units });
                console.log(`Temperature units saved as ${units}.`);
                return;
            }

            const settings = await getSettings();

            console.log("\n===== IKIRERE SETTINGS =====");
            console.log(`Temperature units: ${settings.units}`);
            console.log("============================");

            return;
        }

        throw new Error("Unknown command. Run node src/index.js --help");
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exitCode = 1;
    }
}

function showHelp() {
    console.log(`
IKIRERE - Weather CLI

Usage:
  node src/index.js weather <city>
  node src/index.js weather <city> --units fahrenheit
  node src/index.js favorite add <city>
  node src/index.js favorite list
  node src/index.js history
  node src/index.js settings
  node src/index.js settings --units celsius
  node src/index.js settings --units fahrenheit

Options:
  -h, --help       Show help
  -u, --units      Choose celsius or fahrenheit
`);
}

main();