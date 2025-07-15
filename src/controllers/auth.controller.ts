//recibe una peticion y devuelve una respuesta request
import { generateAccessToken } from '../utils/generateToken';
import { Request, response, Response } from 'express';
import { cache } from '../utils/cache'; 
import dayjs from 'dayjs';
import { access } from 'fs';
import { User } from '../models/user';
import { compare, hash } from 'bcryptjs';

export const login = async (req: Request, res: Response) => {

    // en esta parte esta en el body
    const { email, password } = req.body; 
    const user = await User.findOne({email});
    if (!user) {
        return res.status(401).json({ message: 'credenciales incorrectas' });
    }

    const passwordCorrect = await compare(password, user.password);
    //verificar contrasenas encriptadas
    if (!passwordCorrect){
        return res.status(401).json({message: "credenciales incorrectas"})
    }



    const accessToken = generateAccessToken(user.id);

    //agregar token 


    //inicializar servicio de cache de node
    
    //agregar tiempo el token al cache

    cache.set(user.id, accessToken, 60* 30);
    res.json({ accessToken, user});

    // el primer parametro es la llave unica para identificar en el cahe es decir el userId, para que cuando se use. Despues la info que quiero guardar y el tiempo de expiracion que es accessToken



//tarea 20 mayo crear repo en publico en github,  crear ruta para usar este controlador
};






export const getTimeToken = (req: Request, res: Response) => {
    const { userId } = req.query;

    if (typeof userId !== 'string') {
        return res.status(400).json({ messge: 'userId debe ser una cadena' });
    }

    const ttl = cache.getTtl(userId);

    if (!ttl) {
        return res.status(404).json({ message: 'Token no encontrado' });
    }

    const now = Date.now();
    const timeToLife = Math.floor((ttl - now) / 1000);
    const expTime = dayjs(ttl).format('HH:mm:ss');

    return res.json({
        timeToLife,
        expTime,
    });
};


export const updateToken = (req: Request, res:Response)=>{
    const{ userId } = req.params;

    const ttl=cache.getTtl(userId);
     if (!ttl) {
        return res.status(404).json({ message: 'Token no encontrado' });
    }

    const newTimeTtl:number=60*15;
    cache.ttl(userId, newTimeTtl);

    return res.json({message: "Actualizado correctamente"});
}
export const getAllUsers = async (req: Request, res: Response) => {
    
    const {userEmail} = req.query; //recibir el email del query, si no viene nada, viene undefined
    //user viene del modelo de usuario que creamos

    const userList = await User.find(); //encontrar todos los registros de la base de datos
    const userByEmail = await User.find({email: userEmail}); //encontrar por email

    console.log(userByEmail)
    return res.json({ userList});

}


//si squiero todos los roles activos en find se pone status ture
// export const getAllUsers = async (req: Request, res: Response) => {
    
//     const {userEmail} = req.query; //recibir el email del query, si no viene nada, viene undefined
//     //user viene del modelo de usuario que creamos

//     const userList = await User.find(); //encontrar todos los registros de la base de datos
//     const userByEmail = await User.find({status: true}); //encontrar por email

//     console.log(userByEmail)
//     return res.json({ userList});

// }

export const saveUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role, phone } = req.body;

    // Validación mínima
    if (!name || !email || !password || !role || !phone) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    // Validar duplicado
    const existe = await User.findOne({ email });
    if (existe) {
      return res.status(409).json({ message: "El correo ya está registrado" });
    }

    const hashedPassword = await hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      phone,
      createDate: new Date(),
      status: true
    });

    const user = await newUser.save();

    return res.status(201).json({ user });

  } catch (error) {
    console.error("Error al guardar el usuario:", error);
    return res.status(500).json({ message: "Error interno", error });
  }
};

export const updateUser = async (req: Request, res: Response) => {  
    try {
        const { userEmail } = req.query;
        const { name, password, role, phone } = req.body;

        if (!userEmail) {
            return res.status(400).json({ message: 'Email es requerido para actualizar el usuario.' });
        }

        const updateFields: any = {};
        if (name) updateFields.name = name;
        if (role) updateFields.role = role;
        if (phone) updateFields.phone = phone;
        if (password) updateFields.password = await hash(password, 10);

        const user = await User.findOneAndUpdate(
            { email: userEmail },
            { $set: updateFields },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        return res.json({ message: 'Usuario actualizado correctamente', user });
    } catch (error) {
        console.log('Error al actualizar el usuario:', error);
        return res.status(500).json({ error: 'Error al actualizar el usuario' });
    }
};

export const deleteUser = async (req: Request, res: Response) =>{
    try{
        const {userEmail} = req.query;
        const {status} = req.body;

        if (!userEmail){
            return res.status(400).json({ message: 'credenciales no encontradas'})
        }

        const deleteUser: any = {};
        if (status) deleteUser.status = status;

        const user = await User.findOneAndUpdate(
            { email: userEmail },
            { $set: deleteUser },
            { new: true }
        )
        return res.json({ message: 'Usuario eliminado correctamente' });  
    }catch (error) {
        console.log('Error al eliminar el usuario:', error);
        return res.status(500).json({ error: 'Error al eliminar el usuario' });
    }
}






