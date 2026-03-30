import { Response, Request } from "express";
import { Document } from '../models/document.model'
import {ForwardedDocument} from '../models/forwarding.model'
import { User } from '../models/user.model'
import {storage} from '../config/firebase'
import {ref, uploadBytes, getDownloadURL, deleteObject} from 'firebase/storage'

// Generate Document No.
export const generateDocumentNo = async (req: Request, res: Response) => {
    try{
        const latestDoc = await Document.aggregate([{
            $addFields: {
                documentNoInt: { $toInt: "$documentNo" }
            }
        },
        {
            $sort: { documentNoInt: -1 }
        },
        {
            $limit: 1
        }
    ]);
    const nextDocNo = latestDoc.length > 0 ? latestDoc[0].documentNoInt + 1 : 1;
    return res.status(200).json({success: true, message: "Successfully generated new document number", nextDocNo});
    }catch(error){
        return res.status(400).json({success: false, message: "Error: ", error})
    }
}
// Fetch all documents from the database
export const fetchDocuments = async(req: Request, res: Response) => {
    try{
        // Retrieve all document records
        const documents = await Document.find();
        // Send successful response with documents list
        return res.status(200).json({success: true, message: "Documents fetched successfully", documents});
    }catch(error){
        // Handle errors while fetching documents
        return res.status(400).json({success: false, message: "Error: ", error})
    }
}

