/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Info } from "lucide-react";
import "../../../assets/styles/IncomingDoc.css";
import api from '../../../shared/api';
import Table, { type columnConfig } from '../../../shared/components/ui/Table';

 // Static mock data representing incoming documents. In a real application, this would likely come from an API call to the backend.
const IncomingDoc = () => {
  const [dataTable, setDataTable] = useState([]);
  const userID = localStorage.getItem("userID");

  interface documentData {
    selectedData: any;
    documentNo: string;
    issuanceType: string;
    subject: string;
    file: string;
    date: string;
  }

  
  const columns: columnConfig<documentData>[] = [
      { header: "No.", key: "documentNo" },
      { header: "Type", key: "issuanceType" },
      { header: "Subject", key: "subject" },
      { header: "Date", key: "date", render: (item) => new Date(item.date).toLocaleDateString('en-PH') },
      {
        header: "Action", key: "actions", render: (item) => (
          <>
            <button className="btn accept" onClick={() => acknowledgeDocument(item.documentNo, "Accept")}><CheckCircle size={14} /> Accept</button>
            <button className="btn decline" onClick={() => acknowledgeDocument(item.documentNo, "Declined")}><XCircle size={14} /> Declined</button>
            <button className="btn details" onClick={() => showDetails(item.file)}><Info size={14} /> Details</button>
            {/* <img src="../public/forward.png" className='tbl-Icon' onClick={()=> toggleShareModal(item.documentNo)} />
            <img src="../public/pen.png" className='tbl-Icon' onClick={() => toggleModal(item)} />
            <img src="../public/delete.png" className='tbl-Icon' onClick={() => handleDelete(item.documentNo, item.file)} />
            <img src="../public/download.png" className='tbl-Icon' onClick={() => handleViewFile(item.file)} /> */}
          </>
        )
      }
  ];

  // Method for accept button
  const acknowledgeDocument = async (documentNo: string, action: string) => {
    try {
      alert("Action is: "+ action);
      const response = await api.post("/aims/documents/acknowledgeDocument", {
        documentNo, action, userID
      });
      if(response.data.success){
        alert(response.data.message);
        fetchDocuments();
      }
      

    } catch (error) {
      console.error("Error updating document:", error);
    }
  };

  //Method for declined button
  
  // Method for show details button
  const showDetails = async (file: string) => { 
    window.open(file, "_blank");
  }
  
  // Fetching data for Table
  const fetchDocuments = async () => {
    const response = await api.get("/aims/documents/incomingDocuments", {
      params : {userID}
    });
    setDataTable(response.data.documents ?? response.data ?? []);
  }

  useEffect(() => {
    fetchDocuments();
  }, []);

  return (
    <div className="page">
      <h1 className="title">INCOMING DOCUMENTS</h1>
      <div className="card">
        <div className="table-wrapper">
          <div className="searchdoc-table">
            <Table data={dataTable} columns={columns}/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncomingDoc;