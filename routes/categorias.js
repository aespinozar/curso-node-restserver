const {Router} = require('express');
const { validarJWT,validarCampos,esAdminRole,tieneRole } = require('../middlewares');
const { check } = require('express-validator');
const { crearCategoria, categoriaGet,categoriaGetId,categoriaPut, categoriaDelete } = require('../controller/categorias');
const { existeCategoriaPorId } = require('../helpers/db-validators');

const router = Router();
/**
 * {{url}}/api/categorias
 */
//Obtener todas las categorias. servicio publico
router.get('/', categoriaGet );

/* router.get('/',(req,res) => {
    res.json('get')
}); */

//Obtener una categoria especifica. servicio publico
router.get('/:id',[
    check('id','No es un ID valido ').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos,
         
] ,categoriaGetId);

//crear una categoria. servicio privado cualquiera q tenga token valido
router.post('/', [
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria);

//actualizar una categoria por id. servicio privado cualquiera q tenga token valido
router.put('/:id',[
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], categoriaPut );

//borrar una categoria por id. servicio privado solo Admin
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    //tieneRole('ADMIN_ROLE', 'VENTAS_ROLE'),
    check('id','No es un ID valido ').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
],categoriaDelete );

module.exports = router;