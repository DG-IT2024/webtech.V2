import {Schema, model} from 'mongoose';

// 1. Ensure you have a User Model defined
export const User = model('User', new Schema({
        userID: {type: String, required: true},
        firstName: { type: String, required: true },
        middleName: {type: String, required: false},
        lastName: {type: String, required: true},
        email: {type: String, required: false},
        username: {type: String, required: true},
        password: {type: String, required: true},
        role: {type: String, required: true},
        createdAt: {type: Date, required: true},
}, {collection: "user"}));
