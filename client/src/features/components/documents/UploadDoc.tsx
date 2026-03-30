/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import api from '../../../shared/api';

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

  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const userID = localStorage.getItem("userID");
  const [fileKey, setFileKey] = useState(Date.now()); // unique key for file input

  const resetForm = () => {
    const confirmed = window.confirm("Are you sure you want to empty the form?");
    if (!confirmed) return;
     // Reset form
        setFile(null);
        setDocumentNo("");
        setIssuanceType("");
        setSeries("");
        setDate("");
        setSubject("");
        setKeyword("");
        setFile(null);
        setFileKey(Date.now()); // change key to force input reset
  }
  const validateForm = () => {
    const newErrors: any = {};

    if (!file) newErrors.file = "Document file is required";
    if (!issuanceType || issuanceType === "--SELECT--")
      newErrors.issuanceType = "Issuance type is required";
    if (!documentNo.trim())
      newErrors.documentNo = "Issuance number is required";
    if (!series) newErrors.series = "Series is required";
    if (!date) newErrors.date = "Date is required";
    if (!subject.trim()) newErrors.subject = "Subject is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const confirmUpload = window.confirm("Upload this document?");
    if (!confirmUpload) return;

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('myFile', file as Blob);
      formData.append('documentNo', documentNo);
      formData.append('issuanceType', issuanceType);
      formData.append('series', series);
      formData.append('date', date);
      formData.append('subject', subject);
      formData.append('keyword', keyword);

      if (userID) formData.append("userID", userID);

      const res = await api.post(
        "/aims/documents/uploadDocument",
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      if (res.data.success) {
        alert(res.data.message);

        resetForm();
        setErrors({});
      }

    } catch (err: any) {
      alert(err.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-0 d-flex justify-content-center">
      <div className="card shadow-lg p-4" style={{ width: "700px" }}>
        <h4 className="text-center mb-4">Upload Document</h4>

        <form onSubmit={handleUpload}>

          {/* FILE */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Document File</label>
            <input
              type="file"
              key={fileKey}   // this forces React to recreate the input
              className="form-control"
              onChange={(e) => {
                if (e.target.files?.[0]) setFile(e.target.files[0]);
              }}
            />
            {errors.file && <small className="text-danger">{errors.file}</small>}
          </div>

          {/* ISSUANCE TYPE */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Issuance Type</label>
            <select
              className="form-select"
              value={issuanceType}
              onChange={(e) => setIssuanceType(e.target.value)}
            >
              {items.map(item => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
            {errors.issuanceType && <small className="text-danger">{errors.issuanceType}</small>}
          </div>

          {/* ROW: DOC NO + SERIES */}
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Issuance No.</label>
              <input
                type="text"
                className="form-control"
                value={documentNo}
                onChange={(e) => setDocumentNo(e.target.value)}
              />
              {errors.documentNo && <small className="text-danger">{errors.documentNo}</small>}
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Series</label>
              <input
                type="number"
                className="form-control"
                value={series}
                onChange={(e) => setSeries(e.target.value)}
              />
              {errors.series && <small className="text-danger">{errors.series}</small>}
            </div>
          </div>

          {/* DATE */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Date</label>
            <input
              type="date"
              className="form-control"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            {errors.date && <small className="text-danger">{errors.date}</small>}
          </div>

          {/* SUBJECT */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Subject</label>
            <input
              type="text"
              className="form-control"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
            {errors.subject && <small className="text-danger">{errors.subject}</small>}
          </div>

          {/* KEYWORDS */}
          <div className="mb-4">
            <label className="form-label fw-semibold">Keywords</label>
            <input
              type="text"
              className="form-control"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>

          {/* ACTIONS */}
          <div className="d-flex justify-content-between">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Uploading..." : "Upload"}
            </button>

            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={resetForm}
            >
              Clear
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default UploadDoc;