import jwt from 'jsonwebtoken'
const ACESS_SECRET = "secret1234utd";
//asiganr el tipo de dato en :string


export const generateAccessToken = (userId: string) => {

    //se asinga la llave secreta y el tiempo de vida del token
    //se asigna el id del usuario al token

    //se asigna el tiempo de vida del token
    //se asigna el id del usuario al token
    
    return jwt.sign(
    {userId},
    ACESS_SECRET,
    { expiresIn: '15m' }
    );
};