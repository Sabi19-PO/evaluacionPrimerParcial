import { Router } from "express";
import { register, login } from "../db/usuarioBD.js";
import User from "../models/usuarioModelo.js";
import { mensajes } from "../libs/manejoErrores.js";
const router = Router();

router.post("/registro", async(req,res)=>{
    //Es donde llegan todas las variables
    const respuesta = await register(req.body);
    if(respuesta.status === 200){
        res.cookie('token',respuesta.token).status(respuesta.status).json(respuesta);
    }else{
        res.status(respuesta.status).json(respuesta);
    }   
});

router.post("/ingresar", async(req,res)=>{
    const respuesta = await login(req.body);
    res.status(respuesta.status).json(respuesta);
});


router.get("/salir", async(req,res)=>{
    res.send("Estas en salir");
});
router.get("/usuario", async(req,res)=>{
    res.send("Estas en  usuario ");
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

//todos los usuarios
router.get("/usuarios", async (req, res) => {
    try {
        const usuarios = await User.find();
        res.status(usuarios.length ? 200 : 404).json(usuarios.length ? usuarios : mensajes(404, "No hay usuarios disponibles"));
    } catch (error) {
        res.status(500).json(mensajes(500, "Error al obtener usuarios", error));
    }
});

//usuarios por id
router.get("/usuarios/:id", async (req, res) => {
    try {
        const usuario = await User.findById(req.params.id);
        if (!usuario) return res.status(404).json(mensajes(404, "Usuario no encontrado"));
        res.status(200).json(usuario);
    } catch (error) {
        res.status(500).json(mensajes(500, "Error al obtener el usuario", error));
    }
});

//borrar por id
router.delete("/usuarios/:id", async (req, res) => {
    try {
        const usuario = await User.findByIdAndDelete(req.params.id);
        if (!usuario) return res.status(404).json(mensajes(404, "Usuario no encontrado"));
        res.status(200).json(mensajes(200, "Usuario borrado correctamente"));
    } catch (error) {
        res.status(500).json(mensajes(500, "Error al borrar el usuario", error));
    }
});

//usuario actualizado
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