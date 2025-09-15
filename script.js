/*--Các biến DOM và API--*/
let cityInput = document.getElementById('city_input'), /*Ô nhập và các nút tương tác.*/
    searchBtn = document.getElementById('searchBtn'), /*Ô nhập và các nút tương tác.*/
    locationBtn = document.getElementById('locationBtn'), /*Ô nhập và các nút tương tác.*/
    api_key = '1767a34307b881e4f815e719d71f227d', /*Khóa API để truy vấn dữ liệu từ OpenWeatherMap.*/ 
    currentWeatherCard = document.querySelector('.card'),  /*Các phần tử hiển thị thông tin thời tiết.*/
    fiveDaysForecastCard = document.querySelector('.day-forecast'), /*Các phần tử hiển thị thông tin thời tiết.*/
    aqiCard = document.querySelectorAll('.highlights .card')[0], /*Các thẻ con của Highlights để hiển thị chất lượng không khí và giờ mặt trời mọc/lặn.*/
    sunriseCard = document.querySelectorAll('.highlights .card')[1],  /*Các thẻ con của Highlights để hiển thị chất lượng không khí và giờ mặt trời mọc/lặn.*/
    humidityVal = document.getElementById('humidityVal'),
    pressureVal = document.getElementById('pressureVal'),
    visibilityVal = document.getElementById('visibilityVal'),
    windSpeedVal = document.getElementById('windSpeedVal'),
    feelsVal = document.getElementById('feelsVal'),
    hourlyForecastCard = document.querySelector('.hourly-forecast'), /*Các phần tử hiển thị thông tin thời tiết.*/
    aqiList = ['Good', 'Fair', 'Moderate', 'Poor', 'Very Poor']; /*Mảng định nghĩa mức chất lượng không khí.*/
/*------------------*/

