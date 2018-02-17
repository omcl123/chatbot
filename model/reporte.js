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

// var con = mysql.createConnection({
//     host:"dbiot.clnhdetlnsuw.us-east-1.rds.amazonaws.com",
//     user:"jjarenas26",
//     password:"jjarenas26",
//     database: "dbiot"
// })


function queryReportNivel2(preferencesObj, param){
    let key
    let parameter = preferencesObj.param.type;
    let operation = preferencesObj.param.operation;

    if (preferencesObj.key2 === 'cliente') {
        key = "idCliente";
    } else if (preferencesObj.key2 === 'producto') {
        key = "idProducto";
    } else if (preferencesObj.key2 === 'tiempo') {
        key = "YEAR(fechaVenta),MONTH(fechaVenta)";
    }

    let query;
    let condition;

    if (preferencesObj.key1 === 'tiempo') {
        condition = `concat(YEAR(fechaVenta),MONTH(fechaVenta)) like ${param}`;
    } else if (preferencesObj.key1 === 'cliente') {
        condition = ` idCliente = ${param}`;
    } else {
        condition = ` idProducto = ${param}`;
    }

    if (preferencesObj.key2 === 'tiempo') {
        query = `SELECT concat(${key}) as ${preferencesObj.key2}, ${operation}(${parameter}) as valor
        FROM ventas
        WHERE fechaVenta
        BETWEEN CAST('${preferencesObj.start_date}' as DATE) and CAST('${preferencesObj.end_date}' as DATE) and ${condition}
        GROUP BY ${key};`
    } else {
        query = `SELECT ${key} as ${preferencesObj.key2}, ${operation}(${parameter}) as valor
        FROM ventas
        WHERE fechaVenta
        BETWEEN CAST('${preferencesObj.start_date}' as DATE) and CAST('${preferencesObj.end_date}' as DATE) and ${condition}
        GROUP BY ${key}`;
    }

    return sequelize.query(query, { type: Sequelize.QueryTypes.SELECT });
}

function queryReportNivel1(preferencesObj){
    let key;
  let query;
    console.log(preferencesObj)
    let parameter = preferencesObj.param.type;
    let operation = preferencesObj.param.operation;

    if (preferencesObj.key1 === 'cliente') {
        key = 'idCliente';
    } else if (preferencesObj.key1 === 'producto') {
        key = 'idProducto';
    } else if (preferencesObj.key1 === 'tiempo') {
        key = 'YEAR(fechaVenta), MONTH(fechaVenta)';
        query = `SELECT concat(${key}) as ${preferencesObj.key1}, ${operation}(${parameter}) as valor
        FROM ventas
        WHERE fechaVenta
        BETWEEN CAST('${preferencesObj.start_date}' as DATE) and CAST('${preferencesObj.end_date}' as DATE)
        GROUP BY ${key}`;
    }

    if (preferencesObj.key1 !== 'tiempo') {
        query = `SELECT ${key} as ${preferencesObj.key1}, ${operation}(${parameter}) as valor
        FROM ventas
        WHERE fechaVenta
        BETWEEN CAST('${preferencesObj.start_date}' as DATE) and CAST('${preferencesObj.end_date}' as DATE)
        GROUP BY ${key}`;
    }

    return sequelize.query(query, { type: Sequelize.QueryTypes.SELECT });
}

const principalCallback = async (response, preferencesObj) => {
  let repJson = {};

  repJson.clientID = preferencesObj.clientID;
  repJson.title = "";
  repJson.type = preferencesObj.type1;

  if (preferencesObj.type1 === 'pie-chart') {
      repJson.legendX = "";
      repJson.legendY = "";
  } else if (preferencesObj.type1 === 'bar-chart') {
      repJson.legendX = preferencesObj.key1;
      repJson.legendY = preferencesObj.param.type;
  } else {
      repJson.legendX = "";
      repJson.legendY = preferencesObj.param.type;
  }

  repJson.data = [];

  if (preferencesObj.type1 === 'line-chart'){
      var innerLine = {
          label: 'Tiempo',
          value: 0,
          clickable: false,
          title: '',
          legendX: '',
          legendY: '',
          data: [],
      };
      var auxData=[];
  }

  let arrayOfParts = await Promise.all(response.map(async (item) => {
    let row;
    let part = {};

    if (preferencesObj.key1 == 'producto'){
        row = item.producto;
        part.label = item.producto;
    } else if (preferencesObj.key1 === 'cliente'){
        row = item.cliente;
        part.label = item.cliente;
    } else { row = item.tiempo; part.label = item.tiempo; }

    part.value = item.valor;
    part.clickable = true;
    part.title = '';
    part.type = preferencesObj.type2;

    if (preferencesObj.type2 === 'pie-chart') {
        part.legendX = '';
        part.legendY = '';
    } else if (preferencesObj.type2 === 'bar-chart') {
        part.legendX =preferencesObj.key2;
        part.legendY =preferencesObj.param.type;
    } else {
        part.legendX = '';
        part.legendY = preferencesObj.param.type;
    }

    part.data = [];

    let queryResponse = await queryReportNivel2(preferencesObj, row);
    let auxarray = await queryResponse.map(item => {
      let innerpart = {};

      if (preferencesObj.key2 === 'producto') {
          innerpart.label = item.producto;
      } else if (preferencesObj.key2 === 'cliente'){
          innerpart.label = item.cliente;
      } else {
          innerpart.label = item.tiempo;
      }

      innerpart.value = item.valor;

      return innerpart;
    });

    part.data = await auxarray;

    return part;
  }));

  if (preferencesObj.type1 === 'line-chart'){
      innerLine.data = await arrayOfParts;
      repJson.data[0] = innerLine;
  } else {
      repJson.data = await arrayOfParts;
  }

  return repJson;
};

async function principal(preferencesObj) {
    try {
      let reponse = await queryReportNivel1(preferencesObj);
      let repJson = await principalCallback(reponse, preferencesObj);

      return repJson;
    } catch (e) {
      console.log('Reporter module error in principal function');
      console.log(e);
    }
};



module.exports = {
    principal: principal
};
