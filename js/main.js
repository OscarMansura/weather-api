const cities = [
    {
        city: 'Lisbon',
        latitude: 38.7072,
        longitude: -9.1355,
    },
    {
        city: 'Berlin',
        latitude: 52.5235,
        longitude: 13.4115,
    },
    {
        city: 'Paris',
        latitude: 48.8567,
        longitude: 2.3510,
    },
    {
        city: 'London',
        latitude: 51.5002,
        longitude: -0.1262,
    },
    {
        city: 'Madrid',
        latitude: 40.4167,
        longitude: -3.7033,
    },
    {
        city: 'Vienna',
        latitude: 48.2092,
        longitude: 16.3728,
    },
    {
        city: 'Rome',
        latitude: 41.8955,
        longitude: 12.4823,
    },
    {
        city: 'Dublin',
        latitude: 53.3441,
        longitude: -6.2675,
    },
    {
        city: 'New Delhi',
        latitude: 28.6353,
        longitude: 77.2250,
    },
    {
        city: 'Wellington',
        latitude: -41.2865,
        longitude: 174.7762,
    },
];

for(let city of cities) {
    buildOption(city);
}

function buildOption(info) {
    const option = document.createElement('option');
    option.setAttribute('value', info.latitude + "," + info.longitude);
    option.textContent = info.city;

    document.querySelector('.weather__city').append(option);
}

document.querySelector('.weather__city').addEventListener('change', onLocationChange);

// trigger change event by default on page load
document.querySelector('.weather__city').dispatchEvent(new Event("change"));

function onLocationChange(event) {
    // splits converts string in array
    const coordinates = event.target.value.split(',');
    const city = event.target.options[event.target.options.selectedIndex].text;

    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${coordinates[0]}&longitude=${coordinates[1]}&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max&current_weather=true&timezone=Europe%2FLondon`)
        .then(response => response.json())
        .then(json => updateWeather(json));
}

function updateWeather(data) {
    const current = data.current_weather;
    const info = data.daily;

    let temp = current.temperature * 9 / 5 + 32;
    
    if (temp > 100) {
        temp = 100;
    } else if (temp < 0) {
        temp = 0;
    }

    const hue = -(200 + (160 * (temp / 100)));
    
    document.querySelector('.weather__icon').style.backgroundImage = `linear-gradient(hsl(${hue}, 100%, 50%), hsl(${hue}, 100%, 30%))`;

    document.querySelector('.weather__temp').textContent = current.temperature;

    document.querySelector('.weather__wind span').textContent = current.windspeed;

    document.querySelector('.weather__description').textContent = getWeatherDescription(current.weathercode);

    document.querySelector('.weather__precipitation span').textContent = info.precipitation_sum[0];

    // update image | icon
    const iconElement = document.querySelector('.weather__icon i');
    iconElement.removeAttribute('class');
    iconElement.classList.add(getWeatherIcon(current.weathercode));

    // build 7 days forecast
    build7DaysForecast(info);
}

function build7DaysForecast(weather) {
    document.querySelector('.weather__week').innerHTML = '';
    for (let i = 0; i < 7; i++) {
        buildDayWeather(weather.temperature_2m_max[i], weather.weathercode[i], weather.time[i])
    }
}

function buildDayWeather(temp, code, time) {
    const day = document.createElement('div');
    day.classList.add('day');

    const current = document.createElement('p');
    current.classList.add('day__date');
    current.textContent = getCurrentDay(time);

    const info = document.createElement('div');
    info.classList.add('day__info');
    info.innerHTML = `
    <span class="day__time">
        ${getCurrentTime()}
    </span>
    <span class="day__icon">
      <i class="${getWeatherIcon(code)}"></i>
    </span>
    <span class="day__temp">
        ${temp}°
    </span>`;

    day.append(current, info);
    document.querySelector('.weather__week').append(day);
}

function getCurrentDay(time) {
    const options = { weekday: 'short', month: 'long', day: 'numeric' };
    return new Date(time).toLocaleDateString('pt-PT', options);
}

function getCurrentTime() {
    const now = new Date();
    
    let hours = now.getHours();
    if (hours < 10) hours = '0' + hours;

    let minutes = now.getMinutes();
    if (minutes < 10) minutes = '0' + minutes;

    return `${hours}:${minutes}`;
}

function getWeatherDescription(code) {
    let description = 'Clear sky';
    if (code === 1 || code === 2 || code === 3) {
        description = 'Mainly clear, partly cloudy, and overcast';
    } else if (code === 45 || code === 48) {
        description = 'Fog and depositing rime fog';
    }

    return description;
}

function getWeatherIcon(code) {
    let icon = 'icofont-sun';
    if (code === 1 || code === 2 || code === 3) {
        icon = 'icofont-sunny';
    } else if (code === 45 || code === 48) {
        icon = 'icofont-cloudy';
    }

    return icon;
}


// Hexadecimal colors for temperatures
//https://gist.github.com/randolphdudley/d218330f9e87317f4498b84d141c9567

// Weather API
//https://open-meteo.com/en/docs#latitude=52.52&longitude=13.41&hourly=temperature_2m

// Design references
//https://cdn.dribbble.com/users/2303657/screenshots/14784828/media/c600e5a924a1d6135cdabb57c8b84d25.png?compress=1&resize=1000x750&vertical=top
//https://cdn.dribbble.com/users/2303657/screenshots/14784828/media/076a0a83adf88af64339b736891906f8.png?compress=1&resize=1000x750&vertical=top
//https://cdn.dribbble.com/users/2303657/screenshots/14784828/media/9168f1adca9472d8cc0411f00c803c6b.png?compress=1&resize=1000x750&vertical=top

// Latitude / Longitude
// Geolocation

// Object config
// temperature


// Challenge 1
// criar array com informação dinâmica da lista de cidades e geolocalização
// popular o select com essas opções
// { city: "", latitude: 500, longitude: -30 }




