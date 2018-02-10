
function Reporte(str){
	this._clientId=str["clientID"];
	//console.log(this._clientId);
	this._type=JSON.stringify(str["type"]);
	
};

Reporte.prototype.getAtt=function (){
	return("{'reporte': "+this._type+",'ID':"+this._clientId+" }");
}

module.exports=Reporte;
