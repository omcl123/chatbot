var express = require("express"),bodyParser=require("body-parser");
var Reporte = require("./model/reporte");

var app = express();
app.use(bodyParser.json());

app.post('/', function(request, response){
  report = new Reporte(request.body);
  response.send(report.getAtt());    // echo the result back
});

app.listen("3300", function(){
  console.log('Server up');
});