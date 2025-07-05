
   function getWeather() {
    // Get API key from environment variable
    const apiKey = process.env.WEATHER_API_KEY;

    const city = document.getElementById('city').value;

    if (!city) {
        alert('Please enter a city');
        return;
    }

    const currentWeatherUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;
    const forecastUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=1`; // 1-day forecast

    fetch(currentWeatherUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch current weather data");
            }
            return response.json();
        })
        .then(data => {
            displayWeather(data);
        })
        .catch(error => {
            console.error('Error fetching current weather data:', error);
            alert('Error fetching current weather data. Please try again.');
        });

    fetch(forecastUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch forecast data");
            }
            return response.json();
        })
        .then(data => {
            displayHourlyForecast(data.forecast.forecastday[0].hour); // Access hourly forecast
        })
        .catch(error => {
            console.error('Error fetching hourly forecast data:', error);
            alert('Error fetching hourly forecast data. Please try again.');
        });
}

function displayWeather(data) {
    const tempDivInfo = document.getElementById('temp-div');
    const weatherInfoDiv = document.getElementById('weather-info');
    const weatherIcon = document.getElementById('weather-icon');
    const hourlyForecastDiv = document.getElementById('hourly-forecast');

    // Clear previous content
    weatherInfoDiv.innerHTML = '';
    hourlyForecastDiv.innerHTML = '';
    tempDivInfo.innerHTML = '';

    if (data.error) {
        weatherInfoDiv.innerHTML = `<p>${data.error.message}</p>`;
    } else {
        const cityName = data.location.name;
        const temperature = Math.round(data.current.temp_c); // Celsius
        const description = data.current.condition.text;
        const iconUrl = data.current.condition.icon;

        tempDivInfo.innerHTML = `<p>${temperature}°C</p>`;
        weatherInfoDiv.innerHTML = `<p>${cityName}</p><p>${description}</p>`;
        weatherIcon.src = iconUrl;
        weatherIcon.alt = description;

        showImage();
    }
}

function displayHourlyForecast(hourlyData) {
    const hourlyForecastDiv = document.getElementById('hourly-forecast');

    hourlyData.forEach(item => {
        const hour = new Date(item.time).getHours(); // Get hour
        const temperature = Math.round(item.temp_c);
        const iconUrl = item.condition.icon;

        const hourlyItemHtml = `
            <div class="hourly-item">
                <span>${hour}:00</span>
                <img src="${iconUrl}" alt="Hourly Weather Icon">
                <span>${temperature}°C</span>
            </div>
        `;
        hourlyForecastDiv.innerHTML += hourlyItemHtml;
    });
}

function showImage() {
    const weatherIcon = document.getElementById('weather-icon');
    weatherIcon.style.display = 'block';
}
