/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react'
import api from '../../../shared/api';
import Table, { type columnConfig } from '../../../shared/components/ui/Table';

const MyDocuments = () => {
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
            <img src="../public/download.png" className='tbl-Icon' onClick={() => showDetails(item.file)} />
          </>
        )
      }
  ];

  // Method for show details button
  const showDetails = async (file: string) => { 
    window.open(file, "_blank");
  }

  useEffect(() => {
    const load = async () => {
      const response = await api.get("/aims/documents/myDocuments", {
      params : {userID}
    });
    setDataTable(response.data.documents ?? response.data ?? []);
    }
    load();
  }, []);

  return (
    <div className="bg-body-tertiary m-2 main-Card min-height-center">
      <div className="page">
        <h1 className="title">MY DOCUMENTS</h1>
        <div className="card">
          <div className="table-wrapper">
            <div className="searchdoc-table">
              <Table data={dataTable} columns={columns}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyDocuments;