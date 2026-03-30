/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {useState, useEffect} from 'react'
import "../../../assets/styles/EditDocumentModal.css";
import api from '../../../shared/api';

// List of available issuance types used to populate the dropdown select
const items = [
    '--SELECT--',
    'Administrative Order',
    'Memorandum Circular',
    'Office Circular',
    'Office Memorandum',
    'Office Order',
    'Resolution',
    'CSC Issuance',
    'OLA Opinion',
    'MOA / MOU',
    'Project Contract',
    'Memorandum Order'
];

// Props passed from parent component to control modal behavior and provide selected document data
interface EditDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedData: any;
}

const EditDocumentModal: React.FC<EditDocumentModalProps> = ({isOpen, onClose, selectedData}) => {
  // 2. Initialize state with empty values
  const [documentNo, setDocumentNo] = useState("");
  const [newDocumentNo, setNewDocumentNo] = useState("");
  const [issuanceType, setIssuanceType] = useState("");
  const [series, setSeries] = useState("");
  const [date, setDate] = useState("");
  const [subject, setSubject] = useState("");
  const [keyword, setKeyword] = useState("");
  const userID = localStorage.getItem("userID");

   // Hold the old issuance type   
  const [oldIssuanceType, setOldIssuanceType] = useState("");

  // Holds the current file URL already stored in Firebase / database
  const [oldFile, setOldFile] = useState<string>("");

  // Holds the newly uploaded file selected by the user (if they replace the document)
  const [newFile, setNewFile] = useState<File | null>(null);

   const [errors, setErrors] = useState<any>({});

  // FORM VALIDATION
  const validateForm = () => {

    const newErrors: any = {};

    if (!issuanceType || issuanceType === "--SELECT--")
      newErrors.issuanceType = "Issuance type is required";

    if (!newDocumentNo.trim())
      newErrors.documentNo = "Document number is required";

    if (!series)
      newErrors.series = "Series is required";

    if (!date)
      newErrors.date = "Date is required";

    if (!subject.trim())
      newErrors.subject = "Subject is required";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };
  
  // Handles updating the document data and sending it to the backend API
    const updateData = async (e: React.FormEvent) => {

    e.preventDefault();

    if (!validateForm()) return;

    const confirmUpdate = window.confirm(
      "Are you sure you want to update this document?"
    );

    if (!confirmUpdate) return;

    try {

      const fileData = new FormData();

      fileData.append('documentNo', documentNo);
      fileData.append('newDocumentNo', newDocumentNo);
      fileData.append('issuanceType', issuanceType);
      fileData.append('series', series);
      fileData.append('date', date);
      fileData.append('subject', subject);
      fileData.append('keyword', keyword);
      fileData.append('oldFile', oldFile);
      fileData.append('oldIssuanceType', oldIssuanceType);
    if(userID){
        fileData.append('userID', userID);
    }

      if (newFile) {
        fileData.append('myFile', newFile);
      }

      const response = await api.put(
        "/aims/documents/updateDocument",
        fileData,
        {
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      );

      if (response.data.success) {
        alert(response.data.message);
        handleClose();
      }

    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to update document!");
    }
  };

  const handleClose = () => {
    setDocumentNo("");
    setNewDocumentNo("");
    setIssuanceType("");
    setSeries("");
    setDate("");
    setSubject("");
    setKeyword("");
    setOldFile("");
    setOldIssuanceType("");
    setNewFile(null);

  onClose(); // actually close modal
};

  useEffect(() => {
    if(isOpen && selectedData){
      setDocumentNo(selectedData.documentNo || "");
      setNewDocumentNo(selectedData.documentNo || "");
      setIssuanceType(selectedData.issuanceType || "");
      setSeries(selectedData.series || "");
      setSubject(selectedData.subject || "");
      setKeyword(selectedData.keyword || "");
      setOldFile(selectedData.file || "");
      setOldIssuanceType(selectedData.issuanceType || "");

      // --- DATE FORMATTING LOGIC ---
        if (selectedData.date) {
            const rawDate = new Date(selectedData.date);
            
            // Ensure the date is valid before trying to format it
            if (!isNaN(rawDate.getTime())) {
                // toISOString() gives "YYYY-MM-DDTHH:mm:ss.sssZ"
                // split('T')[0] gives us just "YYYY-MM-DD"
                const formatted = rawDate.toISOString().split('T')[0];
                setDate(formatted);
            }
        } else {
            setDate("");
        }
        
    }
  },[isOpen, selectedData]);

  if(!isOpen) return null;
  return (
    
    <>
      <div className="modal-overlay">
        <div className="modal-container">
          <h2 className="text-center">Edit Document</h2>
          <form className="d-flex flex-column align-items-center g-3">
        <div className="row justify-content-center w-100">
        <div className="mb-3 col-md-6">
          <label htmlFor="formFile" className="form-label">Upload Document</label>
          <input 
            className="form-control" 
            type="file" 
            id="formFile"
            onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                    setNewFile(e.target.files[0]);
                }
            }}
            />
        </div>
        </div>
            <div className="row w-100 justify-content-center">
                <div className="col-md-6 mb-3">
                <label htmlFor="inputState" className="form-label">Issuance Type</label>
                <select 
                    id="inputState" 
                    className="form-select text-center"
                    autoComplete='off'
                    value={issuanceType}
                    onChange={(e) => setIssuanceType(e.target.value)}>
                    {items.map((item, index) => (
                    <option key={index} value={item}>{item}</option>
                    ))}
                </select>

                    {errors.issuanceType && (
                        <small className="text-danger">{errors.issuanceType}</small>
                    )}

                </div>
            </div>

            <div className="row w-100 justify-content-center">
                <div className="col-md-3 mb-3">
                <label htmlFor="inssuaceNo" className="form-label">Issuance No.</label>
                <input 
                    type="text" 
                    className="form-control" 
                    id="inssuaceNo"
                    value={newDocumentNo} 
                    onChange={(e) => setNewDocumentNo(e.target.value)}
                    />
                    {errors.documentNo && (
                        <small className="text-danger">{errors.documentNo}</small>
                    )} 
                </div>

                <div className="col-md-3 mb-3">
                <label htmlFor="series" className="form-label">Series</label>
                <input 
                    type="number" 
                    className="form-control" 
                    id="series" 
                    autoComplete='off'
                    value={series}
                    onChange={(e) => setSeries(e.target.value)}/>

                    {errors.series && (
                        <small className="text-danger">{errors.series}</small>
                    )}  

                </div>
            </div>

            <div className="row justify-content-center w-100">
                <div className="col-md-6 mb-3">
                    <label htmlFor="date" className="form-label">Date</label>
                    <input 
                        type="date" 
                        className="form-control" 
                        id="date" 
                        autoComplete='off'
                        value={date}
                        onChange={(e) => setDate(e.target.value)}/>
                        
                        {errors.date && (
                            <small className="text-danger">{errors.date}</small>
                        )}

                </div>
            </div>


            <div className="row w-100 justify-content-center">
                <div className="col-md-6 mb-3">
                    <label htmlFor="inputSubject" className="form-label">Subject</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        id="inputSubject"
                        autoComplete='off'
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)} />

                        {errors.subject && (
                            <small className="text-danger">{errors.subject}</small>
                        )}
                </div>
            </div>
            <div className="row w-100 justify-content-center">
                <div className="col-md-6 mb-3">
                    <label htmlFor="inputKeyword" className="form-label">Keyword</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        id="inputKeyword"
                        autoComplete='off'
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)} />
                </div>
            </div>

            <div className="row w-100 justify-content-center align-items-center">
            <div className="col-md-2 mb-3">
                  <button type="submit" className="btn btn-primary modal-btn-upload" onClick={updateData}>
                        Update
                </button>
            </div>

            <div className="col-md-2 mb-3">
                <button type="button" className="btn btn-primary modal-btn-cancel" onClick={handleClose}>
                Cancel
                </button>
            </div>
            </div>

        </form>
          <button className="modal-close" onClick={onClose}>
            Close
        </button>
        </div>
      </div>
    </> 
  );
}

export default EditDocumentModal
