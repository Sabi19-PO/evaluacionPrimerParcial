import { Router } from "express";
import { register, login } from "../db/usuarioBD.js";
import User from "../models/usuarioModelo.js";
import { mensajes } from "../libs/manejoErrores.js";
const router = Router();

router.post("/registro", async(req,res)=>{
    //Es donde llegan todas las variables
    const respuesta = await register(req.body);
    //console.log(respuesta);
    res.cookie('token',respuesta.token).status(respuesta.status).json(respuesta.mensajeUsuario);
});

router.post("/ingresar", async(req,res)=>{
    const respuesta = await login(req.body);
    res.status(respuesta.status).json(respuesta);
});


router.get("/salir", async(req,res)=>{
    res.send("Estas en salir");
});
router.get("/usuarios", async(req,res)=>{
    res.send("Estas en los usuario ");
});

router.get("/administradores", async(req,res)=>{
    res.send("Estas en los administradores ");
});

router.get("/todos", async(req,res)=>{
    res.send("Estas en todos ");
});
// Registro de usuario
router.post("/registro", async (req, res) => {
    const respuesta = await register(req.body);
    if (respuesta.status === 200) {
        res.cookie('token', respuesta.token).status(respuesta.status).json(respuesta);
    } else {
        res.status(respuesta.status).json(respuesta);
    }
});

// Inicio de sesión
router.post("/login", async (req, res) => {
    const respuesta = await login(req.body);
    res.status(respuesta.status).json(respuesta);
});

// Obtener todos los usuarios
router.get("/usuarios", async (req, res) => {
    try {
        const usuarios = await User.find(); // Consulta todos los usuarios en la base de datos
        if (usuarios.length === 0) {
            return res.status(404).json({ codigo: 404, mensaje: "No hay usuarios disponibles" });
        }
        res.status(200).json(usuarios); // Retorna la lista de usuarios en JSON
    } catch (error) {
        res.status(500).json({ codigo: 500, mensaje: "Error al obtener usuarios", error });
    }
});

// Obtener usuario por ID
router.get("/usuarios/:id", async (req, res) => {
    try {
        const usuario = await User.findById(req.params.id);
        if (!usuario) return res.status(404).json(mensajes(404, "Usuario no encontrado"));
        res.status(200).json(usuario);
    } catch (error) {
        res.status(500).json(mensajes(500, "Error al obtener el usuario", error));
    }
});

// Borrar usuario por ID
router.delete("/usuarios/:id", async (req, res) => {
    try {
        const usuario = await User.findByIdAndDelete(req.params.id);
        if (!usuario) return res.status(404).json(mensajes(404, "Usuario no encontrado"));
        res.status(200).json(mensajes(200, "Usuario borrado correctamente"));
    } catch (error) {
        res.status(500).json(mensajes(500, "Error al borrar el usuario", error));
    }
});

// Actualizar usuario por ID
router.put("/usuarios/:id", async (req, res) => {
    try {
        const usuario = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!usuario) return res.status(404).json(mensajes(404, "Usuario no encontrado"));
        res.status(200).json(mensajes(200, "Usuario actualizado correctamente", usuario));
    } catch (error) {
        res.status(500).json(mensajes(500, "Error al actualizar el usuario", error));
    }
});
export default router;