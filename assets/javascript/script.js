var searchBtn = document.querySelector("#save");
var userSrch = document.querySelector("#userTxt");
var histSec = document.querySelector(".historySection");


const apiKey = "990fb7b2f72e24a5eaca77e18553684b";
var getCityStateLocation = function(city, state) {
    fetch("https://api.openweathermap.org/geo/1.0/direct?q=" + city + "," + state + ",US&limit=1&appid=" + apiKey)
        .then(function(response) {
            //request was successful
            if (response.ok) {
                response.json().then(function(data) {
                    if (data) {
                        var lat = data[0].lat;
                        var lon = data[0].lon;
                        var city = data[0].name;
                        var state = data[0].state;
                        var coorArray = [lat, lon, city, state];
                        debugger;
                        getWeatherFromCoordinates(coorArray);
                    } else {
                        window.alert("Error: Nothing found.");
                    }
                });
            } else {}
        })
        .catch(function(error) {
            //Notice this '.catch()' getting chained onto the end of the .'then()' method
            alert("Unable to connect to API");
        });
}

CurrentWeather = {};
DailyWeather = {
    date: [],
    temp: [],
    uvi: [],
    humidity: [],
    icon: [],
    wind: []
};
//data.daily[0].dt;
var getWeatherFromCoordinates = function(coorArray) {
    fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + coorArray[0] + "&lon=" + coorArray[1] + "&exclude=hourly,minutely&appid=" + apiKey + "&units=imperial")
        .then(function(response) {
            //request was successful
            if (response.ok) {
                response.json().then(function(data) {
                    if (data) {
                        CurrentWeather.city = coorArray[2];;
                        CurrentWeather.state = coorArray[3];
                        CurrentWeather.icon = "https://openweathermap.org/img/wn/" + data.current.weather[0].icon + ".png";
                        CurrentWeather.date = epochtoHuman(data.current.dt);
                        CurrentWeather.temp = formatTemp(data.current.temp);
                        CurrentWeather.uv = data.current.uvi;
                        CurrentWeather.wind = data.current.wind_speed + " MPH";
                        CurrentWeather.humidity = data.current.humidity + "%";

                        for (let i = 1; i <= 5; i++) {
                            DailyWeather.date.push(epochtoHuman(data.daily[i].dt));
                            DailyWeather.temp.push(`${formatTemp(data.daily[i].temp.max)} ${formatTemp(data.daily[i].temp.min)}`);
                            DailyWeather.uvi.push(data.daily[i].uvi);
                            DailyWeather.humidity.push(data.daily[i].humidity + "%");
                            DailyWeather.icon.push("https://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon + ".png");
                            DailyWeather.wind.push(data.daily[i].wind_speed + " MPH");
                        }

                    } else {
                        window.alert("Error: Nothing found.");
                    }
                    buildCurrentWeatherPart(CurrentWeather);
                    buildDailyWeatherPart(DailyWeather);
                });
            } else {}
        })
        .catch(function(error) {
            alert("Unable to connect to API");
        });
}


