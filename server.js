import express from "express";
const app = express();
import { nuevoUsuario, verUsuarios, editarUsuario, eliminarUsuario, nuevaTransferencia, verTransferencias } from "./consultas/consultas.js";
import cors from "cors";
const PORT = 3000;

// Middleware para enviar respuestas json
app.use(express.json());
app.use(cors());

// Ruta principal que envia un archivo HTML
// app.get("/", (req, res) => {
//     res.sendFile("index.html", { root: "./" });
// })


// 1. Crear una ruta POST /usuario: Recibe los datos de un nuevo usuario y los almacena en PostgreSQL.
app.post('/usuario', async (req, res) => {
    try {
        const { nombre, balance } = req.body;
        const respuesta = await nuevoUsuario(nombre, balance);
        res.send(respuesta)
    } catch (error) {
        res.send(error)
    }
});

// 2. Crear una ruta GET /usuarios: Devuelve todos los usuarios registrados con sus balances
app.get('/usuarios', async (req, res) => {
    try {
        const respuesta = await verUsuarios();
        console.log("valor de respuesta: ", respuesta)
        if (typeof respuesta !== "string") {
            res.json({
                status: "Ok",
                data: respuesta,
                mensaje: "Proceso de conexion correcto"
            })
        } else {
            res.json({
                status: "Error",
                //data: respuesta,
                mensaje: respuesta
            })
        }
    } catch (error) {
        res.json({
            status: "Error",
            mensaje: error
        })
    }
});

// 3. Crear una ruta PUT /usuario: Recibe los datos modificados de un usuario registrado y los actualiza.
app.put('/usuario', async (req, res) => {
    try {
        const { id } = req.query;
        //console.log("id: ", req.query);
        const { name, balance } = req.body;
        // console.log("name: ", name);
        // console.log("balance: ", balance);
        const respuesta = await editarUsuario(id, name, balance);
        //console.log("respuesta:", respuesta)
        res.send(respuesta)
    } catch (error) {
        res.send(error)
    }
});

// 4. Crear una ruta DELETE /usuario Recibe el id de un usuario registrado y lo elimina.
app.delete('/usuario', async (req, res) => {
    try {
        const { id } = req.query;
        console.log("id: ", id);
        const respuesta = await eliminarUsuario(id);
        res.send(respuesta)
    } catch (error) {
        res.send(error)
    }
});

// 5. Crer una ruta POST /transferencia: Recibe los datos para realizar una nueva transferencia. Se
//debe ocupar una transacción SQL en la consulta a la base de datos
app.post('/transferencia', async (req, res) => {
    try {
        const { emisor, receptor, monto } = req.body;
        //console.log("emisor, receptor, monto: ", emisor, receptor, monto)
        const respuesta = await nuevaTransferencia(emisor, receptor, monto);
        if (typeof respuesta !== "string") {
            res.json({
                status: "Ok",
                data: respuesta,
                mensaje: "Tranferencia exitosa"
            })
        } else {
            res.json({
                status: "Error",
                //data: respuesta,
                mensaje: respuesta
            })
        }
        //console.log("valor de respuesta en transferencia: ", respuesta)
    } catch (e) {
        res.json({
            status: "Error",
            mensaje: error
        })
    }
});

//6. Crer una ruta GET /transferencias: Devuelve todas las transferencias almacenadas en la base de
//datos en formato de arreglo.
app.get('/transferencias', async (req, res) => {
    try {
        const respuesta = await verTransferencias();
        console.log("transferencias: ", respuesta);
        res.json(respuesta)
    } catch (error) {
        res.json(error)
    }
});

// Ruta generica para enviar mensaje cuando la ruta ingresada no existe
app.get("*", (req, res) => {
    res.send("Esta página no existe...");
});

// Levantar el servidor
app.listen(PORT, () => {
    console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});