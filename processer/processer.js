
var generador= require("../reporter/genReporte");
var Reporte = require("../model/reporte");

module.exports={
	devuelveUrl: function(str){
		report = new Reporte(str);
		//console.log("json="+str);
		return generador.generateReport(report);
	}
}
