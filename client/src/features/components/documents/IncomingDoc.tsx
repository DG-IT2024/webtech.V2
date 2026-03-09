import React from "react";
import { CheckCircle, XCircle, Info } from "lucide-react";
import "../../../assets/styles/IncomingDoc.css";

const IncomingDoc = () => {
const docs = [
  {
    id: "01-M",
    subject: "Designating GIPO III Juan Dela Cruz as acting director of this bureau.",
    signatory: "Juan Dela Cruz",
    dateSigned: "2025-10-30",
  },
  {
    id: "02-M",
    subject: "Reassignment of Administrative Officer II to Regional Office.",
    signatory: "Maria L. Santos",
    dateSigned: "2025-11-02",
  },
  {
    id: "03-M",
    subject: "Approval of FY 2026 Procurement Plan.",
    signatory: "Roberto A. Reyes",
    dateSigned: "2025-11-05",
  },
  {
    id: "04-M",
    subject: "Authority to Travel for Official Training (Japan).",
    signatory: "Angela C. Navarro",
    dateSigned: "2025-11-10",
  },
];

  return (
    <div className="page">
      <h1 className="title">INCOMING DOCUMENTS</h1>
      <div className="card">
      
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>No.</th>
                <th>Subject</th>
                <th>Signatory</th>
                <th>Date Signed</th>
                <th className="actions-header">Actions</th>
              </tr>
            </thead>
                <tbody>
                  {docs.map((doc) => (
                    <tr key={doc.id}>
                      <td className="doc-id">{doc.id}</td>
                      <td>{doc.subject}</td>
                      <td>{doc.signatory}</td>
                      <td>{doc.dateSigned}</td>
                      <td>
                        <div className="actions">
                          <button className="btn accept">
                            <CheckCircle size={14} /> Accept
                          </button>
                          <button className="btn decline">
                            <XCircle size={14} /> Declined
                          </button>
                          <button className="btn details">
                            <Info size={14} /> Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default IncomingDoc;