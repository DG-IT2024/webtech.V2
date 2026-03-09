import { Request, Response } from "express"
import {User} from '../models/employee.model'

export const googleOAuth = async (req: Request, res: Response) =>{
    
    try{
        const {email} = req.body;
        const user = await User.findOne({email:email});
        if(!user){
            return res.status(400).json({success: false, message: "User not found!"});
        }else{
            return res.status(200).json({success: true, message: "Login Successfully!"});
        }
    }catch(error){
        console.log(error);
    }
}

export const loginUser = async (req: Request, res: Response) => {
    try{
        const {username, password} = req.body;
        const user = await User.findOne({username:username});   //Find User by email
        if(!user){
            console.log("User not found!");
            return res.status(400).json({success: false, message: "User not found!"});
        }else{
            if(user.password === password){
                return res.status(200).json({success: true, message: "Login Successfully!"});
                console.log("Login Successfully");
            }else{
                console.log("Wrong Password");
                return res.status(400).json({success: false, message: "Wrong password!"});
            }
        }
    }catch(error){
        console.log("error: ", error);
    }
}