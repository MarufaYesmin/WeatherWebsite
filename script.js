
// ========================================
// 1. HTML ELEMENTS SELECTION
// ========================================

// Search Elements
const cityInput = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");
const locationBtn = document.getElementById("location-btn");

// Current Weather Elements
const cityName = document.getElementById("city-name");
const currentDate = document.getElementById("current-date");
const temperature = document.getElementById("temperature");
const weatherDescription = document.getElementById("weather-description");
const feelsLike = document.getElementById("feels-like");
const weatherIcon = document.getElementById("weather-icon");

// Weather Details
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("wind-speed");
const feelsDetail = document.getElementById("feels-detail");
const pressure = document.getElementById("pressure");

// Temperature Unit
const unitBtn = document.getElementById("unit-btn");

// Forecast Elements
const forecastContainer = document.getElementById("forecast-container");
const hourlyContainer = document.getElementById("hourly-container");

// UV Index
const uvIndex = document.getElementById("uv-index");
const uvLevel = document.getElementById("uv-level");

// Air Quality
const aqiValue = document.getElementById("aqi-value");
const aqiLevel = document.getElementById("aqi-level");
const pm25Value = document.getElementById("pm25-value");
const pm10Value = document.getElementById("pm10-value");

// Sunrise and Sunset
const sunriseTime = document.getElementById("sunrise-time");
const sunsetTime = document.getElementById("sunset-time");

// Alerts and Greeting
const alertContainer = document.getElementById("alert-container");
const weatherGreeting = document.getElementById("weather-greeting");

// Loading and Error
const loading = document.getElementById("loading");
const errorMessage = document.getElementById("error-message");


// ========================================
// 2. GLOBAL VARIABLES
// ========================================

let currentUnit = "C";

let currentWeatherData = null;
let currentForecastData = null;
let currentHourlyData = null;


// ========================================
// 3. LOADING AND ERROR HANDLING
// ========================================

function setLoading(isLoading) {

    loading.style.display = isLoading ? "block" : "none";

    searchBtn.disabled = isLoading;
    locationBtn.disabled = isLoading;

    searchBtn.innerHTML = isLoading
        ? '<i class="fa-solid fa-spinner fa-spin"></i> Loading...'
        : '<i class="fa-solid fa-magnifying-glass"></i> Search';
}

function showError(message) {

    errorMessage.textContent = message;
    errorMessage.style.display = "block";
}

function clearError() {

    errorMessage.textContent = "";
    errorMessage.style.display = "none";
}


// ========================================
// 4. CURRENT DATE
// ========================================

function showCurrentDate() {

    const today = new Date();

    const options = {
        weekday: "long",
        year: "numeric",
        month: "short",
        day: "numeric"
    };

    currentDate.textContent =
        today.toLocaleDateString("en-US", options);
}


// ========================================
// 5. TEMPERATURE CONVERSION
// ========================================

function convertTemperature(celsius) {

    if (currentUnit === "F") {
        return (celsius * 9 / 5) + 32;
    }

    return celsius;
}

function formatTemperature(celsius) {

    if (celsius == null || !Number.isFinite(celsius)) {
        return "--";
    }

    const converted = Math.round(convertTemperature(celsius));

    return `${converted}°${currentUnit}`;
}

function updateTemperatureDisplays() {

    if (!currentWeatherData) return;

    temperature.textContent =
        formatTemperature(currentWeatherData.temperature_2m);

    feelsLike.textContent =
        formatTemperature(currentWeatherData.apparent_temperature);

    feelsDetail.textContent =
        formatTemperature(currentWeatherData.apparent_temperature);

    if (currentForecastData) {
        displayForecast(currentForecastData);
    }

    if (currentHourlyData) {
        displayHourlyForecast(currentHourlyData);
    }

    unitBtn.textContent =
        currentUnit === "C" ? "Switch to °F" : "Switch to °C";
}


// ========================================
// 6. WEATHER DESCRIPTION
// ========================================