/*
?lat=${lat}: Thông số vĩ độ của địa điểm cần xem dự báo.
&lon=${lon}: Thông số kinh độ của địa điểm.
&appid=${api_key}: Mã khóa API cá nhân để xác thực với OpenWeatherMap.
*/
/*Truy vấn và hiển thị thông tin thời tiết, dự báo, và chất lượng không khí.*/
function getWeatherDetails(name, lat, lon, country, state) {
    let FORECAST_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${api_key}`, /* Lấy dữ liệu thời tiết hiện tại cho một địa điểm cụ thể.*/
        WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`, /*Lấy dữ liệu thời tiết hiện tại cho một địa điểm cụ thể.*/
        AIR_POLLUTION_API_URL = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${api_key}`; /*Lấy dữ liệu về chất lượng không khí (Air Quality Index - AQI)*/
    
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    /*Lấy và hiển thị chất lượng không khí*/
    fetch(AIR_POLLUTION_API_URL)
        .then(res => res.json())
        .then(data => {
            const { co, no, no2, o3, so2, pm2_5, pm10, nh3 } = data.list[0].components;
            aqiCard.innerHTML = `
            <div class="card">
                <div class="card-head">
                    <p>Air Quality Index</p>
                    <p class="air-index aqi-${data.list[0].main.aqi}">${aqiList[data.list[0].main.aqi - 1]}</p>
                </div>
                <div class="air-indices">
                    <i class="fa-regular fa-wind fa-3x"></i>
                    <div class="item">
                        <p>PM 2.5</p>
                        <h2>${pm2_5}</h2>
                    </div>
                    <div class="item">
                        <p>PM10</p>
                        <h2>${pm10}</h2>
                    </div>
                    <div class="item">
                        <p>SO2</p>
                        <h2>${so2}</h2>
                    </div>
                    <div class="item">
                        <p>CO</p>
                        <h2>${co}</h2>
                    </div>
                    <div class="item">
                        <p>NO</p>
                        <h2>${no}</h2>
                    </div>
                    <div class="item">
                        <p>NO2</p>
                        <h2>${no2}</h2>
                    </div>
                    <div class="item">
                        <p>NH3</p>
                        <h2>${nh3}</h2>
                    </div>
                    <div class="item">
                        <p>O3</p>
                        <h2>${o3}</h2>
                    </div>
                </div>
            </div>
        `;
        
        })
        .catch(() => {
            alert('Failed to fetch air quality index.');
        });

    /*Lấy và hiển thị thời tiết hiện tại*/
    fetch(WEATHER_API_URL)
        .then(res => res.json())
        .then(data => {
            const date = new Date();
            currentWeatherCard.innerHTML = `
                <div class="current-weather">
                    <div class="details">
                        <p>Now</p>
                        <h2>${(data.main.temp - 273.15).toFixed(2)}&deg;C</h2>
                        <p>${data.weather[0].description}</p>
                    </div>
                    <div class="weather-icon">
                        <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="">
                    </div>
                </div>
                <hr>
                <div class="card-footer">
                    <p><i class="fa-solid fa-calendar-days"></i> ${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}</p>
                    <p><i class="fa-solid fa-location-dot"></i> ${name}, ${country}</p>
                </div>
            `;
            const { sunrise, sunset, timezone } = data.sys,
                  { humidity, pressure, feels_like } = data.main,
                  { speed } = data.wind,
                  {visibility} = data;
            const sRiseTime = moment.utc(sunrise, 'X').add(timezone, 'seconds').format('hh:mm A'),
                  sSetTime = moment.utc(sunset, 'X').add(timezone, 'seconds').format('hh:mm A');

            sunriseCard.innerHTML = `
                <div class="card-head"><p>Sunrise & Sunset</p></div>
                <div class="sunrise-sunset">
                    <div class="item"><i class="fa-light fa-sunrise fa-4x"></i><p>Sunrise</p><h2>${sRiseTime}</h2></div>
                    <div class="item"><i class="fa-light fa-sunset fa-4x"></i><p>Sunset</p><h2>${sSetTime}</h2></div>
                </div>
            `;
            humidityVal.innerHTML = `${humidity}%`;
            pressureVal.innerHTML = `${pressure} hPa`;
            visibilityVal.innerHTML = `${(visibility / 1000).toFixed(1)} km`;
            windSpeedVal.innerHTML = `${speed} m/s`;
            feelsVal.innerHTML = `${(feels_like - 273.15).toFixed(2)}&deg;C`;
        })
        .catch(() => {
            console.error('Failed to fetch current weather.');
        });

    /*Lấy và hiển thị dự báo thời tiết*/
    fetch(FORECAST_API_URL)
        .then(res => res.json())
        .then(data => {
            const hourlyForecast = data.list;
            hourlyForecastCard.innerHTML = '';
            for (let i = 0; i <= 7; i++) {
                const hrForecastDate = new Date(hourlyForecast[i].dt_txt);
                let hr = hrForecastDate.getHours();
                let period = 'AM';
                if (hr >= 12) { period = 'PM'; hr = (hr > 12) ? hr - 12 : hr; }
                hourlyForecastCard.innerHTML += `
                    <div class="card">
                        <p>${hr} ${period}</p>
                        <img src="https://openweathermap.org/img/wn/${hourlyForecast[i].weather[0].icon}.png" alt="">
                        <p>${(hourlyForecast[i].main.temp - 273.15).toFixed(2)}&deg;C</p>
                    </div>    
                `;
            }

            const uniqueForecastDays = [];
            const today = new Date().getDate();

            const fiveDaysForecast = data.list.filter(forecast => {
                const forecastDate = new Date(forecast.dt_txt).getDate();

                // Bỏ qua ngày hôm nay
                if (forecastDate === today) {
                    return false;
                }

                // Thêm các ngày khác nhau vào mảng
                if (!uniqueForecastDays.includes(forecastDate)) {
                    uniqueForecastDays.push(forecastDate);
                    return true;
                }
                return false;
            });
            fiveDaysForecastCard.innerHTML = '';
            for (let i = 0; i < fiveDaysForecast.length; i++) {
                const date = new Date(fiveDaysForecast[i].dt_txt);
                fiveDaysForecastCard.innerHTML += `
                    <div class="forecast-item">
                        <div class="icon-wrapper">
                            <img src="https://openweathermap.org/img/wn/${fiveDaysForecast[i].weather[0].icon}.png" alt="">
                            <span>${(fiveDaysForecast[i].main.temp - 273.15).toFixed(2)}&deg;C</span>
                        </div>
                        <p>${date.getDate()} ${months[date.getMonth()]}</p>
                        <p>${days[date.getDay()]}</p>
                    </div>
                `;
            }
        })
        .catch(() => {
            console.error('Failed to fetch weather forecast.');
        });
}

/*Hàm lấy tọa độ thành phố*/
function getCityCoordinates() {
    const cityName = cityInput.value.trim(); /*Một tham chiếu đến phần tử input trên giao diện,lấy giá trị người dùng nhập và loại bỏ khoảng trắng ở đầu hoặc cuối.*/
    if (!cityName) return; /* Kiểm tra nếu người dùng không nhập (tên thành phố rỗng), thì thoát khỏi hàm.*/
    const GEOCODING_API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${api_key}`;
    fetch(GEOCODING_API_URL)
        .then(res => res.json())
        .then(data => {
            const { name, lat, lon, country, state } = data[0];
            getWeatherDetails(name, lat, lon, country, state);
        })
        .catch(() => {
            alert(`Failed to fetch coordinates for ${cityName}`);
        });
}

/*Hàm lấy tọa độ người dùng*/
function getUserCoordinates() {
    navigator.geolocation.getCurrentPosition(
        position => {
            const { latitude, longitude } = position.coords;
            const REVERSE_GEOCODING_URL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${api_key}`;
            
            fetch(REVERSE_GEOCODING_URL)
                .then(res => res.json())
                .then(data => {
                    const { name, country, state } = data[0];  
                    getWeatherDetails(name, latitude, longitude, country, state);
                })
                .catch(() => {
                    alert('Failed to fetch user coordinates');
                });
        },
        error => {
            alert('Unable to retrieve your location. Please enable location services and try again.');
        }
    );
}

searchBtn.addEventListener('click', getCityCoordinates);
locationBtn.addEventListener('click', getUserCoordinates);
cityInput.addEventListener('keyup', e => e.key === 'Enter' && getCityCoordinates());
window.addEventListener('load', getUserCoordinates);

/*Chuyển đổi chủ đề sáng/tối*/
const themeToggleButton = document.getElementById('themeToggle');
const bodyElement = document.body;

// Kiểm tra chế độ đã lưu trong localStorage (nếu có)
if (localStorage.getItem('theme') === 'light') {
    bodyElement.classList.add('light-mode');
}

themeToggleButton.addEventListener('click', () => {
    // Chuyển đổi giữa chế độ sáng và tối
    bodyElement.classList.toggle('light-mode');

    // Lưu trạng thái chế độ hiện tại vào localStorage
    if (bodyElement.classList.contains('light-mode')) {
        localStorage.setItem('theme', 'light');
    } else {
        localStorage.setItem('theme', 'dark');
    }
});
