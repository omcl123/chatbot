const generador= require("../reporter/genReporte");
const reporte = require("../model/reporte");

function devuelveUrl(preferencesObj, url) {
    return new Promise(function(resolve, reject) {
        reporte.principal(preferencesObj)
        .then(reportJson => generador.generateReport(reportJson))
        .then(url => resolve(url))
        .catch((err) => {
            console.log(err);
            reject(err);
            throw error;
        });
    });
}



module.exports={
    devuelveUrl: devuelveUrl,
}
