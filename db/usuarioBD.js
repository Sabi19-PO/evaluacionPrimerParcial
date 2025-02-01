import User from "../models/usuarioModelo.js";
import { mensajes } from "../libs/manejoErrores.js";
import { crearToken } from "../libs/jwt.js";
import {encriptarPassword, validarPassword} from "../middlewares/funcionesPassword.js"

export async function register({username, email, password}){
    try {
        const usuarioExistente = await User.findOne({username});
        const emailExitente = await User.findOne({email});

        if (usuarioExistente || emailExitente){
            return mensajes(400, "Usuario duplicado");
        }

        const {salt, hash} = encriptarPassword(password);
        const data = new User({username, email, password:hash, salt})
        var respuesta = await data.save();
        const token=await crearToken({id: respuesta._id});
        return mensajes(200,"Registro agregado correctamente", "", token);
    } catch (error) {
        return mensajes(400, "Error al registrar el ususario ", error);
    }
}

export const login = async({username, password})=>{
   try {
        var usuarioCorrecto = await User.findOne({username});
        if (!usuarioCorrecto){
            return mensajes(400, "datos incorrectos")
        }
        const passwordCorrecto = validarPassword(password, usuarioCorrecto.salt, usuarioCorrecto.password);
        if (!passwordCorrecto){
            return mensajes(400, "datos incorrectos")
        }
        return mensajes(200, "ingreso correcto");
   } catch (error) {
        //console.log("catch incorrecto");
        return mensajes(400, "datos incorrectos");
   }
}