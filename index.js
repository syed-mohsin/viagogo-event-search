var express = require('express');
var app = express();

// specify public assets directory
app.use(express.static('public'));

// index endpoint
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.listen(process.env.PORT || 3000, function() {
  console.log('Server is listening at port', process.env.PORT || 3000);
});
