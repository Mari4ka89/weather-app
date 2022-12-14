function formatTime(time) {
  if (time < 10) {
    time = `0${time}`;
  }

  return time;
}

function formatDate(timestamp) {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let date = new Date(timestamp);
  let dayNumber = date.getDay();
  let hours = formatTime(date.getHours());
  let minutes = formatTime(date.getMinutes());

  return `${days[dayNumber]} ${hours}:${minutes}`;
}

const formatForecastDay = (timestamp) => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let date = new Date(timestamp);
  let dayNumber = date.getDay();

  return days[dayNumber];
};

document.querySelector("#date").innerHTML = formatDate(new Date());

const buildUrlByCityName = (city) =>
  `https://api.openweathermap.org/data/2.5/weather/?q=${city}&units=metric`;
const buildUrlByCoords = ({ lat, lon }) =>
  `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric`;

const addApiKeyToUrl = (apiUrl, apiKey) => `${apiUrl}&appid=${apiKey}`;

const showIncorrectLocationMessage = () => {
  document.querySelector("#error").classList.add("visible");
  document.querySelector("#error").classList.remove("invisible");
};

const displayForecast = ({ data: { daily } }) => {
  let forecastLayout = "";

  daily.slice(0, 6).forEach(({ dt, weather, temp: { max, min } }) => {
    const { icon, description } = weather[0];

    forecastLayout += `<div class="col-2">
      <div class="text-center text-uppercase">${formatForecastDay(
        dt * 1000
      )}</div>
      <img
        class="d-block"
        src="http://openweathermap.org/img/wn/${icon}@2x.png"
        alt=${description}
      />
      <div class="text-center">
        <span class="fw-bold">${Math.round(max)}°</span> 
        <span>${Math.round(min)}°</span>
      </div>
    </div>`;
  });

  document.querySelector("#forecast").innerHTML = forecastLayout;
};

const getWeatherForecast = ({ lat, lon }) => {
  const apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric`;
  const apiKey = "3bc520cc14bbdedfd7e45158f2ef0439";

  axios.get(addApiKeyToUrl(apiUrl, apiKey)).then(displayForecast);
};

function showTemperature(response) {
  const {
    data: {
      main: { temp, humidity },
      name,
      weather,
      dt,
      coord,
      wind: { speed },
    },
  } = response;
  const { icon, main, description } = weather[0];
  let iconElement = document.querySelector("#icon");

  document.querySelector("#city").innerHTML = name;
  document.querySelector("#temperature").innerHTML = Math.round(temp);
  document.querySelector("#weather-description").innerHTML = main;
  document.querySelector("#humidity").innerHTML = humidity;
  document.querySelector("#wind").innerHTML = Math.round(speed);
  document.querySelector("#date").innerHTML = formatDate(dt * 1000);
  iconElement.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${icon}@2x.png`
  );
  iconElement.setAttribute("alt", description);

  getWeatherForecast(coord);
}

const getWeatherData = (urlFunc, params) => {
  const apiKey = "3bc520cc14bbdedfd7e45158f2ef0439";

  axios
    .get(addApiKeyToUrl(urlFunc(params), apiKey))
    .then(showTemperature)
    .catch((error) => {
      showIncorrectLocationMessage();
      console.log(error);
    });
};

const getCurrentLocationCoords = ({ coords: { latitude, longitude } }) =>
  getWeatherData(buildUrlByCoords, { lat: latitude, lon: longitude });

function submitLocationForm(event) {
  event.preventDefault();
  const location = document.querySelector("#location-input").value;

  if (location) {
    getWeatherData(buildUrlByCityName, location);
  }
}

const displayCurrentLocationWeather = () =>
  navigator.geolocation.getCurrentPosition(getCurrentLocationCoords);

getWeatherData(buildUrlByCityName, "Dnipro");

document
  .querySelector("#search-form")
  .addEventListener("submit", submitLocationForm);

document
  .querySelector("#location-button")
  .addEventListener("click", displayCurrentLocationWeather);
