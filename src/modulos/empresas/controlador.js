//Para hacer las consultas a la base de datos
//const db = require("../../DB/mysql"); //Con esto tenemos acceso a la bbdd
//El controlador ya no va a necesitar la base de datos, con esto podremos acceder a cualquier base de datos mas facilmente


//Nombre de la tabla a la que queremos acceder
const TABLA = "company";

const auth = require("../auth")

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

    async function agregar(body) {
        /*Con los datos de la clase auth esta informacion ya no es del todo valida, 
        ahora tenemos que enviar ciertos datos a la otra base de datos, esto solo es si queremos poner dos tablas.*/
        const empresa = {
            id: body.id,
            nombre: body.nombre,
            activo: body.activo,
        }

        //Tiene que esperar para que guarde todo antes de hacer lo mismo en auth
        const respuesta = await db.agregar(TABLA, empresa);

        var insertId = 0;
        //En caso de que el id del body sea cero le envia al auth el id que le des al otro, 
        //sino copia el id de la bbdd y lo pone en el insertid
        /* */
        if(body.id == 0) {
            insertId = respuesta.insertId;
        }
        else {
            insertId = body.id;
        }
        var respuesta2 = "";
        //Lo mismo para contraseña y nombre de usuario
        if(body.usuario || body.password) {
            respuesta2 = await auth.agregar({
                id: insertId,
                usuario: body.usuario,
                password: body.password
            })
        }

        return respuesta2;

        //Formula anterior para agregar usuarios
        //return db.agregar(TABLA, body)
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
