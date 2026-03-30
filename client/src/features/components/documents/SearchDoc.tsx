/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import api from '../../../shared/api';
import Table, { type columnConfig } from '../../../shared/components/ui/Table';
import "../../../assets/styles/Table.css";
import EditDocumentModal from './EditDocumentModal';
import "../../../assets/styles/SearchDoc.css";
import ShareDocumentModal from './ShareDocumentModal';

// Document type dropdown
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

const SearchDoc = () => {
  const [dataTable, setDataTable] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [issuanceType, setIssuanceType] = useState("");
  const [documentNo, setDocumentNo] = useState("");
  const [series, setSeries] = useState("");
  const [date, setDate] = useState("");
  const [subject, setSubject] = useState("");
  const [keyword, setKeyword] = useState("");
  const [selectedDocumentNo, setSelectedDocumentNo] = useState<string | null>(null);
  const [selectedIssuanceType, setSelectedIssuancetype] = useState<string | null>(null);
  // Local storage for role from login
  const role = localStorage.getItem("role");

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const toggleModal = (item: any = null) => {
    setSelectedDoc(item);
    setIsModalOpen(!isModalOpen);
    if (isModalOpen) fetchDocuments(); // refresh after modal closes
  };

  const toggleShareModal = (docNo: string, type: string) => {
    setSelectedDocumentNo(docNo);
    setSelectedIssuancetype(type);
    setIsShareModalOpen(true);
  }
  const closeShareModal = () => setIsShareModalOpen(false);

  interface documentData {
    selectedData: any;
    documentNo: string;
    issuanceType: string;
    file: string;
    series: string;
    date: string;
    subject: string;
    keyword: string;
  }

  const columns: columnConfig<documentData>[] = [
    { header: "No.", key: "documentNo" },
    { header: "Type", key: "issuanceType" },
    { header: "Series", key: "series" },
    { header: "Date", key: "date", render: (item) => new Date(item.date).toLocaleDateString('en-PH') },
    { header: "Subject", key: "subject" },
    { header: "Keyword", key: "keyword" },
    {
      header: "Action", key: "actions", render: (item) => (
        <>
          {role === "Admin" ? (
            <>
              <img src="/forward.png" className='tbl-Icon' onClick={()=> toggleShareModal(item.documentNo, item.issuanceType)} />
              <img src="/pen.png" className='tbl-Icon' onClick={() => toggleModal(item)} />
              <img src="/delete.png" className='tbl-Icon' onClick={() => handleDelete(item.documentNo, item.file)} />
              <img src="/download.png" className='tbl-Icon' onClick={() => handleViewFile(item.file)} />
            </>
            ) : (
              <img src="/download.png" className='tbl-Icon' onClick={() => handleViewFile(item.file)} />
            )
          }
        </>
      )
    }
  ];

  const handleDelete = async (documentNo: string, file: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this document?");
    if (!confirmed) return;

    const response = await api.delete(`/aims/documents/deleteDocument/${documentNo}`, {
      data: { file }
    });

    alert(response.data.message);
    fetchDocuments();
  }

  const handleViewFile = async (file: string) => {
    window.open(file, "_blank");
  }

  const fetchDocuments = async () => {
    const response = await api.get("/aims/documents/allDocuments");
    setDataTable(response.data.documents ?? response.data ?? []);
  }

  // ✅ Validation before search
  const searchDocuments = async () => {
    const newErrors: Record<string, string> = {};

    if (issuanceType && issuanceType === '--SELECT--') newErrors.issuanceType = "Please select a valid Issuance Type";
    if (series && isNaN(Number(series))) newErrors.series = "Series must be a number";
    if (date && new Date(date).toString() === "Invalid Date") newErrors.date = "Invalid date";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    const confirmed = window.confirm("Search documents with current filters?");
    if (!confirmed) return;

    const filters: Record<string, any> = {};
    if (issuanceType && issuanceType !== '--SELECT--') filters.issuanceType = issuanceType;
    if (documentNo) filters.documentNo = documentNo;
    if (series) filters.series = series;
    if (date) filters.date = date;
    if (subject) filters.subject = subject;
    if (keyword) filters.keyword = keyword;

    const response = await api.get("/aims/documents/searchDocuments", { params: filters });
    setDataTable(response.data.documents ?? response.data ?? []);
  }

  useEffect(() => {
    fetchDocuments();
  }, []);

  return (
    <div className="searchdoc-layout">
      <div className="searchdoc-filters">
        <div className="searchdoc-card">
          <h4 className="text-center mb-3">Search Documents</h4>
          <form className="d-flex flex-column">

            <div className="mb-3">
              <label className="form-label">Issuance Type</label>
              <select 
                id="inputState" 
                className="form-select text-center"
                autoComplete='off'
                value={issuanceType}
                onChange={(e) => setIssuanceType(e.target.value)}>
                {items.map((item, index) => <option key={index} value={item}>{item}</option>)}
              </select>
              {errors.issuanceType && <small className="text-danger">{errors.issuanceType}</small>}
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Issuance No.</label>
                <input type="text" className="form-control" value={documentNo} onChange={(e) => setDocumentNo(e.target.value)} />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Series</label>
                <input type="number" className="form-control" value={series} onChange={(e) => setSeries(e.target.value)} />
                {errors.series && <small className="text-danger">{errors.series}</small>}
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Date</label>
              <input type="date" className="form-control" value={date} onChange={(e) => setDate(e.target.value)} />
              {errors.date && <small className="text-danger">{errors.date}</small>}
            </div>

            <div className="mb-3">
              <label className="form-label">Subject</label>
              <input type="text" className="form-control" value={subject} onChange={(e) => setSubject(e.target.value)} />
            </div>

            <div className="mb-3">
              <label className="form-label">Keywords</label>
              <input type="text" className="form-control" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
            </div>

            <button type="button" className="btn btn-primary searchdoc-btn" onClick={searchDocuments}>
              Search
            </button>

          </form>
        </div>
      </div>

      <div className="searchdoc-table">
        <Table data={dataTable} columns={columns}/>
      </div>

      <EditDocumentModal
        isOpen={isModalOpen}
        onClose={() => toggleModal(null)}
        selectedData={selectedDoc}
      />

      <ShareDocumentModal
        isOpen={isShareModalOpen}
        onClose={closeShareModal}
        documentNo={selectedDocumentNo}
        issuanceType = {selectedIssuanceType}
      />
    </div>
  );
}

export default SearchDoc;