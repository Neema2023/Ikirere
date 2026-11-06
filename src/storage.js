import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);

// Store data inside the project's data folder
const DATA_FILE = path.join(
    __dirname,
    "../data/weather-data.json"
);

// Default data when the JSON file is empty or missing
const defaultData = {
    favorites: [],
    history: [],
    settings: {
        units: "celsius"
    }
};

// Read data from JSON file
export async function loadData() {
    try {
        await fs.mkdir(path.dirname(DATA_FILE), {
            recursive: true
        });

        const content = await fs.readFile(DATA_FILE, "utf-8");

        // Handle an empty JSON file
        if (!content.trim()) {
            await saveData(defaultData);
            return structuredClone(defaultData);
        }

        const data = JSON.parse(content);

        // Ensure all required properties exist
        return {
            favorites: data.favorites || [],
            history: data.history || [],
            settings: {
                ...defaultData.settings,
                ...data.settings
            }
        };

    } catch (error) {
        if (error.code === "ENOENT") {
            await saveData(defaultData);
            return structuredClone(defaultData);
        }

        if (error instanceof SyntaxError) {
            throw new Error(
                "The weather data JSON file contains invalid JSON."
            );
        }

        throw error;
    }
}

// Save data to JSON file
export async function saveData(data) {
    await fs.mkdir(path.dirname(DATA_FILE), {
        recursive: true
    });

    await fs.writeFile(
        DATA_FILE,
        JSON.stringify(data, null, 2),
        "utf-8"
    );
}

// Add favourite city
export async function addFavorite(city) {
    const data = await loadData();

    const exists = data.favorites.some(
        favorite => favorite.toLowerCase() === city.toLowerCase()
    );

    if (exists) {
        return false;
    }

    data.favorites.push(city);

    await saveData(data);

    return true;
}

// Get favourite cities
export async function getFavorites() {
    const data = await loadData();
    return data.favorites;
}

// Add successful search to history
export async function addHistory(city) {
    const data = await loadData();

    data.history.unshift({
        city,
        searchedAt: new Date().toISOString()
    });

    // Keep the latest 20 searches
    data.history = data.history.slice(0, 20);

    await saveData(data);
}

// Get search history
export async function getHistory() {
    const data = await loadData();
    return data.history;
}

// Get settings
export async function getSettings() {
    const data = await loadData();
    return data.settings;
}

// Update settings
export async function updateSettings(newSettings) {
    const data = await loadData();

    data.settings = {
        ...data.settings,
        ...newSettings
    };

    await saveData(data);

    return data.settings;
}