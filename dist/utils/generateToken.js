"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ACESS_SECRET = "secret1234utd";
//asiganr el tipo de dato en :string
const generateAccessToken = (userId) => {
    //se asinga la llave secreta y el tiempo de vida del token
    //se asigna el id del usuario al token
    //se asigna el tiempo de vida del token
    //se asigna el id del usuario al token
    return jsonwebtoken_1.default.sign({ userId }, ACESS_SECRET, { expiresIn: '15m' });
};
exports.generateAccessToken = generateAccessToken;
