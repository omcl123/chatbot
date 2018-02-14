var fs = require('fs');
function buildHtml(header,body) {
  return '<!DOCTYPE HTML>' + '<html><head>' + header + '</head><body>' + body + '</body></html>';
};

function createDir(dirName){
    if (fs.existsSync(dirName)) {
      console.log("existe carpeta cliente " + dirName);
    }else{
      console.log("No existe carpeta cliente "+dirName);
      fs.mkdirSync(dirName)
      console.log("carpeta "+dirName+" creada");
    }
};

//{ y: 300878, label: "Venezuela", infoClick:true}
function genDataBar(jsonRep){
  var textDataReturn = '[';
  var numItems = jsonRep['data'].length;
  for (var i = 0; i < numItems; i++) {
    textDataReturn += '{ y:'+jsonRep['data'][i]['value']+', label: "'+jsonRep['data'][i]['label']+'", infoClick:'+jsonRep['data'][i]['clickable']+'}';
    if(i+1!=numItems){
      textDataReturn += ',';
    }
  };
  textDataReturn +=']';
  return textDataReturn;
};

//{ y: 26, name: "School Aid", infoClick:true},
function genDataPie(jsonRep){
  console.log("genera data de pie");
  var textDataReturn = '[';
  var numItems = jsonRep['data'].length;
  //{ y: 300878, label: "Venezuela", infoClick:true}
  for (var i = 0; i < numItems; i++) {
    textDataReturn += '{ y:'+jsonRep['data'][i]['value']+', name: "'+jsonRep['data'][i]['label']+'", infoClick:'+jsonRep['data'][i]['clickable']+'}';
    if(i+1!=numItems){
      textDataReturn += ',';
    }
  };
  textDataReturn +=']';
  return textDataReturn;
};

