// implement chatbot query and response

// global input string for processing:
var input_str;

// get user input after button click:
$("#submit-btn").click(function(){
	// get input string:
	input_str = $("#user-input").val();

	// send the user input to the bot at back-end:
	// send user input with a GET request including input_str. Response comes in the data parameter:
        $.get('http://localhost:3000/chatbot', input_str, function(data, status) {
        	// display the bot reply:
    		$("#bot-response").val(data);
        });

	// does not refresh the page after hitting button or enter
	return false;
});

