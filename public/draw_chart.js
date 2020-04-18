// data from covid collection stored in mongodb
var data = new Object();
let graph_labels = [];
let graph_data = [];

// global variables so they can be seen from other modules
var canvas;
var myChart;

// I create a P5 instance instead of the global mode (so I can run multiple P5 sketches). 
// The entry point for the instance is here:
const s = ( sketch ) => {

    sketch.setup = () => {
        // create the canvas as child of the section element with id=chart of the page:
        canvas = sketch.createCanvas(200, 100);
        canvas.parent('chart');

        // create the chart using chart.js module (CDN included in index.html):
        myChart = new Chart(canvas, {
            type: 'line',
            data: {
            // x-axis labels:
                labels: graph_labels,
                datasets: [{
                    label: '# of Deceased',
                    // values of the y-axis
                    data: graph_data,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });


        // send a GET request to the server to obtain covid chart data (contained in the data field):
        $.get('http://localhost:3000/covid', function(data, status) {
            // status is sent back if the /covid page renders or sends something back
            console.log("GET request to covid route: " + status);

            // populate the labels and data arrays for display (array of strings):
            for (var i=0; i<data.length; i++) {
                graph_labels[i] = data[i].date; // the date in string format
                // display the number of dead in the graph:
                graph_data[i] = parseInt(data[i].dead);  // the numbers in number format

                // update the chart display when the callback returns with updated data from the db:
                myChart.update();
            }
        });
        
    }; // end of instance setup
};

let myp5 = new p5(s);

