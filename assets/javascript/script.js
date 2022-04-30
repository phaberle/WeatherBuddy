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
DailyWeather = {
    temp: [],
    uvi: [],
    humidity: [],
    icon: []
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
                        console.log("City: " + CurrentWeather.city);
                        console.log("State: " + CurrentWeather.state);
                        console.log("IconLnk: " + CurrentWeather.icon);
                        console.log("Today's Date: " + CurrentWeather.date);
                        console.log("Current Temp: " + CurrentWeather.temp);
                        var dailyObjects = data.daily;

                        dailyObjects.slice(-5).forEach(function(dailyDate) {
                            DailyWeather.date = epochtoHuman(dailyDate.dt);
                            console.log(DailyWeather.date);
                        })

                        /*
                         DailyWeather[`day${i+1}uv`] = data.daily[i].uvi;
                        daily wind --> console.log(DailyWeather.day1uv)
                        */

                        for (let i = 0; i < 5; i++) {
                            DailyWeather.temp.push(`${formatTemp(data.daily[i].temp.min)} / ${formatTemp(data.daily[i].temp.max)}`);
                            DailyWeather.uvi.push(data.daily[i].uvi);
                            DailyWeather.humidity.push(data.daily[i].humidity);
                            //DailyWeather.weatherIcon.push(data.daily[i].weather[3]);

                            // console.log(DailyWeather.temp[i]);
                            // console.log(DailyWeather.uvi[i]);
                            // console.log(DailyWeather.humidity[i]);
                            //console.log(data.current.weather[0].icon);
                        }

                        data.daily.slice(-5).forEach(function(dailyWIcon) {
                            debugger;
                            console.log(dailyWIcon.weather.icon);
                        })




                        /*
                        card function
                        current function
                        for city recall, store city in session data, have it send city through main function to recall data
                        */

                        //daily humidity
                        // daily UV with color coding

                        //console.log(data.daily[0].temp.max);
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

function formatTemp(temp) {
    return Math.round(temp);
}

getCityStateLocation("Dallas", "Tx");