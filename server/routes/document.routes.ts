import { Router } from "express"
import { addDocument, fetchDocuments, deleteDocument, viewDocument, updateDocument, searchDocuments } from "../controllers/document.controller"
import multer from 'multer'

// Use memoryStorage so the file is available in req.file.buffer
const storage = multer.memoryStorage();
const upload = multer({storage: storage});

const router = Router();
router.post('/uploadDocument', upload.single('myFile'), addDocument);
router.put('/updateDocument', upload.single('myFile'), updateDocument);
router.get('/allDocuments', fetchDocuments);
router.get('/searchDocuments', searchDocuments);
router.delete('/deleteDocument/:documentNo', deleteDocument);
router.get('/viewDocument/:documentNo', viewDocument);


export default router;