function buildHeaderBody(objHtml,jsonRep){

  var title = jsonRep['title'];
  var textData = '';
  if(jsonRep['type']=="bar-chart"){
    //Bar
    var legendX = jsonRep['legendX'];
    var legendY = jsonRep['legendY'];
    textData = genDataBar(jsonRep);
    objHtml.header = '<meta charset="UTF-8">'+
                    '<script>'+
                    'window.onload = function () {'+
                    'var chart = new CanvasJS.Chart("chartContainer", {'+
                      'exportEnabled: true,'+
                      'animationEnabled: true,'+
                      'theme: "light2",'+
                      'title:{'+
                        'text: "'+title+'"'+
                      '},'+
                      'axisY: {'+
                        'title: "'+legendY+'"'+
                      '},'+
                      'data: [{'+        
                        'type: "column",'+
                        'click: onClick,'+
                        'showInLegend: true,'+
                        'legendMarkerColor: "grey",'+
                        'legendText: "'+legendX+'",'+
                        'dataPoints: '+ textData +
                      '}]'+
                    '});'+
                    'chart.render();'+
                    'function onClick(e) {'+
                      'if(e.dataPoint.infoClick){'+
                        'alert(e.dataPoint.label);'+
                        'location.href="http://www.google.com.pe";'+
                      '}   '+
                    '}'+
                    '}'+
                    '</script>';
    objHtml.body = '<div id="chartContainer" style="height: 370px; max-width: 920px; margin: 0px auto;"></div>'+
            '<script src=https://canvasjs.com/assets/script/canvasjs.min.js></script>';
  }else if(jsonRep['type']=="pie-chart"){
    //Pie
    textData = genDataPie(jsonRep);
    objHtml.header = '<meta charset="UTF-8">'+
                      '<script>'+
                      'window.onload = function () {'+
                      'var chart = new CanvasJS.Chart("chartContainer", {'+
                        'exportEnabled: true,'+
                        'animationEnabled: true,'+
                        'title:{'+
                          'text: "'+title+'"'+
                        '},'+
                        'data: [{'+
                          'click: onClick,'+
                          'type: "pie",'+
                          'showInLegend: true,'+
                          'toolTipContent: "{name}: <strong>{y}%</strong>",'+
                          'indexLabel: "{name} - {y}%",'+
                          'dataPoints:'+ textData +
                        '}]'+
                      '});'+
                      'chart.render();'+
                      '};'+
                      'function onClick(e) {'+
                        'alert(e.dataPoint.name);'+
                        'location.href="http://www.google.com.pe";'+
                      '}'+
                      '</script>';
    objHtml.body=   '<div id="chartContainer" style="height: 370px; max-width: 920px; margin: 0px auto;"></div>'+
                    '<script src=https://canvasjs.com/assets/script/canvasjs.min.js></script>';
  }else if(jsonRep['type']=="line-chart"){
    //Line
    objHtml.header= '<meta charset="UTF-8">'+
                    '<script>'+
                    'window.onload = function () {'+
                    'var chart = new CanvasJS.Chart("chartContainer", {'+
                      'animationEnabled: true,'+
                      'exportEnabled: true,'+
                      'title:{'+
                        'text: "Gold Medals Won in Olympics"'+             
                      '},'+ 
                      'axisY:{'+
                        'title: "Number of Medals"'+
                      '},'+
                      'toolTip: {'+
                        'shared: true'+
                      '},'+
                      'legend:{'+
                        'cursor:"pointer",'+
                        'itemclick: toggleDataSeries'+
                      '},'+
                      'data: [{'+
                        'click: onClick,'+        
                        'type: "spline",'+  
                        'name: "US",'+        
                        'showInLegend: true,'+
                        'dataPoints: ['+
                          '{ label: "Atlanta 1996" , y: 44 },'+     
                          '{ label:"Sydney 2000", y: 37 },'+     
                          '{ label: "Athens 2004", y: 36 },'+     
                          '{ label: "Beijing 2008", y: 36 },'+     
                          '{ label: "London 2012", y: 46 },'+
                          '{ label: "Rio 2016", y: 46 }'+
                        ']'+
                      '},'+ 
                      '{'+
                        'click: onClick,'+ 
                        'type: "spline",'+
                        'name: "China",'+        
                        'showInLegend: true,'+
                        'dataPoints: ['+
                          '{ label: "Atlanta 1996" , y: 16 },'+     
                          '{ label:"Sydney 2000", y: 28 },'+     
                          '{ label: "Athens 2004", y: 32 },'+     
                          '{ label: "Beijing 2008", y: 48 },'+     
                          '{ label: "London 2012", y: 38 },'+
                          '{ label: "Rio 2016", y: 26 }'+
                        ']'+
                      '}]'+
                    '});'+
                    'chart.render();'+
                    'function toggleDataSeries(e) {'+
                      'if(typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {'+
                        'e.dataSeries.visible = false;'+
                      '}'+
                      'else {'+
                        'e.dataSeries.visible = true;'+            
                      '}'+
                      'chart.render();'+
                    '}'+
                    '};'+
                    'function onClick(e) {'+
                      'alert(e.dataPoint.label +" - "+ e.dataPoint.y + " - " + e.dataSeries.name);'+
                      'location.href="http://www.google.com.pe";'+
                    '}'+
                    '</script>';
    objHtml.body = '<div id="chartContainer" style="height: 370px; max-width: 920px; margin: 0px auto;"></div>'+
            '<script src=https://canvasjs.com/assets/script/canvasjs.min.js></script>';
  }else{
    return "No existe ese reporte";
  }
}

module.exports={
  
	generateReport: function(jsonData){
		var idCliente = jsonData['clientID'];
    var typeRep = jsonData["type"];
    var idPage = new Date().getTime().toString();
    var urlReturn = '';
    //localhost
    var dirName ='./'+idCliente;
    //servidor
    //var dirName ='../../../var/www/html/reporteCliente/'+idCliente;
    
    var dirAndPage = dirName+"/"+idPage+".html";
    var paramHtml ={header:'',body:''};
    //var header='';
    //var body = '';

    createDir(dirName);

    buildHeaderBody(paramHtml,jsonData);

    var stream = fs.createWriteStream(dirAndPage);
    stream.once('open', function(fd) {
      var html = buildHtml(paramHtml.header,paramHtml.body);
      stream.end(html);
    });
    //servidor
    //return urlReturn = "http://ec2-54-172-254-2.compute-1.amazonaws.com/reporteCliente/"+idCliente+"/"+idPage+".html";
    //localhost
    return "http://localhost:3300/"+idCliente+"/"+idPage+".html";
  	}

}

