const { Router } = require('express');
const { validarJWT,validarCampos,esAdminRole,tieneRole } = require('../middlewares');
const { check } = require('express-validator');
const { crearProducto,productoGet,productoGetId,productoPut,productoDelete } = require('../controller/productos');
const { existeCategoriaPorId, existeProductoPorId} = require('../helpers/db-validators');

const router = Router();
//obtener todos los productos. servicio publico
router.get('/', productoGet );

//Obtener una producto especifica. servicio publico
router.get('/:id',[
    check('id','No es un ID valido ').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos,
         
] ,productoGetId);

// Crear producto - privado - cualquier persona con un token válido
router.post('/', [ 
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    //la categoria debe existir para crear un producto.
    check('categoria','No es un id de Mongo').isMongoId(),
    check('categoria').custom( existeCategoriaPorId ),
    validarCampos
], crearProducto );

//actualizar una categoria por id. servicio privado cualquiera q tenga token valido
router.put('/:id',[
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('id').custom(existeProductoPorId),
    validarCampos
], productoPut );

//borrar una categoria por id. servicio privado solo Admin
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id','No es un ID valido ').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
],productoDelete );

module.exports = router;
