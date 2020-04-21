# info-site
A basic web application to display various information. 
A back-end server implemented in node.js creates the server logic to accept http requests form various front-end applications.
The front-end apps get the info by requesting APIs, and then storing the results to a mongodb by sending POST requests to the 
server app. 
A MEAN (bitnami) EC2 stack hosts the app in AWS. 
