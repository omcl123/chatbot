
function Reporte(str){
	this._clientId=str["clientID"];
	//console.log(this._clientId);
	//this._type=JSON.stringify(str["type"]).replace(/"/g,'');
	this._type=str['type'];
};



module.exports=Reporte;
