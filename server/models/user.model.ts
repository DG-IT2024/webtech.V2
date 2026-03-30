import {Schema, model} from 'mongoose';

// 1. Ensure you have a User Model defined
export const User = model('User', new Schema({
        userID: {type: String, required: true}, // Unique identifier for the user
        firstName: { type: String, required: true },  // User's first name
        middleName: {type: String, required: false}, // Optional middle name
        lastName: {type: String, required: true}, // User's last name
        email: {type: String, required: false}, // User email (optional if using username login)
        username: {type: String, required: true}, // Username used for login
        password: {type: String, required: true}, // Encrypted user password
        role: {type: String, required: true}, // User role (e.g., admin, user)
        createdAt: {type: Date, required: true}, // Date when the account was created
}, {collection: "user"}));
