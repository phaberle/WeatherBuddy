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

// http://openweathermap.org/img/wn/10d@2x.png <-- weather icon

/*
UV Index Number	        Exposure Level	    Color Code
2 or less	            Low	                Green
3 to 5	                Moderate	        Yellow
6 to 7	                High	            Orange
8 to 10	                Very High	        Red
*/



CurrentWeather = {};
DailyWeather = {};
//data.daily[0].dt;
var getWeatherFromCoordinates = function(coorArray) {
    fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + coorArray[0] + "&lon=" + coorArray[1] + "&exclude=hourly,minutely&appid=" + apiKey + "&units=imperial")
        .then(function(response) {
            //request was successful
            if (response.ok) {
                response.json().then(function(data) {
                    if (data) {
                        var City = coorArray[2];
                        var State = coorArray[3];
                        var currIcon = "http://openweathermap.org/img/wn/" + data.current.weather[0].icon + ".png";
                        var currDate = epochtoHuman(data.current.dt);
                        var currTemp = Math.round(data.current.temp) + "F°";
                        var dailyCount = data.daily.length;
                        /* 
                        console.log(currTemp);
                        console.log(WeatherIcon);
                        console.log(epochtoHuman(data.current.dt));
                        console.log(CityName);
                        console.log(State);
                        */
                        console.log(dailyCount);
                        CurrentWeather.city = City;
                        CurrentWeather.state = State;
                        CurrentWeather.icon = currIcon;
                        CurrentWeather.date = currDate;
                        CurrentWeather.temp = currTemp;
                        var dailyArray = data.daily;
                        dailyArray.slice(-5).forEach(function(arrayItem) {
                            var x = epochtoHuman(arrayItem.dt);
                            console.log(x);
                        });
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

function epochtoHuman(epoch) {
    return humanTime = moment.unix(epoch).format('MM/DD/YYYY');
}

getCityStateLocation("Dallas", "Tx");