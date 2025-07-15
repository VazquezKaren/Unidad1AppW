import { Router, RequestHandler } from 'express';
import { login, getTimeToken, updateToken, getAllUsers, saveUser, updateUser, deleteUser } from '../controllers/auth.controller';
import { createProduct, getAllProducts,updateProduct,deleteProduct } from '../controllers/product.controller';
import { crearOrder,updateOrder, updateOrder,cancelOrder, getOrders  } from "../controllers/order.controller";
import { getMenuByUserId }  from '../controllers/menu.controller';
import {
  crearReporte,
  getReports,
  actualizarReporte,
  eliminarReporte,
} from "../controllers/report.controller";

const router = Router();

router.post('/login', login as RequestHandler);
router.get('/gettime', getTimeToken);
router.patch('/update/:userId', updateToken);
router.get('/getUsers', getAllUsers);
router.post('/newUser', saveUser);
router.patch ('/updateUser', updateUser );
router.patch('/deleteUser', deleteUser); 

router.post ('/createProduct', createProduct);
router.get('/getAllProducts', getAllProducts);
router.delete('deleteProduct/:id', deleteProduct);
router.patch('/updateProduct/:id', updateProduct);

router.post('/crearOrder', crearOrder);
router.patch('/updateOrder/:id', updateOrder);
router.delete('/deleteOrder/:id', cancelOrder);
router.get('/getOrders', getOrders); 

router.get('/menu/:userId', getMenuByUserId);


router.post("/crearReporte", crearReporte);
router.get("/getReports", getReports);
router.put("/actualizarReporte/:id", actualizarReporte);
router.delete("/eliminarReporte/:id", eliminarReporte);


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