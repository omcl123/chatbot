const Sequelize = require('sequelize');
const db = 'dbiot';
const user = 'jjarenas26';
const password = 'jjarenas26';
const host = 'dbiot.clnhdetlnsuw.us-east-1.rds.amazonaws.com';
const dialect = 'mysql';
const timeInterval = 1000;
const maxTime = 10000;

const sequelize = new Sequelize(db, user, password, {
  host: host,
  dialect: dialect,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
});

function evaluateConditions(preferencesObj,tablesQuery){
	if(Math.floor(Math.random()*10)>5){
		return false;
	}else{
		return true;
	}
}

function checkConditions(preferencesObj){
	
    let query;
    let key1 ;
    let key2 = preferencesObj.key2.type;
    let key2Id = preferencesObj.key2.id;
    let top = preferencesObj.top;
    let nom1;
    let ind;
    
    let cont = 0; 
	/*
    if (preferencesObj.key1.type === 'cliente') {
        key1 = 'idCliente';
        nom1 = 'nombCliente';
    } else if (preferencesObj.key1.type === 'producto') {
        key1 = 'idProducto';
        nom1 = 'nombProd';
    } 

    if (preferencesObj.key2.type === 'cliente') {
        key2 = 'idCliente';
    } else if (preferencesObj.key2.type === 'producto') {
        key2 = 'idProducto';
    }

    if (preferencesObj.key1.ind === 'ventas') {
        ind = 'subtotal';
    } else if (preferencesObj.key1.ind === 'cantProd') {
        ind = 'cantProd';
    }

    if (preferencesObj.key2.id == -1) {
        query =`SELECT ${key1} as ${key1}, ${nom1} as ${nom1}, sum(${ind}) as ${ind}
        FROM ventas
        WHERE fechaVenta
        BETWEEN CAST('${preferencesObj.start_date}' as DATE) and CAST('${preferencesObj.end_date}' as DATE)
        GROUP BY ${key1}
        ORDER BY sum(${ind}) DESC LIMIT ${top}`;
    } else {
        query =`SELECT ${key1} as ${key1}, ${nom1} as ${nom1}, sum(${ind}) as ${ind}
        FROM ventas
        WHERE fechaVenta
        BETWEEN CAST('${preferencesObj.start_date}' as DATE) and CAST('${preferencesObj.end_date}' as DATE)
        and ${key2} = ${key2Id}
        GROUP BY ${key1}
        ORDER BY sum(${ind}) DESC LIMIT ${top}`;
    }
    //return sequelize.query(query, { type: Sequelize.QueryTypes.SELECT });
	*/
    const intervalObj = setInterval(() => {

	  //var result = sequelize.query(query, { type: Sequelize.QueryTypes.SELECT });
	  var result=1; 
	  cont++;
	  if(evaluateConditions(preferencesObj,result)){
	  	clearInterval(intervalObj);
	  	console.log("Alert!")
	  	return ">>alert!";
	  }else if(cont*timeInterval > maxTime){
	  	console.log("time exceeded");
	  	return ">>time exceeded!";
	  }else{
	  	console.log('waiting...');
	  }
	}, timeInterval);
}

function principal(preferencesObj) {
	
    let jsonBlock = {};
/*
    return checkConditions(preferencesObj)
        .catch((error) => {
        	console.log("error:");
            console.log(error);
            throw error;
        });
*/
    return checkConditions(preferencesObj);
};

module.exports = {
    principal: principal
};