//Para hacer las consultas a la base de datos
//const db = require("../../DB/mysql"); //Con esto tenemos acceso a la bbdd
//El controlador ya no va a necesitar la base de datos, con esto podremos acceder a cualquier base de datos mas facilmente


//Nombre de la tabla a la que queremos acceder
const TABLA = "game";

/*La forma bsaica de hacerlo, con la base de datos pedida por el controlador

//Lo mismo que en mysql, la lista de funciones que has recogido
function todos() {
    return db.todos(TABLA)
}


function uno(id) {
    return db.uno(TABLA, id)
}

function agregar(body) {
    return db.agregar(TABLA, body)
}

function eliminar(body) {
    return db.eliminar(TABLA, body)
}
module.exports = { 
    todos,
    uno,
    agregar,
    eliminar
}

*/


module.exports = function(dbInyectada) { 
    //Si hay un fallo o error
    let db = dbInyectada;
    if(!db) {
        //Con esto si no lo envia o lo que sea lo puedes requerir de manera manual igualmente
        db = require("../../DB/mysql")
    }



    //Lo mismo que en mysql, la lista de funciones que has recogido
    function todos() {
        return db.todos(TABLA)
    }


    function uno(id) {
        return db.uno(TABLA, id)
    }

    function agregar(body) {
        return db.agregar(TABLA, body)
    }

    function eliminar(body) {
        return db.eliminar(TABLA, body)
    }

    return {
        todos,
        uno,
        agregar,
        eliminar
    }

}
