//Creamos un constructor al que le pasaremos la base de datos

const db = require("../../DB/mysql");
const ctrl = require("./controlador");

//Pasamos la base de datos al controlador
module.exports = ctrl(db);

