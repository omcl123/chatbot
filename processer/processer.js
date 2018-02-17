const generador= require("../reporter/genReporte");
const reporte = require("../model/reporte");

async function devuelveUrl(preferencesObj, url) {
  try {
    reportJson = await reporte.principal(preferencesObj);
    url = await generador.generateReport(reportJson);
    await resolve(url);
  }
  catch(e) {
    console.log(e);
  }
}



module.exports={
    devuelveUrl: devuelveUrl,
}