function getWeatherDescription(code) {

    if (code === 0) return "Clear Sky";
    if (code === 1) return "Mainly Clear";
    if (code === 2) return "Partly Cloudy";
    if (code === 3) return "Overcast";

    if (code === 45 || code === 48) return "Fog";

    if (code >= 51 && code <= 57) return "Drizzle";
    if (code >= 61 && code <= 67) return "Rain";

    if (code >= 71 && code <= 77) return "Snow";

    if (code >= 80 && code <= 82) return "Rain Showers";
    if (code >= 85 && code <= 86) return "Snow Showers";

    if (code >= 95) return "Thunderstorm";

    return "Unknown Weather";
}


// ========================================
// 7. DYNAMIC WEATHER ICON
// ========================================

function changeWeatherIcon(code) {

    let iconClass = "fa-cloud";
    let iconColor = "#ffffff";

    if (code === 0) {
        iconClass = "fa-sun";
        iconColor = "#facc15";
    }
    else if (code === 1 || code === 2) {
        iconClass = "fa-cloud-sun";
        iconColor = "#facc15";
    }
    else if (code === 3) {
        iconClass = "fa-cloud";
    }
    else if (code === 45 || code === 48) {
        iconClass = "fa-smog";
    }
    else if (code >= 51 && code <= 67) {
        iconClass = "fa-cloud-rain";
        iconColor = "#60a5fa";
    }
    else if (code >= 71 && code <= 77) {
        iconClass = "fa-snowflake";
        iconColor = "#bae6fd";
    }
    else if (code >= 80 && code <= 82) {
        iconClass = "fa-cloud-showers-heavy";
        iconColor = "#60a5fa";
    }
    else if (code >= 85 && code <= 86) {
        iconClass = "fa-snowflake";
        iconColor = "#bae6fd";
    }
    else if (code >= 95) {
        iconClass = "fa-cloud-bolt";
        iconColor = "#facc15";
    }

    weatherIcon.className = `fa-solid ${iconClass}`;
    weatherIcon.style.color = iconColor;
}


// ========================================
// 8. DYNAMIC BACKGROUND
// ========================================

function changeBackground(code) {

    document.body.classList.remove(
        "sunny",
        "cloudy",
        "rainy",
        "snowy",
        "stormy",
        "foggy"
    );

    if (code === 0 || code === 1) {
        document.body.classList.add("sunny");
    }
    else if (code === 2 || code === 3) {
        document.body.classList.add("cloudy");
    }
    else if (code === 45 || code === 48) {
        document.body.classList.add("foggy");
    }
    else if (code >= 51 && code <= 67) {
        document.body.classList.add("rainy");
    }
    else if (code >= 71 && code <= 86) {
        document.body.classList.add("snowy");
    }
    else if (code >= 95) {
        document.body.classList.add("stormy");
    }
    else {
        document.body.classList.add("cloudy");
    }
}


// ========================================
// 9. DYNAMIC WEATHER GREETING
// ========================================

function updateGreeting(code) {

    let greeting = "";

    if (code === 0 || code === 1) {
        greeting = "It's a beautiful sunny day! Enjoy your day.";
    }
    else if (code === 2 || code === 3) {
        greeting = "It's a cloudy day. Have a wonderful day!";
    }
    else if (code === 45 || code === 48) {
        greeting = "It's foggy outside. Travel carefully!";
    }
    else if (code >= 51 && code <= 67) {
        greeting = "It's rainy outside. Don't forget your umbrella!";
    }
    else if (code >= 71 && code <= 86) {
        greeting = "It's snowy outside. Stay warm!";
    }
    else if (code >= 95) {
        greeting = "Thunderstorm detected. Stay safe indoors!";
    }
    else {
        greeting = "Have a great day!";
    }

    weatherGreeting.textContent = greeting;
}


// ========================================
// 10. UV INDEX
// ========================================

function getUVLevel(value) {

    if (value <= 2) return "Low";
    if (value <= 5) return "Moderate";
    if (value <= 7) return "High";
    if (value <= 10) return "Very High";

    return "Extreme";
}


// ========================================
// 11. FORECAST ICON
// ========================================

