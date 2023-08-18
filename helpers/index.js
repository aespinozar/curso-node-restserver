
const dbValidators   = require('./db-validators');
const generarJWT     = require('./generar-jwt');
const googleVerify   = require('./google-verify');
const subirArchivo   = require('./subir-archivo');
//se exporta todo los ... indican que se exparce todo su contenido
module.exports = {
    ...dbValidators,
    ...generarJWT ,
    ...googleVerify,
    ...subirArchivo
}