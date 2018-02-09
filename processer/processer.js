
var generador= require("../reporter/genReporte");
var Reporte = require("../model/reporte");

module.exports={
	devuelveUrl: function(str){
		report = new Reporte(str);
		console.log("HOla");
		return generador.generateReport(report);
	}
}