function getForecastIcon(code) {

    if (code === 0) return "fa-sun";
    if (code === 1 || code === 2) return "fa-cloud-sun";
    if (code === 3) return "fa-cloud";

    if (code === 45 || code === 48) return "fa-smog";

    if (code >= 51 && code <= 67) return "fa-cloud-rain";

    if (code >= 71 && code <= 77) return "fa-snowflake";

    if (code >= 80 && code <= 82) return "fa-cloud-showers-heavy";

    if (code >= 85 && code <= 86) return "fa-snowflake";

    if (code >= 95) return "fa-cloud-bolt";

    return "fa-cloud";
}


// ========================================
// 12. 5-DAY FORECAST
// ========================================

function displayForecast(daily) {

    forecastContainer.innerHTML = "";

    daily.time.forEach(function(date, index) {

        const dayName = new Date(date + "T00:00:00")
            .toLocaleDateString("en-US", {
                weekday: "short"
            });

        const icon = getForecastIcon(daily.weather_code[index]);

        const description =
            getWeatherDescription(daily.weather_code[index]);

        const maxTemp =
            formatTemperature(daily.temperature_2m_max[index]);

        const minTemp =
            formatTemperature(daily.temperature_2m_min[index]);

        const forecastCard = document.createElement("div");

        forecastCard.className = "forecast-card";

        forecastCard.innerHTML = `
            <h3 class="forecast-day">${dayName}</h3>

            <i class="fa-solid ${icon} forecast-icon"></i>

            <p class="forecast-description">${description}</p>

            <div class="forecast-temp">
                <span>${maxTemp}</span>
                /
                <span>${minTemp}</span>
            </div>
        `;

        forecastContainer.appendChild(forecastCard);

    });
}


// ========================================
// 13. HOURLY FORECAST
// ========================================

function displayHourlyForecast(hourly) {

    hourlyContainer.innerHTML = "";

    if (!currentWeatherData || !hourly.time.length) {
        hourlyContainer.textContent = "Hourly forecast unavailable.";
        return;
    }

    const currentHour = currentWeatherData.time.slice(0, 13);

    const startIndex = hourly.time.findIndex(function(time) {

        return time.slice(0, 13) === currentHour;

    });

    if (startIndex === -1) {
        hourlyContainer.textContent = "Hourly forecast unavailable.";
        return;
    }

    for (let i = startIndex; i < startIndex + 12; i++) {

        if (i >= hourly.time.length) break;

        const time = hourly.time[i];

        const timeLabel = new Date(
            `2000-01-01T${time.slice(11, 16)}:00`
        ).toLocaleTimeString("en-US", {
            hour: "numeric",
            hour12: true
        });

        const icon = getForecastIcon(hourly.weather_code[i]);

        const temp = formatTemperature(hourly.temperature_2m[i]);

        const rainChance = hourly.precipitation_probability[i];

        const hourlyCard = document.createElement("div");

        hourlyCard.className = "hourly-card";

        hourlyCard.innerHTML = `
            <p class="hourly-time">${timeLabel}</p>

            <i class="fa-solid ${icon} hourly-icon"></i>

            <h3 class="hourly-temp">${temp}</h3>

            <p class="hourly-rain">
                <i class="fa-solid fa-droplet"></i>
                ${rainChance ?? "--"}%
            </p>
        `;

        hourlyContainer.appendChild(hourlyCard);

    }
}


// ========================================
// 14. SUNRISE AND SUNSET
// ========================================

function formatSunTime(dateTime) {

    if (!dateTime) return "--";

    const time = dateTime.split("T")[1];

    const [hour, minute] = time.split(":");

    let hours = Number(hour);

    const period = hours >= 12 ? "PM" : "AM";

    hours = hours % 12 || 12;

    return `${hours}:${minute} ${period}`;
}

function displaySunTimes(daily) {

    sunriseTime.textContent =
        formatSunTime(daily.sunrise[0]);

    sunsetTime.textContent =
        formatSunTime(daily.sunset[0]);
}


// ========================================
// 15. AIR QUALITY INDEX
// ========================================

