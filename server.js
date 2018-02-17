const express = require("express")
const bodyParser=require("body-parser");
var Processer = require("./processer/processer");

const app = express();
app.use(bodyParser.json());

app.post('/', function(request, response){
    Processer.devuelveUrl(request.body)
    .then((url) => {
        return response.send(url);
    });
});

// app.get('/:idU/:idP/reporte/', function(req, res) {
//     res.send('template.html', BD.traemeCosas(idU,IdP));
// });

app.listen("3300", function(){
  console.log('Server up');
});

