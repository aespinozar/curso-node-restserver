const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');

class Server {

    constructor() {
        this.app = express();
        //define el puesto
        this.port = process.env.PORT || 3000;
        this.paths={
            auth:       '/api/auth',
            buscar:     '/api/buscar',
            categorias: '/api/categorias',
            usuarios:   '/api/usuarios',
            productos: '/api/productos',
        }
        //llamada a conectarDB
        this.conectarDB();
        //Middelware
        this.middlewares();
        //Rutas de la aplicacion
        this.routes();
    }

    async conectarDB() {
        await dbConnection();
    }
    
    //aque se define el metodo middleware que publicara la carpeta public
    middlewares(){
        //CORS
        this.app.use(cors());
        //lectura y parseo del body recibe lo que se envia
        this.app.use(express.json());
        //directorio publico
        this.app.use(express.static('public'));

    }
    
    routes() {
        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.buscar, require('../routes/buscar'));
        this.app.use(this.paths.categorias, require('../routes/categorias'));
        this.app.use(this.paths.usuarios, require('../routes/usuarios'));
        this.app.use(this.paths.productos, require('../routes/productos'));
    }

    listen() {

        this.app.listen(this.port, () =>{
            console.log('Servidor corriendo en puerto ',this.port)
        })
    }

}

module.exports = Server;