function getAQILevel(value) {

    if (value <= 50) return "Good";
    if (value <= 100) return "Moderate";
    if (value <= 150) return "Unhealthy for Sensitive Groups";
    if (value <= 200) return "Unhealthy";
    if (value <= 300) return "Very Unhealthy";

    return "Hazardous";
}


// ========================================
// 16. GET AIR QUALITY DATA
// ========================================

async function getAirQualityData(latitude, longitude) {

    const airURL =
        `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&current=us_aqi,pm2_5,pm10&timezone=auto`;

    try {

        const response = await fetch(airURL);

        if (!response.ok) {
            throw new Error("Air quality data unavailable!");
        }

        const data = await response.json();

        const air = data.current;

        if (!air || air.us_aqi == null) {
            throw new Error("Air quality data is missing!");
        }

        aqiValue.textContent = air.us_aqi;

        aqiLevel.textContent =
            getAQILevel(air.us_aqi);

        pm25Value.textContent =
            air.pm2_5 == null ? "--" : air.pm2_5.toFixed(1);

        pm10Value.textContent =
            air.pm10 == null ? "--" : air.pm10.toFixed(1);

    }
    catch (error) {

        aqiValue.textContent = "--";
        aqiLevel.textContent = "Unavailable";

        pm25Value.textContent = "--";
        pm10Value.textContent = "--";

        console.error("Air Quality Error:", error);

    }
}


// ========================================
// 17. WEATHER ALERTS
// ========================================

function displayWeatherAlerts(current, hourly) {

    alertContainer.innerHTML = "";

    const alerts = [];

    const weatherCode = current.weather_code;
    const wind = current.wind_speed_10m;
    const uv = current.uv_index;

    // Rain Alert: Check next 6 hours
    const nextHoursRain = hourly.precipitation_probability.slice(0, 6);

    const maxRainChance = Math.max(...nextHoursRain.filter(
        value => value != null
    ), 0);

    if (maxRainChance >= 60) {

        alerts.push({
            title: "Rain Alert",
            message: "There is a high chance of rain. Carry an umbrella.",
            icon: "fa-cloud-rain",
            type: "rain"
        });

    }

    // Thunderstorm Alert
    if (weatherCode >= 95) {

        alerts.push({
            title: "Thunderstorm Warning",
            message: "Thunderstorms are reported. Stay indoors and avoid open areas.",
            icon: "fa-cloud-bolt",
            type: "storm"
        });

    }

    // UV Warning
    if (uv != null && uv >= 6) {

        alerts.push({
            title: "UV Warning",
            message: "UV level is high. Use sunscreen and avoid prolonged sun exposure.",
            icon: "fa-sun",
            type: "uv"
        });

    }

    // Strong Wind Alert
    if (wind >= 40) {

        alerts.push({
            title: "Strong Wind Alert",
            message: "Strong winds are reported. Be careful outdoors.",
            icon: "fa-wind",
            type: "wind"
        });

    }

    // Default Message
    if (alerts.length === 0) {

        alerts.push({
            title: "Weather Looks Good",
            message: "No major weather warnings based on the available data. Enjoy your day!",
            icon: "fa-circle-check",
            type: "good"
        });

    }

    // Display Alert Cards
    alerts.forEach(function(alert) {

        const alertCard = document.createElement("div");

        alertCard.className = `alert-card ${alert.type}`;

        alertCard.innerHTML = `
            <i class="fa-solid ${alert.icon}"></i>

            <div class="alert-content">
                <h3>${alert.title}</h3>
                <p>${alert.message}</p>
            </div>
        `;

        alertContainer.appendChild(alertCard);

    });

}


// ========================================
// 18. GET WEATHER DATA
// ========================================

