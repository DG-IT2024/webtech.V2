import { Response, Request } from "express";
import { acknowledgementDocumentModel } from '../models/acknowledgement.model'
import {ForwardedDocument} from '../models/forwarding.model'
import { Document } from "../models/document.model";

//Method that will delete the object inside the shareWith in forwarding collection mongodb
const delUserID = async (documentNo: string, userID: string) => {
    try{
        await ForwardedDocument.updateOne(
            { documentNo: documentNo },        // find the document
            {
            $pull: {                        // remove from array
                sharedWith: { userID: userID } // remove array element where userID matches
            }
            }
        );

        // Delete document if sharedWith is now empty
        await ForwardedDocument.deleteOne({
            documentNo,
            sharedWith: { $size: 0 }
        });
        return true;
    }catch(error){
        return false;
    }
};

//To save data in acknowledgement model
const saveAcknowledgeDocument = async(documentNo: string, userID: string, status: string) => {
    try{
        // Find the document
        const doc = await acknowledgementDocumentModel.findOne({ documentNo });
        const sharedWith = {
            userID: userID,
            acknowledgementDate: new Date(),
            status: status
        };
        if (!doc) {
            // Document does not exist → create new
            await acknowledgementDocumentModel.create({
                documentNo : documentNo,
                sharedWith: [sharedWith]
            });
            return true;
        }

        // Document exists → update sharedWith while preventing duplicates
        const exists = doc.sharedWith.some(u => u.userID === userID);
        if (exists) {
           // Update the status of existing user
            await acknowledgementDocumentModel.updateOne(
                { documentNo, "sharedWith.userID": userID },
                {
                $set: {
                    "sharedWith.$.status": status,
                    "sharedWith.$.acknowledgementDate": new Date()
                }
                }
            );
            return true;
        }
        // Add new user
        await acknowledgementDocumentModel.updateOne(
            { documentNo },
            {
                $push: { sharedWith: sharedWith }
            }
        );
        return true;
    }catch{
        // Handle document creation errors
        return false;   
    }
}

export const acknowledgeDocument = async (req: Request ,res: Response) => {
    try{
        
        const {documentNo, action, userID} = req.body;
        // Save acknowledgement first
        const acknowledged = await saveAcknowledgeDocument(documentNo, userID, action);
        if (!acknowledged) {
            return res.status(400).json({ success: false, message: "User already acknowledged this document." });
        }
        // Remove user from forwarded document if needed
        const deletionSuccess = await delUserID(documentNo, userID);
        return res.status(200).json({ success: true, message: `Document successfully ${action}!` });
    }catch(error){
        return res.status(400).json({success: false, message: "Error: ", error})
    }
}

//Fetch my Documents
export const myDocuments = async (req: Request, res: Response) => {
    try{
        const userID = req.query.userID;
        const myDocs = await acknowledgementDocumentModel.find(
           { 
                sharedWith: { 
                    $elemMatch: { 
                        userID: userID, 
                        status: "Accept"
                    } 
                } 
            },
            { documentNo: 1, _id: 0 }
        ).lean();
        // Extract document numbers
        const documentNumbers = myDocs.map(doc => doc.documentNo);
        //Retrieved document details in document collection
        const documents = await Document.find({
            documentNo: { $in: documentNumbers }
        });
        return res.status(200).json({success: true, message: "Documents fetched successfully", documents});
    }catch(error){
        // Handle errors while fetching documents
        return res.status(400).json({success: false, message: "Error: ", error})
    }
}