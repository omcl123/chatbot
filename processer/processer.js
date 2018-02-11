
var generador= require("../reporter/genReporte");
var Reporte = require("../model/reporte");

module.exports={

	devuelveUrl: function(str){
		if(str["type"].localeCompare("help")==0){
			return "Puede pedir 3 tipos de reportes: bar-chart, pie-chart y line-chart";
		}else{
		    report = new Reporte(str);
			//console.log("json="+str);
			return generador.generateReport(report);		
		}
		
	}
	
}
