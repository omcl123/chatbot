
var generador= require("../reporter/genReporte");
var Reporte = require("../model/reporte");

module.exports={

	devuelveUrl: function(str){
		if(str["type1"].localeCompare("help")==0){
			return "Puede pedir 3 tipos de reportes: bar-chart, pie-chart y line-chart";
		}else{
		    report = new Reporte(str);
			//Con los datos de json en str, se hacen las consultas y se forma un nuevo json que se enviará al reporteador.

			var jsonGenerado = JSON.parse('{"clientID":12345678,"title":"titulo para el line","type":"line-chart","legendX":"","legendY":"leyenda de Y","data":[{"label":"linea 1","value":0,"clickable":false,"title":"","type":"","legendX":"","legendY":"","data":[{"label":"fecha 1","value":44,"clickable":true,"title":"titulo para el pie fecha 1 - linea 1","type":"pie-chart","legendX":"","legendY":"","data":[{"label":"datos 1","value":34},{"label":"datos 1.1","value":90}]},{"label":"fecha 2","value":37,"clickable":true,"title":"titulo para el pie fecha 2 - linea 1","type":"pie-chart","legendX":"","legendY":"","data":[{"label":"datos 2","value":34}]}]},{"label":"linea 2","value":0,"clickable":false,"title":"","type":"","legendX":"","legendY":"","data":[{"label":"fecha 1","value":16,"clickable":true,"title":"titulo para el pie fecha 1 - linea 2","type":"pie-chart","legendX":"","legendY":"","data":[{"label":"datos 3","value":45}]},{"label":"fecha 2","value":28,"clickable":true,"title":"titulo para el pie fecha 2 - linea 2","type":"pie-chart","legendX":"","legendY":"","data":[{"label":"datos 4","value":66}]}]}]}');
			return generador.generateReport(jsonGenerado);		
		}
		
	}
	
}
