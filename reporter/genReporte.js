var fs = require('fs');
function buildHtml(header,body) {
  return '<!DOCTYPE html>' + '<html><header>' + header + '</header><body>' + body + '</body></html>';
};

module.exports={
	generateReport: function(objData){
		var idCliente = (objData._clientId);
    var idPage = new Date().getTime().toString();
    var urlReturn = '';
    //var dirName ='../../reporteCliente/'+idCliente;
    var dirName ='../../../var/www/html/reporteCliente/'+idCliente;
    //console.log(dirName);
    var dirAndPage = dirName+"/"+idPage+".html";
    var header='';
    var body = '';

    if (fs.existsSync(dirName)) {
      console.log("existe carpeta cliente " + idCliente);
    }else{
      console.log("No existe carpeta cliente "+idCliente);
      fs.mkdirSync(dirName)
      console.log("carpeta "+idCliente+" creada");
    }
    var typeRep = objData._type;

    if(typeRep=="bar-chart"){
      //Bar
      header = '<meta charset="UTF-8">'+
                '<script>'+
                'window.onload = function () {'+
                'var chart = new CanvasJS.Chart("chartContainer", {'+
                  'animationEnabled: true,'+
                  'title:{'+
                    'text:"Fortune 500 Companies by Country"'+
                  '},'+
                  'axisX:{'+
                    'interval: 1'+
                  '},'+
                  'axisY2:{'+
                    'interlacedColor: "rgba(1,77,101,.2)",'+
                    'gridColor: "rgba(1,77,101,.1)",'+
                    'title: "Number of Companies"'+
                  '},'+
                  'data: [{'+
                    'type: "bar",'+
                    'name: "companies",'+
                    'axisYType: "secondary",'+
                    'color: "#014D65",'+
                    'dataPoints: ['+
                      '{ y: 3, label: "Sweden" },'+
                      '{ y: 7, label: "Taiwan" },'+
                      '{ y: 5, label: "Russia" },'+
                      '{ y: 9, label: "Spain" },'+
                      '{ y: 7, label: "Brazil" },'+
                      '{ y: 7, label: "India" },'+
                      '{ y: 9, label: "Italy" },'+
                      '{ y: 8, label: "Australia" },'+
                      '{ y: 11, label: "Canada" },'+
                      '{ y: 15, label: "South Korea" },'+
                      '{ y: 12, label: "Netherlands" },'+
                      '{ y: 15, label: "Switzerland" },'+
                      '{ y: 25, label: "Britain" },'+
                      '{ y: 28, label: "Germany" },'+
                      '{ y: 29, label: "France" },'+
                      '{ y: 52, label: "Japan" },'+
                      '{ y: 103, label: "China" },'+
                      '{ y: 134, label: "US" }'+
                    ']'+
                  '}]'+
                '});'+
                'chart.render();'+
                '}'+
                '</script>';
      body = '<div id="chartContainer" style="height: 370px; max-width: 920px; margin: 0px auto;"></div>'+
              '<script src=https://canvasjs.com/assets/script/canvasjs.min.js></script>';
    }else if(typeRep=="pie-chart"){
      //Pie
      header = '<meta charset="UTF-8">'+
                '<script>'+
                'window.onload = function() {'+
                'var chart = new CanvasJS.Chart("chartContainer", {'+
                  'animationEnabled: true,'+
                  'title: {'+
                    'text: "Desktop Search Engine Market Share - 2016"'+
                  '},'+
                  'data: [{'+
                    'type: "pie",'+
                    'startAngle: 240,'+
                    'yValueFormatString: "##0.00\'%\'",'+
                    'indexLabel: "{label} {y}",'+
                    'dataPoints: ['+
                      '{y: 79.45, label: "Google"},'+
                      '{y: 7.31, label: "Bing"},'+
                      '{y: 7.06, label: "Baidu"},'+
                      '{y: 4.91, label: "Yahoo"},'+
                      '{y: 1.26, label: "Others"}'+
                    ']'+
                  '}]'+
                '});'+
                'chart.render();'+
                '}'+
                '</script>';
      body=  '<div id="chartContainer" style="height: 370px; max-width: 920px; margin: 0px auto;"></div>'+
              '<script src=https://canvasjs.com/assets/script/canvasjs.min.js></script>';
    }else if(typeRep=="line-chart"){
      //Line
      header='<meta charset="UTF-8">'+
              '<script>'+
              'window.onload = function () {'+
              'var chart = new CanvasJS.Chart("chartContainer", {'+
                'animationEnabled: true,'+
                'theme: "light2",'+
                'title:{'+
                  'text: "Simple Line Chart"'+
                '},'+
                'axisY:{'+
                  'includeZero: false'+
                '},'+
                'data: [{'+        
                  'type: "line",'+       
                  'dataPoints: ['+
                    '{ y: 450 },'+
                    '{ y: 414},'+
                    '{ y: 520, indexLabel: "highest",markerColor: "red", markerType: "triangle" },'+
                    '{ y: 460 },'+
                    '{ y: 450 },'+
                    '{ y: 500 },'+
                    '{ y: 480 },'+
                    '{ y: 480 },'+
                    '{ y: 410 , indexLabel: "lowest",markerColor: "DarkSlateGrey", markerType: "cross" },'+
                    '{ y: 500 },'+
                    '{ y: 480 },'+
                    '{ y: 510 }'+
                  ']'+
                '}]'+
              '});'+
              'chart.render();'+
              '}'+
              '</script>';
      body = '<div id="chartContainer" style="height: 370px; max-width: 920px; margin: 0px auto;"></div>'+
              '<script src=https://canvasjs.com/assets/script/canvasjs.min.js></script>';
    }else{
      return "no existe ese reporte";
    }

    var stream = fs.createWriteStream(dirAndPage);
    stream.once('open', function(fd) {
      var html = buildHtml(header,body);
      stream.end(html);
    });

    return urlReturn = "http://ec2-54-172-254-2.compute-1.amazonaws.com/reporteCliente/"+idCliente+"/"+idPage+".html";
    //return "http://localhost:3300/"+idCliente+"/"+idPage+".html";
  	}
}

