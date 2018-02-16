var mysql= require('mysql');

var con =mysql.createConnection({
	host:"dbiot.clnhdetlnsuw.us-east-1.rds.amazonaws.com",
	user:"jjarenas26",
	password:"jjarenas26",
	database: "dbiot"
})

function queryReportNivel2(str,repJson,param,callback){
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
		query="SELECT concat("+key+") as "+str["key2"]+", "+operation+"("+parameter+") as valor"+
		" FROM ventas "+
		"WHERE fechaVenta BETWEEN CAST('"+str["start_date"]+"' as DATE) and CAST('"+str["end_date"]
		+"' as DATE) and "+ condition+" GROUP BY "+key;
	}else{
		query="SELECT "+key+" as "+str["key2"]+", "+operation+"("+parameter+") as valor"+
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

function queryReportNivel1(str,repJson,callback){
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
		query="SELECT concat("+key+") as "+str["key1"]+", "+operation+"("+parameter+") as valor"+
		" FROM ventas "+
		"WHERE fechaVenta BETWEEN CAST('"+str["start_date"]+"' as DATE) and CAST('"+str["end_date"]
		+"' as DATE) GROUP BY "+key;
	}else{
		query="SELECT "+key+" as "+str["key1"]+", "+operation+"("+parameter+") as valor"+
		" FROM ventas "+
		"WHERE fechaVenta BETWEEN CAST('"+str["start_date"]+"' as DATE) and CAST('"+str["end_date"]
		+"' as DATE) GROUP BY "+key;
	}
	con.query(query,function(err,result){
		if(err)
			callback(err,null);
		else{
			callback(null,result);
		}
	});
}


function Reporte(str){
	var repJson ={};
	repJson["clientID"]=str["clientID"];
	repJson["title"]="";
	repJson["type"]=str["type1"];
	if(str["type1"].localeCompare("pie-chart")){
		repJson["legendX"]="";
		repJson["legendY"]="";
	}else if(str["type1"].localeCompare("bar-chart")){
		repJson["legendX"]=str["key1"];
		repJson["legendY"]=str["param"]["type"];
	}else {
		repJson["legendX"]="";
		repJson["legendY"]=str["param"]["type"];
	}
	repJson["data"]= [];
	//console.log(repJson);
	queryReportNivel1(str,repJson,function(err,data){
		//console.log(repJson);
		if(err){
			console.log(err);
		}
		else{
			console.log("query realizado");
			var i=0;
			//console.log(data);	
			for(var key = 0; key < data.length; key++){
				//console.log(repJson);
				var row;
				var part={};
				if(str["key1"].localeCompare("producto")==0){
					row=data[key].producto;
					part["label"]=data[key].producto;
				}
				else if(str["key1"].localeCompare("cliente")==0){
					row= data[key].cliente;
					part["label"]=data[key].cliente;
				}
				else{
					row=data[key].tiempo;
					part["label"]=data[key].tiempo;
				}
				//console.log(row);
				//console.log(data[key].valor);
				part["value"]=data[key].valor;
				part["clickable"]="";
				part["title"]="";
				part["type"]="";
				part["legendX"]="";
				part["legendY"]="";
				
				//console.log(part);
/*				queryReportNivel2(str,repJson,row,function(err,data){
					if(err){
							console.log(err);
					}
					else{
						//console.log("query drilldown");
						console.log(data);
					}
				});*/
				repJson["data"].push(part);
				i++;
			}
		}
		repJson=JSON.stringify(repJson);
		console.log("jsonfinal:"+repJson);
	});
	console.log(repJson);
};



module.exports=Reporte;