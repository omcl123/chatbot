var mysql= require('mysql');
var con =mysql.createConnection({
	host:"dbiot.clnhdetlnsuw.us-east-1.rds.amazonaws.com",
	user:"jjarenas26",
	password:"jjarenas26",
	database: "dbiot"
})

function queryReportNivel2(str,param,callback){
	var key,parameter,operation;
	if(str["key2"].localeCompare("cliente")==0){
		key="idCliente";
	}else if(str["key2"].localeCompare("producto")==0){
		key="idProducto";
	}else if(str["key2"].localeCompare("tiempo")==0){
		key="YEAR(fechaVenta),MONTH(fechaVenta)";
	}
	parameter=str["param"]["type"];
	operation=str["param"]["operation"];
	var query;
	var condition;
	if(str["key1"].localeCompare("tiempo")==0){
		condition="concat(YEAR(fechaVenta),MONTH(fechaVenta)) like "+param;
	}else if (str["key1"].localeCompare("cliente")==0){
		condition=" idCliente = "+param;
	}else{
		condition=" idProducto = "+param;
	}
	if(str["key2"].localeCompare("tiempo")==0){
		query="SELECT concat("+key+") as "+str["key2"]+", "+operation+"("+parameter+")"+
		" FROM ventas "+
		"WHERE fechaVenta BETWEEN CAST('"+str["start_date"]+"' as DATE) and CAST('"+str["end_date"]
		+"' as DATE) and "+ condition+" GROUP BY "+key;
	}else{
		query="SELECT "+key+" as "+str["key2"]+", "+operation+"("+parameter+")"+
		" FROM ventas "+
		"WHERE fechaVenta BETWEEN CAST('"+str["start_date"]+"' as DATE) and CAST('"+str["end_date"]
		+"' as DATE) and "+ condition+" GROUP BY "+key;
	}
	con.query(query,function(err,result){
		if(err)
			callback(err,null);
		else
			callback(null,result);
	});
}

function queryReportNivel1(str,callback){
	var key,parameter,operation;
	parameter=str["param"]["type"];
	operation=str["param"]["operation"];
	if(str["key1"].localeCompare("cliente")==0){
		key="idCliente";
	}else if(str["key1"].localeCompare("producto")==0){
		key="idProducto";
	}else if(str["key1"].localeCompare("tiempo")==0){
		key="YEAR(fechaVenta),MONTH(fechaVenta)";
	}
	var query;
	if(str["key1"].localeCompare("tiempo")==0){
		query="SELECT concat("+key+") as "+str["key1"]+", "+operation+"("+parameter+")"+
		" FROM ventas "+
		"WHERE fechaVenta BETWEEN CAST('"+str["start_date"]+"' as DATE) and CAST('"+str["end_date"]
		+"' as DATE) GROUP BY "+key;
	}else{
		query="SELECT "+key+" as "+str["key1"]+", "+operation+"("+parameter+")"+
		" FROM ventas "+
		"WHERE fechaVenta BETWEEN CAST('"+str["start_date"]+"' as DATE) and CAST('"+str["end_date"]
		+"' as DATE) GROUP BY "+key;
	}
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
	queryReportNivel1(str,function(err,data){
		if(err){
			console.log(err);
		}
		else{
			console.log("query realizado");
			console.log(data);	
			Object.keys(data).forEach(function(key){
				var row;
				if(str["key1"].localeCompare("producto")==0)
					row=data[key].producto;
				else if(str["key1"].localeCompare("cliente")==0)
					row= data[key].cliente;
				else
					row=data[key].tiempo;
				console.log(row);
				queryReportNivel2(str,row,function(err,data){
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
};



module.exports=Reporte;
