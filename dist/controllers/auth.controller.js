"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTimeToken = exports.login = void 0;
//recibe una peticion y devuelve una respuesta request
const generateToken_1 = require("../utils/generateToken");
const cache_1 = require("../utils/cache");
const dayjs_1 = __importDefault(require("dayjs"));
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // en esta parte esta en el body
    const { username, password } = req.body;
    if (username !== "admin" || password !== "1234") {
        return res.status(401)
            .json({ message: "credenciales incorrectas" });
    }
    const userId = "123456";
    const accessToken = (0, generateToken_1.generateAccessToken)(userId);
    //inicializar servicio de cache de node
    //agregar tiempo el token al cache
    cache_1.cache.set(userId, accessToken, 60 * 15);
    res.json({ accessToken });
    // el primer parametro es la llave unica para identificar en el cahe es decir el userId, para que cuando se use. Despues la info que quiero guardar y el tiempo de expiracion que es accessToken
    //tarea 20 mayo crear repo en publico en github,  crear ruta para usar este controlador
});
exports.login = login;
const getTimeToken = (req, res) => {
    const { userId } = req.body;
    const ttl = cache_1.cache.getTtl(userId);
    if (!ttl) {
        return res.status(404).json({ message: 'Token no encontrado' });
    }
    const now = Date.now();
    const timeToLife = Math.floor((ttl - now) / 1000);
    const expTime = (0, dayjs_1.default)(ttl).format('HH:mm:ss');
    return res.json({
        timeToLife,
        expTime,
    });
};
exports.getTimeToken = getTimeToken;
