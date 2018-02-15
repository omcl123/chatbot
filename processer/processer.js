
var generador= require("../reporter/genReporte");
var Reporte = require("../model/reporte");

module.exports={

	devuelveUrl: function(str){
		//if(str["type1"].localeCompare("help")==0){
		if(str["type1"]=="help"){
			return "Puede pedir 3 tipos de reportes: bar-chart, pie-chart y line-chart";
		}else{
		    report = new Reporte(str);
			//Con los datos de json en str, se hacen las consultas y se forma un nuevo json que se enviará al reporteador.

			var jsonGenerado = JSON.parse('{"clientID":12345678,"title":"titulo para el bar","type":"bar-chart","legendX":"","legendY":"leyenda de Y","data":[{"label":"columna 1","value":40,"clickable":true,"title":"titulo de pizza 1","type":"pie-chart","legendX":"","legendY":"","data":[{"label":"pizza 1","value":44},{"label":"pizza 2","value":37}]},{"label":"columna 2","value":80,"clickable":true,"title":"titulo de pizza 2","type":"pie-chart","legendX":"","legendY":"","data":[{"label":"pizza 1.1","value":16},{"label":"pizza 2.2","value":28}]}]}');
			return generador.generateReport(jsonGenerado);		
		}
		
	}
	
}
