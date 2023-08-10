const {Router} = require('express');
const {buscar} = require('../controller/buscar');

const router = Router();
//el metodo get recibi los parametros collecion y termino de busqueda y se invoca al controller buscar.
router.get('/:coleccion/:termino',buscar)

module.exports = router;