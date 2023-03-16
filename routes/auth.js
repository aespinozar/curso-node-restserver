const {Router} = require('express');
const { validarCampos } = require('../middlewares/validar-campos');
const { check } = require('express-validator');
const { login, googleSignIn } = require('../controller/auth');

const router = Router();

router.post('/login',[
    check('correo','El correo es obligatorio').isEmail(),
    check('password','El Password obligatorio ').not().isEmpty(),
    validarCampos

] ,login );

router.post('/google',[
    check('id_token','id_token es necesario ').not().isEmpty(),
    validarCampos

] ,googleSignIn );

module.exports = router;