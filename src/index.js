const apiKey = "6b24516d286b8dbb432adef9e9789e67";

function formatTime(time) {
  if (time < 10) {
    time = `0${time}`;
  }

  return time;
}

function formatDate(date) {
  let week = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];
  let dayNumber = date.getDay();
  let hours = formatTime(date.getHours());
  let minutes = formatTime(date.getMinutes());

  return `${week[dayNumber]} ${hours}:${minutes}`;
}

document.querySelector("#current-date").innerHTML = formatDate(new Date());

const buildUrlByCityName = (city) =>
  `https://api.openweathermap.org/data/2.5/weather/?q=${city}&units=metric`;
const buildUrlByCoords = (lat, lon) =>
  `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric`;

function showTemperature(response) {
  const {
    data: {
      main: { temp, humidity },
      name,
      weather,
      wind: { speed }
    }
  } = response;

  document.querySelector("#location-text").innerHTML = name;
  document.querySelector("#temperature").innerHTML = Math.round(temp);
  document.querySelector("#weather-description").innerHTML = weather[0].main;
  document.querySelector("#humidity").innerHTML = humidity;
  document.querySelector("#wind").innerHTML = Math.round(speed);
  document.querySelector("#current-date").innerHTML = formatDate(new Date());
}

function submitLocationForm(event) {
  event.preventDefault();
  const location = document.querySelector("#location-input").value;

  if (location) {
    const apiUrl = buildUrlByCityName(location);

    axios.get(`${apiUrl}&appid=${apiKey}`).then(showTemperature);
  }
}

function getCurrentLocationCoords({ coords: { latitude, longitude } }) {
  const apiUrl = buildUrlByCoords(latitude, longitude);

  axios.get(`${apiUrl}&appid=${apiKey}`).then(showTemperature);
}

function displayCurrentLocationWeather() {
  navigator.geolocation.getCurrentPosition(getCurrentLocationCoords);
}

document
  .querySelector("#search-form")
  .addEventListener("submit", submitLocationForm);

document
  .querySelector("#location-button")
  .addEventListener("click", displayCurrentLocationWeather);
