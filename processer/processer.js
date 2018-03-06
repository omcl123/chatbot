const generador= require("../reporter/genReporte");
const reporte = require("../model/reporte");
const block = require("../model/block.js");
const alert = require("../model/alert.js");

async function devuelveUrl(preferencesObj, url) {
  try {
    reportJson = await reporte.principal(preferencesObj);
    url = await generador.generateReport(reportJson);

    return url;
  } catch (e) {
    console.log(e);
  }
};

async function devuelveBloque(preferencesObj,jsonBlock) {
    try {
        jsonBlock = await block.principal(preferencesObj);

        return jsonBlock;
    } catch (e) {
        console.log(e);
    }
}

function devuelveNotificacion(preferencesObj,notf) {
    return new Promise(function(resolve,reject) {
        alert.principal(preferencesObj)
        .then(notf => resolve(notf))
        .catch((err) => {
            console.log(err);
            reject(err);
            throw error;
        });
    });
}

module.exports={
    devuelveUrl: devuelveUrl,
    devuelveBloque: devuelveBloque,
    devuelveNotificacion: devuelveNotificacion
}
