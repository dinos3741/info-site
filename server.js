// this is the server file running with node.js. It will store received data from the client side in a database.

// include express framework:
var express = require('express');
var app = express();

// serve an html static file from the public folder (default name: index.html):
app.use(express.static("public")); // we could use any folder name

// http request module:
var request = require("request");

// require body-parser to enable express to get data from POST requests:
var bodyParser = require("body-parser");

// tell express to use body parser:
app.use(bodyParser.urlencoded({extended: true}));

// include node-cron module for scheduled jobs:
var cron = require("node-cron");

// finally define mongoose to use mongodb:
var mongoose = require("mongoose");

// configure mongoose and connect to mongodb to the info database locally connected to the default port:
// I have to use either localhost or 127.0.0.1, I cannot use the 192.168.1.6 (private IP). 
// SOS: this needs to be changed to mongo in the container instead of localhost, if the container name is
// mongo in the docker-compose.yml file
// Note: if the database name does not exist, it will create it!

// mongoose.connect("mongodb://localhost:27017/info"); // specify the database name here (info). 
mongoose.connect("mongodb://mongo:27017/info");


// MONGODB CONFUGURATION
// create the schema for the weather database. We define what we want to store in the database:
var weatherSchema = new mongoose.Schema({
	date: String,
	time: String,
	temperature: Number,
    description: String
});

// same thing for covid schema:
var covidSchema = new mongoose.Schema({
	date: String,
	time: String,
	confirmed: Number,
    dead: Number,
    recovered: Number
});

// now we create the model called Weather for the database from the schema we created before.
// The first argument is the singular name of the collection the model is for. Mongoose automatically looks 
// for the plural, lowercased version of the model name
// Note: if it does not exist, it will NOT create a collection called weathers inside the info database, I have
// to create it manually from within compass!

// The model function makes a copy of schema:
var weather = mongoose.model("Weather", weatherSchema);
// create model based on covid schema:
var covid = mongoose.model("Covid", covidSchema);


// ----------------------------------------------------------
// receive GET request from draw_chart.js and interrogate the database:
 app.get('/covid', (req, res) => {
 	// retrieve all entries - {} from the covids collection:
	covid.find({}, function(error, data) {
		if (error) {
			res.send("no results found");
		}
		else { // when data retrieved from the covid collection, sends them to the requester:
			res.send(data);
			// console.log("data retrieved from the covid collection");
		}
	});
});

var RiveScript = require('rivescript');

// create the chatbot object:
let bot = new RiveScript();

// load the Stanley rive file using asynchronous promise:
bot.loadFile("public/brains/stanley.rive").then(function() {
	console.log("Stanley loaded!");
	bot.sortReplies();
}).catch(function(err, filename, lineno) {
	console.error("Error loading Stanley!");
});

// load the Eliza file using asynchronous promise:
bot.loadFile("public/brains/eliza.rive").then(function() {
	console.log("Eliza loaded!");
	bot.sortReplies();
}).catch(function(err, filename, lineno) {
	console.error("Error loading Eliza!");
});

// load the substitutions file using asynchronous promise:
bot.loadFile("public/brains/begin.rive").then(function() {
	console.log("Subs loaded!");
	bot.sortReplies();
}).catch(function(err, filename, lineno) {
	console.error("Error loading subs!");
});

// text log of the transcript:
var script_log = '';

// ----------------------------------------------------------
// receive GET request from chatbot2.js with a user phrase:
app.get('/chatbot', (req, res) => {
 	
	var input_str = req._parsedOriginalUrl.query;

	// log the human input:
	script_log = script_log.concat("human: " + input_str + "\n");

 	// pass the user input to the bot. DecodeURI is used to remove %20 coding for spaces
	bot.reply("local-user", decodeURI(input_str)).then(function(reply) {
		// get the answer asynchronously (using promise) and display on the output box:
    	res.send(reply);
	});

	// log the bot response in the same logfile:
	script_log = script_log.concat("bot: " + reply + "\n");
});


// ----------------------------------------------------------
// functionality to receive a POST request from WEATHER app to store weather data in the DB:
app.post("/weather", function(req, res) {
	// get the date/time stamp:
	var d = new Date();
	
	// the data is in the field "body" of the POST request:
	console.log(d.toLocaleTimeString() + ": POST request received from weather.js");
	console.log(req.body);

	// create an instance of the weather model and store new entry in the db in the weather collection.
	// alternative method: create the instance first:
	// var weather_instance = new weather({ temperature: req.body.temperature });
	// and then store: weather_instance.save(function (error){}
	weather.create({ date: d.toLocaleDateString(), 
					 time: d.toLocaleTimeString(), 
					 temperature: req.body.temperature, 
					 description: req.body.description}, 
		function(error, weather_data) { // callback after store: weather_data is the data stored
		if (error) {
			console.log("Error creating new entry in the weathers collection");
		}
		else {
			console.log("Entry stored successfully in the weathers collection");
		}
	});
});

// ----------------------------------------------------------
// function to interrogate the API and update the db:
function updateCovidCollection () {
	// get the date/time stamp:
	var d = new Date();
	var data = new Object();
	
	var options = {
  		method: 'GET',
  		url: 'https://covid-19-coronavirus-statistics.p.rapidapi.com/v1/stats?country=Greece',
  		qs: {format: 'undefined'},
  		headers: {
    		'x-rapidapi-host': 'covid-19-coronavirus-statistics.p.rapidapi.com',
    		'x-rapidapi-key': 'c1e9db53f9msh3570c9519e11242p1a9791jsnff65d94abc9f'
  		}
	};

	// send a request to the covid API to get current data:
	request(options, function (error, response, body) {
		if (error) throw new Error(error);
		data.confirmed = JSON.parse(body).data.covid19Stats[0].confirmed;
		data.dead = JSON.parse(body).data.covid19Stats[0].deaths;
		data.recovered = JSON.parse(body).data.covid19Stats[0].recovered;

		// create an instance of the covid model and store new entry in the db in the covid collection:
		covid.create({ date: d.toLocaleDateString(), 
				   	time: d.toLocaleTimeString(), 
					confirmed: data.confirmed, 
					dead: data.dead,
					recovered: data.recovered }, 
			function(error, covid_data) { // callback after store: covid_data is the data stored
			if (error) {
				console.log("Error creating new entry in the covids collection");
			}
			else {
				console.log("Entry stored successfully in the covids collection");
			}
		});
	});
}

// schedule tasks to be run on the server: 6* = every second, 5* = every minute, 4* = every hour,
// 3* = every day of the month (insert the day, eg. 21), 2* = every month, 1* = every day of the week
// example: cron.schedule("59 23 * * *", function(): run every day at 23:59
cron.schedule("00 11 * * *", function() {
	// run the update everyday at 11 AM
	updateCovidCollection();
});

// ----------------------------------------------------------
// functionality to receive a POST request from COVID app - not used if server asks the covid API periodically):
app.post("/covid", function(req, res) {
	// get the date/time stamp:
	var d = new Date();

	// create an instance of the covid model and store new entry in the db in the covid collection:
	covid.create({ 	date: d.toLocaleDateString(), 
				   	time: d.toLocaleTimeString(), 
					confirmed: req.body.confirmed, 
					dead: req.body.dead,
					recovered: req.body.recovered }, 
		function(error, covid_data) { // callback after store: covid_data is the data stored
		if (error) {
			console.log("Error creating new entry in the covids collection");
		}
		else {
			console.log("Entry stored successfully in the covids collection");
		}
	});
});


// server listens to port 3000 (the anonymous callback symbol is =>):
app.listen(3000, () => console.log('Listening at port 3000'));
