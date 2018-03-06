const express = require("express")
const bodyParser=require("body-parser");
var Processer = require("./processer/processer");

const app = express();
app.use(bodyParser.json());

app.post('/report', async function(request, response){
    let url = await Processer.devuelveUrl(request.body);
    response.send(url);
});

app.get('/block', async function(request, response){
    let jsonBlock = await Processer.devuelveBloque(request.query);
    response.send(jsonBlock);
});

app.post('/alert', function(request, response){
    Processer.devuelveNotificacion(request.body)
    .then((notf) => {
        return response.send(notf);
    });
});
// app.get('/:idU/:idP/reporte/', function(req, res) {
//     res.send('template.html', BD.traemeCosas(idU,IdP));
// });

app.listen("3300", function(){
  console.log('Server up');
});

