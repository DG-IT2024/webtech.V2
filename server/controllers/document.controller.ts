import { Response, Request } from "express";
import { Document } from '../models/document.model'
import {storage} from '../config/firebase'
import {ref, uploadBytes, getDownloadURL, deleteObject} from 'firebase/storage'
import { addEmployee } from "./employee.controller";

//To fetch all documents
export const fetchDocuments = async(req: Request, res: Response) => {
    try{
        const documents = await Document.find();
        return res.status(200).json({success: true, message: "Documents fetched successfully", documents});
    }catch(error){
        return res.status(400).json({success: false, message: "Error: ", error})
    }
}

// To delete documents
export const deleteDocument = async(req: Request, res: Response) => {
    try{
        const {documentNo} = req.params;
        const {file} = req.body;
        const document = await Document.findOneAndDelete({documentNo:documentNo});
        const urlFile = ref(storage, file);
        await deleteObject(urlFile);
        if(document){
            return res.status(200).json({success: true, message: "Successfully deleted document"});
        }
    }catch(error){
        return res.status(400).json({success: false, message: "Document not found!"});
    }
}

//To view document
export const viewDocument = async(req:Request, res: Response) => {
    try{ 
        const {documentNo} = req.params;
        const {file, issuanceType} = req.body;
        const urlFile = ref(storage, file);
        const openInNewTab = (url: string) => {
            window.open(url, "_blank");
        };
    }catch(error){
        return res.status(400).json({success: false, message: "Error to load the file!"});
    }
}

// To search documents
export const searchDocuments = async(req:Request, res: Response) => {
    try{ 
        const filters = req.query;
        const query: Record<string, any> = {};
        Object.keys(filters).forEach((key) => {
            const value = filters[key];
            if (value) {
                query[key] = { $regex: value as string, $options: "i" };
            }
        });
        const documents = await Document.find(query);
        return res.status(200).json({success: true, message: "Documents fetched successfully", documents});       
    }catch(error){
        return res.status(400).json({success: false, message: "Error to load the file!"});
    }
}

// To updatedDocument
export const updateDocument = async(req: Request, res: Response) => {
    try{
        const fileData = req.file;
        const {documentNo, newDocumentNo ,issuanceType, series, date, subject, keyword, oldFile, newFile} = req.body;
        
        let urlFile = oldFile;
        if(fileData){
            const fileRef = ref(storage, oldFile);
            await deleteObject(fileRef);
            // To save the image
            console.log("New image", fileData.originalname);
            const imageRef = ref(storage, `${issuanceType}/${fileData?.originalname}`);
            await uploadBytes(imageRef, fileData.buffer, {
                contentType: fileData.mimetype,
            });
            urlFile = await getDownloadURL(imageRef);
            console.log("New URL: ", urlFile);
        }
        console.log("old File is : "+urlFile);
         const filter = {documentNo:documentNo};
            const update = {
                documentNo : newDocumentNo,
                issuanceType : issuanceType,
                series : series,
                date : date,
                subject : subject,
                keyword : keyword,
                file: urlFile,
                employeeID: "00001"
            };

            const response = await Document.findOneAndUpdate(filter, update,{
                new: true,
                runValidators: true //to ensure the schema validation
            });

            if(!response){
                return res.status(400).json({success: false, message:"Document doesn't exist!"});
            }else{
                return res.status(200).json({success: true, message:"Successfully updated Document!"});
            }
    }catch(error){
        return res.status(400).json({success: false, message: "Error to Update file!"});
    }
}
//To addDocuments
export const addDocument = async(req: Request, res: Response) => {
    try{
        const fileData = req.file;
        const {documentNo, issuanceType, series, date, subject, keyword, file} = req.body;

         // Check if document already exists
        const existingDoc = await Document.findOne({ documentNo });
        if (existingDoc) {
            return res.status(401).json({ success: false, message: "Document already exists!" });
        }
        const response = await Document.findOne({documentNo:documentNo});
        if(!response){
             // To save the image
            const imageRef = ref(storage, `${issuanceType}/${fileData.originalname}`);
            await uploadBytes(imageRef, fileData.buffer, {
                contentType: fileData.mimetype,
            });
            const url = await getDownloadURL(imageRef);

            const newDocument = new Document({
                documentNo : documentNo,
                issuanceType : issuanceType,
                series : series,
                date : date,
                subject : subject,
                keyword : keyword,
                file : url,
                uploadDate : new Date(),
                employeeID : "00001",
            })
            await newDocument.save();
            return res.status(200).json({success: true, message: "Successfully upload new document!"});
        }else{
            return res.status(401).json({success: false, message: "Document already exist!"});
        }
    }catch{
        return res.status(401).json({success: false, message: "Failed to add new document!"});
        
    }
}

