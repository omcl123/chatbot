var mysql= require('mysql');
var con =mysql.createConnection({
	host:"dbiot.clnhdetlnsuw.us-east-1.rds.amazonaws.com",
	user:"jjarenas26",
	password:"jjarenas26",
	database: "dbiot"
})

function queryNivel1BarPie(str,callback){
	var key,parameter,operation;
	if(str["key"].localeCompare("producto")==0){
		key="idProducto";
	}else if(str["key"].localeCompare("cliente")==0){
		key="idCliente";
	}else 
		key="subtotal";
	if(str["parameter1"]["type"].localeCompare("producto")==0){
		parameter="cantProd";
	}else if(str["parameter1"]["type"].localeCompare("cliente")==0){
		parameter="idCliente";
	}else{
		parameter="subtotal";
	}
	operation=str["parameter1"]["operation"];
	var query="SELECT "+key+" as "+str["key"] +", "+operation+"("+parameter+")"+" as "+str["parameter1"]["type"] +" FROM ventas "+
	"WHERE fechaVenta BETWEEN CAST('"+str["start_date"]+"' as DATE) and CAST('"+str["end_date"]
	+"' as DATE) GROUP BY "+key;
	con.query(query,function(err,result){
		if(err)
			callback(err,null);
		else
			callback(null,result);
	});
}

function queryNivel2BarPie(str,param,callback){
	if(str["type1"].localeCompare("line-chart")==0){
		
	}else{
		var parameter,operation,param2;
		if(str["parameter2"]["type"].localeCompare("producto")==0){
			param2="idProducto";
		}else if(str["parameter2"]["type"].localeCompare("cliente")==0){
			param2="idCliente";
		}else 
			param2="subtotal";
		if(str["parameter1"]["type"].localeCompare("producto")==0){
			parameter="cantProd";
		}else if(str["parameter1"]["type"].localeCompare("cliente")==0){
			parameter="idCliente";
		}else{
			parameter="subtotal";
		}
		if(str["key"].localeCompare("producto")==0){
			key="idProducto";
		}else if(str["key"].localeCompare("cliente")==0){
			key="idCliente";
		}else 
			key="subtotal";
		operation=str["parameter1"]["operation"];	
		query="SELECT "+param2+", "+operation+"("+parameter+") FROM ventas "+
		"WHERE fechaVenta BETWEEN CAST('"+str["start_date"]+"' as DATE) and CAST('"+str["end_date"]
		+"' as DATE) and "+key+"="+param+" GROUP BY "+param2;
		console.log(query);
		//con.query(query,function(err,result){
		if(err)
			callback(err,null);
		else
			callback(null,result);
	});
	}
}

function queryNivel1Line(str,callback){
	var key, operation;
	operation=str["key"]["operation"];
	if(str["key"]["type"].localeCompare("producto")==0){
		key="cantProd";
	}else if(str["key"]["type"].localeCompare("cliente")==0){
		key="idCliente";
	}else 
		key="subtotal";
	var query="select concat(YEAR(fechaVenta),MONTH(fechaVenta))as fecha,"+operation+"("+key+") "+
		"from dbiot.ventas "
		+"where fechaVenta BETWEEN CAST('"+str["start_date"]+"' as DATE) and "
		+"CAST('"+str["end_date"]+"' as DATE)"
		+"group by YEAR(fechaVenta),MONTH(fechaVenta) DESC";
	
	con.query(query,function(err,result){
		if(err)
			callback(err,null);
		else
			callback(null,result);
	});
}

function Reporte(str){
	this._clientId=str["clientID"];
	this._type=str['type1'];
	if(str['type1'].localeCompare("line-chart")==0){
		queryNivel1Line(str,function(err,data){
			if(err){
				console.log(err);
			}
			else{
				console.log("query realizado");
				console.log(data);
				
			}
		});
	}else{
		queryNivel1BarPie(str,function(err,data){
			if(err){
				console.log(err);
			}
			else{
				console.log("query realizado");
				console.log(data);
				var key=str["key"];
				console.log(key);
				Object.keys(data).forEach(function(key){
					var row;
					if(str["key"].localeCompare("producto")==0)
						row=data[key].producto;
					else if (str["key"].localeCompare("cliente")==0)
						row=data[key].cliente;
					else
						row=data[key].venta;
					console.log(row);
					queryNivel2BarPie(str,row,function(err,data){
						if(err){
							console.log(err);
						}
						else{
							//console.log("query drilldown");
							console.log(data);
						}
					});
				});
			}
		});
	}
};



module.exports=Reporte;
