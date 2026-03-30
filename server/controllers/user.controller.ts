// src/controllers/employee.controller.ts
import { Request, Response } from "express";
import {User} from '../models/user.model';
import bcrypt from 'bcrypt';

// Generate User ID.
export const generateUserID = async (req: Request, res: Response) => {
    try{
        const latestID = await User.aggregate([{
            $addFields: {
                userIDInt: { $toInt: "$userID" }
            }
        },
        {
            $sort: { userIDInt: -1 }
        },
        {
            $limit: 1
        }
    ]);
    const nextID = latestID.length > 0 ? latestID[0].userIDInt + 1 : 1;
    return res.status(200).json({success: true, message: "Successfully generated new user ID", nextID});
    }catch(error){
        return res.status(400).json({success: false, message: "Error: ", error})
    }
}

// Hashing of Password
const hashPassword = async (password: string) : Promise<string> => {
    const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS));
    return await bcrypt.hash(password, salt);
};
// To Fetch All Employees
export const getAllEmployees = async (req: Request, res: Response) => {
    try{
        // Fetch all employees from the database
        const users = await User.find();
        // Return successful response with employee list
        return res.status(200).json({success: true, message: "Employees fetched successfully", users});
    }catch(error){
        // Handle error if database query fails
        return res.status(400).json({success: false, message: "Error: ", error})
    }
}

// Add a new employee to the database
export const addEmployee = async(req: Request, res: Response) => {
    try{
        // Extract employee data from request body
        const {userID, fname, mname, lname, email, userName, password, role} = req.body;
        
        // Hash result password
        const hashedPassword = await hashPassword(password);
        
        // Check if employee ID already exists
        const empID = await User.findOne({userID:userID});
       
        // Check if email is already used
        const empEmail = await User.findOne({email:email});
       
        if(empID){
            // Prevent duplicate employee ID
            return res.status(400).json({success: false, message:"Employee ID already exist!"});
        }else{
            if(empEmail){
                // Prevent duplicate email
                return res.status(400).json({success: false, message:"Email already exist!"});
            }else{
                // Create new employee document
                const newEmployee = new User({
                    userID : userID,
                    firstName : fname,
                    middleName : mname,
                    lastName : lname,
                    email : email,
                    username : userName,
                    password : hashedPassword,
                    role: role,
                    createdAt: Date.now() // Record creation timestamp
                });
                // Save employee to database
                await newEmployee.save();
                // Send success response after saving employee
            }   return res.status(200).json({success: true, message:"Successfully added new employee!"});
        }
    }catch(error){
        // Handle server or database errors
        return res.status(400).json({success: false, message:"Error to add employees!"});
    }
}

// Update an existing employee
export const updateEmployee = async(req: Request, res: Response) => {
    try{
        // Get employee ID from request parameters
        const {userID} = req.params;

        // Extract updated employee data
        const {fname, mname, lname, email, userName, password, role} = req.body;
        
        // Hash result password
        const hashedPassword = await hashPassword(password);

        // Filter to locate employee in database
        const filter = {userID:userID};
        
        // Updated fields to apply
        const update = {
            firstName : fname,
            middleName : mname,
            lastName : lname,
            email : email,
            username : userName,
            password : hashedPassword,
            role: role
        };

        // Update employee record
        const response = await User.findOneAndUpdate(filter, update,{
            new: true, // Return the updated document
            runValidators: true //to ensure the schema validation
        });

        if(!response){
            // Employee not found
            return res.status(400).json({success: false, message:"Employee doesn't exist!"});
        }else{
            // Employee updated successfully
            return res.status(200).json({success: true, message:"Successfully updated employee!"});
        }
    }catch(error){
        // Handle update errors
        return res.status(400).json({success: false, message:"Error to update employees!"});
    }
}

// Delete an employee from the database
export const deleteEmployee = async (req: Request, res: Response) => {
    try{
        // Get employee ID from request parameters
        const {userID} = req.params;
        // Delete employee record
        const response = await User.findOneAndDelete({userID:userID});

        if(response){
            // Deletion successful
            return res.status(200).json({success: true, message:"Successfully deleted employee!"});
        }else{
            // Employee not found
            return res.status(400).json({success: false, message:"No employee found!"});
        }
    }catch(error){
        // Handle deletion errors
        return res.status(400).json({success: false, message:"Error to delete employees!"});
    }
}
