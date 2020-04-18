// interrogate star wars API for a quote

const starwars_url = "http://swquotesapi.digitaljedi.dk/api/SWQuote/RandomStarWarsQuote";

$("#starwars-btn").click( function () {
	// call jquery json method to request data from the starwars API:
	$.getJSON(starwars_url, function(data) {
		// JSON response is in the variable data
		// empty and update weather string:
				
		// update the paragraph text:
		$("#starwars").text(('"' + data.starWarsQuote + '"').toString());

	});
})