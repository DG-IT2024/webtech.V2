import {useState} from 'react'
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

const UploadDoc = () => {
    const [documentNo, setDocumentNo] = useState("");
    const [issuanceType, setIssuanceType] = useState("");
    const [series, setSeries] = useState("");
    const [date, setDate] = useState("");
    const [subject, setSubject] = useState("");
    const [keyword, setKeyword] = useState("");
    const [file, setFile] = useState<File | null>(null);

    const handlebtnUpload= async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        try{
            if (!file) {
                alert("Please select a file.");
                return;
            }
            const fileData = new FormData();
            fileData.append('myFile', file);
            fileData.append('documentNo', documentNo);
            fileData.append('issuanceType', issuanceType);
            fileData.append('series', series);
            fileData.append('date', date);
            fileData.append('subject', subject);
            fileData.append('keyword', keyword);

        const response = await axios.post("http://localhost:8080/aims/documents/uploadDocument", fileData,{
            headers: {'Content-Type': 'multipart/form-data'}
        });
        if(response.data.success){
            alert(response.data.message);
        }
        
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }catch(error: any){
            alert(error.response?.data?.message || "Failed to Add New Document!");
        }
  }


  return (
    <div>
      <h2 className="text-center">Upload Document Component</h2>

      <form className="d-flex flex-column align-items-center g-3">
        <div className="row justify-content-center w-100">
        <div className="mb-3 col-md-6">
          <label htmlFor="formFile" className="form-label">Upload Document</label>
          <input 
            className="form-control" 
            type="file" 
            id="formFile"
            autoComplete='off'
            onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                    setFile(e.target.files[0]);
                }
        }}/>
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
                    autoComplete='off'
                    value={documentNo}
                    onChange={(e) => setDocumentNo(e.target.value)}/>
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
                <div className="col-md-6 mb-3 ">
                    <label htmlFor="inputKeyWords" className="form-label">Key Words</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        id="inputKeyWords"
                        autoComplete='off'
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}/>
                </div>
            </div>
            <div className="row w-100 justify-content-center align-items-center">
              <div className="col-md-2 mb-3">
              <button type="submit" className="btn btn-primary" onClick={handlebtnUpload}>Upload</button>
              </div>
              <div className="col-md-2 mb-3">
              <button type="submit" className="btn btn-primary color-red">Cancel</button>
              </div>   
            </div>

        </form>
    </div>
  )
}

export default UploadDoc