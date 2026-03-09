/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {useState, useEffect} from 'react'
import "../../../assets/styles/EditDocumentModal.css";
import axios from 'axios';

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
  const [oldFile, setOldFile] = useState<string>("");   // existing Firebase file URL
  const [newFile, setNewFile] = useState<File | null>(null);  // new uploaded file
  
  const updateData = async (e: { preventDefault: () => void; }) => {
    e.preventDefault(); 
   
    const fileData = new FormData();
    fileData.append('documentNo', documentNo);
    fileData.append('newDocumentNo', newDocumentNo);
    fileData.append('issuanceType', issuanceType);
    fileData.append('series', series);
    fileData.append('date', date);
    fileData.append('subject', subject);
    fileData.append('keyword', keyword);
    fileData.append('oldFile', oldFile);
    // ✅ Only append if file exists
    if (newFile) {
        fileData.append('myFile', newFile);
    }

    const response = await axios.put("http://localhost:8080/aims/documents/updateDocument", fileData,{
            headers: {'Content-Type': 'multipart/form-data'}
    });
    if(response.data.success){
        alert(response.data.message);
    }
  }

  const handleClose = () => {
    setDocumentNo("");
    setNewDocumentNo("");
    setIssuanceType("");
    setSeries("");
    setDate("");
    setSubject("");
    setKeyword("");
    setOldFile("");
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