var buildCurrentWeatherPart = function(CurrentWeather) {
    var city_state = CurrentWeather.city + "," + CurrentWeather.state;
    var uviColorCoding = UVtoColorCoding(CurrentWeather.uv);
    document.getElementById("currentWeather").innerHTML = `
    <div id="currWeatherHeadline">
    <h3>${CurrentWeather.city}, ${CurrentWeather.state} (${CurrentWeather.date}) <img id="currWeatherIcon" src="${CurrentWeather.icon}"></h3>
    <ul id="currLst">
    <li>Temp: ${CurrentWeather.temp}</li>
    <li>Wind: ${CurrentWeather.wind}</li>
    <li>Humidity: ${CurrentWeather.humidity}</li>
    <li id="uvItem">UV Index: <span style="background:${uviColorCoding}; margin-left:4px;text-align:center;padding:3px;border:1px black solid"> ${CurrentWeather.uv}<span></li>
    </ul>
    `
    var histSecCt = histSec.childElementCount;
    var histParent = histSec;
    if (histSecCt == 8) {
        if (window.confirm("Max number of history buttons reached.\nI have to clear them.")) {
            document.querySelector(".historySection").innerHTML = "";
            var newBtn = document.createElement("button");
            newBtn.setAttribute("class", "histBtn");
            newBtn.setAttribute("type", "button");
            newBtn.setAttribute("data-cityState", city_state);
            newBtn.textContent = city_state;
            histParent.appendChild(newBtn);
        }
    } else {

        var newBtn = document.createElement("button");
        newBtn.setAttribute("class", "histBtn");
        newBtn.setAttribute("type", "button");
        newBtn.setAttribute("data-cityState", city_state);
        newBtn.textContent = city_state;
        histParent.appendChild(newBtn);
    }
}
var buildDailyWeatherPart = function(DailyWeather) {
    var content = ""
    document.getElementById("dCardContainer").innerHTML = "";
    for (var i = 0; i < 5; i++) {
        var dailyUVI = UVtoColorCoding(DailyWeather.uvi[i]);
        content =
            `
        <div class="dCard">
        <ul>
      <li>${DailyWeather.date[i]}</l>
      <li><img src="${DailyWeather.icon[i]}"></li>
      <li>Temp: ${DailyWeather.temp[i]}</li>
      <li>Wind: ${DailyWeather.wind[i]}</li>
      <li>Humidity: ${DailyWeather.humidity[i]}</li>
      <li id="uvItem">UV Index: <span style="background:${dailyUVI}; margin-left:4px;text-align:center;padding:3px;border:1px black solid; color:black"> ${DailyWeather.uvi[i]}<span></li>
        </ul>
        </div>
        `;
        document.getElementById("dCardContainer").innerHTML += content;
    }
}



var UVtoColorCoding = function(UVNum) {
    let answer = "";
    if (UVNum <= 2.99) { answer = "green" };
    if (UVNum >= 3.00 && UVNum <= 5.99) { answer = "yellow" };
    if (UVNum >= 6.00 && UVNum <= 7.99) { answer = "orange" };
    if (UVNum >= 8.00 && UVNum <= 10.99) { answer = "red" };
    if (UVNum > 10.99) { answer = "red" };
    return answer;
}

function epochtoHuman(epoch) {
    return humanTime = moment.unix(epoch).format('MM/DD/YYYY');
}

function formatTemp(temp) {
    return Math.round(temp);
}

function clearWeatherDatasets() {
    CurrentWeather.city = "";
    CurrentWeather.state = "";
    CurrentWeather.icon = "";
    CurrentWeather.date = "";
    CurrentWeather.temp = "";
    CurrentWeather.uv = "";
    CurrentWeather.wind = "";
    CurrentWeather.humidity = "";

    DailyWeather.date.splice(0, DailyWeather.date.length);
    DailyWeather.temp.splice(0, DailyWeather.temp.length);
    DailyWeather.uvi.splice(0, DailyWeather.uvi.length);
    DailyWeather.humidity.splice(0, DailyWeather.humidity.length);
    DailyWeather.icon.splice(0, DailyWeather.icon.length);
    DailyWeather.wind.splice(0, DailyWeather.wind.length);
}

handleSearch = function(event) {
    event.preventDefault();
    var userInput = userSrch.value;
    userSrch.value = "";
    var txtArray = userInput.split(',');
    if (txtArray.length == 2) {
        let city = txtArray[0];
        let state = txtArray[1];
        clearWeatherDatasets();
        getCityStateLocation(city, state);
    } else {
        window.alert("Please enter city, state for search.");
    }
}


handleHistoryRecall = function(cityState) {
    var txtArray = cityState.split(',');
    if (txtArray.length == 2) {
        let city = txtArray[0];
        let state = txtArray[1];
        clearWeatherDatasets();
        getCityStateLocation(city, state);
    } else {
        window.alert("Please enter city, state for search.");
    }
}

var recallHistory = function(event) {
    var cityState = event.target.getAttribute("data-cityState");
    handleHistoryRecall(cityState);
}




searchBtn.addEventListener("click", handleSearch);
histSec.addEventListener("click", recallHistory);