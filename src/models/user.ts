import { Document, Schema, model, Types } from "mongoose";

export interface IUser extends Document{
    name: string;
    email: string;
    password: string;
    role: string;
    _id: Types.ObjectId;
    phone: string;
    createDate: Date;
    deleteDate: Date;
    status: boolean;

}

const userschema = new Schema<IUser>({ 
    name: { 
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,

    },
    password: {

    },
    phone: { 
        type: String,
        required: true,
    },
    createDate: {
        type: Date,
        default: Date.now, 
    },
    status: { 
        type: Boolean,
        required: true,
    },        

});

export const User = model<IUser>('User', userschema, 'users'); //el ultimo user es para la coleccion exactamente

