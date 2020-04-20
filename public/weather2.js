// get the weather information from openweathermap.org
// all global variables declarations go here

// weather string:
let weather_string = 'waiting for update...';

// data to send with the POST request to the node.js server. I have to send to 192.168.1.6 (private IP, because 
// localhost means local machine, and is only recognized from here. If I want to send the request from the iphone, 
// it will not work.

// url and data object to include in the POST request:
// check if address is localhost. If not, use the domain name address
var weather_url;
if (window.location.origin == "http://localhost:3000") {
	weather_url = "http://localhost:3000/weather"
} else {
	weather_url = "http://www1.dinosdimou.site:3000/weather";
}

// define data object to send to the post request (temperature as received from the JSON):
let weatherData = new Object();

$("#weather-button").click( function () {
	// call jquery json method to request data from the weather API:
	$.getJSON("http://api.openweathermap.org/data/2.5/weather?q=Thessaloniki,gr&units=metric&APPID=31a213ec3a6d87d073e22fabfcc6591f", function(data) {
		// JSON response is in the variable data.
		// empty and update weather string:
		weather_string = '';
		
		// get current date and time:
		var d = new Date();
  		weather_string = d.toLocaleDateString();
  		weather_string = weather_string.concat(", ", d.toLocaleTimeString(), ": \n");
		weather_string = weather_string.concat("Current temperature: ", (data.main.temp).toString(), " (feels like ", (data.main.feels_like).toString(), '). ');
		weather_string = weather_string.concat("Current situation: ", (data.weather[0].description).toString(), '.\n');
		// update the paragraph text:
		$("#weather").text(weather_string);

		// populate Data object values as received from the API:
		weatherData.temperature = data.main.temp;
		weatherData.description = (data.weather[0].description).toString();

		// Construct the url and retrieve the current weather icon from the openweather site:
		let icon_url = '';
		icon_url = icon_url.concat("http://openweathermap.org/img/wn/", (data.weather[0].icon).toString(), "@2x.png");
		// change the src attribute of the icon in the DOM:
		$("#weather_icon").attr("src", icon_url);

		// send a POST request with the data to the server:
		$.post(weather_url, weatherData, function(data, status) {
			console.log(status);	
		});
	});
})
