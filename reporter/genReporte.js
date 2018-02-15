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
function genDataBarAndChilds(jsonRep,lastGraph){
  var textDataReturn = '[';
  var numItems = jsonRep['data'].length;
  for (var i = 0; i < numItems; i++) {
    textDataReturn += '{ y:'+jsonRep['data'][i]['value']+', label: "'+jsonRep['data'][i]['label']+ '"';
                      
    if(lastGraph){
      textDataReturn += ', infoClick: false';
    }else{
      textDataReturn += ', infoClick:'+jsonRep['data'][i]['clickable'];
    }

    textDataReturn += '}';
    if(i+1!=numItems){
      textDataReturn += ',';
    }
  };
  textDataReturn +=']';
  return textDataReturn;
};

//{ y: 26, name: "School Aid", infoClick:true},
function genDataPieAndChilds(jsonRep,lastGraph){
  var textDataReturn = '[';
  var numItems = jsonRep['data'].length;
  //{ y: 300878, label: "Venezuela", infoClick:true}
  for (var i = 0; i < numItems; i++) {
    textDataReturn += '{ y:'+jsonRep['data'][i]['value']+', name: "'+jsonRep['data'][i]['label']+ '"';
                      
    if(lastGraph){
      textDataReturn += ', infoClick: false';
    }else{
      textDataReturn += ', infoClick:'+jsonRep['data'][i]['clickable'];
    }

    textDataReturn += '}';
    if(i+1!=numItems){
      textDataReturn += ',';
    }
  };
  textDataReturn +=']';
  return textDataReturn;
};

function genDataLineAndChilds(jsonRep,lastGraph,dirName,namePage){
  var textDataReturn = '[';
  var cantLineas = jsonRep['data'].length;
  var numEpocas = -1;

  for (var i = 0; i < cantLineas; i++) {
    textDataReturn += '{click: onClick,type: "spline",name: "'+ jsonRep['data'][i]['label'] +
                      '",showInLegend: true,dataPoints: [';

    numEpocas = jsonRep['data'][i]['data'].length;
    for(var j = 0; j < numEpocas; j++){

      textDataReturn += '{ label:"'+ jsonRep['data'][i]['data'][j]['label'] +
                      '", y:'+ jsonRep['data'][i]['data'][j]['value'];
      if(lastGraph){
        textDataReturn += ', infoClick: false';
      }else{
        console.log("i:"+i+" j:"+j);
        textDataReturn += ', infoClick:'+jsonRep['data'][i]['data'][j]['clickable'];
        var paramHtmlChild ={header:'',body:''};
        var newNamePage = namePage +"-" +jsonRep['data'][i]['label']+"-" +jsonRep['data'][i]['data'][j]['label'];
        var newdirAndPage = dirName+"/"+newNamePage+".html"; 
        //newNamePage = encodeURI(newNamePage);
        buildHeaderBody(paramHtmlChild,jsonRep['data'][i]['data'][j],dirName,newNamePage,true);
        createPage(newdirAndPage,paramHtmlChild);
      }

      textDataReturn += '}';
      if(j+1!=numEpocas){
        textDataReturn += ',';
      }
    }
    textDataReturn += ']}';
    if(i+1!=cantLineas){
      textDataReturn += ',';
    }
  };
  textDataReturn +=']';
  return textDataReturn;
};

function buildHeaderBody(objHtml,jsonRep,dirName,namePage,lastGraph){

  var title = jsonRep['title'];
  var legendY = '';
  var legendX = '';
  var textData = '';
  if(jsonRep['type']=="bar-chart"){
    //Bar
    legendX = jsonRep['legendX'];
    legendY = jsonRep['legendY'];
    textData = genDataBarAndChilds(jsonRep,lastGraph,dirName,namePage);
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
    textData = genDataPieAndChilds(jsonRep,lastGraph,dirName,namePage);
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
    textData = genDataLineAndChilds(jsonRep,lastGraph,dirName,namePage);
    legendY = jsonRep['legendY'];
    objHtml.header= '<meta charset="UTF-8">'+
                    '<script>'+
                    'window.onload = function () {'+
                    'var chart = new CanvasJS.Chart("chartContainer", {'+
                      'animationEnabled: true,'+
                      'exportEnabled: true,'+
                      'title:{'+
                        'text: "'+title+'"'+             
                      '},'+ 
                      'axisY:{'+
                        'title: "'+legendY+'"'+
                      '},'+
                      'toolTip: {'+
                        'shared: true'+
                      '},'+
                      'legend:{'+
                        'cursor:"pointer",'+
                        'itemclick: toggleDataSeries'+
                      '},'+
                      'data:'+textData+
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
                      'if(e.dataPoint.infoClick){'+
                      //'location.href=encodeURI('+namePage+'+ "-"+ e.dataSeries.name + "-" + e.dataPoint.label'+')+".html";}'+
                      'location.href='+namePage+'+ "-"+ e.dataSeries.name + "-" + e.dataPoint.label +'+'".html";}'+
                    '}'+
                    '</script>';
    objHtml.body = '<div id="chartContainer" style="height: 370px; max-width: 920px; margin: 0px auto;"></div>'+
            '<script src=https://canvasjs.com/assets/script/canvasjs.min.js></script>';
  }else{
    return "No existe ese reporte";
  }
}

function createPage(dirAndPage,paramHtml){
  var stream = fs.createWriteStream(dirAndPage);
  stream.once('open', function(fd) {
    var html = buildHtml(paramHtml.header,paramHtml.body);
    stream.end(html);
  });
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

    createDir(dirName);

    buildHeaderBody(paramHtml,jsonData,dirName,idPage,false);

    createPage(dirAndPage,paramHtml);

    //servidor
    //return urlReturn = "http://ec2-54-172-254-2.compute-1.amazonaws.com/reporteCliente/"+idCliente+"/"+idPage+".html";
    //localhost
    return "http://localhost:3300/"+idCliente+"/"+idPage+".html";
  	}

}

