var express = require("express"),bodyParser=require("body-parser");
var Processer = require("./processer/processer");

var app = express();
app.use(bodyParser.json());

app.post('/', function(request, response){
		var url;
		Processer.devuelveUrl(request.body,url).then(function(url){
		//console.log("en server");
		//console.log(url);
		return response.send(url);
	});
	
});

app.listen("3300", function(){
  console.log('Server up');
});

