const {Router} = require('express');
const { validarCampos } = require('../middlewares/validar-campos');
const { check } = require('express-validator');
const { login } = require('../controller/auth');

const router = Router();

router.post('/login',[
    check('correo','El correo es obligatorio').isEmail(),
    check('password','El Password obligatorio ').not().isEmpty(),
    validarCampos

] ,login );

module.exports = router;