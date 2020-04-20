// implement chatbot query and response
// version where logic is implemented in the server and this sends only GET user requests

// global input string for processing:
var input_str;

// check if address is localhost. If not, use the domain name address
var address;
if (window.location.origin == "http://localhost:3000") {
	address = "http://localhost:3000/chatbot"
} else {
	address = "http://www1.dinosdimou.site:3000/chatbot";
}

// get user input after button click:
$("#submit-btn").click(function(){
	// get input string:
	input_str = $("#user-input").val();

	// send the user input to the bot at back-end:
	// send user input with a GET request including input_str. Response comes in the data parameter:
        $.get(address, input_str, function(data, status) {
        	// display the bot reply:
    		$("#bot-response").val(data);
        });

	// does not refresh the page after hitting button or enter
	return false;
});

