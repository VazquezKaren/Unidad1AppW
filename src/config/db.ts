import mongoose from "mongoose";        

const connectDB = async (): Promise<void> => {

    //primera parte usuario :// contrasena@servidor:puerto/base de datos?"bdprincipal"
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/user';

    try {
        await mongoose.connect(mongoUri);
        console.log("Conectando a la base de datos...");

        
    } catch (error) {

        console.error("Error al conectar a la base de datos:", error);
    }
};
export default connectDB;