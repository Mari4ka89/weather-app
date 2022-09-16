let celsiusValue = null;
let celsiusLink = document.querySelector("#celsius");
let fahrenheitLink = document.querySelector("#fahrenheit");

function formatTime(time) {
  if (time < 10) {
    time = `0${time}`;
  }

  return time;
}

function formatDate(timestamp) {
  let week = [
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

  return `${week[dayNumber]} ${hours}:${minutes}`;
}

document.querySelector("#date").innerHTML = formatDate(new Date());

const buildUrlByCityName = (city) =>
  `https://api.openweathermap.org/data/2.5/weather/?q=${city}&units=metric`;
const buildUrlByCoords = ({ lat, lon }) =>
  `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric`;

const showIncorrectLocationMessage = () => {
  document.querySelector("#error").classList.add("visible");
  document.querySelector("#error").classList.remove("invisible");
};

function showTemperature(response) {
  const {
    data: {
      main: { temp, humidity },
      name,
      weather,
      dt,
      wind: { speed },
    },
  } = response;
  const { icon, main, description } = weather[0];
  let iconElement = document.querySelector("#icon");

  celsiusValue = temp;
  addRemoveClass(celsiusLink, fahrenheitLink);
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
}

const getWeatherData = (urlFunc, params) => {
  const apiUrl = urlFunc(params);
  const apiKey = "6b24516d286b8dbb432adef9e9789e67";

  axios
    .get(`${apiUrl}&appid=${apiKey}`)
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

const calculateFahrenheitTemperature = (value) => (value * 9) / 5 + 32;

const addRemoveClass = (addSelector, removeSelector) => {
  addSelector.classList.add("active");
  removeSelector.classList.remove("active");
};

const handleCelciusClick = (event) => {
  event.preventDefault();
  document.querySelector("#temperature").innerHTML = Math.round(celsiusValue);
  addRemoveClass(celsiusLink, fahrenheitLink);
};

const handleFahrenheitClick = (event) => {
  event.preventDefault();
  document.querySelector("#temperature").innerHTML = Math.round(
    calculateFahrenheitTemperature(celsiusValue)
  );
  addRemoveClass(fahrenheitLink, celsiusLink);
};

getWeatherData(buildUrlByCityName, "Dnipro");

document
  .querySelector("#search-form")
  .addEventListener("submit", submitLocationForm);

document
  .querySelector("#location-button")
  .addEventListener("click", displayCurrentLocationWeather);

celsiusLink.addEventListener("click", handleCelciusClick);
fahrenheitLink.addEventListener("click", handleFahrenheitClick);
