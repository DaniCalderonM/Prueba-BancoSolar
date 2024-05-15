import pool from "../config/db.js";
import { manejoErrores } from '../erroresBBDD/errores.js';
const tabla1 = 'usuarios';
const tabla2 = 'transferencias'

let mensaje;
// Agregar un nuevo usuario
const nuevoUsuario = async (nombre, balance) => {
    try {
        // Validar que ingresen todos los campos por thunder o postman
        if (!nombre || !balance) {
            mensaje = "Debe ingresar todos los campos: nombre y balance";
            console.log(mensaje);
            return mensaje;
        } else {
            // Validar que no exista usuario en la bbdd
            const consulta = {
                text: `SELECT * FROM ${tabla1} WHERE nombre = $1`,
                values: [nombre]
            }

            const verificar = await pool.query(consulta);
            if (verificar.rows != 0) {
                mensaje = "El usuario ya existe en la base de datos"
                console.log(mensaje)
                return mensaje;
            }
        }

        const consulta = {
            text: ` INSERT INTO ${tabla1} (nombre, balance) values ($1, $2) RETURNING *`,
            values: [nombre, balance]
        };
        const resultado = await pool.query(consulta);
        if (resultado.rows == 0) {
            mensaje = "No se pudo agregar al usuario";
            console.log(mensaje);
            return mensaje;
        } else {
            console.log(`Usuario con nombre: ${nombre} agregado correctamente. ${JSON.stringify(resultado.rows[0])}`);
            return resultado.rows[0];
        }
    } catch (error) {
        return manejoErrores(error, pool, tabla1);
    }
}

// Mostrar todos los usuarios
const verUsuarios = async () => {
    try {
        const consulta = {
            text: `SELECT * FROM ${tabla1}`
        };
        const resultado = await pool.query(consulta);

        if (resultado.rows == 0) {
            mensaje = "No se encontraron usuarios registrados";
            console.log(mensaje);
            return mensaje;
        } else {
            console.log(`El registro actual de usuarios es ${JSON.stringify(resultado.rows)}`);
            return resultado.rows;
        }
    } catch (error) {
        return manejoErrores(error, pool, tabla1);
    }
};

// Actualizar un usuario
const editarUsuario = async (id, nombre, balance) => {
    try {
        //Validar que ingresen todos los campos por thunder o postman
        if (!id || !nombre || !balance) {
            mensaje = "Debe ingresar todos los campos: id, nombre y balance";
            console.log(mensaje);
            return mensaje;
        }
        const consulta = {
            text: `UPDATE ${tabla1} SET nombre = $1, balance = $2 WHERE id = $3 RETURNING *`,
            values: [nombre, balance, id]
        };
        const resultado = await pool.query(consulta);

        if (resultado.rows == 0) {
            mensaje = "No se pudo actualizar el usuario, ya que no existe"
            console.log(mensaje);
            return mensaje;
        } else {
            console.log(`Usuario con id: ${id} actualizado correctamente.`);
            return resultado.rows[0];
        }
    } catch (error) {
        return manejoErrores(error, pool, tabla1);
    }
};

//Eliminar un usuario
const eliminarUsuario = async (id) => {
    try {
        //Validar que ingresen el campo id por thunder o postman
        if (!id) {
            mensaje = "Debe ingresar el campo id";
            console.log(mensaje);
            return mensaje;
        }
        const consulta = {
            text: `DELETE FROM ${tabla1} WHERE id = $1 RETURNING *`,
            values: [id],
        };
        const resultado = await pool.query(consulta);

        if (resultado.rows == 0) {
            mensaje = "No se pudo eliminar al usuario, ya que no existe"
            console.log(mensaje);
            return mensaje;
        } else {
            console.log(`Usuario con id: ${id} eliminado correctamente.`);
            return resultado.rows[0];
        }
    } catch (error) {
        return manejoErrores(error, pool, tabla1);
    }
};


//Agregar una nueva transferencia
const nuevaTransferencia = async (emisor, receptor, monto) => {
    try {
        //Validar que ingresen el campo emisor, receptor y monto por thunder o postman
        if (!emisor || !receptor || !monto) {
            mensaje = "Debe ingresar todos los campos: emisor, receptor y monto";
            console.log(mensaje);
            return mensaje;
        }
        // Validar que el emisor y el receptor no sean la misma persona
        if (emisor === receptor) {
            return "El emisor y el receptor no pueden ser la misma persona"
        }
        // Validar que el monto no sea negativo en thunder o postman
        if (monto < 0) {
            return "El monto a transferir no puede ser menor a 0"
        } else {

            await pool.query("BEGIN");

            // Paso 1: Actualizar y descontar saldo del emisor
            const descontar = {
                text: `UPDATE ${tabla1} SET balance = balance - $1 WHERE id = $2 RETURNING *`,
                values: [monto, emisor]
            }
            const descuento = await pool.query(descontar);

            if (descuento.rowCount == 1) {
                console.log("Descuento realizado con éxito: ", descuento.rows[0]);
            } else {
                console.log("No se pudo realizar el descuento, el usuario no existe");
                await pool.query("ROLLBACK");
                return "Transacción Incompleta, se aplicó ROLLBACK";
            }

            // Paso 2: Actualizar y aumentar saldo del receptor
            const acreditar = {
                text: `UPDATE ${tabla1} SET balance = balance + $1 WHERE id = $2 RETURNING *`,
                values: [monto, receptor]
            }
            const acreditacion = await pool.query(acreditar);

            if (acreditacion.rowCount == 1) {
                console.log("Acreditación realizada con éxito: ", acreditacion.rows[0]);
                await pool.query("COMMIT");
            } else {
                console.log("No se pudo realizar la acreditación, el usuario no existe");
                await pool.query("ROLLBACK");
                return "Transacción Incompleta, se aplicó ROLLBACK";
            }

            // Paso 3: Insertar registro en la tabla transferencias
            const insertar = {
                text: `INSERT INTO ${tabla2} (emisor, receptor, monto, fecha) VALUES ($1, $2, $3, CURRENT_TIMESTAMP) RETURNING *`,
                values: [emisor, receptor, monto]
            }
            const insertacion = await pool.query(insertar);

            if (insertacion.rowCount == 1) {
                console.log("Registro de transferencia exitoso: ", insertacion.rows[0]);
                return insertacion.rows[0];
            } else {
                console.log("No se pudo realizar el registro de transferencia");
                await pool.query("ROLLBACK");
                return "Transacción Incompleta, se aplicó ROLLBACK";
            }
        }
    } catch (e) {
        await pool.query("ROLLBACK");
        console.log("Error de conexión o instrucción, Transacción abortada: ", e.message);
        return manejoErrores(e, pool, tabla2);
    }
};


// Mostrar todas las transferencias
const verTransferencias = async () => {
    try {
        const consulta = {
            rowMode: "array",
            text: `SELECT t.id, e.nombre, r.nombre, t.monto  FROM ${tabla2} t
            INNER JOIN ${tabla1} e ON e.id = t.emisor INNER JOIN ${tabla1} r ON
            r.id = t.receptor`
        };
        const resultado = await pool.query(consulta);

        if (resultado.rows == 0) {
            mensaje = "No se encontraron transferencias registradas";
            console.log(mensaje);
            return mensaje;
        } else {
            console.log(`El registro actual de transferencias es ${JSON.stringify(resultado.rows)}`);
            return resultado.rows;
        }
    } catch (error) {
        return manejoErrores(error, pool, tabla2);
    }
};


export { nuevoUsuario, verUsuarios, editarUsuario, eliminarUsuario, nuevaTransferencia, verTransferencias }
