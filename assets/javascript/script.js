const apiKey = "990fb7b2f72e24a5eaca77e18553684b";

var getCityStateLocation = function(city, state) {
    fetch("http://api.openweathermap.org/geo/1.0/direct?q=" + city + "," + state + ",US&limit=1&appid=" + apiKey)
        .then(function(response) {
            //request was successful
            if (response.ok) {
                response.json().then(function(data) {
                    //console.log(data.length);
                    if (data) {
                        var lat = data[0].lat;
                        var lon = data[0].lon;
                        var city = data[0].name;
                        var state = data[0].state;
                        var coorArray = [lat, lon, city, state];

                        //console.log(coordinates);
                        getWeatherFromCoordinates(coorArray);
                    } else {
                        // alert("Error: Nothing found."); << ADD DOM ELEMENT ALERT
                    }
                });
            } else {}
        })
        .catch(function(error) {
            //Notice this '.catch()' getting chained onto the end of the .'then()' method
            alert("Unable to connect to geoLocationsFile");
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
                        CurrentWeather.icon = "http://openweathermap.org/img/wn/" + data.current.weather[0].icon + ".png";
                        CurrentWeather.date = epochtoHuman(data.current.dt);
                        CurrentWeather.temp = formatTemp(data.current.temp);
                        CurrentWeather.uv = data.current.uvi;
                        CurrentWeather.wind = data.current.wind_speed + " MPH";
                        CurrentWeather.humidity = data.current.humidity + "%";
                        // console.log("City: " + CurrentWeather.city);
                        // console.log("State: " + CurrentWeather.state);
                        // console.log("IconLnk: " + CurrentWeather.icon);
                        // console.log("Today's Date: " + CurrentWeather.date);
                        // console.log("Current Temp: " + CurrentWeather.temp);
                        // var dailyObjects = data.daily;

                        for (let i = 1; i <= 5; i++) {
                            DailyWeather.date.push(epochtoHuman(data.daily[i].dt));
                            DailyWeather.temp.push(`${formatTemp(data.daily[i].temp.min)}/${formatTemp(data.daily[i].temp.max)}`);
                            DailyWeather.uvi.push(data.daily[i].uvi);
                            DailyWeather.humidity.push(data.daily[i].humidity + "%");
                            DailyWeather.icon.push("http://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon + ".png");
                            DailyWeather.wind.push(data.daily[i].wind_speed + " MPH");
                        }
                    } else {
                        // alert("Error: Nothing found."); << ADD DOM ELEMENT ALERT
                    }
                });
            } else {}
        })
        .catch(function(error) {
            //Notice this '.catch()' getting chained onto the end of the .'then()' method
            alert("Unable to connect to geoLocationsFile");
        });
}


var UVtoColorCoding = function(UVNum) {
    let answer = "";
    if (UVNum <= 2) { answer = "green" };
    if (UVNum >= 3 && UVNum <= 5) { answer = "yellow" };
    if (UVNum >= 6 && UVNum <= 7) { answer = "orange" };
    if (UVNum >= 8 && UVNum <= 10) { answer = "red" };
    return answer;
}

function epochtoHuman(epoch) {
    return humanTime = moment.unix(epoch).format('MM/DD/YYYY');
}

function formatTemp(temp) {
    return Math.round(temp);
}

function clearDailyWeatherArrays() {
    DailyWeather.date.splice(0, DailyWeather.date.length);
    DailyWeather.temp.splice(0, DailyWeather.temp.length);
    DailyWeather.uvi.splice(0, DailyWeather.uvi.length);
    DailyWeather.humidity.splice(0, DailyWeather.humidity.length);
    DailyWeather.icon.splice(0, DailyWeather.icon.length);
    DailyWeather.wind.splice(0, DailyWeather.wind.length);
}

getCityStateLocation("Dallas", "Tx");