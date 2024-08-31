// import { Schema, model, Document } from 'mongoose';

// export interface IUser extends Document {
//     name: string;
//     email: string;
// }

// const UserSchema: Schema = new Schema({
//     name: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
// });

// export default model<IUser>('User', UserSchema);


import mongoose from "mongoose";
// Create User Schema fot mongoDB.
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    authentication: {
        password: {
            type: String,
            required: true,
            select: false,
        },
        salt: {
            type: String,
            select: false,
        },
        sessionToken: {
            type: String,
            select: false,
        },
    },
});

export const UserModel = mongoose.model("User", userSchema);

// User Model CRUD functions
export const getUsers = () => {
    return UserModel.find();
};
export const getUserByEmail = (email: String) => {
    return UserModel.findOne({ email });
};
export const getUserBySessionToken = async (seessionToken: String) => {
    return UserModel.findOne({ "authentication.sessionToken": seessionToken });
};
export const getUserById = (id: string) => {
    return UserModel.findOne({ _id: id });
};
export const createUser = async (values: Record<string, any>) => {
    return new UserModel(values).save().then((user) => user.toObject());
};
export const deleteUserById = (id: string) => {
    return UserModel.findOneAndDelete({ _id: id });
};
export const updateUserById = (id: any, values: Record<string, any>) => {
    return UserModel.findOneAndUpdate(id, values);
};
