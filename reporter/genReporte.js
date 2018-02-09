var fs = require('fs');
function buildHtml(tipo) {
  var header = '';
  var body = "<h1>este es un grafico "+ tipo+"</h1>";

  return '<!DOCTYPE html>' + '<html><header>' + header + '</header><body>' + body + '</body></html>';
};

function generateReport(objData){

  var idCliente = (objData.clientId).toString();
  var idPage = new Date().getTime().toString();
  var urlReturn = '';
  //var dirName ='../../reporteCliente/'+idCliente;
  var dirName ='./'+idCliente;
  var stream = fs.createWriteStream(fileName);

  if (fs.existsSync(dirName)) {
    console.log("existe carpeta cliente");
  }else{
    console.log("NO existe carpeta cliente");
    fs.mkdirSync(dirName)
    console.log("carpeta creada");
  }

  switch(objData.type){
    case "bar-chart":
      console.log("pidio-bar-char");
      break;
    case "pie-chart":
      console.log("pidio-pie-char");
      break;
    case "line-chart":
      console.log("pidio-line-chart");
      break;
  }

  stream.once('open', function(fd) {
    var html = buildHtml(objData.type);
    stream.end(html);
  });

  //urlReturn = "http://ec2-54-172-254-2.compute-1.amazonaws.com/reporteCliente/"+idCliente+"/"+idPage+".html";
  return "http://localhost:3300/"+idCliente+"/"+idPage+".html";
}