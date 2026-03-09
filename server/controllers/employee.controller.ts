// src/controllers/employee.controller.ts
import { Request, Response } from "express";
import {User} from '../models/employee.model';

// To Fetch All Employees
export const getAllEmployees = async (req: Request, res: Response) => {
    try{
        const users = await User.find();
        return res.status(200).json({success: true, message: "Employees fetched successfully", users});
    }catch(error){
        return res.status(400).json({success: false, message: "Error: ", error})
    }
}

// Adding of New Employee
export const addEmployee = async(req: Request, res: Response) => {
    try{
        const {userID, fname, mname, lname, email, userName, password, role} = req.body;
        const empID = await User.findOne({userID:userID});
        const empEmail = await User.findOne({email:email});
        if(empID){
            return res.status(400).json({success: false, message:"Employee ID already exist!"});
        }else{
            if(empEmail){
                return res.status(400).json({success: false, message:"Email already exist!"});
            }else{
                const newEmployee = new User({
                    userID : userID,
                    firstName : fname,
                    middleName : mname,
                    lastName : lname,
                    email : email,
                    username : userName,
                    password : password,
                    role: role,
                    createdAt: Date.now()
                });
                await newEmployee.save();
            }   return res.status(200).json({success: true, message:"Successfully added new employee!"});
        }
    }catch(error){
        return res.status(400).json({success: false, message:"Error to add employees!"});
    }
}

//Update Employee
export const updateEmployee = async(req: Request, res: Response) => {
    try{
        const {userID} = req.params;
        const {fname, mname, lname, email, userName, password, role} = req.body;
        const filter = {userID:userID};
        const update = {
            firstName : fname,
            middleName : mname,
            lastName : lname,
            email : email,
            username : userName,
            password : password,
            role: role
        };

        const response = await User.findOneAndUpdate(filter, update,{
            new: true,
            runValidators: true //to ensure the schema validation
        });

        if(!response){
            return res.status(400).json({success: false, message:"Employee doesn't exist!"});
        }else{
            return res.status(200).json({success: true, message:"Successfully updated employee!"});
        }
    }catch(error){
        return res.status(400).json({success: false, message:"Error to update employees!"});
    }
}

// Delete Employee
export const deleteEmployee = async (req: Request, res: Response) => {
    try{
        const {userID} = req.params;
        const response = await User.findOneAndDelete({userID:userID});
        if(response){
            return res.status(200).json({success: true, message:"Successfully deleted employee!"});
        }else{
            return res.status(400).json({success: false, message:"No employee found!"});
        }
    }catch(error){
        return res.status(400).json({success: false, message:"Error to delete employees!"});
    }
}
