const express = require('express');
const morgan = require('morgan');

const config = require('./config');
const juegos = require("./modulos/juegos/rutas");
const empresas = require("./modulos/empresas/rutas")
const auth = require("./modulos/auth/rutas")

const app = express();

//Utilizamos la funcion error
const error = require('./red/errors');

//Poner todos nuestro middleware
app.use(morgan('dev'));

//PAra que reconozca los objetos json
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//configuracion
app.set('port', config.app.port)

//rutas
app.use('/api/juegos', juegos)
app.use('/api/empresas', empresas)

app.use("/api/auth", auth)

module.exports = app;