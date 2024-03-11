const express = require('express');


const respuesta = require("../../red/respuestas");
const controlador = require("./index");



const router = express.Router()

router.get('/', todos)
router.get('/:id', uno)
router.put('/', eliminar)
router.post('/', agregar)

async function todos(req, res, next) {
    try {
        const items = await controlador.todos()
        respuesta.success(req, res, items, 200);
    }
    catch(err) {
        next(err);
    }

};

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
    
};

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