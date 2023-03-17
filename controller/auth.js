const {response, json} = require('express');
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');
const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');

const login = async(req, res = response) => {
    const {correo,password} = req.body;
    try {
        //verificar si el email existe
        const usuario = await Usuario.findOne({correo});
        if(!usuario){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - correo'
            });
        }
        //verificar si el usuario esta activo
        if(!usuario.estado){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - estado falso'
            });
        }
        //verificar la contrasena
        const validPassword = bcryptjs.compareSync(password,usuario.password);
        if(!validPassword){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - password falso'
            }); 
        }
        //generar el JWT
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Hable con el Administrador'
        })
        
    }

    
}

const googleSignIn = async(req, res = response) => {
    const {id_token} = req.body;
    try {
        const {nombre,img,correo} = await googleVerify(id_token);
        let usuario = await Usuario.findOne({correo}); //busca si existe el correo en la bd.
        if(!usuario){
            // crear el usuario pues no existe
            const data ={
                nombre,
                correo,
                password: ':P',
                img,
                google: true
            };
            usuario = new Usuario(data);
            await usuario.save();
        }
        if(!usuario.estado){
            //usuario bloqueado en google
            return res.status(400).json({
                msg: 'Hable con el Administrador. Usuario bloqueado'
            });

        }
        //generar el json web token.
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
          
        })
        
    } catch (error) {
        console.log(error)
      return  res.status(400).json({
        ok: false,
        msg: 'El token no se pudo verificar'
       })
               
    }
   
}

module.exports = {
    login,
    googleSignIn
}