import { Request, Response } from "express"
import {User} from '../models/user.model'
import bcrypt from 'bcrypt';

export const googleOAuth = async (req: Request, res: Response) =>{
    
    try{
        // Extract the email sent from the frontend after Google OAuth authentication
        const {email} = req.body;

        // Check if a user with this email already exists in the database
        const user = await User.findOne({email:email});

        // If the user does not exist, return an error response
        if(!user){
            return res.status(400).json({success: false, message: "User not found!"});
        }else{
            // If user exists, allow login
            return res.status(200).json({success: true, message: "Login Successfully!", user});
        }
    }catch(error){
        console.log(error);
    }
}

export const loginUser = async (req: Request, res: Response) => {
    try{
        // Extract login credentials sent from the client
        const {username, password} = req.body;

        // Find user in the database using the provided username
        const user = await User.findOne({username:username});   //Find User by email
        
        // If the user does not exist in the database
        if(!user){
            console.log("User not found!");
            return res.status(400).json({success: false, message: "User not found!"});
        }else{
            // Compare the provided password with the stored password
            if(await bcrypt.compare(password, user.password)){
                return res.status(200).json({success: true, message: "Login Successfully!", user});
            }else{
                // If password does not match, deny login
                return res.status(400).json({success: false, message: "Wrong password!"});
            }
        }
    }catch(error){
        // Catch and log any unexpected server errors
        console.log("error: ", error);
    }
}