//Fetch Incoming Documents
export const incomingDocuments = async (req: Request, res: Response) => {
    try{
        const userID = req.query.userID;
        const forwardedDocs = await ForwardedDocument.find(
            {"sharedWith.userID": userID},
            { documentNo: 1, _id: 0 }       //To retrived the documentNo only and drop other details
        );
        // Extract document numbers
        const documentNumbers = forwardedDocs.map(doc => doc.documentNo);
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


// Delete a document from database and Firebase storage
export const deleteDocument = async(req: Request, res: Response) => {
    try{
        // Get document number from request params
        const {documentNo} = req.params;

        // Get file path from request body
        const {file} = req.body;

        // Delete from MongoDB first, then Firebase Storage
        const document = await Document.findOneAndDelete({documentNo:documentNo});

        if(!document){
            return res.status(404).json({success: false, message: "Document not found!"});
        }

        const urlFile = ref(storage, file);
        await deleteObject(urlFile);

        return res.status(200).json({success: true, message: "Successfully deleted document"});
    }catch(error){
        // Return error if document deletion fails
        console.error("deleteDocument error:", error);
        return res.status(400).json({success: false, message: "Failed to delete document!"});
    }
}

// View or access a specific document
export const viewDocument = async(req:Request, res: Response) => {
    try{ 
        // Get document identifier
        const {documentNo} = req.params;

        // Get file reference and issuance type
        const {file, issuanceType} = req.body;

        // Create Firebase reference for the fil
        const urlFile = ref(storage, file);
        
        // Function to open file in new browser tab
        const openInNewTab = (url: string) => {
            window.open(url, "_blank");
        };
    }catch(error){
        // Handle file loading errors
        return res.status(400).json({success: false, message: "Error to load the file!"});
    }
}

// Search documents using query filters
export const searchDocuments = async(req:Request, res: Response) => {
    try{ 
        // Get query parameters from request
        const filters = req.query;

        // Create dynamic search query
        const query: Record<string, any> = {};

        // Loop through filters and build regex search
        Object.keys(filters).forEach((key) => {
            const value = filters[key];
            if (value) {
                query[key] = { $regex: value as string, $options: "i" };
            }
        });

        // Execute search query in database
        const documents = await Document.find(query);
        return res.status(200).json({success: true, message: "Documents fetched successfully", documents});       
    }catch(error){
        // Handle search errors
        return res.status(400).json({success: false, message: "Error to load the file!"});
    }
}

// Update an existing document
export const updateDocument = async(req: Request, res: Response) => {
    try{
        // Uploaded file data from request
        const fileData = (req as any).file;

        // Extract document fields from request body
        const {documentNo, newDocumentNo ,issuanceType, series, date, subject, keyword, oldFile, oldIssuanceType, userID} = req.body;
        
        // Default file URL remains the old file
        let urlFile = oldFile;
        const decodedUrl = decodeURIComponent(urlFile); 
        const path = decodedUrl.split("/o/")[1].split("?")[0];
        // If a new file is uploaded, replace the existing file
        if(fileData){
            if(oldFile){
                // Delete old file from Firebase
                const filePath = ref(storage, path);
                await deleteObject(filePath);
            }
        
            // Upload new file to Firebase storage
            const imageRef = ref(storage, `${issuanceType}/${fileData?.originalname}`);
            await uploadBytes(imageRef, fileData.buffer, {
                contentType: fileData.mimetype,
            });

            // Get new file URL after upload
            urlFile = await getDownloadURL(imageRef);
        }
        // If Issuance Type is being changed and no new file was uploaded (move existing file to new folder)
        if(oldIssuanceType !== issuanceType && !fileData){
            console.log("Old Version ", oldIssuanceType);
            console.log("New Version ", issuanceType);
            try{
                // Get reference to old file in storage
                const oldFileRef = ref(storage, oldFile);

                // Extract filename from old URL (assumes file URL contains the filename)
 
                const decodedPath = decodeURIComponent(path);
                const filename = decodedPath.split('/').pop(); 

                // Define new storage path with new issuanceType
                const newFilePath = `${issuanceType}/${filename}`;
                const newFileRef = ref(storage, newFilePath);

                 // Get file data as blob
                const fileUrl = await getDownloadURL(oldFileRef);
                const response = await fetch(fileUrl);
                const blob = await response.blob();

                // Upload the same file to new location
                await uploadBytes(newFileRef, blob);

                // Delete the old file
                await deleteObject(oldFileRef);

                // Update URL for database
                urlFile = await getDownloadURL(newFileRef);

            }catch(error){
                // Handle update errors
                console.error("updateDocument (issuance type change) error:", error);
                return res.status(400).json({success: false, message: "Error to Update file!"});
            }
        }

         // Document filter condition
         const filter = {documentNo:documentNo};

            // Updated document fields
            const update = {
                documentNo : newDocumentNo,
                issuanceType : issuanceType,
                series : series,
                date : date,
                subject : subject,
                keyword : keyword,
                file: urlFile,
                userID: userID,
            };
            // Update document in database
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
        // Handle update errors
        console.error("updateDocument error:", error);
        return res.status(400).json({success: false, message: "Error to Update file!"});
    }
}

// Add a new document
export const addDocument = async(req: Request, res: Response) => {
    try{
        // Uploaded file information
        const fileData = (req as any).file;
        if (!fileData) {
            return res.status(400).json({ success: false, message: "No file uploaded!" });
        }
        // Extract document details from request body
        const {documentNo, issuanceType, series, date, subject, keyword, file, userID} = req.body;

         // Check if document already exists
        const existingDoc = await Document.findOne({ documentNo });
        if (existingDoc) {
            return res.status(409).json({ success: false, message: "Document already exists!" });
        }

        // Upload file to Firebase storage
        const imageRef = ref(storage, `${issuanceType}/${fileData.originalname}`);
        await uploadBytes(imageRef, fileData.buffer, {
            contentType: fileData.mimetype,
        });

        // Get public download URL
        const url = await getDownloadURL(imageRef);
        // Create new document object
        const newDocument = new Document({
            documentNo : documentNo,
            issuanceType : issuanceType,
            series : series,
            date : date,
            subject : subject,
            keyword : keyword,
            file : url,
            uploadDate : new Date(),
            userID : userID,
        })

        // Save document to database
        await newDocument.save();
        return res.status(200).json({success: true, message: "Successfully upload new document!"});
    }catch(error){
        // Handle document creation errors
        console.error("addDocument error:", error);
        return res.status(500).json({success: false, message: "Failed to add new document!"});

    }
}

export const shareDocuments = async(req: Request, res: Response) => {
    try{
        const {emails, documentNo} = req.body;
        // Find all existing users
        const users = await User.find({
            email: { $in: emails }
        });
        // Extract found emails
        // const foundEmails = users.map(u => u.email);
        // Extract user IDs
        const userIds = users.map(u => u.userID);
        // Find the document
        const doc = await ForwardedDocument.findOne({ documentNo });
        if (!doc) {
            // Document does not exist → create new
            const newSharedWith = userIds.map(id => ({
                userID: id,
                forwardedAt: new Date()
            }));
            const newDoc = new ForwardedDocument({
                documentNo : documentNo,
                sharedWith: newSharedWith
            });
            await newDoc.save();
            return res.json({success: true, message: "Successfully forwarded document!"});
        }

        // Document exists → update sharedWith while preventing duplicates
        const existingUserIds = doc.sharedWith.map(u => u.userID);
        const newUsers = userIds
            .filter(id => !existingUserIds.includes(id))
            .map(id => ({
                userID: id,
                forwardedAt: new Date()
            }));

             // Only push if there are new users
        if (newUsers.length > 0) {
            await ForwardedDocument.updateOne(
                { documentNo: documentNo },
                { $addToSet: { sharedWith: { $each: newUsers } } }
            );
            return res.json({success: true, message: "Successfully forwarded document!"});
        } else {
            return res.json({success: false, message: "Documents already forwarded!"});
        }
    }catch{
        // Handle document creation errors
        return res.status(401).json({success: false, message: "Failed to share document!"});   
    }
}

