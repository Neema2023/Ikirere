# 🌦️ Ikirere – Weather CLI

Ikirere is a Node.js command-line application that allows users to check current weather information for different cities directly from the terminal.

## Features

- Search weather by city name.
- Display temperature, humidity, feels-like temperature and wind speed.
- Add favourite cities.
- View weather search history.
- Manage temperature settings (Celsius/Fahrenheit).
- Save favourites, history and settings in a JSON file.
- Handle network errors, timeouts and invalid city names.

## Technologies

- Node.js
- JavaScript (ES Modules)
- Fetch API
- Open-Meteo API
- JSON
- Git and GitHub

## Requirements

- Node.js 20.6 or later
- npm
- Internet connection

## Installation

Clone the repository:

```bash
git clone https://github.com/Neema2023/Ikirere.git
```

Open the project:

```bash
cd Ikirere
```

Install dependencies:

```bash
npm install
```

Create your environment file:

```cmd
copy .env.example .env
```

Install the CLI globally:

```bash
npm link
```

## Environment Variables

Configure your `.env` file:

```env
REQUEST_TIMEOUT=10000
GEOCODING_API_URL=https://geocoding-api.open-meteo.com/v1/search
WEATHER_API_URL=https://api.open-meteo.com/v1/forecast
IKIRERE_DATA_DIR=./data
```

## Usage

**Display help:**

```bash
ikirere --help
```

**Check weather:**

```bash
ikirere weather Kigali
ikirere weather Nairobi
```

**Manage favourite cities:**

```bash
ikirere favorite add Kigali
ikirere favorite list
```

**View search history:**

```bash
ikirere history
```

**Manage settings:**

```bash
ikirere settings
ikirere settings --units celsius
ikirere settings --units fahrenheit
```

## Example Output

```text
===== IKIRERE WEATHER =====
City: Kigali
Country: Rwanda
Temperature: 21.8 °C
Humidity: 71%
Feels like: 23.7 °C
Wind speed: 1.3 km/h
===========================
```

## How It Works (Walkthrough)

1. The user enters a city name in the terminal.
2. The application sends a request to the Geocoding API to find the city's coordinates.
3. It uses the coordinates to request weather information from the Weather API.
4. The weather results are displayed in the terminal.
5. Search history is saved automatically in a JSON file.
6. Favourite cities and settings are also stored in JSON.

## Project Structure

```text
Ikirere/
├── src/
│   ├── cli.js
│   ├── index.js
│   ├── geocoding.js
│   ├── weather.js
│   ├── http.js
│   ├── storage.js
│   └── utils.js
├── data/
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Author

**Zaninka Neema**


## License

MIT License