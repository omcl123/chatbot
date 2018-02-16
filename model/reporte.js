var mysql= require('mysql');
var Promise=require('bluebird');
var con =mysql.createConnection({
	host:"dbiot.clnhdetlnsuw.us-east-1.rds.amazonaws.com",
	user:"jjarenas26",
	password:"jjarenas26",
	database: "dbiot"
})

function queryReportNivel2(str,repJson,param,part){
	return new Promise(function(resolve,reject){
		//console.log(part);
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
		//console.log(query);
		con.query(query,function(err,result){
			if(err)
				reject(err);
			else{
				//console.log(result);
				resolve(result);
			}
		});			
	});	
}

function queryReportNivel1(str,repJson){
	return new Promise(function(resolve,reject){
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
		console.log(query);
		con.query(query,function(err,result2){
			if(err)
				reject(err);
			else{
				
				resolve(result2);
			}
		});			
		
	});
}


function principal(str,repJson){
	//console.log(repJson);
	return queryReportNivel1(str,repJson).then(function(result){
		repJson["clientID"]=str["clientID"];
		repJson["title"]="";
		repJson["type"]=str["type1"];
		if(str["type1"].localeCompare("pie-chart")==0){
			repJson["legendX"]="";
			repJson["legendY"]="";
		}else if(str["type1"].localeCompare("bar-chart")==0){
			repJson["legendX"]=str["key1"];
			repJson["legendY"]=str["param"]["type"];
		}else {
			repJson["legendX"]="";
			repJson["legendY"]=str["param"]["type"];
		}
		repJson["data"]= [];
		//console.log(repJson);
		console.log("query realizado");
		var i=0;
		var promises = [];
		//console.log(data);	
		for(var key = 0; key < result.length; key++){
			//console.log(repJson);
			var row;
			var part={};
			if(str["key1"].localeCompare("producto")==0){
				row=result[key].producto;
				part["label"]=result[key].producto;
			}
			else if(str["key1"].localeCompare("cliente")==0){
				row= result[key].cliente;
				part["label"]=result[key].cliente;
			}
			else{
				row=result[key].tiempo;
				part["label"]=result[key].tiempo;
			}
			//console.log(row);
			//console.log(data[key].valor);
			part["value"]=result[key].valor;
			part["clickable"]="true";
			part["title"]="";
			part["type"]=str["type2"];
			if(str["type2"].localeCompare("pie-chart")==0){
				part["legendX"]="";
				part["legendY"]="";
			}else if(str["type2"].localeCompare("bar-chart")==0){
				part["legendX"]=str["key2"];
				part["legendY"]=str["param"]["type"];
			}else {
				part["legendX"]="";
				part["legendY"]=str["param"]["type"];
			}
			part["data"]=[];
			//console.log(part);
			//console.log(row);
			var auxarray=[];
			promises.push(queryReportNivel2(str,repJson,row,part).then(function(result2){
				//console.log(result2.length);
				//console.log(result2);
				for(var key2 = 0; key2 < result2.length; key2++){
					var innerpart={};
					if(str["key2"].localeCompare("producto")==0){
						row2=result2[key2].producto;
						innerpart["label"]=result2[key2].producto;
					}
					else if(str["key2"].localeCompare("cliente")==0){
						row2= result2[key2].cliente;
						innerpart["label"]=result2[key2].cliente;
					}
					else{
						row2=result2[key2].tiempo;
						innerpart["label"]=result2[key2].tiempo;
					}
					innerpart["value"]=result2[key2].valor;
					//console.log("innerpart")
					//console.log(innerpart);
					auxarray.push(innerpart);
				}
			}).then(function(){
				console.log("entre aqui");
				part["data"]=auxarray;
				console.log(part);
				auxarray=[];
			}).catch(function (error){
				console.log(error);
			}));
			repJson["data"].push(part);
			i++;
		}
		return Promise.all(promises);
		console.log(partsMay);
		repJson=JSON.stringify(repJson);
		//console.log("json1:"+repJson);
	}).catch(function (error){
		console.log(error);
	});
};



module.exports={principal:principal};