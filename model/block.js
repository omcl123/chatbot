const Sequelize = require('sequelize');
const db = 'dbiot';
const user = 'jjarenas26';
const password = 'jjarenas26';
const host = 'dbiot.clnhdetlnsuw.us-east-1.rds.amazonaws.com';
const dialect = 'mysql';

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

function queryblock(preferencesObj){
    let query;
    let key1 ;
    let key2 = preferencesObj.key2.type;
    let key2Id = preferencesObj.key2.id;
    let top = preferencesObj.top;
    let nom1;
    let ind;

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
    return sequelize.query(query, { type: Sequelize.QueryTypes.SELECT });
}

const principalCallback = (response, preferencesObj, jsonBlock) => {
	jsonBlock.clientID = preferencesObj.clientID ;
	jsonBlock.date = new Date() ;
	jsonBlock.start_date = preferencesObj.start_date ;
	jsonBlock.end_date = preferencesObj.end_date ;
	if (preferencesObj.key2.id == -1) {
		jsonBlock.title = `Top ${preferencesObj.top} ${preferencesObj.key1.type}s having most ${preferencesObj.key1.ind}`;
	} else {
		jsonBlock.title = 
		`Top ${preferencesObj.top} ${preferencesObj.key1.type}s having most ${preferencesObj.key1.ind} with ${preferencesObj.key2.type} ID = ${preferencesObj.key2.id}`;
	}
	preferencesObj.data = [];

	return Promise.all(response.map((item) => {
        let part = {};

    	if (preferencesObj.key1.type === 'cliente') {
    		part.idCliente = item.idCliente ;
    		part.nombCliente = item.nombCliente ;
    	} else {
    		part.idProducto = item.idProducto ;
    		part.nombProd = item.nombProd ;
    	}

    	if (preferencesObj.key1.type === 'ventas') {
    		part.subtotal = item.subtotal ;
    	} else {
    		part.cantProd = item.cantProd ;
    	}

        return part;
    }))
    .then(arrayOfParts => {
        jsonBlock.data = arrayOfParts ;
        console.log(jsonBlock) ;
        return jsonBlock;
    });
}

function principal(preferencesObj) {
    let jsonBlock = {};

    return queryblock(preferencesObj)
        .then((response) => principalCallback(response, preferencesObj, jsonBlock))
        .catch((error) => {
            console.log(error);
            throw error;
        });
};



module.exports = {
    principal: principal
};