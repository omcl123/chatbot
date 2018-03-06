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
    let key2 = preferencesObj.key2Type;
    let key2Id = preferencesObj.key2Id;
    let top = preferencesObj.top;
    let nom1;
    let ind;

    if (preferencesObj.key1Type === 'cliente') {
        key1 = 'idCliente';
        nom1 = 'nombCliente';
    } else if (preferencesObj.key1Type === 'producto') {
        key1 = 'idProducto';
        nom1 = 'nombProd';
    } 

    if (preferencesObj.key2Type === 'cliente') {
        key2 = 'idCliente';
    } else if (preferencesObj.key2Type === 'producto') {
        key2 = 'idProducto';
    }

    if (preferencesObj.key1Ind === 'ventas') {
        ind = 'subtotal';
    } else if (preferencesObj.key1Ind === 'cantProd') {
        ind = 'cantProd';
    }

    if (preferencesObj.key2Id == -1) {
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

const principalCallback = async (response, preferencesObj) => {
    let jsonBlock = {};

	jsonBlock.clientID = preferencesObj.clientID ;
	jsonBlock.date = new Date() ;
	jsonBlock.start_date = preferencesObj.start_date ;
	jsonBlock.end_date = preferencesObj.end_date ;
	if (preferencesObj.key2Id == -1) {
		jsonBlock.title = `Top ${preferencesObj.top} ${preferencesObj.key1Type}s having most ${preferencesObj.key1Ind}`;
	} else {
		jsonBlock.title = 
		`Top ${preferencesObj.top} ${preferencesObj.key1Type}s having most ${preferencesObj.key1Ind} with ${preferencesObj.key2Type} ID = ${preferencesObj.key2Id}`;
	}

    let arrayOfParts =  await Promise.all(response.map((item) => {
        let part = {};

        if (preferencesObj.key1Type === 'cliente') {
            part.idCliente = item.idCliente ;
            part.nombCliente = item.nombCliente ;
        } else {
            part.idProducto = item.idProducto ;
            part.nombProd = item.nombProd ;
        }

        if (preferencesObj.key1Type === 'ventas') {
            part.subtotal = item.subtotal ;
        } else {
            part.cantProd = item.cantProd ;
        }

        return part;
    }));
    jsonBlock.data = await arrayOfParts;
    return jsonBlock;
}

async function principal(preferencesObj) {
    let jsonBlock = {};
    try {
        let response = await queryblock(preferencesObj);
        let jsonBlock = await principalCallback(response, preferencesObj);
        return jsonBlock;
    } catch (e) {
      console.log('Reporter module error in principal function');
      console.log(e);
    }
};



module.exports = {
    principal: principal
};