async function getWeatherData(latitude, longitude, city, country = "") {

    const apiURL =
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,surface_pressure,wind_speed_10m,uv_index&hourly=temperature_2m,weather_code,precipitation_probability&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset&forecast_days=5&timezone=auto`;

    try {

        const response = await fetch(apiURL);

        if (!response.ok) {
            throw new Error("Unable to fetch weather data!");
        }

        const data = await response.json();

        const current = data.current;

        if (!current || !data.daily || !data.hourly) {
            throw new Error("Weather data is incomplete!");
        }

        // Save Weather Data
        currentWeatherData = current;
        currentForecastData = data.daily;
        currentHourlyData = data.hourly;

        // City Name
        cityName.textContent = country
            ? `${city}, ${country}`
            : city;

        // Weather Description
        weatherDescription.textContent =
            getWeatherDescription(current.weather_code);

        // Weather Details
        humidity.textContent =
            `${current.relative_humidity_2m}%`;

        windSpeed.textContent =
            `${current.wind_speed_10m} km/h`;

        pressure.textContent =
            `${Math.round(current.surface_pressure)} hPa`;

        // UV Index
        if (current.uv_index != null) {

            uvIndex.textContent =
                current.uv_index.toFixed(1);

            uvLevel.textContent =
                getUVLevel(current.uv_index);

        }
        else {

            uvIndex.textContent = "--";
            uvLevel.textContent = "Unavailable";

        }

        // Temperature and Forecast
        updateTemperatureDisplays();

        // Weather Icon
        changeWeatherIcon(current.weather_code);

        // Background
        changeBackground(current.weather_code);

        // Greeting
        updateGreeting(current.weather_code);

        // Sunrise and Sunset
        displaySunTimes(data.daily);

        // Weather Alerts
        displayWeatherAlerts(current, data.hourly);

        // Air Quality
        await getAirQualityData(latitude, longitude);

    }
    catch (error) {

        showError("Weather data could not be loaded. Please try again.");

        console.error("Weather Error:", error);

        throw error;

    }
}


// ========================================
// 19. SEARCH CITY
// ========================================

async function searchCity(city) {

    clearError();

    setLoading(true);

    try {

        const geoURL =
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

        const response = await fetch(geoURL);

        if (!response.ok) {
            throw new Error("Unable to search for this city!");
        }

        const data = await response.json();

        if (!data.results || data.results.length === 0) {
            throw new Error("City not found! Please enter a valid city name.");
        }

        const location = data.results[0];

        await getWeatherData(
            location.latitude,
            location.longitude,
            location.name,
            location.country
        );

    }
    catch (error) {

        showError(error.message);

        console.error("Search Error:", error);

    }
    finally {

        setLoading(false);

    }
}


// ========================================
// 20. SEARCH BUTTON
// ========================================

searchBtn.addEventListener("click", function() {

    const city = cityInput.value.trim();

    if (city === "") {

        showError("Please enter a city name!");

        return;

    }

    searchCity(city);

});


// ========================================
// 21. ENTER KEY SEARCH
// ========================================

cityInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {

        searchBtn.click();

    }

});

cityInput.addEventListener("input", clearError);


// ========================================
// 22. MY LOCATION
// ========================================

function getUserLocation() {

    clearError();

    if (!navigator.geolocation) {

        showError("Geolocation is not supported by your browser!");

        return;

    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(

        async function(position) {

            try {

                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                await getWeatherData(
                    latitude,
                    longitude,
                    "My Location"
                );

            }
            catch (error) {

                console.error("Location Weather Error:", error);

            }
            finally {

                setLoading(false);

            }

        },

        function(error) {

            setLoading(false);

            if (error.code === 1) {
                showError("Location permission denied!");
            }
            else if (error.code === 2) {
                showError("Location information is unavailable!");
            }
            else if (error.code === 3) {
                showError("Location request timed out!");
            }
            else {
                showError("Unable to get your location!");
            }

        }

    );

}


// ========================================
// 23. LOCATION BUTTON EVENT
// ========================================

locationBtn.addEventListener("click", getUserLocation);


// ========================================
// 24. CELSIUS / FAHRENHEIT BUTTON
// ========================================

unitBtn.addEventListener("click", function() {

    currentUnit = currentUnit === "C" ? "F" : "C";

    updateTemperatureDisplays();

});


// ========================================
// 25. INITIALIZE APPLICATION
// ========================================

function initializeApp() {

    showCurrentDate();

    unitBtn.textContent = "Switch to °F";

    searchCity("Chattogram");

}

initializeApp();
