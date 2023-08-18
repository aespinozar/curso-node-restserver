const {Router} = require('express');
const { validarCampos,validarArchivoSubir } = require('../middlewares');
const { check } = require('express-validator');
const { cargarArchivo, actualizarImagen, mostrarImagen,actualizarImagenCloudinary } = require('../controller/uploads');
const {coleccionesPermitidas} = require('../helpers');

const router = Router();
//metodo para cargar el archivo post, el / indica la ruta 
router.post('/', validarArchivoSubir, cargarArchivo);
router.put('/:coleccion/:id',[
    validarArchivoSubir,
    check('id','El Id debe ser mongo').isMongoId(),
    check('coleccion').custom(c=>coleccionesPermitidas(c,['usuarios','productos'])),
    validarCampos

],actualizarImagenCloudinary);

router.get('/:coleccion/:id', [
    check('id','El Id debe ser mongo').isMongoId(),
    check('coleccion').custom(c=>coleccionesPermitidas(c,['usuarios','productos'])),
    validarCampos
],mostrarImagen );

module.exports = router;