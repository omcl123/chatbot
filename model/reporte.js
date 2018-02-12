
function Reporte(str){
	this._clientId=str["clientID"];
	//console.log(this._clientId);
	this._type=JSON.stringify(str["type"]).replace(/"/g,'');
	
};



module.exports=Reporte;
