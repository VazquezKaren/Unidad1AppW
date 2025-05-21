//recibe una peticion y devuelve una respuesta request
import { generateAccessToken } from '../utils/generateToken';
import NodeCache from 'node-cache';
import { Request, Response } from 'express';

export const login = async (req: Request, res: Response) => {

    // en esta parte esta en el body
    const { username, password } = req.body; 
    if (username !== "admin" || password !== "1234"){
        return res.status(401)
        .json({ message: "credenciales incorrectas"})
    
    }
    const userId = "123456";

    const accessToken = generateAccessToken(userId);

    //inicializar servicio de cache de node
    const cache = new NodeCache();
    
    //agregar tiempo el token al cache

    cache.set(userId, accessToken, 60* 15);
    res.json({ accessToken});

    // el primer parametro es la llave unica para identificar en el cahe es decir el userId, para que cuando se use. Despues la info que quiero guardar y el tiempo de expiracion que es accessToken



//tarea 20 mayo crear repo en publico en github,  crear ruta para usar este controlador
};

