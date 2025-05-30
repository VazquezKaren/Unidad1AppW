import { Router, RequestHandler } from 'express';
import { login, getTimeToken, updateToken, getAllUsers, saveUser, updateUser, deleteUser } from '../controllers/auth.controller';

const router = Router();

router.post('/login', login as RequestHandler);
router.get('/gettime', getTimeToken);
router.patch('/update/:userId', updateToken);
router.get('/getUsers', getAllUsers);
router.patch('/newUser', saveUser);
router.patch ('/updateUser', updateUser );
router.patch('/deleteUser', deleteUser); 


export default router;

// mongoose.connect(process.env.MONGO_URI!)
//     .then(() => {
//         console.log('Conectado a MongoDB');
//         app.listen(PORT, () => {
//             console.log(`Servidor escuchando en puerto ${PORT}`);
//         });
//     })
//     .catch(err => {
//         console.error('Error al conectar a MongoDB:', err);
//     });