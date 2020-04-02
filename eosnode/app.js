const express = require('express');
const app = express();

/*CORS stands for Cross Origin Resource Sharing and allows modern web browsers to be able to send AJAX requests and receive HTTP responses for resource from other domains other that the domain serving the client side application.*/
const cors = require('cors');

//Parse incoming request bodies in a middleware before your handlers, available under the req.body property.
const bodyParser = require('body-parser');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());


app.use('/eos', require('./routes/eos.router'));


// start server
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 3030;
app.listen(port, function () {
  console.log('Server listening on port ' + port);
});
