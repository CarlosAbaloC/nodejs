const express = require('express');

//Tenemos que verificar si se esta enviando un token y si es verdadero el token
const seguridad = require("./seguridad")

const respuesta = require("../../red/respuestas");

//Importampos el controlador
//const controlador = require("./controlador");

//Ahora no requerimos el controlador sino el index, debido al cambio en la manera de pedir la base de datos
const controlador = require("./index");

const  router = express.Router()

//El get normal que coge todo
//Hacemos uso de promesas
/*
router.get('/', function (req, res) {
    const todos = controlador.todos()
    .then((items) => {
        respuesta.success(req, res, items, 200)
    });
});
*/
//Tambien podemos hacerlo sin tantas lineas con el async
/*Haciendo las rutas a la vez su funcionalidad, con las funciones vamos

    router.get('/', async function (req, res) {
        try {
            const items = await controlador.todos()
            respuesta.success(req, res, items, 200);
        }
        catch(err) {
            respuesta.error(req, res, err, 500)
        }

    });

    //Get a un elemento concreto
    router.get('/:id', async function (req, res) {
        try {
            const items = await controlador.uno(req.params.id)
            respuesta.success(req, res, items, 200);
        }
        catch(err) {
            respuesta.error(req, res, err, 500)
        }
        
    });

*/

//Separando las rutas de las funciones
router.get('/', todos)
router.get('/:id', uno)
//Siempre que haya seguirad es que te pide un token 
router.put('/', seguridad(), eliminar)
router.post('/', seguridad(), agregar)

async function todos(req, res, next) {
    try {
        const items = await controlador.todos()
        respuesta.success(req, res, items, 200);
    }
    catch(err) {
        next(err);
    }

};

//Get a un elemento concreto
async function uno(req, res, next) {
    try {
        const items = await controlador.uno(req.params.id)
        respuesta.success(req, res, items, 200);
    }
    catch(err) {
        next(err);
    }
    
};

async function agregar(req, res, next) {
    try {
        const items = await controlador.agregar(req.body);
        if(req.body.id == 0) {
            mensaje = "Item guardado con exito"
        }

        else {
            mensaje = "Item acualizado con exito"
        }
        respuesta.success(req, res, mensaje, 201);
    }
    catch(err) {
        next(err);
    }
    
}

//El next es si procesamos el error, esto lo hacemos con todos los demas
async function eliminar(req, res, next) {
    try {
        const items = await controlador.eliminar(req.body);
        respuesta.success(req, res, "ITem eliminado satisfactoriamente", 200);
    }
    catch(err) {
        //Error dado por el sistema
        //respuesta.error(req, res, err, 500)

        //Error procesado por el programa
        next(err);

    }
    
};


module.exports = router;