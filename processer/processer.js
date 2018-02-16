
var generador= require("../reporter/genReporte");
var Reporte = require("../model/reporte");


function devuelveUrl(str,url){
	return new Promise(function(resolve,reject){
		var repJson={};
		Reporte.principal(str,repJson).then(function(err){
			//console.log("entro");
			//console.log(repJson);
			repJson=JSON.stringify(repJson);
			repJson=JSON.parse(repJson);
			url=generador.generateReport(repJson);
			
			if 
				(err) reject(err);
			else{
				console.log(url);
				resolve(url);	
			}
				
		});
	});
	
	//var jsonGenerado = JSON.parse('{"clientID":12345678,"title":"titulo para el pie","type":"pie-chart","legendX":"","legendY":"","data":[{"label":"pizza 1","value":40,"clickable":true,"title":"titulo del line - pizza 1","type":"line-chart","legendX":"","legendY":"","data":[{"label":"linea 1","value":0,"clickable":false,"title":"","type":"","legendX":"","legendY":"","data":[{"label":"fecha 1","value":44},{"label":"fecha 2","value":37}]}]},{"label":"pizza 2","value":80,"clickable":true,"title":"titulo del line - pizza 2","type":"line-chart","legendX":"","legendY":"","data":[{"label":"linea 2","value":0,"clickable":false,"title":"","type":"","legendX":"","legendY":"","data":[{"label":"fecha 1","value":16},{"label":"fecha 2","value":28}]}]}]}');
	
}



module.exports={

	devuelveUrl:devuelveUrl
	
}
