/* gets recent data regarding the covid-19 pandemic.

I can leave the functionality here that the user can request current data from the API directly just for 
display purposes. It will not send a POST request to the server to store each time we press the button. 
The server will periodically request the API and store in the database, and the draw_chart will get the 
update with a GET request. 
*/

// covid string:
let covid_string = 'Click to see current data';

// url and data object to include in the POST request:
// check if address is localhost. If not, use the domain name address
var covid_url;
if (window.location.origin == "http://localhost:3000") {
	covid_url = "http://localhost:3000/covid"
} else {
	covid_url = "http://www1.dinosdimou.site:3000/covid";
}

let covidData = new Object();

// jQuery covid update button:
$("#covid-button").click(function () {

	var settings = {
		"async": true,
		"crossDomain": true,
		"url": "https://covid-19-coronavirus-statistics.p.rapidapi.com/v1/stats?country=Greece",
		"method": "GET",
		"headers": {
			"x-rapidapi-host": "covid-19-coronavirus-statistics.p.rapidapi.com",
			"x-rapidapi-key": "c1e9db53f9msh3570c9519e11242p1a9791jsnff65d94abc9f"
		}
	}

	$.ajax(settings).done(function (response) {
		// clear and update the string:
		covid_string = '';
		covid_string = covid_string.concat("Confirmed: ", (response.data.covid19Stats[0].confirmed).toString(), "\n",
			"Deaths: ", (response.data.covid19Stats[0].deaths).toString(), "\n", "Recovered: ", 
			(response.data.covid19Stats[0].recovered).toString() );
		// pass the string to the paragraph object:
		$("#covid").text(covid_string);

		// refresh the graph:
		myChart.update();

		// populate the Data object if I want to send to server:
		covidData.confirmed = response.data.covid19Stats[0].confirmed;
		covidData.dead = response.data.covid19Stats[0].deaths;
		covidData.recovered = response.data.covid19Stats[0].recovered;

		// send a POST request with the data to the server when reply comes from the API:
		//$.post(covid_url, covidData, function(data, status) {
		//	console.log(status);	
		//});

	});
})
